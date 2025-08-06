import { searchParamsCache } from '@/lib/searchparams';
import { PerformanceTable } from './performance-tables';
import { Performance } from '../service/performance.service';
import { performanceService } from '../service/performance.service';

type PerformanceListingPage = {};

export default async function PerformanceListingPage({}: PerformanceListingPage) {
  try {
    const page = searchParamsCache.get('page').toString();
    const search = searchParamsCache.get('search')?.toString();
    const pageLimit = searchParamsCache.get('perPage').toString();
    const athleteId = searchParamsCache.get('athleteId')?.toString();
    const eventId = searchParamsCache.get('eventId')?.toString();
    const disciplineId = searchParamsCache.get('disciplineId')?.toString();
    const sportType = searchParamsCache.get('sportType')?.toString();
    const dateFrom = searchParamsCache.get('dateFrom')?.toString();
    const dateTo = searchParamsCache.get('dateTo')?.toString();

    const filters = {
      page: page || '1',
      limit: pageLimit || '10',
      ...(search && { search }),
      ...(athleteId && { athleteId }),
      ...(eventId && { eventId }),
      ...(disciplineId && { disciplineId }),
      ...(sportType && { sportType }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo })
    };

    const data = await performanceService.getAllPerformances(filters);

    const totalPerformances = data.total || 0;
    const performances: Performance[] = data.data || [];

    return (
      <PerformanceTable data={performances} totalItems={totalPerformances} />
    );
  } catch (error) {
    console.error('Error loading performances:', error);

    return <PerformanceTable data={[]} totalItems={0} />;
  }
}
