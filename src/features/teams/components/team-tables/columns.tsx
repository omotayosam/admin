'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Team } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';

import { SPORT_MAP } from './options';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Team>[] = [
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column }: { column: Column<Team, unknown> }) => (
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
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Team, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
    enableColumnFilter: true,
    meta: {
      label: 'Name',
      placeholder: 'Search team...',
      variant: 'text'
    }
  },
  {
    id: 'sport',
    accessorKey: 'sportId',
    header: ({ column }: { column: Column<Team, unknown> }) => (
      <DataTableColumnHeader column={column} title='Sport' />
    ),
    cell: ({ row }) => {
      const sportId = row.getValue('sportId') as number;
      const sportName =
        SPORT_MAP[sportId.toString() as keyof typeof SPORT_MAP] || 'Unknown';
      return (
        <Badge variant='secondary' className='capitalize'>
          {sportName}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Sport',
      variant: 'select',
      options: [
        { label: 'Football', value: '1' },
        { label: 'Basketball', value: '2' },
        { label: 'Athletics', value: '3' },
        { label: 'Wrestling', value: '4' },
        { label: 'Boxing', value: '5' }
      ]
    }
  },
  {
    id: 'athletes',
    header: ({ column }: { column: Column<Team, unknown> }) => (
      <DataTableColumnHeader column={column} title='Athletes' />
    ),
    cell: ({ row }) => {
      const athletes = row.original.athletes || [];
      return <div>{athletes.length} athletes</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
