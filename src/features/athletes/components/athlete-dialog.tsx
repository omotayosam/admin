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
    code: '',
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

  useEffect(() => {
    console.log('AthleteDialog received athlete:', athlete);
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
        code: '',
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

  const handleSave = async () => {
    try {
      setLoading(true);

      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.code) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Create athlete data object
      const athleteData = {
        code: formData.code,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality || 'Nigeria',
        gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
        height: formData.height || 0,
        weight: formData.weight || 0,
        bio: formData.bio || '',
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        sportType: formData.sportType as
          | 'BASKETBALL'
          | 'FOOTBALL'
          | 'ATHLETICS'
          | 'WRESTLING'
          | 'BOXING'
      };

      let response;

      if (athlete?.athleteId) {
        // Update existing athlete
        response = await athleteService.updateAthlete(
          athlete.athleteId,
          athleteData
        );
        toast.success(
          `Athlete "${formData.firstName} ${formData.lastName}" updated successfully`
        );
      } else {
        // Create new athlete - determine if individual or team
        if (
          formData.sportType === 'FOOTBALL' ||
          formData.sportType === 'BASKETBALL'
        ) {
          // Team athlete
          if (formData.teamCode && formData.positionCode) {
            response = await athleteService.createTeamAthlete({
              ...athleteData,
              teamCode: formData.teamCode,
              positionCode: formData.positionCode
            });
          } else {
            toast.error(
              'Team code and position code are required for team athletes'
            );
            return;
          }
        } else {
          // Individual athlete
          if (formData.disciplines && formData.disciplines.length > 0) {
            response = await athleteService.createIndividualAthlete({
              ...athleteData,
              disciplines: formData.disciplines
            });
          } else {
            // Default to individual athlete with a basic discipline
            response = await athleteService.createIndividualAthlete({
              ...athleteData,
              disciplines: [{ code: '100M', currentRank: 1 }]
            });
          }
        }
        toast.success(
          `Athlete "${formData.firstName} ${formData.lastName}" created successfully`
        );
      }

      onSave(formData);
      onClose();
      router.refresh(); // Refresh the page to show updated data
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
      router.refresh(); // Refresh the page to show updated data
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
              <Input
                id='code'
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder='ATH001'
              />
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
                ) => setFormData({ ...formData, sportType: value })}
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
          {(formData.sportType === 'FOOTBALL' ||
            formData.sportType === 'BASKETBALL') && (
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='teamCode'>Team Code</Label>
                <Input
                  id='teamCode'
                  value={formData.teamCode || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, teamCode: e.target.value })
                  }
                  placeholder='TEAM001'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='positionCode'>Position Code</Label>
                <Input
                  id='positionCode'
                  value={formData.positionCode || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, positionCode: e.target.value })
                  }
                  placeholder='POS001'
                />
              </div>
            </div>
          )}

          {/* Discipline selection for individual athletes */}
          {formData.sportType &&
            formData.sportType !== 'FOOTBALL' &&
            formData.sportType !== 'BASKETBALL' && (
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
