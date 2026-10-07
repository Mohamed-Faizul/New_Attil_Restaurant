import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { menu } from '@/data/restaurant';

const STORE_PATH = path.join(process.cwd(), 'data', 'app-store.json');
const DEFAULT_OFFER = { name: 'None', percentage: 0, active: false };

function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

function buildSeedDishes() {
  return menu.flatMap((group, groupIndex) =>
    group.signature.map((item, itemIndex) => ({
      id: `${group.slug}-${itemIndex}`,
      name: item,
      category: group.name,
      cuisine: group.slug,
      price: 120 + groupIndex * 40 + itemIndex * 18,
      description: `${group.description} A signature favourite from ${group.name}.`,
      image: group.media?.src || '/images/photos/kothu-parotta.jpg',
      available: true,
      createdAt: new Date().toISOString(),
    }))
  );
}

export async function readStore() {
  try {
    const file = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(file);

    return {
      admins: Array.isArray(parsed.admins) ? parsed.admins : [],
      dishes: Array.isArray(parsed.dishes) ? parsed.dishes : [],
      offer: parsed.offer || DEFAULT_OFFER,
    };
  } catch {
    const defaultStore = {
      admins: [],
      dishes: buildSeedDishes(),
      offer: DEFAULT_OFFER,
    };

    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(defaultStore, null, 2));
    return defaultStore;
  }
}

export async function writeStore(store) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

export async function seedStore() {
  const store = await readStore();
  const email = normalizeEmail(process.env.ADMIN_EMAIL || '');
  const password = process.env.ADMIN_PASSWORD || '';
  let changed = false;

  if (email && password && !store.admins.some((user) => normalizeEmail(user.email) === email)) {
    store.admins.push({
      id: 'super-admin',
      name: 'Super Admin',
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'super',
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    changed = true;
  }

  if (!store.dishes.length) {
    store.dishes = buildSeedDishes();
    changed = true;
  }

  if (!store.offer || !store.offer.name) {
    store.offer = DEFAULT_OFFER;
    changed = true;
  }

  if (changed) {
    await writeStore(store);
  }

  return store;
}

export async function getStore() {
  return readStore();
}

export async function getDishes() {
  const store = await readStore();
  return store.dishes;
}

export async function getOffer() {
  const store = await readStore();
  return store.offer;
}

export function sanitizeAdmin(admin) {
  if (!admin) return null;
  const { passwordHash, ...safe } = admin;
  return safe;
}

export async function getAdmins() {
  const store = await seedStore();
  return store.admins.map((user) => sanitizeAdmin(user));
}

export async function findAdminByEmail(email) {
  const store = await seedStore();
  const normalizedEmail = normalizeEmail(email);
  return store.admins.find((user) => normalizeEmail(user.email) === normalizedEmail) || null;
}

export async function verifyAdminCredentials(email, password) {
  const user = await findAdminByEmail(email);
  if (!user || !user.isActive) return null;
  const valid = await bcrypt.compare(password, user.passwordHash || '');
  if (!valid) return null;
  return sanitizeAdmin(user);
}

export async function createDish(data) {
  const store = await seedStore();
  const dish = {
    id: data.id || `dish-${Date.now()}`,
    name: data.name?.trim(),
    category: data.category?.trim() || 'General',
    cuisine: data.cuisine?.trim() || data.category?.trim() || 'General',
    price: Number(data.price) || 0,
    description: data.description?.trim() || '',
    image: data.image?.trim() || '/images/photos/kothu-parotta.jpg',
    available: data.available !== false,
    createdAt: new Date().toISOString(),
  };

  if (!dish.name) {
    throw new Error('Dish name is required.');
  }

  const existingIndex = store.dishes.findIndex((item) => item.id === dish.id);
  if (existingIndex >= 0) {
    store.dishes[existingIndex] = { ...store.dishes[existingIndex], ...dish };
  } else {
    store.dishes.unshift(dish);
  }

  await writeStore(store);
  return dish;
}

export async function updateDish(id, changes) {
  const store = await seedStore();
  const index = store.dishes.findIndex((dish) => dish.id === id);
  if (index === -1) return null;

  store.dishes[index] = {
    ...store.dishes[index],
    ...changes,
    price: Number(changes.price) || 0,
    available: changes.available !== undefined ? Boolean(changes.available) : store.dishes[index].available,
  };

  await writeStore(store);
  return store.dishes[index];
}

export async function deleteDish(id) {
  const store = await seedStore();
  const before = store.dishes.length;
  store.dishes = store.dishes.filter((dish) => dish.id !== id);
  if (store.dishes.length === before) {
    return false;
  }

  await writeStore(store);
  return true;
}

export async function createAdminAccount(input) {
  const store = await seedStore();
  const name = String(input.name || '').trim();
  const email = normalizeEmail(input.email);
  const password = String(input.password || '');

  if (!name || !email || password.length < 6) {
    throw new Error('Name, valid email, and password (6+ chars) are required.');
  }

  if (store.admins.some((user) => normalizeEmail(user.email) === email)) {
    throw new Error('An account with that email already exists.');
  }

  const user = {
    id: `admin-${Date.now()}`,
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  store.admins.push(user);
  await writeStore(store);
  return sanitizeAdmin(user);
}

export async function toggleAdminAccount(id, active) {
  const store = await seedStore();
  const index = store.admins.findIndex((user) => user.id === id);
  if (index === -1 || store.admins[index].role === 'super') return null;

  store.admins[index].isActive = Boolean(active);
  await writeStore(store);
  return sanitizeAdmin(store.admins[index]);
}

export async function removeAdminAccount(id) {
  const store = await seedStore();
  const target = store.admins.find((user) => user.id === id);
  if (!target || target.role === 'super') {
    return false;
  }

  store.admins = store.admins.filter((user) => user.id !== id);
  await writeStore(store);
  return true;
}

export async function saveOffer(offer) {
  const store = await seedStore();
  const parsed = {
    name: String(offer?.name || 'None').trim() || 'None',
    percentage: Number(offer?.percentage) || 0,
    active: Boolean(offer?.active),
  };

  if (parsed.name === 'None') {
    parsed.active = false;
    parsed.percentage = 0;
  }

  store.offer = parsed;
  await writeStore(store);
  return store.offer;
}
