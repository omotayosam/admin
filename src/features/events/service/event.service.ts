import { AxiosError } from 'axios';
import apiClient from '@/lib/api-client';
import type { PaginatedResponse } from '@/constants/data';

export interface EventItem {
    eventId: number;
    name: string;
    code: string;
    sportId: number;
    year: number;
    seasonId: number;
    gamedayId: number;
    venueId?: number | null;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
    startDate: string;
    endDate?: string | null;
    location?: string | null;
    description?: string | null;
    isActive: boolean;
    status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELED';
    createdAt: string;
    updatedAt: string;
    sport?: any;
    season?: any;
    gameday?: any;
    venue?: any;
}

export interface EventListParams {
    search?: string;
    page?: string;
    limit?: string;
    seasonId?: string;
    gamedayId?: string;
    sportType?: string;
    status?: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELED';
}

export interface CreateEventData {
    name: string;
    code: string;
    sportType: string;
    year: number;
    seasonId: number;
    gamedayId: number;
    venueId?: number;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    startDate: string;
    endDate?: string;
    location?: string;
    description?: string;
    status?: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELED';
}

export type UpdateEventData = Partial<CreateEventData>;

class EventService {
    async getAll(params?: EventListParams): Promise<PaginatedResponse<EventItem>> {
        try {
            const res = await apiClient.get('/events', { params });
            return res.data;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error as AxiosError;
        }
    }

    async getById(id: number): Promise<EventItem> {
        try {
            const res = await apiClient.get(`/events/${id}`);
            return res.data;
        } catch (error) {
            console.error('Error fetching event by id:', error);
            throw error as AxiosError;
        }
    }

    async create(data: CreateEventData): Promise<EventItem> {
        try {
            const res = await apiClient.post('/events', data);
            return res.data;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error as AxiosError;
        }
    }

    async update(id: number, data: UpdateEventData): Promise<EventItem> {
        try {
            const res = await apiClient.put(`/events/${id}`, data);
            return res.data;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error as AxiosError;
        }
    }

    async delete(id: number): Promise<{ success: boolean; message: string }> {
        try {
            const res = await apiClient.delete(`/events/${id}`);
            return res.data;
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error as AxiosError;
        }
    }

    async updateStatus(id: number, status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELED') {
        try {
            const res = await apiClient.patch(`/events/${id}/status`, { status });
            return res.data;
        } catch (error) {
            console.error('Error updating event status:', error);
            throw error as AxiosError;
        }
    }

    async getBySport(sportType: string) {
        try {
            const res = await apiClient.get(`/events/sport/${sportType}`);
            return res.data;
        } catch (error) {
            console.error('Error fetching events by sport:', error);
            throw error as AxiosError;
        }
    }

    async getBySeason(seasonId: number) {
        try {
            const res = await apiClient.get(`/events/season/${seasonId}`);
            return res.data;
        } catch (error) {
            console.error('Error fetching events by season:', error);
            throw error as AxiosError;
        }
    }

    async getByGameday(gamedayId: number) {
        try {
            const res = await apiClient.get(`/events/gameday/${gamedayId}`);
            return res.data;
        } catch (error) {
            console.error('Error fetching events by gameday:', error);
            throw error as AxiosError;
        }
    }

    async getUpcoming() {
        try {
            const res = await apiClient.get('/events/upcoming');
            return res.data;
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
            throw error as AxiosError;
        }
    }

    async getActive() {
        try {
            const res = await apiClient.get('/events/active');
            return res.data;
        } catch (error) {
            console.error('Error fetching active events:', error);
            throw error as AxiosError;
        }
    }
}

export const eventService = new EventService();
