# Athlete Service Documentation

This service provides a complete interface to the athlete API endpoints, matching the backend API structure exactly.

## Overview

The `AthleteService` class provides methods to interact with all athlete-related API endpoints. It includes proper TypeScript types, error handling, and comprehensive logging.

## Available Methods

### Core CRUD Operations

#### `getAllAthletes(params?: AthleteListParams)`

Get all athletes with pagination and filtering.

**Parameters:**

- `params` (optional): Filtering and pagination parameters
  - `search`: Search by name or code
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10, max: 100)
  - `positionCode`: Filter by position code
  - `teamCode`: Filter by team code
  - `sportType`: Filter by sport type
  - `gender`: Filter by gender
  - `isActive`: Filter by active status
  - `disciplineCode`: Filter by discipline code

**Returns:** `Promise<PaginatedResponse<Athlete>>`

**Example:**

```typescript
const athletes = await athleteService.getAllAthletes({
  search: 'john',
  page: '1',
  limit: '20',
  sportType: 'FOOTBALL'
});
```

#### `getAthleteById(id: number)`

Get a specific athlete by ID.

**Parameters:**

- `id`: Athlete ID

**Returns:** `Promise<Athlete>`

#### `getAthleteByCode(code: string)`

Get a specific athlete by code.

**Parameters:**

- `code`: Athlete code

**Returns:** `Promise<Athlete>`

### Creation Methods

#### `createIndividualAthlete(data: CreateIndividualAthleteData)`

Create a new individual athlete (for sports like Athletics, Swimming, etc.).

**Parameters:**

- `data`: Athlete data including disciplines

**Returns:** `Promise<Athlete>`

**Example:**

```typescript
const athlete = await athleteService.createIndividualAthlete({
  code: 'ATH001',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '2000-01-01',
  nationality: 'Nigeria',
  gender: 'MALE',
  height: 180,
  weight: 75,
  bio: 'Professional athlete',
  sportType: 'ATHLETICS',
  disciplines: [
    { code: '100M', currentRank: 1 },
    { code: '200M', currentRank: 2 }
  ]
});
```

#### `createTeamAthlete(data: CreateTeamAthleteData)`

Create a new team athlete (for sports like Football, Basketball, etc.).

**Parameters:**

- `data`: Athlete data including team and position

**Returns:** `Promise<Athlete>`

**Example:**

```typescript
const athlete = await athleteService.createTeamAthlete({
  code: 'FB001',
  firstName: 'Jane',
  lastName: 'Smith',
  teamCode: 'TEAM_A',
  positionCode: 'STRIKER',
  sportType: 'FOOTBALL',
  dateOfBirth: '1999-05-15',
  nationality: 'Nigeria',
  gender: 'FEMALE',
  height: 165,
  weight: 60,
  bio: 'Forward player'
});
```

### Update and Delete

#### `updateAthlete(id: number, data: UpdateAthleteData)`

Update an existing athlete.

**Parameters:**

- `id`: Athlete ID
- `data`: Partial athlete data to update

**Returns:** `Promise<Athlete>`

#### `deleteAthlete(id: number)`

Delete an athlete (soft delete if has performances, hard delete otherwise).

**Parameters:**

- `id`: Athlete ID

**Returns:** `Promise<{ success: boolean; message: string }>`

### Filtering Methods

#### `getAthletesByTeam(teamCode: string)`

Get all athletes belonging to a specific team.

**Parameters:**

- `teamCode`: Team code

**Returns:** `Promise<{ success: boolean; data: Athlete[] }>`

#### `getAthletesByPosition(positionCode: string)`

Get all athletes playing a specific position.

**Parameters:**

- `positionCode`: Position code

**Returns:** `Promise<{ success: boolean; data: Athlete[] }>`

#### `getAthletesBySport(sportType: string)`

Get all athletes participating in a specific sport.

**Parameters:**

- `sportType`: Sport type

**Returns:** `Promise<{ success: boolean; data: Athlete[] }>`

#### `getAthletesByDiscipline(disciplineCode: string)`

Get all athletes participating in a specific discipline.

**Parameters:**

- `disciplineCode`: Discipline code

**Returns:** `Promise<{ success: boolean; data: Athlete[] }>`

### Discipline Management

#### `updateDisciplineRank(athleteId: number, disciplineCode: string, newRank: number)`

Update an athlete's rank in a specific discipline.

