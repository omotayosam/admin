import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { description } from './bar-graph';

const athletesData = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/1.png',
    fallback: 'OM',
    date: '21/02/2025',
    description: 'Olivia registered for a boxing event'
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/2.png',
    fallback: 'JL',
    date: '21/02/2025',
    description: 'Boxing weigh-in results for City Knockout have been updated'
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/3.png',
    fallback: 'IN',
    date: '21/02/2025',
    description: 'new athlete Isabella registered'
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/4.png',
    fallback: 'WK',
    date: '21/02/2025',
    description: 'william healthstatus updated to injured'
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/5.png',
    fallback: 'SD',
    date: '21/02/2025',
    description: 'new athlete sofia registered'
  }
];

export function RecentAthletes() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>15 activities this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {athletesData.map((athlete, index) => (
            <div key={index} className='flex items-center'>
              <Avatar className='h-9 w-9'>
                <AvatarImage src={athlete.avatar} alt='Avatar' />
                <AvatarFallback>{athlete.fallback}</AvatarFallback>
              </Avatar>
              <div className='ml-4 space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {athlete.name}
                </p>
                <p className='text-sm leading-none font-bold'>
                  {athlete.description}
                </p>
                <p className='text-muted-foreground text-sm'>{athlete.email}</p>
              </div>
              <div className='ml-auto font-medium'>{athlete.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
