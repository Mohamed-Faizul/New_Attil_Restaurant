import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionFromRequestCookies } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  const session = getSessionFromRequestCookies(cookies());

  if (session) {
    redirect('/admin/dishes');
  }

  return <LoginForm />;
}