**Parameters:**

- `athleteId`: Athlete ID
- `disciplineCode`: Discipline code
- `newRank`: New rank value

**Returns:** `Promise<{ success: boolean; data: any }>`

#### `addDisciplineToAthlete(athleteId: number, disciplineCode: string, currentRank?: number)`

Add a discipline to an athlete.

**Parameters:**

- `athleteId`: Athlete ID
- `disciplineCode`: Discipline code
- `currentRank` (optional): Current rank

**Returns:** `Promise<{ success: boolean; data: any }>`

#### `removeDisciplineFromAthlete(athleteId: number, disciplineCode: string)`

Remove a discipline from an athlete.

**Parameters:**

- `athleteId`: Athlete ID
- `disciplineCode`: Discipline code

**Returns:** `Promise<{ success: boolean; message: string }>`

### Statistics and Performance

#### `getAthleteStats(athleteId: number, seasonId?: number)`

Get performance statistics for an athlete.

**Parameters:**

- `athleteId`: Athlete ID
- `seasonId` (optional): Season ID

**Returns:** `Promise<{ success: boolean; data: any[] }>`

#### `getAthleteSeasonSummary(athleteId: number, seasonId: number)`

Get a comprehensive season summary for an athlete.

**Parameters:**

- `athleteId`: Athlete ID
- `seasonId`: Season ID

**Returns:** `Promise<{ success: boolean; data: any }>`

### Utility Methods

#### `searchAthletes(query: string)`

Search athletes by name or code (alias for getAllAthletes with search).

**Parameters:**

- `query`: Search query

**Returns:** `Promise<Athlete[]>`

#### `createAthlete(data: any)` (Legacy)

Legacy method for backward compatibility. Automatically determines if it's a team or individual athlete.

**Warning:** This method is deprecated. Use `createIndividualAthlete` or `createTeamAthlete` instead.

## Type Definitions

### Athlete

```typescript
type Athlete = {
  athleteId: number;
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
  teamCode?: string;
  positionId?: number;
  sportType: SportType;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  team?: Team | null;
  position?: Position | null;
  disciplines?: AthleteDiscipline[];
};
```

### SportType

```typescript
type SportType =
  | 'FOOTBALL'
  | 'BASKETBALL'
  | 'VOLLEYBALL'
  | 'ATHLETICS'
  | 'SWIMMING'
  | 'TENNIS'
  | 'BADMINTON'
  | 'TABLE_TENNIS'
  | 'CHESS'
  | 'SCRABBLE';
```

### PaginatedResponse

```typescript
type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
```

## Error Handling

All methods include comprehensive error handling with:

- Axios error logging
- Response status and data logging
- Proper error propagation
- TypeScript error types

## Usage Examples

### Basic Usage

```typescript
import { athleteService } from '@/features/athletes/service/athlete.service';

// Get all athletes
const athletes = await athleteService.getAllAthletes();

// Get athlete by ID
const athlete = await athleteService.getAthleteById(1);

// Create individual athlete
const newAthlete = await athleteService.createIndividualAthlete({
  code: 'ATH001',
  firstName: 'John',
  lastName: 'Doe'
  // ... other required fields
});
```

### Advanced Filtering

```typescript
// Get football players from a specific team
const footballPlayers = await athleteService.getAllAthletes({
  sportType: 'FOOTBALL',
  teamCode: 'TEAM_A',
  isActive: true
});

// Search for athletes by name
const searchResults = await athleteService.searchAthletes('john');
```

### Discipline Management

```typescript
// Add a discipline to an athlete
await athleteService.addDisciplineToAthlete(1, '100M', 1);

// Update discipline rank
await athleteService.updateDisciplineRank(1, '100M', 2);

// Remove discipline
await athleteService.removeDisciplineFromAthlete(1, '100M');
```

## Migration Notes

If you're migrating from the old service:

1. **Type Changes:**

   - `code` is now `string` instead of `number`
   - `created_at` → `createdAt`
   - `updated_at` → `updatedAt`
   - `disciplineId` → `disciplines` array

2. **Method Changes:**

   - `createAthlete()` is deprecated, use `createIndividualAthlete()` or `createTeamAthlete()`
   - `disciplineId` parameter → `disciplineCode`

3. **New Features:**
   - All backend endpoints are now available
   - Proper TypeScript types for all operations
   - Enhanced error handling and logging
