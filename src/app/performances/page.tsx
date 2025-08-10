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
import { performanceService } from '@/features/performances/service/performance.service';

interface PerformanceItemVM {
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
  const [performances, setPerformances] = useState<PerformanceItemVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPerformances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      fetchPerformances(searchTerm);
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatResult = (p: any): string => {
    if (p?.time !== undefined && p.time !== null) return `${p.time}s`;
    if (p?.distance !== undefined && p.distance !== null)
      return `${p.distance}m`;
    if (p?.height !== undefined && p.height !== null) return `${p.height}m`;
    if (p?.points !== undefined && p.points !== null) return `${p.points} pts`;
    // Basketball specific summary
    if (
      [
        'twoPoints',
        'threePoints',
        'freeThrows',
        'rebounds',
        'assists',
        'steals',
        'blocks'
      ].some((k) => p?.[k] !== undefined && p?.[k] !== null)
    ) {
      const parts: string[] = [];
      if (p.points != null) parts.push(`${p.points} PTS`);
      if (p.rebounds != null) parts.push(`${p.rebounds} REB`);
      if (p.assists != null) parts.push(`${p.assists} AST`);
      return parts.join(' · ') || '—';
    }
    // Football summary
    if (
      [
        'goalsScored',
        'assists',
        'minutesPlayed',
        'yellowCards',
        'redCards'
      ].some((k) => p?.[k] !== undefined && p?.[k] !== null)
    ) {
      const parts: string[] = [];
      if (p.goalsScored != null) parts.push(`${p.goalsScored} G`);
      if (p.assists != null) parts.push(`${p.assists} A`);
      if (p.minutesPlayed != null) parts.push(`${p.minutesPlayed}'`);
      return parts.join(' · ') || '—';
    }
    return '—';
  };

  const fetchPerformances = async (search?: string) => {
    try {
      setLoading(true);
      const response = await performanceService.getAllPerformances({
        ...(search ? { search } : {}),
        limit: '10',
        page: '1'
      });

      const items = (response?.data || []).map((p: any) => {
        const athleteName = p?.athlete
          ? `${p.athlete.firstName} ${p.athlete.lastName}`
          : 'Unknown Athlete';
        const eventName = p?.event?.name ?? 'Unknown Event';
        const disciplineName =
          p?.discipline?.name ??
          (p?.event?.sport?.isTeamSport ? p?.event?.sport?.name : '—');
        const venueName = p?.event?.venue?.name ?? undefined;
        return {
          id: String(p.performanceId ?? p.id ?? Math.random()),
          athleteName,
          eventName,
          discipline: disciplineName,
          result: formatResult(p),
          date: p?.date ?? p?.event?.startDate ?? new Date().toISOString(),
          venue: venueName,
          rank: p?.position ?? undefined,
          isPersonalBest: p?.isPersonalBest ?? false
        } as PerformanceItemVM;
      });

      setPerformances(items);
    } catch (error) {
      console.error('Error fetching performances:', error);
      setPerformances([]);
    } finally {
      setLoading(false);
    }
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
