'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Performance } from '../../service/performance.service';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { performanceService } from '../../service/performance.service';

interface CellActionProps {
  data: Performance;
  onEdit: (performance: Performance) => void;
}

export const CellAction: React.FC<CellActionProps> = ({ data, onEdit }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await handleDeletePerformance(data);
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error in onConfirm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePerformance = async (performance: Performance) => {
    try {
      setLoading(true);
      await performanceService.deletePerformance(performance.performanceId);
      toast.success('Performance deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting performance:', error);
      toast.error('Failed to delete performance');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    onEdit(data);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={handleEdit}>
            <IconEdit className='mr-2 h-4 w-4' /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
