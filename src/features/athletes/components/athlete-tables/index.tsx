'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';

import { useDataTable } from '@/hooks/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { columns } from './columns';
import { Athlete } from '@/constants/data';
import { AthleteDialog, AthleteFormData } from '../athlete-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AthleteTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

export function AthleteTable<TData, TValue>({
  data,
  totalItems,
  columns
}: AthleteTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);
  const [isAthleteDialogOpen, setIsAthleteDialogOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] =
    useState<AthleteFormData | null>(null);
  const { table } = useDataTable({
    data, // athlete data
    columns, // athlete columns
    pageCount: pageCount,
    shallow: false, //Setting to false triggers a network request with the updated querystring.
    debounceMs: 500
  });

  const handleAthleteSave = (athlete: AthleteFormData) => {
    toast(
      `Athlete "${athlete.firstName} ${athlete.lastName}" ${athlete.athleteId ? 'updated' : 'added'}`,
      {
        position: 'bottom-left'
      }
    );
    setIsAthleteDialogOpen(false);
    setSelectedAthlete(null);
  };

  const handleAthleteDelete = (id: number) => {
    toast(`Athlete deleted`, {
      position: 'bottom-left'
    });
    setIsAthleteDialogOpen(false);
    setSelectedAthlete(null);
  };

  return (
    <DataTable table={table}>
      <Button
        variant='outline'
        className='max-sm:h-8 max-sm:px-2.5!'
        onClick={() => {
          setSelectedAthlete(null);
          setIsAthleteDialogOpen(true);
        }}
      >
        <Plus className='mr-2 h-4 w-4' />
        New Athlete
      </Button>
      <AthleteDialog
        athlete={selectedAthlete}
        isOpen={isAthleteDialogOpen}
        onClose={() => {
          setIsAthleteDialogOpen(false);
          setSelectedAthlete(null);
        }}
        onSave={handleAthleteSave}
        onDelete={handleAthleteDelete}
      />
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
