import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Claude Weidner',
  description: 'Portfolio management dashboard',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
