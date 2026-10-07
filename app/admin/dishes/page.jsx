import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getSessionFromRequestCookies } from '@/lib/auth';

export default function AdminDishesPage() {
  const session = getSessionFromRequestCookies(cookies());

  if (!session) {
    redirect('/admin');
  }

  return <AdminDashboard user={session} />;
}
