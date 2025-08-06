'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Performance } from '../../service/performance.service';
import { Column, ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export const createColumns = (
  onEdit: (performance: Performance) => void
): ColumnDef<Performance>[] => [
  {
    id: 'athlete',
    accessorKey: 'athlete',
    header: ({ column }: { column: Column<Performance, unknown> }) => (
      <DataTableColumnHeader column={column} title='Athlete' />
    ),
    cell: ({ row }) => {
      const athlete = row.getValue('athlete') as any;
      if (!athlete) return <div>Unknown Athlete</div>;
      return (
        <div>
          {athlete.firstName} {athlete.lastName} ({athlete.code})
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Athlete',
      placeholder: 'Search athlete...',
      variant: 'text'
    }
  },
  {
    id: 'event',
    accessorKey: 'event',
    header: ({ column }: { column: Column<Performance, unknown> }) => (
      <DataTableColumnHeader column={column} title='Event' />
    ),
    cell: ({ row }) => {
      const event = row.getValue('event') as any;
      if (!event) return <div>Unknown Event</div>;
      return <div>{event.name}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: 'Event',
      placeholder: 'Search event...',
      variant: 'text'
    }
  },
  {
    id: 'discipline',
    accessorKey: 'discipline',
    header: ({ column }: { column: Column<Performance, unknown> }) => (
      <DataTableColumnHeader column={column} title='Discipline' />
    ),
    cell: ({ row }) => {
      const discipline = row.getValue('discipline') as any;
      if (!discipline) return <div>N/A</div>;
      return (
        <Badge variant='outline' className='capitalize'>
          {discipline.name}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Discipline',
      placeholder: 'Search discipline...',
      variant: 'text'
    }
  },
  {
    id: 'date',
    accessorKey: 'date',
    header: ({ column }: { column: Column<Performance, unknown> }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('date') as string;
      return <div>{new Date(date).toLocaleDateString()}</div>;
    }
  },
  {
    id: 'position',
    accessorKey: 'position',
    header: ({ column }: { column: Column<Performance, unknown> }) => (
      <DataTableColumnHeader column={column} title='Position' />
    ),
    cell: ({ row }) => {
      const position = row.getValue('position') as number;
      return (
        <div className='font-medium'>{position ? `#${position}` : 'N/A'}</div>
      );
    }
  },
  {
    id: 'time',
    accessorKey: 'time',
    header: ({ column }: { column: Column<Performance, unknown> }) => (
      <DataTableColumnHeader column={column} title='Time' />
    ),
    cell: ({ row }) => {
      const time = row.getValue('time') as number;
      return <div>{time ? `${time}s` : 'N/A'}</div>;
    }
  },
  {
    id: 'distance',
    accessorKey: 'distance',
    header: ({ column }: { column: Column<Performance, unknown> }) => (
      <DataTableColumnHeader column={column} title='Distance' />
    ),
    cell: ({ row }) => {
      const distance = row.getValue('distance') as number;
      return <div>{distance ? `${distance}m` : 'N/A'}</div>;
    }
  },
  {
    id: 'height',
    accessorKey: 'height',
    header: ({ column }: { column: Column<Performance, unknown> }) => (
      <DataTableColumnHeader column={column} title='Height' />
    ),
    cell: ({ row }) => {
      const height = row.getValue('height') as number;
      return <div>{height ? `${height}m` : 'N/A'}</div>;
    }
  },
  {
    id: 'points',
    accessorKey: 'points',
    header: ({ column }: { column: Column<Performance, unknown> }) => (
      <DataTableColumnHeader column={column} title='Points' />
    ),
    cell: ({ row }) => {
      const points = row.getValue('points') as number;
      return <div>{points || 'N/A'}</div>;
    }
  },
  {
    id: 'best',
    accessorKey: 'isPersonalBest',
    header: ({ column }: { column: Column<Performance, unknown> }) => (
      <DataTableColumnHeader column={column} title='Best' />
    ),
    cell: ({ row }) => {
      const isPersonalBest = row.original.isPersonalBest;
      const isSeasonBest = row.original.isSeasonBest;

      if (isPersonalBest && isSeasonBest) {
        return (
          <Badge variant='default' className='bg-green-500'>
            PB & SB
          </Badge>
        );
      } else if (isPersonalBest) {
        return (
          <Badge variant='default' className='bg-blue-500'>
            PB
          </Badge>
        );
      } else if (isSeasonBest) {
        return (
          <Badge variant='default' className='bg-yellow-500'>
            SB
          </Badge>
        );
      }
      return <div>N/A</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} onEdit={onEdit} />
  }
];
