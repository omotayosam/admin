'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { EventItem } from '../../service/event.service';
import { CellAction } from './cell-action';

export const columns: ColumnDef<EventItem>[] = [
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column }: { column: Column<EventItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='Code' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-sm'>{row.getValue('code')}</div>
    )
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<EventItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>
  },
  {
    id: 'sport',
    header: ({ column }: { column: Column<EventItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='Sport' />
    ),
    cell: ({ row }) => {
      const sport = (row.original as any).sport?.name || 'Unknown';
      return (
        <Badge variant='secondary' className='capitalize'>
          {sport}
        </Badge>
      );
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<EventItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('status')}</div>
    )
  },
  {
    id: 'date',
    header: ({ column }: { column: Column<EventItem, unknown> }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const start = row.original.startDate
        ? new Date(row.original.startDate).toLocaleDateString()
        : '—';
      const end = row.original.endDate
        ? new Date(row.original.endDate).toLocaleDateString()
        : '';
      return <div>{end ? `${start} - ${end}` : start}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
