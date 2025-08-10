import { NavItem } from '@/types';

// Updated Athlete type to match backend API structure
export type Athlete = {
  athleteId: number;
  code: string; // Changed from number to string to match backend
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  height: number;
  weight: number;
  bio?: string;
  isActive: boolean;
  teamCode?: string;
  positionId?: number;
  createdAt: string; // Changed from created_at to match backend
  updatedAt: string; // Changed from updated_at to match backend
  avatarUrl?: string; // Added for frontend display
  // Relations
  team?: Team | null;
  position?: Position | null;
  disciplines?: AthleteDiscipline[];
};

export type Team = {
  teamId: number;
  code: string;
  name: string;
  sportId: number;
  createdAt: string;
  updatedAt: string;
  sport?: Sport;
  athletes?: Athlete[];
};

export type Position = {
  positionId: number;
  code: string;
  name: string;
  sportId: number;
  sport?: Sport;
};

export type Sport = {
  sportId: number;
  name: 'BASKETBALL' | 'FOOTBALL' | 'ATHLETICS' | 'WRESTLING' | 'BOXING';
  isTeamSport: boolean;
  disciplines?: Discipline[];
};

export type Discipline = {
  disciplineId: number;
  code: string;
  name: string;
  sportId: number;
  sport?: Sport;
};

export type AthleteDiscipline = {
  id: number;
  athleteId: number;
  disciplineId: number;
  currentRank?: number;
  discipline?: Discipline;
};

// Type definitions for API operations
export type CreateIndividualAthleteData = {
  code: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  height: number;
  weight: number;
  bio?: string;
  disciplines: { code: string; currentRank?: number }[];
  sportType: 'BASKETBALL' | 'FOOTBALL' | 'ATHLETICS' | 'WRESTLING' | 'BOXING';
};

export type CreateTeamAthleteData = {
  code: string;
  firstName: string;
  lastName: string;
  teamCode: string;
  positionCode: string;
  sportType: 'BASKETBALL' | 'FOOTBALL' | 'ATHLETICS' | 'WRESTLING' | 'BOXING';
  dateOfBirth: string;
  nationality: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  height: number;
  weight: number;
  bio?: string;
};

export type UpdateAthleteData = Partial<Omit<Athlete, 'athleteId' | 'createdAt' | 'updatedAt'>>;

export type AthleteListParams = {
  search?: string;
  page?: string;
  limit?: string;
  positionCode?: string;
  teamCode?: string;
  sportType?: 'BASKETBALL' | 'FOOTBALL' | 'ATHLETICS' | 'WRESTLING' | 'BOXING';
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  isActive?: boolean;
  disciplineCode?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Athlete',
    url: '/dashboard/athlete',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Team',
    url: '/dashboard/teams',
    icon: 'product',
    shortcut: ['t', 't'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Performances',
    url: '/dashboard/performances',
    icon: 'product',
    shortcut: ['s', 's'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Events',
    url: '/dashboard/events',
    icon: 'product',
    shortcut: ['s', 's'],
    isActive: false,
    items: [] // No child items
  },

];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
