import { fakeAthletes } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { AthleteTable } from './athlete-tables';
import { Athlete } from '@/constants/data';
import { athleteService } from '../service/athlete.service';
import { columns } from './athlete-tables/columns';

type AthleteListingPage = {};

export default async function AthleteListingPage({}: AthleteListingPage) {
  try {
    // Showcasing the use of search params cache in nested RSCs
    const page = searchParamsCache.get('page').toString();
    const search = searchParamsCache.get('name')?.toString();
    const pageLimit = searchParamsCache.get('perPage').toString();
    const disciplineCode = searchParamsCache.get('disciplineCode')?.toString();

    const filters = {
      page: page || '1',
      limit: pageLimit || '10',
      ...(search && { search }),
      ...(disciplineCode && { disciplineCode })
    };

    const data = await athleteService.getAllAthletes(filters);

    // Updated to use the new PaginatedResponse structure
    const totalAthletes = data.total || 0;
    const athletes: Athlete[] = data.data || [];

    return (
      <AthleteTable
        data={athletes}
        totalItems={totalAthletes}
        columns={columns}
      />
    );
  } catch (error) {
    console.error('Error loading athletes:', error);

    // Return empty data on error
    return <AthleteTable data={[]} totalItems={0} columns={columns} />;
  }
}
