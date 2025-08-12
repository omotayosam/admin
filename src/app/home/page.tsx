'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trophy, BarChart3, ArrowRight } from 'lucide-react';
import SimpleLayout from '../simple-layout';
import Link from 'next/link';
import ChatComponent from './chat';

export default function HomePage() {
  return (
    <SimpleLayout>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome to DashSport 👋
          </h2>
        </div>

        {/* Mobile: Stack everything vertically */}
        <div className='mb-8 space-y-6 md:mb-12 lg:space-y-0'>
          {/* Main Cards */}
          <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
            <Card className='container/card !pt-3g'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <Users className='h-6 w-6 text-blue-600' />
                  <CardTitle className='text-lg'>Athletes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className='mb-4 text-sm text-gray-600 md:text-base'>
                  Browse and search through all registered athletes. View
                  detailed profiles, personal information, and performance
                  history.
                </p>
                <Link href='/athletes'>
                  <Button className='w-full'>
                    View Athletes
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className='container/card !pt-3'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <Trophy className='h-6 w-6 text-green-600' />
                  <CardTitle className='text-lg'>Performances</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className='mb-4 text-sm text-gray-600 md:text-base'>
                  Track individual and team performances across different
                  events, disciplines, and competitions.
                </p>
                <Link href='/performances'>
                  <Button className='w-full'>
                    View Performances
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className='container/card !pt-3'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <BarChart3 className='h-6 w-6 text-purple-600' />
                  <CardTitle className='text-lg'>Statistics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className='mb-4 text-sm text-gray-600 md:text-base'>
                  Analyze performance trends, personal bests, and comparative
                  statistics across athletes and teams.
                </p>
                <Link href='/stats'>
                  <Button className='w-full'>
                    View Statistics
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className='container/card !pt-3'>
              <ChatComponent className='h-80 w-full md:h-96' />
            </Card>
          </div>

          {/* Chat Component - Full width on mobile, sidebar on large screens */}
        </div>

        <div className='rounded-lg border bg-white p-4 shadow-sm md:p-8'>
          <h2 className='mb-4 text-xl font-bold text-gray-900 md:text-2xl'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <div className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'>
              <div>
                <h3 className='text-sm font-medium md:text-base'>
                  Search Athletes
                </h3>
                <p className='text-xs text-gray-500 md:text-sm'>
                  Find specific athletes by name or code
                </p>
              </div>
              <Link href='/athletes'>
                <Button variant='outline' size='sm'>
                  Search
                </Button>
              </Link>
            </div>

            <div className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'>
              <div>
                <h3 className='text-sm font-medium md:text-base'>
                  View Recent Performances
                </h3>
                <p className='text-xs text-gray-500 md:text-sm'>
                  See the latest competition results
                </p>
              </div>
              <Link href='/performances'>
                <Button variant='outline' size='sm'>
                  View
                </Button>
              </Link>
            </div>

            <div className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 sm:col-span-2 lg:col-span-1'>
              <div>
                <h3 className='text-sm font-medium md:text-base'>
                  Ask AI Assistant
                </h3>
                <p className='text-xs text-gray-500 md:text-sm'>
                  Get insights about your sports data
                </p>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  const chatInput = document.querySelector(
                    'input[placeholder*="Ask about athletes"]'
                  ) as HTMLInputElement;
                  if (chatInput) {
                    chatInput.focus();
                    chatInput.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }
                }}
              >
                Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
