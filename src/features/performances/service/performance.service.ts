import { AxiosError } from "axios";
import { PaginatedResponse } from "@/constants/data";
import apiClient from "@/lib/api-client";

export interface Performance {
    performanceId: number;
    athleteId: number;
    eventId: number;
    disciplineId?: number;
    date: string;
    position?: number;
    points?: number;
    time?: number;
    distance?: number;
    height?: number;
    minutesPlayed?: number;
    goalsScored?: number;
    goalsConceded?: number;
    yellowCards?: number;
    redCards?: number;
    assists?: number;
    saves?: number;
    twoPoints?: number;
    threePoints?: number;
    freeThrows?: number;
    fieldGoals?: number;
    rebounds?: number;
    steals?: number;
    blocks?: number;
    turnovers?: number;
    wins?: number;
    losses?: number;
    pins?: number;
    technicalFalls?: number;
    decisions?: number;
    rounds?: number;
    knockouts?: number;
    knockdowns?: number;
    punchesLanded?: number;
    punchesThrown?: number;
    notes?: string;
    isPersonalBest: boolean;
    isSeasonBest: boolean;
    createdAt: string;
    updatedAt: string;
    athlete?: any;
    event?: any;
    discipline?: any;
}

export interface PerformanceListParams {
    search?: string;
    page?: string;
    limit?: string;
    athleteId?: string;
    eventId?: string;
    disciplineId?: string;
    sportType?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface CreatePerformanceData {
    athleteId: number;
    eventId: number;
    disciplineId?: number;
    date: string;
    position?: number;
    points?: number;
    time?: number;
    distance?: number;
    height?: number;
    minutesPlayed?: number;
    goalsScored?: number;
    goalsConceded?: number;
    yellowCards?: number;
    redCards?: number;
    assists?: number;
    saves?: number;
    twoPoints?: number;
    threePoints?: number;
    freeThrows?: number;
    fieldGoals?: number;
    rebounds?: number;
    steals?: number;
    blocks?: number;
    turnovers?: number;
    wins?: number;
    losses?: number;
    pins?: number;
    technicalFalls?: number;
    decisions?: number;
    rounds?: number;
    knockouts?: number;
    knockdowns?: number;
    punchesLanded?: number;
    punchesThrown?: number;
    notes?: string;
}

export interface UpdatePerformanceData extends Partial<CreatePerformanceData> { }

class PerformanceService {
    // Get all performances with pagination and filtering
    async getAllPerformances(params?: PerformanceListParams): Promise<PaginatedResponse<Performance>> {
        try {
            const response = await apiClient.get('/performances', {
                params: {
                    ...(params?.search && { search: params.search }),
                    ...(params?.page && { page: params.page }),
                    ...(params?.limit && { limit: params.limit }),
                    ...(params?.athleteId && { athleteId: params.athleteId }),
                    ...(params?.eventId && { eventId: params.eventId }),
                    ...(params?.disciplineId && { disciplineId: params.disciplineId }),
                    ...(params?.sportType && { sportType: params.sportType }),
                    ...(params?.dateFrom && { dateFrom: params.dateFrom }),
                    ...(params?.dateTo && { dateTo: params.dateTo })
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching performances:', error);
            throw error;
        }
    }

    // Get performance by ID
    async getPerformanceById(id: number): Promise<Performance> {
        try {
            const response = await apiClient.get(`/performances/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.getPerformanceById:', axiosError);
            throw axiosError;
        }
    }

    // Create performance
    async createPerformance(data: CreatePerformanceData): Promise<Performance> {
        try {
            const response = await apiClient.post('/performances', data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.createPerformance:', axiosError);
            throw axiosError;
        }
    }

    // Update performance
    async updatePerformance(id: number, data: UpdatePerformanceData): Promise<Performance> {
        try {
            const response = await apiClient.put(`/performances/${id}`, data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.updatePerformance:', axiosError);
            throw axiosError;
        }
    }

    // Delete performance
    async deletePerformance(id: number): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiClient.delete(`/performances/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.deletePerformance:', axiosError);
            throw axiosError;
        }
    }

    // Get performances by athlete
    async getPerformancesByAthlete(athleteId: number, params?: any): Promise<Performance[]> {
        try {
            const response = await apiClient.get(`/performances/athlete/${athleteId}`, { params });
            //return response.data;
            return response.data?.data || [];
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.getPerformancesByAthlete:', axiosError);
            throw axiosError;
        }
    }

    // Get event results
    async getEventResults(eventId: number): Promise<Performance[]> {
        try {
            const response = await apiClient.get(`/performances/event/${eventId}/results`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.getEventResults:', axiosError);
            throw axiosError;
        }
    }

    // Get top performances
    async getTopPerformances(disciplineId: number, limit: number = 10, seasonId?: number): Promise<Performance[]> {
        try {
            const response = await apiClient.get(`/performances/discipline/${disciplineId}/top`, {
                params: { limit, seasonId }
            });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.getTopPerformances:', axiosError);
            throw axiosError;
        }
    }

    // Get personal bests
    async getPersonalBests(athleteId: number, disciplineId?: number): Promise<Performance[]> {
        try {
            const response = await apiClient.get(`/performances/athlete/${athleteId}/personal-bests`, {
                params: { disciplineId }
            });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.getPersonalBests:', axiosError);
            throw axiosError;
        }
    }

    // Get season bests
    async getSeasonBests(athleteId: number, seasonId: number): Promise<Performance[]> {
        try {
            const response = await apiClient.get(`/performances/athlete/${athleteId}/season/${seasonId}/bests`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.getSeasonBests:', axiosError);
            throw axiosError;
        }
    }

    // Get team stats
    async getTeamStats(teamCode: string, eventId: number): Promise<Performance[]> {
        try {
            const response = await apiClient.get(`/performances/team/${teamCode}/event/${eventId}/stats`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.getTeamStats:', axiosError);
            throw axiosError;
        }
    }

    // Get performances by sport
    async getPerformancesBySport(sportType: string, params?: any): Promise<Performance[]> {
        try {
            const response = await apiClient.get(`/performances/sport/${sportType}`, { params });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.getPerformancesBySport:', axiosError);
            throw axiosError;
        }
    }

    // Compare athletes
    async compareAthletes(athleteIds: number[], disciplineId?: number, seasonId?: number): Promise<any> {
        try {
            const response = await apiClient.post('/performances/compare', {
                athleteIds,
                disciplineId,
                seasonId
            });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.compareAthletes:', axiosError);
            throw axiosError;
        }
    }

    // Bulk create performances
    async bulkCreatePerformances(performances: CreatePerformanceData[]): Promise<Performance[]> {
        try {
            const response = await apiClient.post('/performances/bulk', performances);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.bulkCreatePerformances:', axiosError);
            throw axiosError;
        }
    }

    // Get events for performance dialog
    async getEvents(): Promise<any[]> {
        try {
            const response = await apiClient.get('/events');
            return response.data.data || [];
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.getEvents:', axiosError);
            throw axiosError;
        }
    }

    // Get athletes for performance dialog
    async getAthletes(): Promise<any[]> {
        try {
            const response = await apiClient.get('/athletes');
            return response.data.data || [];
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.getAthletes:', axiosError);
            throw axiosError;
        }
    }

    // Get disciplines for performance dialog
    async getDisciplines(): Promise<any[]> {
        try {
            const response = await apiClient.get('/disciplines');
            return response.data.data || [];
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in performanceService.getDisciplines:', axiosError);
            throw axiosError;
        }
    }
}

export const performanceService = new PerformanceService(); 