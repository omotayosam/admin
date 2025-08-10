'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

const teamFormSchema = z.object({
  code: z.string().min(2, 'Code must be at least 2 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sportId: z.string().min(1, 'Please select a sport')
});

type TeamFormData = z.infer<typeof teamFormSchema>;

interface TeamDialogProps {
  team?: TeamFormData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeamFormData) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

const sports = [
  { id: 1, name: 'Basketball', value: '1' },
  { id: 2, name: 'Football', value: '2' },
  { id: 3, name: 'Athletics', value: '3' },
  { id: 4, name: 'Wrestling', value: '4' },
  { id: 5, name: 'Boxing', value: '5' }
];

function sportIdToPrefix(sportId?: string): string {
  switch (sportId) {
    case '1':
      return 'BB';
    case '2':
      return 'FB';
    case '3':
      return 'ATH';
    case '4':
      return 'WR';
    case '5':
      return 'BX';
    default:
      return 'TM';
  }
}

function generateTeamCode(prefix: string = 'TM'): string {
  const random = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `${prefix}${random}`;
}

export function TeamDialog({
  team,
  isOpen,
  onClose,
  onSave,
  onDelete
}: TeamDialogProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      code: team?.code || '',
      name: team?.name || '',
      sportId: team?.sportId || ''
    }
  });

  const sportId = form.watch('sportId');

  // Prefill random code for new teams when dialog opens or when sport changes and code empty
  useEffect(() => {
    if (!team && isOpen) {
      const currentCode = form.getValues('code');
      if (!currentCode || currentCode.length < 2) {
        form.setValue('code', generateTeamCode(sportIdToPrefix(sportId)));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sportId, team]);

  const onSubmit = async (data: TeamFormData) => {
    setIsLoading(true);
    try {
      await onSave(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error saving team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!team || !onDelete) return;

    setIsLoading(true);
    try {
      // Note: This would need the team ID, which isn't in the form data
      // You might need to pass the full team object instead
      await onDelete(0); // This needs to be fixed
      onClose();
    } catch (error) {
      console.error('Error deleting team:', error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{team ? 'Edit Team' : 'Create New Team'}</DialogTitle>
            <DialogDescription>
              {team
                ? 'Make changes to the team information here.'
                : 'Add a new team to the system.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Code</FormLabel>
                    <FormControl>
                      <div className='flex gap-2'>
                        <Input placeholder='TEAM001' {...field} />
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() =>
                            form.setValue(
                              'code',
                              generateTeamCode(
                                sportIdToPrefix(form.getValues('sportId'))
                              )
                            )
                          }
                        >
                          Randomize
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the team
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Lakers' {...field} />
                    </FormControl>
                    <FormDescription>Display name for the team</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='sportId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a sport' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sports.map((sport) => (
                          <SelectItem key={sport.id} value={sport.value}>
                            {sport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The sport this team participates in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                {team && onDelete && (
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                )}
                <Button type='button' variant='outline' onClick={onClose}>
                  Cancel
                </Button>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? 'Saving...' : team ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              team and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
