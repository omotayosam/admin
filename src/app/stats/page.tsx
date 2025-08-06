'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Trophy } from 'lucide-react';
import SimpleLayout from '../simple-layout';

export default function StatsPage() {
  return (
    <SimpleLayout>
      <div className='container mx-auto p-6'>
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            Statistics & Analytics
          </h1>
          <p className='text-gray-600'>
            Comprehensive performance analytics and insights across all athletes
            and competitions.
          </p>
        </div>

        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Athletes
              </CardTitle>
              <Users className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>0</div>
              <p className='text-muted-foreground text-xs'>
                Registered athletes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Performances
              </CardTitle>
              <Trophy className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>0</div>
              <p className='text-muted-foreground text-xs'>
                Recorded performances
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Personal Bests
              </CardTitle>
              <TrendingUp className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>0</div>
              <p className='text-muted-foreground text-xs'>
                New records this season
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Sports
              </CardTitle>
              <BarChart3 className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>0</div>
              <p className='text-muted-foreground text-xs'>
                Different sports tracked
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Top Performances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='py-8 text-center'>
                <Trophy className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                <h3 className='mb-2 text-lg font-medium text-gray-900'>
                  No Data Available
                </h3>
                <p className='text-gray-500'>
                  Performance statistics will appear here once data is
                  available.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Athlete Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='py-8 text-center'>
                <Users className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                <h3 className='mb-2 text-lg font-medium text-gray-900'>
                  No Rankings Yet
                </h3>
                <p className='text-gray-500'>
                  Athlete rankings will be calculated based on performance data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='mt-8'>
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='py-8 text-center'>
                <BarChart3 className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                <h3 className='mb-2 text-lg font-medium text-gray-900'>
                  Analytics Coming Soon
                </h3>
                <p className='text-gray-500'>
                  Detailed performance analytics and trend analysis will be
                  available once sufficient data is collected.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SimpleLayout>
  );
}
