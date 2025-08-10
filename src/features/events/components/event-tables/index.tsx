'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';

import { useDataTable } from '@/hooks/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { EventDialog, type EventFormData } from '../event-dialog';
import { useRouter } from 'next/navigation';

interface EventTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

export function EventTable<TData, TValue>({
  data,
  totalItems,
  columns
}: EventTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventFormData | null>(
    null
  );
  const router = useRouter();
  const { table } = useDataTable({
    data, // Event data
    columns, // Event columns
    pageCount: pageCount,
    shallow: false, //Setting to false triggers a network request with the updated querystring.
    debounceMs: 500
  });

  const handleEventSaved = () => {
    toast('Event saved', { position: 'bottom-left' });
    router.refresh();
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <DataTable table={table}>
      <Button
        variant='outline'
        className='max-sm:h-8 max-sm:px-2.5!'
        onClick={() => {
          setSelectedEvent(null);
          setIsEventDialogOpen(true);
        }}
      >
        <Plus className='mr-2 h-4 w-4' />
        New Event
      </Button>
      <EventDialog
        eventData={selectedEvent}
        isOpen={isEventDialogOpen}
        onClose={() => {
          setIsEventDialogOpen(false);
          setSelectedEvent(null);
        }}
        onSaved={handleEventSaved}
      />
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
