'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';

import { useDataTable } from '@/hooks/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { createColumns } from './columns';
import {
  CreatePerformanceData,
  Performance
} from '../../service/performance.service';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PerformanceDialog } from '../performance-dialog';
import { useState } from 'react';
import { performanceService } from '../../service/performance.service';
import { toast } from 'sonner';

interface PerformanceTableParams {
  data: Performance[];
  totalItems: number;
}

export function PerformanceTable({ data, totalItems }: PerformanceTableParams) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const [selectedPerformance, setSelectedPerformance] =
    useState<Performance | null>(null);
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditPerformance = (performance: Performance) => {
    setSelectedPerformance(performance);
    setIsPerformanceDialogOpen(true);
  };

  const columns = createColumns(handleEditPerformance);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  const handleCreatePerformance = () => {
    setSelectedPerformance(null);
    setIsPerformanceDialogOpen(true);
  };

  const handleSavePerformance = async (data: CreatePerformanceData) => {
    setIsLoading(true);
    try {
      if (selectedPerformance) {
        // Update existing performance
        await performanceService.updatePerformance(
          selectedPerformance.performanceId,
          data
        );
        toast.success('Performance updated successfully');
      } else {
        // Create new performance
        await performanceService.createPerformance(data);
        toast.success('Performance created successfully');
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error saving performance:', error);
      toast.error('Failed to save performance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePerformance = async (id: number) => {
    try {
      await performanceService.deletePerformance(id);
      toast.success('Performance deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting performance:', error);
      toast.error('Failed to delete performance');
    }
  };

  return (
    <DataTable table={table}>
      <Button
        variant='outline'
        className='max-sm:h-8 max-sm:px-2.5!'
        onClick={handleCreatePerformance}
        disabled={isLoading}
      >
        <Plus className='mr-2 h-4 w-4' />
        New Performance
      </Button>

      <PerformanceDialog
        performance={selectedPerformance}
        isOpen={isPerformanceDialogOpen}
        onClose={() => {
          setIsPerformanceDialogOpen(false);
          setSelectedPerformance(null);
        }}
        onSave={handleSavePerformance}
        onDelete={selectedPerformance ? handleDeletePerformance : undefined}
      />
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
