'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Users,
  Trophy,
  Calendar,
  Target
} from 'lucide-react';
import SimpleLayout from '../simple-layout';
import { athleteService } from '@/features/athletes/service/athlete.service';
import { performanceService } from '@/features/performances/service/performance.service';
import apiClient from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

interface TopPerformanceItem {
  id: string;
  athleteName: string;
  eventName: string;
  discipline: string;
  result: string;
  date: string;
  isPersonalBest?: boolean;
}

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    totalAthletes: 0,
    totalPerformances: 0,
    personalBests: 0,
    activeSports: 0
  });
  const [topPerformances, setTopPerformances] = useState<TopPerformanceItem[]>(
    []
  );
  const [rankings, setRankings] = useState<
    { athleteName: string; count: number }[]
  >([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [
          athletesPage,
          performancesTotalPage,
          sportsRes,
          recentPerformances
        ] = await Promise.all([
          athleteService.getAllAthletes({ page: '1', limit: '1' }),
          performanceService.getAllPerformances({ page: '1', limit: '1' }),
          apiClient.get('/sports'),
          performanceService.getAllPerformances({
            page: '1',
            limit: '200' /* sort by latest for recency */
          })
        ]);

        const sportsData = sportsRes?.data?.data || [];
        const perfList = recentPerformances?.data || [];

        // Compute personal bests from recent set (approximation)
        const personalBests = perfList.filter(
          (p: any) => p?.isPersonalBest
        ).length;

        // Map top (recent) performances - pick top 5
        const formatResult = (p: any): string => {
          if (p?.time != null) return `${p.time}s`;
          if (p?.distance != null) return `${p.distance}m`;
          if (p?.height != null) return `${p.height}m`;
          if (p?.points != null) return `${p.points} pts`;
          if (
            [
              'twoPoints',
              'threePoints',
              'freeThrows',
              'rebounds',
              'assists',
              'steals',
              'blocks'
            ].some((k) => p?.[k] != null)
          ) {
            const parts: string[] = [];
            if (p.points != null) parts.push(`${p.points} PTS`);
            if (p.rebounds != null) parts.push(`${p.rebounds} REB`);
            if (p.assists != null) parts.push(`${p.assists} AST`);
            return parts.join(' · ') || '—';
          }
          if (
            [
              'goalsScored',
              'assists',
              'minutesPlayed',
              'yellowCards',
              'redCards'
            ].some((k) => p?.[k] != null)
          ) {
            const parts: string[] = [];
            if (p.goalsScored != null) parts.push(`${p.goalsScored} G`);
            if (p.assists != null) parts.push(`${p.assists} A`);
            if (p.minutesPlayed != null) parts.push(`${p.minutesPlayed}'`);
            return parts.join(' · ') || '—';
          }
          return '—';
        };

        const mappedTop: TopPerformanceItem[] = perfList
          .slice(0, 5)
          .map((p: any) => ({
            id: String(p.performanceId ?? p.id ?? Math.random()),
            athleteName: p?.athlete
              ? `${p.athlete.firstName} ${p.athlete.lastName}`
              : 'Unknown Athlete',
            eventName: p?.event?.name ?? 'Unknown Event',
            discipline:
              p?.discipline?.name ??
              (p?.event?.sport?.isTeamSport ? p?.event?.sport?.name : '—'),
            result: formatResult(p),
            date: p?.date ?? p?.event?.startDate ?? new Date().toISOString(),
            isPersonalBest: p?.isPersonalBest ?? false
          }));

        // Compute simple athlete rankings from recent performances set
        const counts: Record<string, number> = {};
        for (const p of perfList) {
          const name = p?.athlete
            ? `${p.athlete.firstName} ${p.athlete.lastName}`
            : 'Unknown Athlete';
          counts[name] = (counts[name] || 0) + 1;
        }
        const rankingArr = Object.entries(counts)
          .map(([athleteName, count]) => ({ athleteName, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setTotals({
          totalAthletes: athletesPage.total || 0,
          totalPerformances: performancesTotalPage.total || 0,
          personalBests,
          activeSports: sportsData.length || 0
        });
        setTopPerformances(mappedTop);
        setRankings(rankingArr);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

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
              {loading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold'>{totals.totalAthletes}</div>
              )}
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
              {loading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold'>
                  {totals.totalPerformances}
                </div>
              )}
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
              {loading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold'>{totals.personalBests}</div>
              )}
              <p className='text-muted-foreground text-xs'>
                New records (sampled)
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
              {loading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-2xl font-bold'>{totals.activeSports}</div>
              )}
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
              {loading ? (
                <div className='space-y-3'>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className='h-16 w-full' />
                  ))}
                </div>
              ) : topPerformances.length === 0 ? (
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
              ) : (
                <div className='space-y-3'>
                  {topPerformances.map((p) => (
                    <div
                      key={p.id}
                      className='flex items-center justify-between rounded-lg border p-4'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='rounded-full bg-blue-100 p-2'>
                          <Calendar className='h-4 w-4 text-blue-600' />
                        </div>
                        <div>
                          <div className='font-medium'>{p.athleteName}</div>
                          <div className='text-sm text-gray-500'>
                            {p.eventName} • {p.discipline}
                          </div>
                          <div className='text-xs text-gray-400'>
                            {formatDate(p.date)}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-semibold'>
                          {p.result}
                        </span>
                        {p.isPersonalBest && (
                          <Target className='h-4 w-4 text-yellow-500' />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Athlete Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className='space-y-3'>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className='h-10 w-full' />
                  ))}
                </div>
              ) : rankings.length === 0 ? (
                <div className='py-8 text-center'>
                  <Users className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                  <h3 className='mb-2 text-lg font-medium text-gray-900'>
                    No Rankings Yet
                  </h3>
                  <p className='text-gray-500'>
                    Athlete rankings will be calculated based on performance
                    data.
                  </p>
                </div>
              ) : (
                <div className='space-y-2'>
                  {rankings.map((r, idx) => (
                    <div
                      key={r.athleteName}
                      className='flex items-center justify-between rounded-md border p-3'
                    >
                      <div className='flex items-center gap-2'>
                        <Badge variant='secondary'>#{idx + 1}</Badge>
                        <span className='font-medium'>{r.athleteName}</span>
                      </div>
                      <span className='text-sm text-gray-600'>
                        {r.count} performances
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
