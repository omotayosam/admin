import { AxiosError } from "axios";
import { Team, PaginatedResponse } from "@/constants/data";
import apiClient from "@/lib/api-client";

export interface TeamListParams {
    search?: string;
    page?: string;
    limit?: string;
    sportId?: string;
}

export interface CreateTeamData {
    code: string;
    name: string;
    sportId: number;
}

export interface UpdateTeamData {
    code?: string;
    name?: string;
    sportId?: number;
}

export interface AddTeamMemberData {
    teamId: number;
    athleteId: number;
}

class TeamService {
    // Get all teams with pagination and filtering
    async getAllTeams(params?: TeamListParams): Promise<PaginatedResponse<Team>> {
        try {
            const response = await apiClient.get('/teams', {
                params: {
                    ...(params?.search && { search: params.search }),
                    ...(params?.page && { page: params.page }),
                    ...(params?.limit && { limit: params.limit }),
                    ...(params?.sportId && { sportId: params.sportId })
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw error;
        }
    }

    // Get team by ID
    async getTeamById(id: number): Promise<Team> {
        try {
            const response = await apiClient.get(`/teams/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in teamService.getTeamById:', axiosError);
            throw axiosError;
        }
    }

    // Create team
    async createTeam(data: CreateTeamData): Promise<Team> {
        try {
            const response = await apiClient.post('/teams', data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in teamService.createTeam:', axiosError);
            throw axiosError;
        }
    }

    // Update team
    async updateTeam(id: number, data: UpdateTeamData): Promise<Team> {
        try {
            const response = await apiClient.put(`/teams/${id}`, data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in teamService.updateTeam:', axiosError);
            throw axiosError;
        }
    }

    // Delete team
    async deleteTeam(id: number): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiClient.delete(`/teams/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in teamService.deleteTeam:', axiosError);
            throw axiosError;
        }
    }

    // Get teams by sport
    async getTeamsBySport(sportId: number): Promise<{ success: boolean; data: Team[] }> {
        try {
            const response = await apiClient.get(`/teams/sport/${sportId}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in teamService.getTeamsBySport:', axiosError);
            throw axiosError;
        }
    }

    // Add team member
    async addTeamMember(data: AddTeamMemberData): Promise<any> {
        try {
            const response = await apiClient.post('/teams/members', data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in teamService.addTeamMember:', axiosError);
            throw axiosError;
        }
    }

    // Remove team member
    async removeTeamMember(memberId: number): Promise<any> {
        try {
            const response = await apiClient.delete(`/teams/members/${memberId}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in teamService.removeTeamMember:', axiosError);
            throw axiosError;
        }
    }
}

export const teamService = new TeamService(); 