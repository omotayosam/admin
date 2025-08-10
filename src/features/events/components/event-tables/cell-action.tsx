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
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import type { EventItem } from '../../service/event.service';
import { eventService } from '../../service/event.service';
import { EventDialog, type EventFormData } from '../event-dialog';

interface Props {
  data: EventItem;
}

export function CellAction({ data }: Props) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await eventService.delete(data.eventId);
      toast.success('Event deleted');
      setOpen(false);
      router.refresh();
    } catch (e) {
      console.error('Delete event failed', e);
      toast.error('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const editPayload: EventFormData = {
    eventId: data.eventId,
    name: data.name,
    code: data.code,
    sportType: (data as any).sport?.name || 'ATHLETICS',
    seasonId: data.seasonId,
    gamedayId: data.gamedayId,
    venueId: data.venueId || undefined,
    gender: (data as any).gender || undefined,
    startDate: data.startDate?.slice(0, 10),
    endDate: data.endDate?.slice(0, 10) || undefined,
    location: data.location || undefined,
    description: data.description || undefined,
    status: data.status
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <EventDialog
        eventData={editPayload}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={() => router.refresh()}
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
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <IconEdit className='mr-2 h-4 w-4' /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
