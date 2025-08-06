import { searchParamsCache } from '@/lib/searchparams';
import { TeamTable } from './team-tables';
import { Team } from '@/constants/data';
import { teamService } from '../service/team.service';
import { columns } from './team-tables/columns';

type TeamListingPage = {};

export default async function TeamListingPage({}: TeamListingPage) {
  try {
    const page = searchParamsCache.get('page').toString();
    const search = searchParamsCache.get('name')?.toString();
    const pageLimit = searchParamsCache.get('perPage').toString();
    const sportId = searchParamsCache.get('sportId')?.toString();

    const filters = {
      page: page || '1',
      limit: pageLimit || '10',
      ...(search && { search }),
      ...(sportId && { sportId })
    };

    const data = await teamService.getAllTeams(filters);

    const totalTeams = data.total || 0;
    const teams: Team[] = data.data || [];

    return <TeamTable data={teams} totalItems={totalTeams} columns={columns} />;
  } catch (error) {
    console.error('Error loading teams:', error);

    return <TeamTable data={[]} totalItems={0} columns={columns} />;
  }
}
