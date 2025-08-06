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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect } from 'react';
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
import {
  CreatePerformanceData,
  Performance,
  performanceService
} from '../service/performance.service';

const performanceFormSchema = z.object({
  athleteId: z.string().min(1, 'Please select an athlete'),
  eventId: z.string().min(1, 'Please select an event'),
  disciplineId: z.string().optional(),
  date: z.string().min(1, 'Please select a date'),
  position: z.string().optional(),
  points: z.string().optional(),
  notes: z.string().optional(),

  // Track and Field
  time: z.string().optional(),
  distance: z.string().optional(),
  height: z.string().optional(),

  // Team sports common
  minutesPlayed: z.string().optional(),
  assists: z.string().optional(),

  // Football specific
  goalsScored: z.string().optional(),
  goalsConceded: z.string().optional(),
  yellowCards: z.string().optional(),
  redCards: z.string().optional(),
  saves: z.string().optional(),

  // Basketball specific
  twoPoints: z.string().optional(),
  threePoints: z.string().optional(),
  freeThrows: z.string().optional(),
  fieldGoals: z.string().optional(),
  rebounds: z.string().optional(),
  steals: z.string().optional(),
  blocks: z.string().optional(),
  turnovers: z.string().optional(),

  // Wrestling specific
  wins: z.string().optional(),
  losses: z.string().optional(),
  pins: z.string().optional(),
  technicalFalls: z.string().optional(),
  decisions: z.string().optional(),

  // Boxing specific
  rounds: z.string().optional(),
  knockouts: z.string().optional(),
  knockdowns: z.string().optional(),
  punchesLanded: z.string().optional(),
  punchesThrown: z.string().optional()
});

type PerformanceFormData = z.infer<typeof performanceFormSchema>;

interface PerformanceDialogProps {
  performance?: Performance | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreatePerformanceData) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

// Real data will be fetched from API
const athletes: any[] = [];
const events: any[] = [];
const disciplines: any[] = [];

