import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  disciplineCode: parseAsString,
  sportId: parseAsInteger,
  teamId: parseAsInteger,
  seasonId: parseAsInteger,
  gamedayId: parseAsInteger,
  venueId: parseAsInteger,
  eventId: parseAsInteger,
  athleteId: parseAsInteger,
  disciplineId: parseAsInteger,
  positionId: parseAsInteger,
  sportType: parseAsString,
  dateFrom: parseAsString,
  dateTo: parseAsString,
  position: parseAsString,
  points: parseAsInteger,
  date: parseAsString,
  event: parseAsString,
  discipline: parseAsString,
  athlete: parseAsString,
  team: parseAsString,
  search: parseAsString,
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
