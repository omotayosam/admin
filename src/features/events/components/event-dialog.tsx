'use client';

import { useEffect, useState } from 'react';
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
import { eventService } from '../../events/service/event.service';

export type EventFormData = {
  eventId?: number;
  name: string;
  code: string;
  sportType: 'BASKETBALL' | 'FOOTBALL' | 'ATHLETICS' | 'WRESTLING' | 'BOXING';
  year?: number;
  seasonId: number;
  gamedayId: number;
  venueId?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
  status?: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELED';
};

function generateEventCode(prefix: string = 'EVT') {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${random}`;
}

interface Props {
  eventData: EventFormData | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function EventDialog({ eventData, isOpen, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<EventFormData>({
    name: '',
    code: generateEventCode(),
    sportType: 'ATHLETICS',
    year: new Date().getFullYear(),
    seasonId: 1,
    gamedayId: 1,
    startDate: new Date().toISOString().slice(0, 10),
    status: 'SCHEDULED'
  } as EventFormData);

  useEffect(() => {
    if (eventData) setForm(eventData);
  }, [eventData]);

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!form.name || !form.code || !form.startDate) return;
      const payloadYear = new Date(form.startDate).getFullYear();
      const startDateIso = new Date(
        `${form.startDate}T00:00:00.000Z`
      ).toISOString();
      const endDateIso = form.endDate
        ? new Date(`${form.endDate}T00:00:00.000Z`).toISOString()
        : undefined;
      if (form.eventId) {
        await eventService.update(form.eventId, {
          ...form,
          year: payloadYear,
          startDate: startDateIso,
          endDate: endDateIso
        });
      } else {
        await eventService.create({
          ...(form as any),
          year: payloadYear,
          startDate: startDateIso,
          endDate: endDateIso
        });
      }
      onSaved();
      onClose();
    } catch (e) {
      console.error('Save event failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{eventData ? 'Edit Event' : 'Create Event'}</DialogTitle>
          <DialogDescription>
            {eventData ? 'Update event details' : 'Add a new event'}
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name *</Label>
              <Input
                id='name'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder='City Knockout'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='code'>Code *</Label>
              <div className='flex gap-2'>
                <Input
                  id='code'
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder='EVT00001'
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() =>
                    setForm({ ...form, code: generateEventCode() })
                  }
                >
                  Randomize
                </Button>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label>Sport *</Label>
              <Select
                value={form.sportType}
                onValueChange={(v: EventFormData['sportType']) =>
                  setForm({ ...form, sportType: v })
                }
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
            <div className='space-y-2'>
              <Label htmlFor='startDate'>Start Date *</Label>
              <Input
                id='startDate'
                type='date'
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='endDate'>End Date</Label>
              <Input
                id='endDate'
                type='date'
                value={form.endDate || ''}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                value={form.location || ''}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder='City Arena'
              />
            </div>
            <div className='space-y-2'>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v: NonNullable<EventFormData['status']>) =>
                  setForm({ ...form, status: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='SCHEDULED'>Scheduled</SelectItem>
                  <SelectItem value='LIVE'>Live</SelectItem>
                  <SelectItem value='FINISHED'>Finished</SelectItem>
                  <SelectItem value='CANCELED'>Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={form.description || ''}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder='Event details...'
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : eventData ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
