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
import { Team } from '@/constants/data';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { teamService } from '../../service/team.service';
import { TeamDialog } from '../team-dialog';

interface CellActionProps {
  data: Team;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await handleDeleteTeam(data);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error in onConfirm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (team: Team) => {
    try {
      setLoading(true);
      await teamService.deleteTeam(team.teamId);
      toast.success('Team deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Failed to delete team');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditOpen(true);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <TeamDialog
        team={{
          code: data.code,
          name: data.name,
          sportId: String(data.sportId)
        }}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={async (payload) => {
          try {
            await teamService.updateTeam(data.teamId, {
              code: payload.code,
              name: payload.name,
              sportId: Number(payload.sportId)
            });
            toast.success('Team updated');
            setEditOpen(false);
            router.refresh();
          } catch (e) {
            console.error('Update team failed', e);
            toast.error('Failed to update team');
          }
        }}
        onDelete={async () => {
          try {
            await teamService.deleteTeam(data.teamId);
            toast.success('Team deleted');
            setEditOpen(false);
            router.refresh();
          } catch (e) {
            console.error('Delete team failed', e);
            toast.error('Failed to delete team');
          }
        }}
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
