'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SimpleLayout from '../simple-layout';
import { athleteService } from '@/features/athletes/service/athlete.service';
import type { Athlete } from '@/constants/data';

export default function AthletesPage() {
  const router = useRouter();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAthletes();
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      fetchAthletes(searchTerm);
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const fetchAthletes = async (search?: string) => {
    try {
      setLoading(true);
      const response = await athleteService.getAllAthletes({
        page: '1',
        limit: '100',
        ...(search ? { search } : {})
      });
      const athletesData = response.data || [];
      setAthletes(athletesData);
    } catch (error) {
      console.error('Error fetching athletes:', error);
      setAthletes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAthletes = Array.isArray(athletes)
    ? athletes.filter((athlete) =>
        `${athlete.firstName} ${athlete.lastName} ${athlete.code}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <SimpleLayout>
        <div className='container mx-auto p-6'>
          <div className='mb-6 flex items-center justify-between'>
            <h1 className='text-3xl font-bold'>Athletes</h1>
            <Skeleton className='h-10 w-64' />
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className='flex items-center space-x-4'>
                    <Skeleton className='h-12 w-12 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-4 w-24' />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className='mb-2 h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
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
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
          <div className='relative'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <Input
              placeholder='Search athletes...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-64 pl-10'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredAthletes.map((athlete) => (
            <Card
              key={athlete.athleteId}
              className='cursor-pointer transition-shadow hover:shadow-lg'
            >
              <CardHeader>
                <div className='flex items-center space-x-4'>
                  <Avatar className='h-12 w-12'>
                    <AvatarImage src={athlete.avatarUrl} />
                    <AvatarFallback>
                      {getInitials(athlete.firstName, athlete.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className='text-lg'>
                      {athlete.firstName} {athlete.lastName}
                    </CardTitle>
                    <p className='text-sm text-gray-500'>{athlete.code}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Nationality:</span>
                    <Badge variant='secondary'>{athlete.nationality}</Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Gender:</span>
                    <span className='text-sm'>{athlete.gender}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>DOB:</span>
                    <span className='text-sm'>
                      {formatDate(athlete.dateOfBirth)}
                    </span>
                  </div>
                  {athlete.team && (
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Team:</span>
                      <span className='text-sm'>{athlete.team?.name}</span>
                    </div>
                  )}
                  {athlete.position && (
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Position:</span>
                      <span className='text-sm'>{athlete.position?.name}</span>
                    </div>
                  )}
                  {athlete.disciplines && athlete.disciplines.length > 0 && (
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>
                        Disciplines:
                      </span>
                      <span className='text-sm'>
                        {athlete.disciplines
                          .map((d) => d.discipline?.name)
                          .join(', ')}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  className='mt-4 w-full'
                  onClick={() => router.push(`/athletes/${athlete.athleteId}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAthletes.length === 0 && !loading && (
          <div className='py-12 text-center'>
            <p className='text-gray-500'>No athletes found.</p>
          </div>
        )}
      </div>
    </SimpleLayout>
  );
}
