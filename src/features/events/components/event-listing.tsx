import { searchParamsCache } from '@/lib/searchparams';
import { eventService } from '../service/event.service';
import { EventTable } from './event-tables';
import { columns } from './event-tables/columns';
import type { EventItem } from '../service/event.service';

export default async function EventListingPage() {
  try {
    const page = searchParamsCache.get('page').toString();
    const search = searchParamsCache.get('name')?.toString();
    const pageLimit = searchParamsCache.get('perPage').toString();

    const filters: any = {
      page: page || '1',
      limit: pageLimit || '10',
      ...(search && { search })
    };

    const res = await eventService.getAll(filters);
    const payload: any = res as any; // expected { success, message, data }
    const events: EventItem[] = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.data)
        ? payload.data.data
        : [];
    const total =
      typeof payload?.data?.total === 'number'
        ? payload.data.total
        : events.length;

    return <EventTable data={events} totalItems={total} columns={columns} />;
  } catch (e) {
    console.error('Failed to load events', e);
    return <EventTable data={[]} totalItems={0} columns={columns} />;
  }
}
