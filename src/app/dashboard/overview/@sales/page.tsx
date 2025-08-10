import { delay } from '@/constants/mock-api';
import RecentAthletes from '@/features/overview/components/recent-athletes';

export default async function Sales() {
  await delay(3000);
  return <RecentAthletes />;
}