export function PerformanceDialog({
  performance,
  isOpen,
  onClose,
  onSave,
  onDelete
}: PerformanceDialogProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setError(null); // Clear any previous errors
      const fetchData = async () => {
        setIsDataLoading(true);
        try {
          const [athletesData, eventsData, disciplinesData] = await Promise.all(
            [
              performanceService.getAthletes(),
              performanceService.getEvents(),
              performanceService.getDisciplines()
            ]
          );
          console.log('Athletes data:', athletesData);
          console.log('Events data:', eventsData);
          console.log('Disciplines data:', disciplinesData);
          setAthletes(Array.isArray(athletesData) ? athletesData : []);
          setEvents(Array.isArray(eventsData) ? eventsData : []);
          setDisciplines(Array.isArray(disciplinesData) ? disciplinesData : []);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to load data. Please try again.');
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const form = useForm<PerformanceFormData>({
    resolver: zodResolver(performanceFormSchema),
    defaultValues: {
      athleteId: performance?.athleteId?.toString() || '',
      eventId: performance?.eventId?.toString() || '',
      disciplineId: performance?.disciplineId?.toString() || '',
      date: performance?.date || new Date().toISOString().split('T')[0],
      position: performance?.position?.toString() || '',
      points: performance?.points?.toString() || '',
      notes: performance?.notes || '',
      time: performance?.time?.toString() || '',
      distance: performance?.distance?.toString() || '',
      height: performance?.height?.toString() || '',
      minutesPlayed: performance?.minutesPlayed?.toString() || '',
      assists: performance?.assists?.toString() || '',
      goalsScored: performance?.goalsScored?.toString() || '',
      goalsConceded: performance?.goalsConceded?.toString() || '',
      yellowCards: performance?.yellowCards?.toString() || '',
      redCards: performance?.redCards?.toString() || '',
      saves: performance?.saves?.toString() || '',
      twoPoints: performance?.twoPoints?.toString() || '',
      threePoints: performance?.threePoints?.toString() || '',
      freeThrows: performance?.freeThrows?.toString() || '',
      fieldGoals: performance?.fieldGoals?.toString() || '',
      rebounds: performance?.rebounds?.toString() || '',
      steals: performance?.steals?.toString() || '',
      blocks: performance?.blocks?.toString() || '',
      turnovers: performance?.turnovers?.toString() || '',
      wins: performance?.wins?.toString() || '',
      losses: performance?.losses?.toString() || '',
      pins: performance?.pins?.toString() || '',
      technicalFalls: performance?.technicalFalls?.toString() || '',
      decisions: performance?.decisions?.toString() || '',
      rounds: performance?.rounds?.toString() || '',
      knockouts: performance?.knockouts?.toString() || '',
      knockdowns: performance?.knockdowns?.toString() || '',
      punchesLanded: performance?.punchesLanded?.toString() || '',
      punchesThrown: performance?.punchesThrown?.toString() || ''
    }
  });

  const onSubmit = async (data: PerformanceFormData) => {
    setIsLoading(true);
    try {
      const performanceData: CreatePerformanceData = {
        athleteId: parseInt(data.athleteId),
        eventId: parseInt(data.eventId),
        disciplineId: data.disciplineId
          ? parseInt(data.disciplineId)
          : undefined,
        date: new Date(data.date).toISOString(),
        position: data.position ? parseInt(data.position) : undefined,
        points: data.points ? parseFloat(data.points) : undefined,
        notes: data.notes,
        time: data.time ? parseFloat(data.time) : undefined,
        distance: data.distance ? parseFloat(data.distance) : undefined,
        height: data.height ? parseFloat(data.height) : undefined,
        minutesPlayed: data.minutesPlayed
          ? parseInt(data.minutesPlayed)
          : undefined,
        assists: data.assists ? parseInt(data.assists) : undefined,
        goalsScored: data.goalsScored ? parseInt(data.goalsScored) : undefined,
        goalsConceded: data.goalsConceded
          ? parseInt(data.goalsConceded)
          : undefined,
        yellowCards: data.yellowCards ? parseInt(data.yellowCards) : undefined,
        redCards: data.redCards ? parseInt(data.redCards) : undefined,
        saves: data.saves ? parseInt(data.saves) : undefined,
        twoPoints: data.twoPoints ? parseInt(data.twoPoints) : undefined,
        threePoints: data.threePoints ? parseInt(data.threePoints) : undefined,
        freeThrows: data.freeThrows ? parseInt(data.freeThrows) : undefined,
        fieldGoals: data.fieldGoals ? parseInt(data.fieldGoals) : undefined,
        rebounds: data.rebounds ? parseInt(data.rebounds) : undefined,
        steals: data.steals ? parseInt(data.steals) : undefined,
        blocks: data.blocks ? parseInt(data.blocks) : undefined,
        turnovers: data.turnovers ? parseInt(data.turnovers) : undefined,
        wins: data.wins ? parseInt(data.wins) : undefined,
        losses: data.losses ? parseInt(data.losses) : undefined,
        pins: data.pins ? parseInt(data.pins) : undefined,
        technicalFalls: data.technicalFalls
          ? parseInt(data.technicalFalls)
          : undefined,
        decisions: data.decisions ? parseInt(data.decisions) : undefined,
        rounds: data.rounds ? parseInt(data.rounds) : undefined,
        knockouts: data.knockouts ? parseInt(data.knockouts) : undefined,
        knockdowns: data.knockdowns ? parseInt(data.knockdowns) : undefined,
        punchesLanded: data.punchesLanded
          ? parseInt(data.punchesLanded)
          : undefined,
        punchesThrown: data.punchesThrown
          ? parseInt(data.punchesThrown)
          : undefined
      };

      await onSave(performanceData);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error saving performance:', error);
      setError('Failed to save performance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[800px]'>
          <DialogHeader>
            <DialogTitle>
              {performance ? 'Edit Performance' : 'Create New Performance'}
            </DialogTitle>
            <DialogDescription>
              {performance
                ? 'Update the performance information here.'
                : 'Record a new performance for an athlete.'}
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className='rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
              {error}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <Tabs defaultValue='basic' className='w-full'>
                <TabsList className='grid w-full grid-cols-6'>
                  <TabsTrigger value='basic'>Basic</TabsTrigger>
                  <TabsTrigger value='track'>Track</TabsTrigger>
                  <TabsTrigger value='football'>Football</TabsTrigger>
                  <TabsTrigger value='basketball'>Basketball</TabsTrigger>
                  <TabsTrigger value='wrestling'>Wrestling</TabsTrigger>
                  <TabsTrigger value='boxing'>Boxing</TabsTrigger>
                </TabsList>

                <TabsContent value='basic' className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='athleteId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Athlete</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isDataLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    isDataLoading
                                      ? 'Loading athletes...'
                                      : 'Select an athlete'
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {athletes.map((athlete) => (
                                <SelectItem
                                  key={athlete.athleteId}
                                  value={athlete.athleteId.toString()}
                                >
                                  {athlete.firstName} {athlete.lastName} (
                                  {athlete.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='eventId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isDataLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    isDataLoading
                                      ? 'Loading events...'
                                      : 'Select an event'
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {events.map((event) => (
                                <SelectItem
                                  key={event.eventId}
                                  value={event.eventId.toString()}
                                >
                                  {event.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='disciplineId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discipline (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isDataLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    isDataLoading
                                      ? 'Loading disciplines...'
                                      : 'Select a discipline'
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {disciplines.map((discipline) => (
                                <SelectItem
                                  key={discipline.disciplineId}
                                  value={discipline.disciplineId.toString()}
                                >
                                  {discipline.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='date'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type='date' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='position'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position/Rank</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='1' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='points'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Points</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.01'
                              placeholder='100'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='notes'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Additional notes about the performance...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value='track' className='space-y-4'>
                  <div className='grid grid-cols-3 gap-4'>
                    <FormField
                      control={form.control}
                      name='time'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time (seconds)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.01'
                              placeholder='10.5'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='distance'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distance (meters)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.01'
                              placeholder='100'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='height'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (meters)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.01'
                              placeholder='2.1'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='football' className='space-y-4'>
                  <div className='grid grid-cols-3 gap-4'>
                    <FormField
                      control={form.control}
                      name='minutesPlayed'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minutes Played</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='90' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='goalsScored'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goals Scored</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='2' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='assists'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assists</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='1' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='yellowCards'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yellow Cards</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='1' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='redCards'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Red Cards</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='0' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='saves'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saves</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='5' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='basketball' className='space-y-4'>
                  <div className='grid grid-cols-3 gap-4'>
                    <FormField
                      control={form.control}
                      name='minutesPlayed'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minutes Played</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='35' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='twoPoints'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>2-Point Field Goals</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='8' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='threePoints'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>3-Point Field Goals</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='2' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='freeThrows'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Free Throws</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='4' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='rebounds'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rebounds</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='10' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='assists'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assists</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='8' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='steals'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Steals</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='2' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='blocks'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blocks</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='1' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='turnovers'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Turnovers</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='3' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='wrestling' className='space-y-4'>
                  <div className='grid grid-cols-3 gap-4'>
                    <FormField
                      control={form.control}
                      name='wins'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wins</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='1' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='losses'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Losses</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='0' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='pins'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pins</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='1' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='technicalFalls'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technical Falls</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='0' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='decisions'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Decisions</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='0' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='boxing' className='space-y-4'>
                  <div className='grid grid-cols-3 gap-4'>
                    <FormField
                      control={form.control}
                      name='rounds'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rounds</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='12' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='knockouts'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Knockouts</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='1' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='knockdowns'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Knockdowns</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='2' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='punchesLanded'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Punches Landed</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='150' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='punchesThrown'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Punches Thrown</FormLabel>
                          <FormControl>
                            <Input type='number' placeholder='300' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                {performance && onDelete && (
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
                  {isLoading ? 'Saving...' : performance ? 'Update' : 'Create'}
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
              performance record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (performance && onDelete) {
                  try {
                    await onDelete(performance.performanceId);
                    setIsDeleteDialogOpen(false);
                    onClose();
                  } catch (error) {
                    console.error('Error deleting performance:', error);
                  }
                }
              }}
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
