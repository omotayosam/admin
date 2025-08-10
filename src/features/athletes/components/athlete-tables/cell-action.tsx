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
import { Athlete } from '@/constants/data';

import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { athleteService } from '../../service/athlete.service';
import { AthleteDialog, type AthleteFormData } from '../athlete-dialog';

interface CellActionProps {
  data: Athlete;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await handleDeleteAthlete(data);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error in onConfirm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAthlete = async (athlete: Athlete) => {
    try {
      setLoading(true);
      await athleteService.deleteAthlete(athlete.athleteId);
      toast.success('Athlete deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting athlete:', error);
      toast.error('Failed to delete athlete');
    } finally {
      setLoading(false);
    }
  };

  const deriveSportType = (): AthleteFormData['sportType'] => {
    const teamSport = data.team?.sport?.name as any;
    if (teamSport) return teamSport;
    const firstDisciplineSport = data.disciplines?.[0]?.discipline?.sport
      ?.name as any;
    return firstDisciplineSport || 'ATHLETICS';
  };

  const editingAthlete: AthleteFormData = useMemo(
    () => ({
      athleteId: data.athleteId,
      code: data.code,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality,
      gender: data.gender,
      height: data.height,
      weight: data.weight,
      bio: data.bio,
      isActive: data.isActive,
      sportType: deriveSportType(),
      teamCode: data.teamCode,
      positionCode: data.position?.code,
      disciplines: data.disciplines?.map((d) => ({
        code: d.discipline?.code || '',
        currentRank: d.currentRank
      }))
    }),
    [data]
  );

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
      <AthleteDialog
        athlete={editingAthlete}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={() => {
          setEditOpen(false);
          router.refresh();
        }}
        onDelete={() => {
          setEditOpen(false);
          router.refresh();
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
