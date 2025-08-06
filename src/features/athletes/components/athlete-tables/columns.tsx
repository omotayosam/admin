'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Athlete } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { DISCIPLINE_MAP } from './options';

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
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
}

// Helper function to get primary discipline from disciplines array
function getPrimaryDiscipline(athlete: Athlete): string {
  if (!athlete.disciplines || athlete.disciplines.length === 0) {
    return 'No Discipline';
  }

  // Get the discipline with the highest rank (lowest number) or first discipline
  const primaryDiscipline = athlete.disciplines.reduce((prev, current) => {
    if (prev.currentRank && current.currentRank) {
      return prev.currentRank < current.currentRank ? prev : current;
    }
    return prev;
  });

  return primaryDiscipline.discipline?.code || 'Unknown';
}

// Helper function to get primary rank from disciplines array
function getPrimaryRank(athlete: Athlete): number | null {
  if (!athlete.disciplines || athlete.disciplines.length === 0) {
    return null;
  }

  // Get the discipline with the highest rank (lowest number)
  const primaryDiscipline = athlete.disciplines.reduce((prev, current) => {
    if (prev.currentRank && current.currentRank) {
      return prev.currentRank < current.currentRank ? prev : current;
    }
    return prev;
  });

  return primaryDiscipline.currentRank || null;
}

// Helper function to get sport type from disciplines or team
function getSportType(athlete: Athlete): string {
  if (athlete.disciplines && athlete.disciplines.length > 0) {
    const sportName = athlete.disciplines[0].discipline?.sport?.name;
    return sportName || 'Unknown';
  }
  if (athlete.team) {
    const sportName = athlete.team.sport?.name;
    return sportName || 'Unknown';
  }
  return 'Unknown';
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1440/api'
).replace('/api', '');

export const columns: ColumnDef<Athlete>[] = [
  {
    accessorKey: 'photo',
    header: 'IMAGE',
    cell: ({ row }) => {
      const athlete = row.original;
      return athlete.avatarUrl ? (
        <div className='relative aspect-square'>
          <img
            src={athlete.avatarUrl}
            alt={`${athlete.firstName} ${athlete.lastName}`}
            className='rounded-lg'
          />
        </div>
      ) : (
        <div className='relative flex aspect-square items-center justify-center rounded-lg bg-gray-200'>
          <span className='text-xs text-gray-500'>No Image</span>
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'firstName', // Use firstName as the primary accessor
    header: ({ column }: { column: Column<Athlete, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div>{`${row.original.firstName} ${row.original.lastName}`}</div>
    ),
    // Custom accessor function to return the full name for filtering
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    meta: {
      label: 'Name',
      placeholder: 'Search athlete...',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column }: { column: Column<Athlete, unknown> }) => (
      <DataTableColumnHeader column={column} title='Code' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-sm'>{row.getValue('code')}</div>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Code',
      placeholder: 'Search code...',
      variant: 'text'
    }
  },
  {
    id: 'discipline',
    accessorKey: 'disciplines',
    header: ({ column }: { column: Column<Athlete, unknown> }) => (
      <DataTableColumnHeader column={column} title='Discipline' />
    ),
    cell: ({ row }) => {
      const disciplineCode = getPrimaryDiscipline(row.original);
      const disciplineName =
        DISCIPLINE_MAP[disciplineCode as keyof typeof DISCIPLINE_MAP] ||
        disciplineCode;
      return (
        <Badge variant='outline' className='capitalize'>
          {disciplineName}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Discipline',
      variant: 'select',
      options: Object.entries(DISCIPLINE_MAP).map(([id, name]) => ({
        label: name,
        value: id
      }))
    }
  },
  {
    id: 'rank',
    accessorKey: 'disciplines',
    header: ({ column }: { column: Column<Athlete, unknown> }) => (
      <DataTableColumnHeader column={column} title='Rank' />
    ),
    cell: ({ row }) => {
      const rank = getPrimaryRank(row.original);
      return <div className='font-medium'>{rank ? `#${rank}` : 'N/A'}</div>;
    }
  },
  {
    id: 'age',
    accessorKey: 'dateOfBirth',
    header: ({ column }: { column: Column<Athlete, unknown> }) => (
      <DataTableColumnHeader column={column} title='Age' />
    ),
    cell: ({ row }) => {
      const age = calculateAge(row.original.dateOfBirth);
      return <div>{age} years</div>;
    }
  },
  {
    id: 'sport',
    header: ({ column }: { column: Column<Athlete, unknown> }) => (
      <DataTableColumnHeader column={column} title='Sport' />
    ),
    cell: ({ row }) => {
      const sportType = getSportType(row.original);
      return (
        <Badge variant='secondary' className='capitalize'>
          {sportType}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Sport',
      variant: 'select',
      options: [
        { label: 'Football', value: 'FOOTBALL' },
        { label: 'Basketball', value: 'BASKETBALL' },
        { label: 'Athletics', value: 'ATHLETICS' },
        { label: 'Wrestling', value: 'WRESTLING' },
        { label: 'Boxing', value: 'BOXING' }
      ]
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
