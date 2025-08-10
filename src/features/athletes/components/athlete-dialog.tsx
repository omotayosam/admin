'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { athleteService } from '../service/athlete.service';
import { useRouter } from 'next/navigation';
import { teamService } from '@/features/teams/service/team.service';
import { positionService } from '@/features/positions/service/position.service';
import type { Team } from '@/constants/data';

export interface AthleteFormData {
  athleteId?: number;
  code: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  height: number;
  weight: number;
  bio?: string;
  isActive: boolean;
  sportType: 'BASKETBALL' | 'FOOTBALL' | 'ATHLETICS' | 'WRESTLING' | 'BOXING';
  // For team athletes
  teamCode?: string;
  positionCode?: string;
  // For individual athletes
  disciplines?: { code: string; currentRank?: number }[];
}

interface AthleteDialogProps {
  athlete: AthleteFormData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (athlete: AthleteFormData) => void;
  onDelete: (athleteId: number) => void;
}

function generateAthleteCode(prefix: string = 'ATH'): string {
  const random = Math.floor(10000000 + Math.random() * 90000000); // 8 digits
  return `${prefix}${random}`;
}

function sportPrefix(sportType: AthleteFormData['sportType']): string {
  switch (sportType) {
    case 'FOOTBALL':
      return 'FB';
    case 'BASKETBALL':
      return 'BB';
    case 'WRESTLING':
      return 'WR';
    case 'BOXING':
      return 'BX';
    case 'ATHLETICS':
    default:
      return 'ATH';
  }
}

