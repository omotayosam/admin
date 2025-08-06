'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Trophy, Calendar, Target } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import apiClient from '@/lib/api-client';
import SimpleLayout from '../../simple-layout';

interface Athlete {
  athleteId: number;
  firstName: string;
  lastName: string;
  code: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  height?: number;
  weight?: number;
  bio?: string;
  isActive: boolean;
  teamCode?: string;
  positionId?: number;
  team?: string;
  position?: string;
  avatarUrl?: string;
  disciplines?: Array<{
    id: number;
    disciplineId: number;
    currentRank: number;
    discipline: {
      disciplineId: number;
      name: string;
      code: string;
      sportId: number;
      description?: string;
      unit: string;
    };
  }>;
}

interface Performance {
  id: string;
  eventName: string;
  discipline: string;
  result: string;
  date: string;
  venue?: string;
  rank?: number;
  isPersonalBest?: boolean;
}

export default function AthleteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [performancesLoading, setPerformancesLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchAthleteDetails(params.id as string);
      fetchAthletePerformances(params.id as string);
    }
  }, [params.id]);

  const fetchAthleteDetails = async (athleteId: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/athletes/${athleteId}`);
      setAthlete(response.data);
    } catch (error) {
      console.error('Error fetching athlete details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAthletePerformances = async (athleteId: string) => {
    try {
      setPerformancesLoading(true);
      const response = await apiClient.get(
        `/performances/athlete/${athleteId}`
      );
      setPerformances(response.data);
    } catch (error) {
      console.error('Error fetching athlete performances:', error);
    } finally {
      setPerformancesLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <SimpleLayout>
        <div className='container mx-auto p-6'>
          <div className='mb-6 flex items-center'>
            <Skeleton className='mr-4 h-8 w-24' />
            <Skeleton className='h-8 w-32' />
          </div>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            <Card>
              <CardHeader>
                <div className='flex items-center space-x-4'>
                  <Skeleton className='h-20 w-20 rounded-full' />
                  <div className='space-y-2'>
                    <Skeleton className='h-6 w-32' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                </div>
              </CardContent>
            </Card>
            <div className='lg:col-span-2'>
              <Card>
                <CardHeader>
                  <Skeleton className='h-6 w-32' />
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className='h-16 w-full' />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  if (!athlete) {
    return (
      <SimpleLayout>
        <div className='container mx-auto p-6'>
          <div className='py-12 text-center'>
            <p className='text-gray-500'>Athlete not found.</p>
            <Button onClick={() => router.push('/athletes')} className='mt-4'>
              Back to Athletes
            </Button>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <div className='container mx-auto p-6'>
        <div className='mb-6 flex items-center'>
          <Button
            variant='ghost'
            onClick={() => router.push('/athletes')}
            className='mr-4'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
          <h1 className='text-3xl font-bold'>
            {athlete.firstName} {athlete.lastName}
          </h1>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Athlete Profile Card */}
          <Card>
            <CardHeader>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage src={athlete.avatarUrl} />
                  <AvatarFallback className='text-lg'>
                    {getInitials(athlete.firstName, athlete.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className='text-xl'>
                    {athlete.firstName} {athlete.lastName}
                  </CardTitle>
                  <p className='text-sm text-gray-500'>{athlete.code}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Age:</span>
                  <span className='text-sm font-medium'>
                    {calculateAge(athlete.dateOfBirth)} years
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Gender:</span>
                  <span className='text-sm font-medium'>{athlete.gender}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Nationality:</span>
                  <Badge variant='secondary'>{athlete.nationality}</Badge>
                </div>
                {athlete.team && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>Team:</span>
                    <span className='text-sm font-medium'>{athlete.team}</span>
                  </div>
                )}
                {athlete.position && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>Position:</span>
                    <span className='text-sm font-medium'>
                      {athlete.position}
                    </span>
                  </div>
                )}
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Date of Birth:</span>
                  <span className='text-sm font-medium'>
                    {formatDate(athlete.dateOfBirth)}
                  </span>
                </div>
                {athlete.disciplines && athlete.disciplines.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <span className='mb-2 block text-sm text-gray-600'>
                        Disciplines:
                      </span>
                      <div className='flex flex-wrap gap-1'>
                        {athlete.disciplines.map((discipline, index) => (
                          <Badge
                            key={index}
                            variant='outline'
                            className='text-xs'
                          >
                            {discipline.discipline.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performances Card */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center'>
                    <Trophy className='mr-2 h-5 w-5' />
                    Recent Performances
                  </CardTitle>
                  <Badge variant='outline'>
                    {performances.length} performances
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {performancesLoading ? (
                  <div className='space-y-4'>
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className='flex items-center space-x-4 rounded-lg border p-4'
                      >
                        <Skeleton className='h-12 w-12 rounded-full' />
                        <div className='flex-1 space-y-2'>
                          <Skeleton className='h-4 w-32' />
                          <Skeleton className='h-4 w-24' />
                        </div>
                        <Skeleton className='h-6 w-16' />
                      </div>
                    ))}
                  </div>
                ) : performances.length > 0 ? (
                  <div className='space-y-4'>
                    {performances.map((performance) => (
                      <div
                        key={performance.id}
                        className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'
                      >
                        <div className='flex items-center space-x-4'>
                          <div className='flex flex-col items-center rounded-full bg-blue-100 p-2'>
                            <Calendar className='h-4 w-4 text-blue-600' />
                          </div>
                          <div>
                            <h4 className='font-medium'>
                              {performance.eventName}
                            </h4>
                            <p className='text-sm text-gray-500'>
                              {performance.discipline} •{' '}
                              {formatDate(performance.date)}
                            </p>
                            {performance.venue && (
                              <p className='text-xs text-gray-400'>
                                {performance.venue}
                              </p>
                            )}
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
                    ))}
                  </div>
                ) : (
                  <div className='py-8 text-center'>
                    <Target className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                    <p className='text-gray-500'>
                      No performances recorded yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
