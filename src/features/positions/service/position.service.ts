import { AxiosError } from 'axios';
import apiClient from '@/lib/api-client';

export interface Position {
    positionId: number;
    code: string;
    name: string;
    sportId: number;
}

class PositionService {
    async getPositionsBySport(sportId: number): Promise<Position[]> {
        try {
            const res = await apiClient.get(`/positions/sport/${sportId}`);
            return res.data?.data || [];
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in positionService.getPositionsBySport:', axiosError);
            throw axiosError;
        }
    }

    async getAllPositions(): Promise<Position[]> {
        try {
            const res = await apiClient.get('/positions');
            return res.data?.data || [];
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in positionService.getAllPositions:', axiosError);
            throw axiosError;
        }
    }
}

export const positionService = new PositionService();
