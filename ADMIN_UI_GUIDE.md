# Admin UI Implementation Guide

## Overview

This guide documents the comprehensive admin UI implementation for the athlete management system. The UI follows a consistent pattern across all features and provides full CRUD operations for managing athletes, teams, performances, and related entities.

## 🏗️ Architecture Pattern

All features follow this consistent structure:

```
features/
├── [feature-name]/
│   ├── service/
│   │   └── [feature].service.ts          # API service layer
│   └── components/
│       ├── [feature]-listing.tsx         # Server component for data fetching
│       ├── [feature]-dialog.tsx          # Form dialog for create/edit
│       └── [feature]-tables/
│           ├── index.tsx                 # Main table component
│           ├── columns.tsx               # Table column definitions
│           └── cell-action.tsx           # Row action menu
```

## ✅ Implemented Features

### 1. **Teams Management** (`/admin/src/features/teams/`)

**Components:**

- `TeamService` - Full CRUD operations for teams
- `TeamDialog` - Create/edit team form with sport selection
- `TeamTable` - Data table with filtering and pagination
- `TeamListing` - Server component for data fetching

**Features:**

- Create, read, update, delete teams
- Assign teams to sports (Basketball, Football, Athletics, Wrestling, Boxing)
- Team member management
- Search and filter capabilities

**API Endpoints:**

- `GET /teams` - List all teams with pagination
- `POST /teams` - Create new team
- `PUT /teams/:id` - Update team
- `DELETE /teams/:id` - Delete team
- `GET /teams/sport/:sportId` - Get teams by sport

### 2. **Performances Management** (`/admin/src/features/performances/`)

**Components:**

- `PerformanceService` - Comprehensive performance tracking
- `PerformanceDialog` - Multi-tab form for sport-specific metrics
- `PerformanceTable` - Advanced data table with sport metrics display
- `PerformanceListing` - Server component with advanced filtering

**Features:**

- Sport-specific performance tracking:
  - **Track & Field**: Time, distance, height
  - **Football**: Goals, assists, cards, saves, minutes played
  - **Basketball**: Points, rebounds, assists, steals, blocks, turnovers
  - **Wrestling**: Wins, losses, pins, technical falls, decisions
  - **Boxing**: Rounds, knockouts, knockdowns, punches landed/thrown
- Personal and season best tracking
- Performance comparison tools
- Bulk operations support

**API Endpoints:**

- `GET /performances` - List all performances with advanced filtering
- `POST /performances` - Create new performance
- `PUT /performances/:id` - Update performance
- `DELETE /performances/:id` - Delete performance
- `GET /performances/athlete/:athleteId` - Get athlete performances
- `GET /performances/event/:eventId/results` - Get event results
- `POST /performances/compare` - Compare athletes
- `POST /performances/bulk` - Bulk create performances

## 🎨 UI Components

### Data Tables

All tables include:

- **Pagination** - Server-side pagination with configurable page sizes
- **Sorting** - Multi-column sorting
- **Filtering** - Advanced filtering with search
- **Selection** - Row selection with bulk operations
- **Actions** - Context menu for each row

### Forms

All forms include:

- **Validation** - Zod schema validation
- **Error Handling** - Comprehensive error messages
- **Loading States** - Loading indicators during operations
- **Responsive Design** - Mobile-friendly layouts

### Dialogs

All dialogs include:

- **Create/Edit Mode** - Same component for both operations
- **Delete Confirmation** - Alert dialogs for destructive actions
- **Form Reset** - Automatic form reset after operations

## 🚀 Dashboard Pages

### Teams Page (`/dashboard/teams`)

- **URL**: `/admin/dashboard/teams`
- **Description**: Manage all teams across different sports
- **Features**: Create, edit, delete teams, assign to sports

### Performances Page (`/dashboard/performances`)

- **URL**: `/admin/dashboard/performances`
- **Description**: Track and manage athlete performances
- **Features**: Sport-specific metrics, personal/season bests, comparisons

## 🔧 Technical Implementation

### Service Layer Pattern

```typescript
class FeatureService {
  async getAllItems(params?: ListParams): Promise<PaginatedResponse<Item>>;
  async getItemById(id: number): Promise<Item>;
  async createItem(data: CreateData): Promise<Item>;
  async updateItem(id: number, data: UpdateData): Promise<Item>;
  async deleteItem(id: number): Promise<{ success: boolean; message: string }>;
}
```

