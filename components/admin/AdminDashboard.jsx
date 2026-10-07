'use client';

import { useEffect, useMemo, useState } from 'react';

const EMPTY_DISH = {
  name: '',
  category: '',
  cuisine: '',
  price: '',
  description: '',
  image: '',
  available: true,
};

const EMPTY_OFFER = { name: 'None', percentage: '', active: false };

export default function AdminDashboard({ user }) {
  const [dishes, setDishes] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [offer, setOffer] = useState(EMPTY_OFFER);
  const [dishForm, setDishForm] = useState(EMPTY_DISH);
  const [editingId, setEditingId] = useState(null);
  const [dishSearch, setDishSearch] = useState('');
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
  const [offerForm, setOfferForm] = useState(EMPTY_OFFER);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const isSuperAdmin = user?.role === 'super';

  const dishSummary = useMemo(() => {
    const available = dishes.filter((dish) => dish.available).length;
    return { total: dishes.length, available };
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    const query = dishSearch.trim().toLowerCase();
    if (!query) return dishes;

    return dishes.filter((dish) =>
      [dish.name, dish.cuisine, dish.category]
        .some((value) => String(value || '').toLowerCase().includes(query))
    );
  }, [dishes, dishSearch]);

  async function fetchData() {
    const [dishRes, adminRes, offerRes] = await Promise.all([
      fetch('/api/admin/dishes'),
      fetch('/api/admin/admins'),
      fetch('/api/admin/offer'),
    ]);

    const dishPayload = await dishRes.json().catch(() => ({ dishes: [] }));
    const adminPayload = await adminRes.json().catch(() => ({ admins: [] }));
    const offerPayload = await offerRes.json().catch(() => ({ offer: EMPTY_OFFER }));

    setDishes(dishPayload.dishes || []);
    setAdmins(adminPayload.admins || []);
    setOffer(offerPayload.offer || EMPTY_OFFER);
    setOfferForm(offerPayload.offer || EMPTY_OFFER);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleDishChange(event) {
    const { name, value, type, checked } = event.target;
    setDishForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleDishSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const payload = {
      ...dishForm,
      price: Number(dishForm.price) || 0,
      available: Boolean(dishForm.available),
    };

    const response = await fetch(editingId ? `/api/admin/dishes/${editingId}` : '/api/admin/dishes', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({ message: 'Unable to save dish.' }));

    if (!response.ok) {
      setStatus({ type: 'error', message: data.message || 'Unable to save dish.' });
      setLoading(false);
      return;
    }

    setStatus({ type: 'success', message: editingId ? 'Dish updated.' : 'Dish created.' });
    setDishForm(EMPTY_DISH);
    setEditingId(null);
    await fetchData();
    setLoading(false);
  }

  async function editDish(dish) {
    setEditingId(dish.id);
    setDishForm({
      name: dish.name,
      category: dish.category,
      cuisine: dish.cuisine,
      price: String(dish.price),
      description: dish.description,
      image: dish.image,
      available: Boolean(dish.available),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteDish(dishId) {
    const confirmed = window.confirm('Delete this dish?');
    if (!confirmed) return;

    const response = await fetch(`/api/admin/dishes/${dishId}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({ message: 'Could not delete dish.' }));

    if (!response.ok) {
      setStatus({ type: 'error', message: data.message || 'Could not delete dish.' });
      return;
    }

    setStatus({ type: 'success', message: 'Dish deleted.' });
    await fetchData();
  }

  async function handleAdminSubmit(event) {
    event.preventDefault();
    const response = await fetch('/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminForm),
    });

    const data = await response.json().catch(() => ({ message: 'Could not create admin.' }));

    if (!response.ok) {
      setStatus({ type: 'error', message: data.message || 'Could not create admin.' });
      return;
    }

    setStatus({ type: 'success', message: 'New admin added.' });
    setAdminForm({ name: '', email: '', password: '' });
    await fetchData();
  }

  async function toggleAdmin(accountId, active) {
    const response = await fetch(`/api/admin/admins/${accountId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });

    const data = await response.json().catch(() => ({ message: 'Unable to update admin.' }));
    if (!response.ok) {
      setStatus({ type: 'error', message: data.message || 'Unable to update admin.' });
      return;
    }

    setStatus({ type: 'success', message: 'Admin status updated.' });
    await fetchData();
  }

  async function removeAdmin(accountId) {
    const confirmed = window.confirm('Remove this admin account?');
    if (!confirmed) return;

    const response = await fetch(`/api/admin/admins/${accountId}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({ message: 'Could not remove admin.' }));

    if (!response.ok) {
      setStatus({ type: 'error', message: data.message || 'Could not remove admin.' });
      return;
    }

    setStatus({ type: 'success', message: 'Admin removed.' });
    await fetchData();
  }

  async function handleOfferSubmit(event) {
    event.preventDefault();
    const payload = {
      name: offerForm.name || 'None',
      percentage: Number(offerForm.percentage) || 0,
      active: Boolean(offerForm.active),
    };

    const response = await fetch('/api/admin/offer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({ message: 'Unable to save offer.' }));

    if (!response.ok) {
      setStatus({ type: 'error', message: data.message || 'Unable to save offer.' });
      return;
    }

    setOffer(data.offer || payload);
    setOfferForm(data.offer || payload);
    setStatus({ type: 'success', message: 'Offer saved successfully.' });
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin';
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-10 text-leaf-deep">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border-[3px] border-leaf-deep/80 bg-cream p-5 shadow-card md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-leaf-deep/65">Admin dashboard</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-leaf-deep">Food dishes & offers</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-leaf/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep">
              {user?.name || 'Admin'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border-[2px] border-leaf-deep bg-gold px-4 py-2 text-sm font-extrabold uppercase tracking-[0.16em] text-leaf-deep"
            >
              Logout
            </button>
          </div>
        </div>

        {status.message && (
          <div
            className={`mb-6 rounded-2xl border-2 px-4 py-3 text-sm font-semibold ${
              status.type === 'success' ? 'border-green-600 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700'
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border-[3px] border-leaf-deep/70 bg-leaf p-5 text-cream shadow-card">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gold">Total dishes</p>
            <p className="mt-3 font-display text-4xl font-bold">{dishSummary.total}</p>
          </div>
          <div className="rounded-[1.5rem] border-[3px] border-leaf-deep/70 bg-gold p-5 text-leaf-deep shadow-card">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Available</p>
            <p className="mt-3 font-display text-4xl font-bold">{dishSummary.available}</p>
          </div>
          <div className="rounded-[1.5rem] border-[3px] border-leaf-deep/70 bg-cream p-5 shadow-card">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Active offer</p>
            <p className="mt-3 font-display text-3xl font-bold text-leaf-deep">{offer?.active ? `${offer.percentage}%` : 'None'}</p>
          </div>
        </div>

        {isSuperAdmin && (
          <section className="mb-8 rounded-[2rem] border-[3px] border-leaf-deep/80 bg-cream p-6 shadow-card">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="font-display text-3xl font-bold text-leaf-deep">Add another admin</h2>
            </div>

            <form onSubmit={handleAdminSubmit} className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Name</span>
                <input
                  value={adminForm.name}
                  onChange={(event) => setAdminForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep outline-none focus:border-leaf focus:ring-4 focus:ring-gold/30"
                  placeholder="Admin name"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Email</span>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(event) => setAdminForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep outline-none focus:border-leaf focus:ring-4 focus:ring-gold/30"
                  placeholder="admin@attil.com"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Password</span>
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(event) => setAdminForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep outline-none focus:border-leaf focus:ring-4 focus:ring-gold/30"
                  placeholder="At least 6 chars"
                  required
                />
              </label>

              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="rounded-full border-[2.5px] border-leaf-deep bg-gold px-5 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-leaf-deep">
                  Save admin
                </button>
              </div>
            </form>

            <div className="mt-8 overflow-hidden rounded-[1.5rem] border-2 border-leaf-deep/20">
              <table className="min-w-full divide-y divide-leaf-deep/10 bg-white text-left">
                <thead className="bg-leaf/10 text-leaf-deep">
                  <tr>
                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em]">Name</th>
                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em]">Email</th>
                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em]">Role</th>
                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em]">Status</th>
                    <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-leaf-deep/10">
                  {admins.map((account) => (
                    <tr key={account.id}>
                      <td className="px-4 py-3 font-semibold">{account.name}</td>
                      <td className="px-4 py-3 font-semibold">{account.email}</td>
                      <td className="px-4 py-3 font-semibold uppercase">{account.role}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${account.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                          {account.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleAdmin(account.id, account.isActive)}
                            className="rounded-full border-[2px] border-leaf-deep bg-cream px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-leaf-deep"
                          >
                            {account.isActive ? 'Disable' : 'Enable'}
                          </button>
                          {account.role !== 'super' && (
                            <button
                              type="button"
                              onClick={() => removeAdmin(account.id)}
                              className="rounded-full border-[2px] border-red-600 bg-red-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-red-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mb-8 rounded-[2rem] border-[3px] border-leaf-deep/80 bg-cream p-6 shadow-card">
          <h2 className="mb-6 font-display text-3xl font-bold text-leaf-deep">Offer</h2>
          <form onSubmit={handleOfferSubmit} className="grid gap-5 md:grid-cols-3">
            <label className="block md:col-span-1">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Offer Name</span>
              <input
                value={offerForm.name}
                onChange={(event) => setOfferForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep outline-none focus:border-leaf focus:ring-4 focus:ring-gold/30"
                placeholder="Gandhi Jayanthi - Oct 2"
              />
            </label>

            <label className="block md:col-span-1">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Offer %</span>
              <input
                type="number"
                min="0"
                max="100"
                value={offerForm.percentage}
                onChange={(event) => setOfferForm((current) => ({ ...current, percentage: event.target.value }))}
                className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep outline-none focus:border-leaf focus:ring-4 focus:ring-gold/30"
                placeholder="15"
              />
            </label>

            <label className="flex items-center gap-3 self-end rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep">
              <input
                type="checkbox"
                checked={Boolean(offerForm.active)}
                onChange={(event) => setOfferForm((current) => ({ ...current, active: event.target.checked }))}
                className="h-4 w-4 rounded border-leaf-deep text-leaf focus:ring-gold"
              />
              Active
            </label>

            <div className="md:col-span-3 flex justify-end">
              <button type="submit" className="rounded-full border-[2.5px] border-leaf-deep bg-gold px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-leaf-deep">
                Save offer
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-[2rem] border-[3px] border-leaf-deep/80 bg-cream p-6 shadow-card">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-bold text-leaf-deep">{editingId ? 'Edit dish' : 'Add dish'}</h2>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setDishForm(EMPTY_DISH);
                }}
                className="rounded-full border-[2px] border-leaf-deep bg-paper px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleDishSubmit} className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-1">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Dish name</span>
              <input
                name="name"
                value={dishForm.name}
                onChange={handleDishChange}
                className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep outline-none focus:border-leaf focus:ring-4 focus:ring-gold/30"
                placeholder="Paneer Tikka"
                required
              />
            </label>

            <label className="block md:col-span-1">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Category / cuisine</span>
              <input
                name="category"
                value={dishForm.category}
                onChange={handleDishChange}
                className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep outline-none focus:border-leaf focus:ring-4 focus:ring-gold/30"
                placeholder="North Indian & Tandoor"
                required
              />
            </label>

            <label className="block md:col-span-1">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Price (₹)</span>
              <input
                name="price"
                type="number"
                min="0"
                value={dishForm.price}
                onChange={handleDishChange}
                className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep outline-none focus:border-leaf focus:ring-4 focus:ring-gold/30"
                placeholder="260"
                required
              />
            </label>

            <label className="flex items-center gap-3 self-end rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep">
              <input
                name="available"
                type="checkbox"
                checked={Boolean(dishForm.available)}
                onChange={handleDishChange}
                className="h-4 w-4 rounded border-leaf-deep text-leaf focus:ring-gold"
              />
              Available now
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Image URL</span>
              <input
                name="image"
                value={dishForm.image}
                onChange={handleDishChange}
                className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep outline-none focus:border-leaf focus:ring-4 focus:ring-gold/30"
                placeholder="/images/photos/your-dish.jpg"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-deep/70">Description</span>
              <textarea
                name="description"
                value={dishForm.description}
                onChange={handleDishChange}
                rows="4"
                className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep outline-none focus:border-leaf focus:ring-4 focus:ring-gold/30"
                placeholder="Short dish description"
                required
              />
            </label>

            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <input
                  type="search"
                  aria-label="Search dishes"
                  value={dishSearch}
                  onChange={(event) => setDishSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') event.preventDefault();
                  }}
                  className="w-full rounded-2xl border-2 border-leaf-deep/20 bg-white px-4 py-3 font-semibold text-leaf-deep outline-none focus:border-leaf focus:ring-4 focus:ring-gold/30"
                  placeholder="Search dishes"
                />
                {dishSearch && (
                  <button
                    type="button"
                    onClick={() => setDishSearch('')}
                    aria-label="Clear dish search"
                    className="shrink-0 rounded-full border-2 border-leaf-deep/20 bg-white px-3 py-2 font-bold text-leaf-deep/70 hover:bg-leaf/10"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full border-[2.5px] border-leaf-deep bg-gold px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-leaf-deep disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Saving...' : editingId ? 'Update dish' : 'Add dish'}
              </button>
            </div>
          </form>

          <div className="mt-8 overflow-hidden rounded-[1.5rem] border-2 border-leaf-deep/20">
            <table className="min-w-full divide-y divide-leaf-deep/10 bg-white text-left">
              <thead className="bg-leaf/10 text-leaf-deep">
                <tr>
                  <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em]">Dish</th>
                  <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em]">Category</th>
                  <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em]">Price</th>
                  <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em]">Status</th>
                  <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-leaf-deep/10">
                {filteredDishes.map((dish) => (
                  <tr key={dish.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={dish.image} alt={dish.name} className="h-12 w-12 rounded-xl object-cover" />
                        <div>
                          <div className="font-bold text-leaf-deep">{dish.name}</div>
                          <div className="text-xs text-leaf-deep/60">{dish.cuisine}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-leaf-deep/80">{dish.category}</td>
                    <td className="px-4 py-3 font-semibold text-leaf-deep/80">₹{dish.price}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${dish.available ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {dish.available ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => editDish(dish)} className="rounded-full border-[2px] border-leaf-deep bg-paper px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-leaf-deep">
                          Edit
                        </button>
                        <button type="button" onClick={() => deleteDish(dish.id)} className="rounded-full border-[2px] border-red-600 bg-red-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-red-700">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDishes.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center font-semibold text-leaf-deep/60">
                      No dishes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
