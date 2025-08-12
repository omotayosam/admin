'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Users, Trophy, BarChart3, Home, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Athletes', href: '/athletes', icon: Users },
  { name: 'Performances', href: '/performances', icon: Trophy },
  { name: 'Stats', href: '/stats', icon: BarChart3 }
];

export function SimpleNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className='border-b border-gray-200 bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center'>
            <h1 className='text-xl font-bold text-gray-900'>DashSports</h1>
          </div>

          {/* Desktop Menu */}
          <div className='hidden sm:flex sm:space-x-8'>
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

          {/* Mobile Hamburger */}
          <div className='sm:hidden'>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className='rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none'
            >
              {mobileOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className='border-t border-gray-200 bg-white sm:hidden'>
          <div className='space-y-1 px-2 pt-2 pb-3'>
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-base font-medium',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className='mr-3 h-5 w-5' />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
