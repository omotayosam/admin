
import { AxiosError } from "axios";
import {
    Athlete,
    CreateIndividualAthleteData,
    CreateTeamAthleteData,
    UpdateAthleteData,
    AthleteListParams,
    PaginatedResponse
} from "@/constants/data";
import apiClient from "@/lib/api-client";

class AthleteService {
    // Get all athletes with pagination and filtering
    async getAllAthletes(params?: AthleteListParams): Promise<PaginatedResponse<Athlete>> {
        try {
            console.log('Calling endpoint:', '/athletes', 'with params:', params);
            const response = await apiClient.get('/athletes', {
                params: {
                    ...(params?.search && { search: params.search }),
                    ...(params?.page && { page: params.page }),
                    ...(params?.limit && { limit: params.limit }),
                    ...(params?.positionCode && { positionCode: params.positionCode }),
                    ...(params?.teamCode && { teamCode: params.teamCode }),
                    ...(params?.sportType && { sportType: params.sportType }),
                    ...(params?.gender && { gender: params.gender }),
                    ...(params?.isActive !== undefined && { isActive: params.isActive }),
                    ...(params?.disciplineCode && { disciplineCode: params.disciplineCode })
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching athletes:', error);
            throw error;
        }
    }

    // Get athlete by ID
    async getAthleteById(id: number): Promise<Athlete> {
        try {
            const response = await apiClient.get(`/athletes/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.getAthleteById:', axiosError);
            if (axiosError.response) {
                console.error('Response data:', axiosError.response.data);
                console.error('Response status:', axiosError.response.status);
            } else if (axiosError.request) {
                console.error('No response received:', axiosError.request);
            } else {
                console.error('Error message:', axiosError.message);
            }
            throw axiosError;
        }
    }

    // Get athlete by code
    async getAthleteByCode(code: string): Promise<Athlete> {
        try {
            const response = await apiClient.get(`/athletes/code/${code}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.getAthleteByCode:', axiosError);
            if (axiosError.response) {
                console.error('Response data:', axiosError.response.data);
                console.error('Response status:', axiosError.response.status);
            } else if (axiosError.request) {
                console.error('No response received:', axiosError.request);
            } else {
                console.error('Error message:', axiosError.message);
            }
            throw axiosError;
        }
    }

    // Create individual athlete
    async createIndividualAthlete(data: CreateIndividualAthleteData): Promise<Athlete> {
        try {
            const response = await apiClient.post('/athletes/individual', data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.createIndividualAthlete:', axiosError);
            if (axiosError.response) {
                console.error('Response data:', axiosError.response.data);
                console.error('Response status:', axiosError.response.status);
            } else if (axiosError.request) {
                console.error('No response received:', axiosError.request);
            } else {
                console.error('Error message:', axiosError.message);
            }
            throw axiosError;
        }
    }

    // Create team athlete
    async createTeamAthlete(data: CreateTeamAthleteData): Promise<Athlete> {
        try {
            const response = await apiClient.post('/athletes/team', data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.createTeamAthlete:', axiosError);
            if (axiosError.response) {
                console.error('Response data:', axiosError.response.data);
                console.error('Response status:', axiosError.response.status);
            } else if (axiosError.request) {
                console.error('No response received:', axiosError.request);
            } else {
                console.error('Error message:', axiosError.message);
            }
            throw axiosError;
        }
    }

    // Update athlete
    async updateAthlete(id: number, data: UpdateAthleteData): Promise<Athlete> {
        try {
            const response = await apiClient.put(`/athletes/${id}`, data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.updateAthlete:', axiosError);
            if (axiosError.response) {
                console.error('Response data:', axiosError.response.data);
                console.error('Response status:', axiosError.response.status);
            } else if (axiosError.request) {
                console.error('No response received:', axiosError.request);
            } else {
                console.error('Error message:', axiosError.message);
            }
            throw axiosError;
        }
    }

    // Delete athlete
    async deleteAthlete(id: number): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiClient.delete(`/athletes/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.deleteAthlete:', axiosError);
            if (axiosError.response) {
                console.error('Response data:', axiosError.response.data);
                console.error('Response status:', axiosError.response.status);
            } else if (axiosError.request) {
                console.error('No response received:', axiosError.request);
            } else {
                console.error('Error message:', axiosError.message);
            }
            throw axiosError;
        }
    }

    // Get athletes by team
    async getAthletesByTeam(teamCode: string): Promise<{ success: boolean; data: Athlete[] }> {
        try {
            const response = await apiClient.get(`/athletes/team/${teamCode}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.getAthletesByTeam:', axiosError);
            throw axiosError;
        }
    }

    // Get athletes by position
    async getAthletesByPosition(positionCode: string): Promise<{ success: boolean; data: Athlete[] }> {
        try {
            const response = await apiClient.get(`/athletes/position/${positionCode}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.getAthletesByPosition:', axiosError);
            throw axiosError;
        }
    }

    // Get athletes by sport
    async getAthletesBySport(sportType: string): Promise<{ success: boolean; data: Athlete[] }> {
        try {
            const response = await apiClient.get(`/athletes/sport/${sportType}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.getAthletesBySport:', axiosError);
            throw axiosError;
        }
    }

    // Get athletes by discipline
    async getAthletesByDiscipline(disciplineCode: string): Promise<{ success: boolean; data: Athlete[] }> {
        try {
            const response = await apiClient.get(`/athletes/discipline/${disciplineCode}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.getAthletesByDiscipline:', axiosError);
            throw axiosError;
        }
    }

    // Update discipline rank
    async updateDisciplineRank(athleteId: number, disciplineCode: string, newRank: number): Promise<{ success: boolean; data: any }> {
        try {
            const response = await apiClient.put(`/athletes/${athleteId}/discipline-rank`, {
                disciplineCode,
                newRank
            });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.updateDisciplineRank:', axiosError);
            throw axiosError;
        }
    }

    // Get athlete stats
    async getAthleteStats(athleteId: number, seasonId?: number): Promise<{ success: boolean; data: any[] }> {
        try {
            const params = seasonId ? { seasonId: seasonId.toString() } : {};
            const response = await apiClient.get(`/athletes/${athleteId}/stats`, { params });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.getAthleteStats:', axiosError);
            throw axiosError;
        }
    }

    // Get athlete season summary
    async getAthleteSeasonSummary(athleteId: number, seasonId: number): Promise<{ success: boolean; data: any }> {
        try {
            const response = await apiClient.get(`/athletes/${athleteId}/season/${seasonId}/summary`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.getAthleteSeasonSummary:', axiosError);
            throw axiosError;
        }
    }

    // Add discipline to athlete
    async addDisciplineToAthlete(athleteId: number, disciplineCode: string, currentRank?: number): Promise<{ success: boolean; data: any }> {
        try {
            const response = await apiClient.post(`/athletes/${athleteId}/disciplines`, {
                disciplineCode,
                currentRank
            });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.addDisciplineToAthlete:', axiosError);
            throw axiosError;
        }
    }

    // Remove discipline from athlete
    async removeDisciplineFromAthlete(athleteId: number, disciplineCode: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiClient.delete(`/athletes/${athleteId}/disciplines/${disciplineCode}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.removeDisciplineFromAthlete:', axiosError);
            throw axiosError;
        }
    }

    // Search athletes (alias for getAllAthletes with search parameter)
    async searchAthletes(query: string): Promise<Athlete[]> {
        try {
            const response = await this.getAllAthletes({ search: query });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in athleteService.searchAthletes:', axiosError);
            throw axiosError;
        }
    }

    // Legacy method for backward compatibility
    async createAthlete(data: any): Promise<Athlete> {
        console.warn('createAthlete is deprecated. Use createIndividualAthlete or createTeamAthlete instead.');
        // Try to determine if it's a team or individual athlete based on data
        if (data.teamCode && data.positionCode) {
            return this.createTeamAthlete(data as CreateTeamAthleteData);
        } else if (data.disciplines) {
            return this.createIndividualAthlete(data as CreateIndividualAthleteData);
        } else {
            throw new Error('Unable to determine athlete type. Please use createIndividualAthlete or createTeamAthlete explicitly.');
        }
    }
}

export const athleteService = new AthleteService();