### Component Pattern

```typescript
// Server Component (Data Fetching)
export default async function FeatureListingPage() {
  const data = await featureService.getAllItems(filters);
  return <FeatureTable data={data.items} totalItems={data.total} />;
}

// Client Component (Interactive Table)
export function FeatureTable({ data, totalItems }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Table logic with edit/delete handlers
}
```

### Form Pattern

```typescript
const formSchema = z.object({
  // Validation schema
});

export function FeatureDialog({ item, isOpen, onClose, onSave }) {
  const form = useForm({ resolver: zodResolver(formSchema) });

  const onSubmit = async (data) => {
    await onSave(data);
    form.reset();
    onClose();
  };
}
```

## 📊 Data Models

### Team

```typescript
interface Team {
  teamId: number;
  code: string;
  name: string;
  sportId: number;
  createdAt: string;
  updatedAt: string;
  sport?: Sport;
  athletes?: Athlete[];
}
```

### Performance

```typescript
interface Performance {
  performanceId: number;
  athleteId: number;
  eventId: number;
  disciplineId?: number;
  date: string;
  position?: number;
  points?: number;
  // Sport-specific fields...
  isPersonalBest: boolean;
  isSeasonBest: boolean;
  athlete?: Athlete;
  event?: Event;
  discipline?: Discipline;
}
```

## 🎯 Next Steps

### Remaining Features to Implement

1. **Events Management**

   - Event creation and scheduling
   - Event status management (Scheduled → Live → Finished)
   - Venue assignment
   - Season and gameday organization

2. **Seasons Management**

   - Season lifecycle management
   - Active season handling
   - Year-based organization

3. **Gamedays Management**

   - Gameday progression (Current → Next → Previous)
   - Event scheduling within gamedays

4. **Venues Management**

   - Venue creation and management
   - Location-based filtering
   - Capacity management

5. **Positions Management** (Team Sports)

   - Position creation for team sports
   - Sport-specific positions (Basketball: PG, SG, SF, PF, C)

6. **Disciplines Management** (Individual Sports)

   - Discipline creation for individual sports
   - Sport-specific disciplines (Athletics: 100m, 200m, Long Jump)

7. **Sports Management**
   - Sport configuration
   - Team vs Individual sport settings

### Implementation Priority

1. **High Priority**: Events, Seasons, Gamedays

   - Core event management functionality
   - Essential for performance tracking

2. **Medium Priority**: Venues, Positions, Disciplines

   - Supporting entities for better organization

3. **Low Priority**: Sports Management
   - Configuration and settings

## 🔗 Navigation Integration

To integrate these new pages into the navigation, update the navigation configuration:

```typescript
// In navigation configuration
{
  title: "Athlete Management",
  items: [
    { title: "Athletes", href: "/dashboard/athlete" },
    { title: "Teams", href: "/dashboard/teams" },
    { title: "Performances", href: "/dashboard/performances" },
    { title: "Events", href: "/dashboard/events" },
    { title: "Seasons", href: "/dashboard/seasons" },
    { title: "Gamedays", href: "/dashboard/gamedays" },
    { title: "Venues", href: "/dashboard/venues" },
    { title: "Positions", href: "/dashboard/positions" },
    { title: "Disciplines", href: "/dashboard/disciplines" },
    { title: "Sports", href: "/dashboard/sports" },
  ]
}
```

## 🧪 Testing

### Manual Testing Checklist

For each feature:

- [ ] Create new item
- [ ] Edit existing item
- [ ] Delete item
- [ ] Search and filter
- [ ] Pagination
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states
- [ ] Mobile responsiveness

### API Testing

Use the provided API documentation to test all endpoints:

- Verify CRUD operations
- Test filtering and pagination
- Validate error responses
- Check data consistency

## 📝 Notes

1. **Mock Data**: Some components use mock data for athletes, events, and disciplines. Replace with actual API calls when implementing the remaining features.

2. **Error Handling**: All components include comprehensive error handling with user-friendly messages.

3. **Performance**: The implementation uses server-side pagination and filtering for optimal performance.

4. **Accessibility**: All components follow accessibility best practices with proper ARIA labels and keyboard navigation.

5. **Responsive Design**: All components are mobile-friendly with responsive layouts.

This implementation provides a solid foundation for managing the athlete management system with a consistent, scalable, and user-friendly interface.
