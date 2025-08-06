'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Trophy, BarChart3, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Athletes', href: '/athletes', icon: Users },
  { name: 'Performances', href: '/performances', icon: Trophy },
  { name: 'Stats', href: '/stats', icon: BarChart3 }
];

export function SimpleNav() {
  const pathname = usePathname();

  return (
    <nav className='border-b border-gray-200 bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex'>
            <div className='flex flex-shrink-0 items-center'>
              <h1 className='text-xl font-bold text-gray-900'>DashSports</h1>
            </div>
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    <item.icon className='mr-2 h-4 w-4' />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
