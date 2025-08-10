import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { athleteService } from '@/features/athletes/service/athlete.service';
import { performanceService } from '@/features/performances/service/performance.service';

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  dateTs: number;
  avatarUrl?: string;
  fallback: string;
};

function getInitials(first: string, last: string) {
  return (
    `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase() || 'NA'
  );
}

function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString();
}

export default async function RecentAthletes() {
  // Fetch recent athletes and performances
  const [athletesPage, performancesPage] = await Promise.all([
    athleteService.getAllAthletes({ page: '1', limit: '10' }),
    performanceService.getAllPerformances({ page: '1', limit: '10' })
  ]);

  const athleteItems: ActivityItem[] = (athletesPage.data || []).map(
    (a: any) => ({
      id: `ath-${a.athleteId}`,
      title: `${a.firstName} ${a.lastName}`,
      description: 'New athlete registered',
      date: formatDate(a.createdAt || new Date()),
      dateTs: new Date(a.createdAt || Date.now()).getTime(),
      avatarUrl: a.avatarUrl,
      fallback: getInitials(a.firstName, a.lastName)
    })
  );

  const perfItems: ActivityItem[] = (performancesPage.data || []).map(
    (p: any) => {
      const first = p?.athlete?.firstName || 'Unknown';
      const last = p?.athlete?.lastName || '';
      const discipline =
        p?.discipline?.name ||
        (p?.event?.sport?.isTeamSport ? p?.event?.sport?.name : 'Performance');
      const eventName = p?.event?.name || '';
      const dateStr = p?.date || p?.createdAt || new Date().toISOString();
      return {
        id: `perf-${p.performanceId || crypto.randomUUID()}`,
        title: `${first} ${last}`,
        description: `${discipline}${eventName ? ` • ${eventName}` : ''} recorded`,
        date: formatDate(dateStr),
        dateTs: new Date(dateStr).getTime(),
        avatarUrl: undefined,
        fallback: getInitials(first, last)
      } as ActivityItem;
    }
  );

  const items = [...athleteItems, ...perfItems]
    .sort((a, b) => b.dateTs - a.dateTs)
    .slice(0, 5);

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>{items.length} activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {items.map((item) => (
            <div key={item.id} className='flex items-center'>
              <Avatar className='h-9 w-9'>
                {item.avatarUrl ? (
                  <AvatarImage src={item.avatarUrl} alt='Avatar' />
                ) : (
                  <AvatarFallback>{item.fallback}</AvatarFallback>
                )}
              </Avatar>
              <div className='ml-4 space-y-1'>
                <p className='text-sm leading-none font-medium'>{item.title}</p>
                <p className='text-sm leading-none font-bold'>
                  {item.description}
                </p>
              </div>
              <div className='ml-auto font-medium'>{item.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
