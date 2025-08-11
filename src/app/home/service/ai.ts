// services/api.ts

import apiClient from '@/lib/api-client';
import { AxiosResponse } from 'axios';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

export interface ChatRequest {
    input: string;
    messages?: ChatMessage[];
}

export interface ChatResponse {
    text: string;
    error?: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

class ApiService {
    private async handleRequest<T>(
        requestPromise: Promise<AxiosResponse<T>>
    ): Promise<ApiResponse<T>> {
        try {
            const response = await requestPromise;
            return {
                data: response.data,
                error: undefined,
                status: response.status,
            };
        } catch (error: any) {
            console.error('API request failed:', error);

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                return {
                    data: undefined,
                    error: error.response.data?.error || error.response.data?.message || `HTTP error! status: ${error.response.status}`,
                    status: error.response.status,
                };
            } else if (error.request) {
                // The request was made but no response was received
                return {
                    data: undefined,
                    error: 'No response received from server',
                    status: 0,
                };
            } else {
                // Something happened in setting up the request that triggered an Error
                return {
                    data: undefined,
                    error: error.message || 'Unknown error occurred',
                    status: 0,
                };
            }
        }
    }

    // Chat with Gemini AI
    async sendChatMessage(
        input: string,
        messages: ChatMessage[] = []
    ): Promise<ApiResponse<ChatResponse>> {
        const payload: ChatRequest = {
            input,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
        };

        return this.handleRequest(
            apiClient.post<ChatResponse>('/ai/chat', payload)
        );
    }

    // Health check
    async healthCheck(): Promise<ApiResponse<{ hello: string }>> {
        return this.handleRequest(
            apiClient.get<{ hello: string }>('/main/healthcheck')
        );
    }

    // Athletes endpoints
    async getAthletes(params?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<ApiResponse<any[]>> {
        return this.handleRequest(
            apiClient.get<any[]>('/athletes', { params })
        );
    }

    async getAthlete(id: string): Promise<ApiResponse<any>> {
        return this.handleRequest(
            apiClient.get<any>(`/athletes/${id}`)
        );
    }

    async createAthlete(athlete: any): Promise<ApiResponse<any>> {
        return this.handleRequest(
            apiClient.post<any>('/athletes', athlete)
        );
    }

    async updateAthlete(id: string, athlete: any): Promise<ApiResponse<any>> {
        return this.handleRequest(
            apiClient.put<any>(`/athletes/${id}`, athlete)
        );
    }

    async deleteAthlete(id: string): Promise<ApiResponse<void>> {
        return this.handleRequest(
            apiClient.delete<void>(`/athletes/${id}`)
        );
    }

    // Performances endpoints
    async getPerformances(params?: {
        page?: number;
        limit?: number;
        athleteId?: string;
        event?: string;
    }): Promise<ApiResponse<any[]>> {
        return this.handleRequest(
            apiClient.get<any[]>('/performances', { params })
        );
    }

    async getPerformance(id: string): Promise<ApiResponse<any>> {
        return this.handleRequest(
            apiClient.get<any>(`/performances/${id}`)
        );
    }

    async createPerformance(performance: any): Promise<ApiResponse<any>> {
        return this.handleRequest(
            apiClient.post<any>('/performances', performance)
        );
    }

    async updatePerformance(id: string, performance: any): Promise<ApiResponse<any>> {
        return this.handleRequest(
            apiClient.put<any>(`/performances/${id}`, performance)
        );
    }

    async deletePerformance(id: string): Promise<ApiResponse<void>> {
        return this.handleRequest(
            apiClient.delete<void>(`/performances/${id}`)
        );
    }

    // Statistics endpoints
    async getStatistics(params?: {
        type?: string;
        athleteId?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<ApiResponse<any>> {
        return this.handleRequest(
            apiClient.get<any>('/stats', { params })
        );
    }

    async getAthleteStats(athleteId: string): Promise<ApiResponse<any>> {
        return this.handleRequest(
            apiClient.get<any>(`/stats/athlete/${athleteId}`)
        );
    }

    // Generic CRUD operations for extensibility
    async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
        return this.handleRequest(
            apiClient.get<T>(endpoint, { params })
        );
    }

    async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        return this.handleRequest(
            apiClient.post<T>(endpoint, data)
        );
    }

    async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        return this.handleRequest(
            apiClient.put<T>(endpoint, data)
        );
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.handleRequest(
            apiClient.delete<T>(endpoint)
        );
    }
}

// Export singleton instance
export const apiService = new ApiService();
export default ApiService;