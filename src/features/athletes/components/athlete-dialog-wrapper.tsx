'use client';

import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AthleteDialog, AthleteFormData } from './athlete-dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AthleteDialogWrapperProps {
  children: ReactNode;
}

export function AthleteDialogWrapper({ children }: AthleteDialogWrapperProps) {
  const [isAthleteDialogOpen, setIsAthleteDialogOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] =
    useState<AthleteFormData | null>(null);
  const router = useRouter();

  const handleAthleteSave = (athlete: AthleteFormData) => {
    toast.success(
      `Athlete "${athlete.firstName} ${athlete.lastName}" ${athlete.athleteId ? 'updated' : 'added'} successfully`,
      {
        position: 'bottom-left'
      }
    );
    setIsAthleteDialogOpen(false);
    setSelectedAthlete(null);
    router.refresh();
  };

  const handleAthleteDelete = (id: number) => {
    toast.success('Athlete deleted successfully', {
      position: 'bottom-left'
    });
    setIsAthleteDialogOpen(false);
    setSelectedAthlete(null);
    router.refresh();
  };

  return (
    <>
      <div className='space-y-4'>
        <div className='flex justify-end'>
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
        </div>

        {children}
      </div>

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
    </>
  );
}