export function AthleteDialog({
  athlete,
  isOpen,
  onClose,
  onSave,
  onDelete
}: AthleteDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AthleteFormData>({
    code: generateAthleteCode('ATH'),
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: 'Nigeria',
    gender: 'MALE',
    height: 0,
    weight: 0,
    bio: '',
    isActive: true,
    sportType: 'ATHLETICS',
    disciplines: []
  });

  // Team search state
  const [teamQuery, setTeamQuery] = useState('');
  const [teamOptions, setTeamOptions] = useState<Team[]>([]);
  const [positions, setPositions] = useState<
    { positionId: number; code: string; name: string; sportId: number }[]
  >([]);
  const isTeamSport =
    formData.sportType === 'FOOTBALL' || formData.sportType === 'BASKETBALL';

  useEffect(() => {
    if (athlete) {
      setFormData({
        athleteId: athlete.athleteId,
        code: athlete.code || '',
        firstName: athlete.firstName,
        lastName: athlete.lastName,
        dateOfBirth: athlete.dateOfBirth,
        nationality: athlete.nationality || 'Nigeria',
        gender: athlete.gender || 'MALE',
        height: athlete.height || 0,
        weight: athlete.weight || 0,
        bio: athlete.bio || '',
        isActive: athlete.isActive !== undefined ? athlete.isActive : true,
        sportType: athlete.sportType || 'ATHLETICS',
        teamCode: athlete.teamCode,
        positionCode: athlete.positionCode,
        disciplines: athlete.disciplines || []
      });
    } else {
      setFormData({
        code: generateAthleteCode(sportPrefix('ATHLETICS')),
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nationality: 'Nigeria',
        gender: 'MALE',
        height: 0,
        weight: 0,
        bio: '',
        isActive: true,
        sportType: 'ATHLETICS',
        disciplines: []
      });
    }
  }, [athlete]);

  // When sport type changes, optionally regenerate a code prefix for new athletes
  useEffect(() => {
    if (!athlete) {
      const prefix = sportPrefix(formData.sportType);
      setFormData((prev) => ({ ...prev, code: generateAthleteCode(prefix) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.sportType]);

  // Fetch positions whenever team or sport changes for team sports
  useEffect(() => {
    const loadPositions = async () => {
      try {
        setPositions([]);
        if (!isTeamSport) return;
        const selectedTeam = teamOptions.find(
          (t) => t.code === formData.teamCode
        );
        const sportId = selectedTeam?.sportId;
        if (!sportId) return;
        const list = await positionService.getPositionsBySport(sportId);
        setPositions(list);
      } catch (e) {
        console.error('Failed to load positions', e);
      }
    };
    loadPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.teamCode, formData.sportType]);

  // Debounced team search
  useEffect(() => {
    const handle = setTimeout(async () => {
      try {
        if (!isTeamSport) return;
        const page = await teamService.getAllTeams({
          search: teamQuery,
          limit: '10',
          page: '1'
        });
        setTeamOptions(page.data || []);
      } catch (e) {
        console.error('Failed to search teams', e);
        setTeamOptions([]);
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamQuery, formData.sportType]);

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!formData.firstName || !formData.lastName || !formData.code) {
        toast.error('Please fill in all required fields');
        return;
      }

      const athleteData = {
        code: formData.code,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality || 'Nigeria',
        gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
        height: formData.height || 0,
        weight: formData.weight || 0,
        bio: formData.bio || ''
      };

      let response;

      if (athlete?.athleteId) {
        // Build update payload (omit sportType; include teamCode/positionId if provided)
        const updatePayload: any = { ...athleteData };
        if (isTeamSport) {
          if (formData.teamCode) updatePayload.teamCode = formData.teamCode;
          if (formData.positionCode) {
            const pos = positions.find((p) => p.code === formData.positionCode);
            if (pos) updatePayload.positionId = pos.positionId;
          }
        }
        response = await athleteService.updateAthlete(
          athlete.athleteId,
          updatePayload
        );
        toast.success(
          `Athlete "${formData.firstName} ${formData.lastName}" updated successfully`
        );
      } else {
        // Helper to attempt create and retry on duplicate code
        const attemptCreate = async (): Promise<any> => {
          try {
            if (isTeamSport) {
              if (formData.teamCode && formData.positionCode) {
                return await athleteService.createTeamAthlete({
                  ...athleteData,
                  sportType: formData.sportType,
                  teamCode: formData.teamCode!,
                  positionCode: formData.positionCode!
                });
              }
              throw new Error(
                'Please select a team and position for team athletes'
              );
            } else {
              if (formData.disciplines && formData.disciplines.length > 0) {
                return await athleteService.createIndividualAthlete({
                  ...athleteData,
                  sportType: formData.sportType,
                  disciplines: formData.disciplines
                });
              } else {
                return await athleteService.createIndividualAthlete({
                  ...athleteData,
                  sportType: formData.sportType,
                  disciplines: [{ code: '100M', currentRank: 1 }]
                });
              }
            }
          } catch (err: any) {
            const status = err?.response?.status;
            if (status === 409) {
              // Duplicate code - generate a new one and retry once
              const prefix = sportPrefix(formData.sportType);
              const newCode = generateAthleteCode(prefix);
              setFormData((prev) => ({ ...prev, code: newCode }));
              return await new Promise((resolve, reject) => {
                setTimeout(async () => {
                  try {
                    const retry = await (isTeamSport
                      ? athleteService.createTeamAthlete({
                          ...athleteData,
                          code: newCode,
                          sportType: formData.sportType,
                          teamCode: formData.teamCode!,
                          positionCode: formData.positionCode!
                        })
                      : athleteService.createIndividualAthlete({
                          ...athleteData,
                          code: newCode,
                          sportType: formData.sportType,
                          disciplines: formData.disciplines?.length
                            ? formData.disciplines
                            : [{ code: '100M', currentRank: 1 }]
                        }));
                    resolve(retry);
                  } catch (e) {
                    reject(e);
                  }
                }, 150);
              });
            }
            throw err;
          }
        };

        response = await attemptCreate();
        toast.success(
          `Athlete "${formData.firstName} ${formData.lastName}" created successfully`
        );
      }

      onSave(formData);
      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error saving athlete:', error);
      toast.error('Failed to save athlete');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!athlete?.athleteId) {
      toast.error('No athlete selected for deletion');
      return;
    }

    try {
      setLoading(true);
      await athleteService.deleteAthlete(athlete.athleteId);
      onDelete(athlete.athleteId);
      onClose();
      router.refresh();
      toast.success('Athlete deleted successfully');
    } catch (error) {
      console.error('Error deleting athlete:', error);
      toast.error('Failed to delete athlete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {athlete ? 'Edit Athlete' : 'Create New Athlete'}
          </DialogTitle>
          <DialogDescription>
            {athlete
              ? 'Update athlete information'
              : 'Add a new athlete to the system'}
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='code'>Code *</Label>
              <div className='flex gap-2'>
                <Input
                  id='code'
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder='ATH00123456'
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      code: generateAthleteCode(sportPrefix(formData.sportType))
                    }))
                  }
                >
                  Randomize
                </Button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='sportType'>Sport Type *</Label>
              <Select
                value={formData.sportType}
                onValueChange={(
                  value:
                    | 'BASKETBALL'
                    | 'FOOTBALL'
                    | 'ATHLETICS'
                    | 'WRESTLING'
                    | 'BOXING'
                ) => {
                  setFormData({
                    ...formData,
                    sportType: value,
                    teamCode: undefined,
                    positionCode: undefined
                  });
                  setTeamQuery('');
                  setTeamOptions([]);
                  setPositions([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select sport' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='FOOTBALL'>Football</SelectItem>
                  <SelectItem value='BASKETBALL'>Basketball</SelectItem>
                  <SelectItem value='ATHLETICS'>Athletics</SelectItem>
                  <SelectItem value='WRESTLING'>Wrestling</SelectItem>
                  <SelectItem value='BOXING'>Boxing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>First Name *</Label>
              <Input
                id='firstName'
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder='John'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>Last Name *</Label>
              <Input
                id='lastName'
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder='Doe'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='dateOfBirth'>Date of Birth *</Label>
              <Input
                id='dateOfBirth'
                type='date'
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='nationality'>Nationality</Label>
              <Input
                id='nationality'
                value={formData.nationality}
                onChange={(e) =>
                  setFormData({ ...formData, nationality: e.target.value })
                }
                placeholder='Nigeria'
              />
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='gender'>Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: 'MALE' | 'FEMALE' | 'OTHER') =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='MALE'>Male</SelectItem>
                  <SelectItem value='FEMALE'>Female</SelectItem>
                  <SelectItem value='OTHER'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='height'>Height (cm)</Label>
              <Input
                id='height'
                type='number'
                value={formData.height}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    height: parseInt(e.target.value) || 0
                  })
                }
                placeholder='180'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='weight'>Weight (kg)</Label>
              <Input
                id='weight'
                type='number'
                value={formData.weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: parseInt(e.target.value) || 0
                  })
                }
                placeholder='75'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='bio'>Bio</Label>
            <Textarea
              id='bio'
              value={formData.bio || ''}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder='Athlete biography...'
              rows={3}
            />
          </div>

          {/* Team fields for team sports */}
          {isTeamSport && (
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='teamSearch'>School (Team)</Label>
                <Input
                  id='teamSearch'
                  value={teamQuery}
                  onChange={(e) => setTeamQuery(e.target.value)}
                  placeholder='Type school name to search'
                />
                {teamOptions.length > 0 && (
                  <div className='max-h-48 overflow-auto rounded-md border'>
                    {teamOptions.map((t) => (
                      <div
                        key={t.teamId}
                        className={`hover:bg-accent cursor-pointer px-3 py-2 ${formData.teamCode === t.code ? 'bg-accent' : ''}`}
                        onClick={() =>
                          setFormData({ ...formData, teamCode: t.code })
                        }
                      >
                        <div className='font-medium'>{t.name}</div>
                        <div className='text-muted-foreground text-xs'>
                          {t.code}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='positionCode'>Position</Label>
                <Select
                  value={formData.positionCode || ''}
                  onValueChange={(value) =>
                    setFormData({ ...formData, positionCode: value })
                  }
                  disabled={!positions.length}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        positions.length
                          ? 'Select position'
                          : 'Select a team first'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((p) => (
                      <SelectItem key={p.positionId} value={p.code}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Discipline selection for individual athletes */}
          {formData.sportType && !isTeamSport && (
            <div className='space-y-2'>
              <Label htmlFor='disciplines'>Disciplines</Label>
              <Select
                value={formData.disciplines?.[0]?.code || ''}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    disciplines: [{ code: value, currentRank: 1 }]
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select discipline' />
                </SelectTrigger>
                <SelectContent>
                  {formData.sportType === 'ATHLETICS' && (
                    <>
                      <SelectItem value='100M'>100 Meters</SelectItem>
                      <SelectItem value='200M'>200 Meters</SelectItem>
                      <SelectItem value='400M'>400 Meters</SelectItem>
                      <SelectItem value='800M'>800 Meters</SelectItem>
                      <SelectItem value='1500M'>1500 Meters</SelectItem>
                      <SelectItem value='110H'>110m Hurdles</SelectItem>
                      <SelectItem value='LJ'>Long Jump</SelectItem>
                      <SelectItem value='HJ'>High Jump</SelectItem>
                      <SelectItem value='SP'>Shot Put</SelectItem>
                      <SelectItem value='JAV'>Javelin</SelectItem>
                    </>
                  )}
                  {formData.sportType === 'WRESTLING' && (
                    <>
                      <SelectItem value='57KG_FS'>57kg Freestyle</SelectItem>
                      <SelectItem value='61KG_FS'>61kg Freestyle</SelectItem>
                      <SelectItem value='65KG_FS'>65kg Freestyle</SelectItem>
                      <SelectItem value='70KG_FS'>70kg Freestyle</SelectItem>
                      <SelectItem value='74KG_FS'>74kg Freestyle</SelectItem>
                    </>
                  )}
                  {formData.sportType === 'BOXING' && (
                    <>
                      <SelectItem value='FLY'>Flyweight</SelectItem>
                      <SelectItem value='BAN'>Bantamweight</SelectItem>
                      <SelectItem value='FEA'>Featherweight</SelectItem>
                      <SelectItem value='LIG'>Lightweight</SelectItem>
                      <SelectItem value='WEL'>Welterweight</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='flex items-center space-x-2'>
            <Switch
              id='isActive'
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor='isActive'>Active</Label>
          </div>
        </div>

        <DialogFooter>
          {athlete && (
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          )}
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : athlete ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
