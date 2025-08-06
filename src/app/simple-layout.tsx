import { SimpleNav } from '@/components/simple-nav';

export default function SimpleLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <SimpleNav />
      <main className='py-6'>{children}</main>
    </div>
  );
}
