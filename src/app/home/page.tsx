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
      <div className='container mx-auto p-6'>
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>
            Welcome to Dash Sport
          </h1>
          <p className='mx-auto max-w-2xl text-xl text-gray-600'>
            Your comprehensive sports management platform for tracking athletes,
            performances, and statistics.
          </p>
        </div>

        <div className='mb-12 grid grid-cols-1 gap-6 lg:grid-cols-4'>
          {/* Main Cards */}
          <div className='lg:col-span-3'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <Card className='transition-shadow hover:shadow-lg'>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <Users className='h-6 w-6 text-blue-600' />
                    <CardTitle>Athletes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='mb-4 text-gray-600'>
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

              <Card className='transition-shadow hover:shadow-lg'>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <Trophy className='h-6 w-6 text-green-600' />
                    <CardTitle>Performances</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='mb-4 text-gray-600'>
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

              <Card className='transition-shadow hover:shadow-lg'>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <BarChart3 className='h-6 w-6 text-purple-600' />
                    <CardTitle>Statistics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='mb-4 text-gray-600'>
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
            </div>
          </div>

          {/* Chat Component */}
          <div className='lg:col-span-1'>
            <ChatComponent className='h-full' />
          </div>
        </div>

        <div className='rounded-lg border bg-white p-8 shadow-sm'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'>
              <div>
                <h3 className='font-medium'>Search Athletes</h3>
                <p className='text-sm text-gray-500'>
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
                <h3 className='font-medium'>View Recent Performances</h3>
                <p className='text-sm text-gray-500'>
                  See the latest competition results
                </p>
              </div>
              <Link href='/performances'>
                <Button variant='outline' size='sm'>
                  View
                </Button>
              </Link>
            </div>

            <div className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'>
              <div>
                <h3 className='font-medium'>Ask AI Assistant</h3>
                <p className='text-sm text-gray-500'>
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
