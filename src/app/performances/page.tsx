'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Trophy, Calendar, Target } from 'lucide-react';
import apiClient from '@/lib/api-client';
import SimpleLayout from '../simple-layout';

interface Performance {
  id: string;
  athleteName: string;
  eventName: string;
  discipline: string;
  result: string;
  date: string;
  venue?: string;
  rank?: number;
  isPersonalBest?: boolean;
}

export default function PerformancesPage() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPerformances();
  }, []);

  const fetchPerformances = async () => {
    try {
      setLoading(true);
      // For now, we'll show a placeholder since we need to implement this endpoint
      // const response = await apiClient.get('/performances');
      // setPerformances(response.data);
      setPerformances([]);
    } catch (error) {
      console.error('Error fetching performances:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <SimpleLayout>
        <div className='container mx-auto p-6'>
          <div className='mb-6 flex items-center justify-between'>
            <h1 className='text-3xl font-bold'>Performances</h1>
            <Skeleton className='h-10 w-64' />
          </div>
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <Skeleton className='h-12 w-12 rounded-full' />
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-4 w-24' />
                      </div>
                    </div>
                    <Skeleton className='h-6 w-16' />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <div className='container mx-auto p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Performances</h1>
          <div className='relative'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <Input
              placeholder='Search performances...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-64 pl-10'
            />
          </div>
        </div>

        {performances.length === 0 ? (
          <div className='py-12 text-center'>
            <Trophy className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <h3 className='mb-2 text-lg font-medium text-gray-900'>
              No Performances Yet
            </h3>
            <p className='text-gray-500'>
              Performance data will appear here once competitions are recorded.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {performances.map((performance) => (
              <Card
                key={performance.id}
                className='transition-shadow hover:shadow-lg'
              >
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex flex-col items-center rounded-full bg-blue-100 p-2'>
                        <Calendar className='h-4 w-4 text-blue-600' />
                      </div>
                      <div>
                        <h4 className='font-medium'>
                          {performance.athleteName}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {performance.eventName} • {performance.discipline}
                        </p>
                        <p className='text-xs text-gray-400'>
                          {formatDate(performance.date)}
                          {performance.venue && ` • ${performance.venue}`}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='flex items-center space-x-2'>
                        <span className='text-lg font-semibold'>
                          {performance.result}
                        </span>
                        {performance.isPersonalBest && (
                          <Target className='h-4 w-4 text-yellow-500' />
                        )}
                      </div>
                      {performance.rank && (
                        <p className='text-sm text-gray-500'>
                          Rank: {performance.rank}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SimpleLayout>
  );
}
