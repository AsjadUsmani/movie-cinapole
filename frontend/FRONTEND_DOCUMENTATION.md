# Frontend UI Documentation

## 🎨 Overview

A modern, responsive React UI for browsing and managing cinema shows with advanced filtering and synchronization capabilities.

**Technology Stack:**
- React 19 with TypeScript
- Tailwind CSS 4
- Lucide React Icons
- Vite Build Tool

---

## ✨ Features Implemented

### 1. **Search & Filter Panel**
- **Movie ID Search** - Search shows by specific movie ID (e.g., HO00000945)
- **Date Range Filtering** - Filter shows between specific dates with:
  - From Date picker
  - To Date picker
  - Real-time query building
- **Per-Page Limit** - Select how many results to display:
  - 10 items
  - 20 items (default)
  - 50 items
  - 100 items
- **Search Button** - Trigger filtered search
- **Reset Button** - Clear all filters and reload

### 2. **Database Synchronization**
- **Sync Button** - One-click button to:
  - Run API data synchronization
  - Sync SyncShow table with new data
  - Reconcile changes to MasterShow table
  - Auto-refresh table after sync completes
- **Loading State** - Visual feedback while syncing
- **Error Handling** - Display sync errors to user

### 3. **Results Display**
- **Statistics** - Shows current result range:
  - "Showing X to Y of Z shows"
  - Real-time count updates
- **Loading Indicator** - Visual spinner when fetching data
- **Empty State** - Helpful message when no results found

### 4. **Advanced Table**
Displays movies with columns:
- **Movie Title** - Movie name
- **Movie ID** - Unique identifier (highlighted tag)
- **Cinema** - Cinema/theater ID
- **Screen** - Screen/auditorium name
- **Format** - Display format (2D, 3D, IMAX) with badge
- **Show Time** - Formatted datetime

**Features:**
- Hover effects for better UX
- Alternating row colors for readability
- Formatted timestamps (e.g., "Jan 28, 2026, 3:30 PM")
- Responsive horizontal scrolling

### 5. **Smart Pagination**
- **Previous Button** - Navigate to previous page
- **Next Button** - Navigate to next page
- **Page Input** - Jump to specific page by number
- **Total Pages Display** - Shows current/total pages
- **Intelligent State Management**:
  - Disables Previous on first page
  - Disables Next on last page
  - Updates dynamically with limit changes
  - Resets to page 1 on filter change

---

## 🎯 UI/UX Highlights

### Design System
- **Dark Theme** - Modern slate-based gradient background
- **Color Palette**:
  - Primary: Blue (#3b82f6)
  - Background: Slate (900-700)
  - Accents: Purple, Blue badges
  
### Responsive Layout
- **Desktop** - Full 4-column filter grid
- **Tablet** - 2-column grid
- **Mobile** - Single column responsive design

### Interactive Elements
- **Smooth Transitions** - All buttons and elements transition smoothly
- **Hover States** - Clear visual feedback on all interactive elements
- **Loading States** - Disabled buttons with spinners during operations
- **Error Messages** - Red alert boxes for user feedback

### Accessibility
- Semantic HTML labels
- Keyboard navigation support
- Clear focus states on form elements
- Alt text considerations

---

## 🔌 API Integration

### Endpoints Used

```typescript
// Fetch shows with filters
GET /shows?page=1&limit=20&movieId=HO00000945&from=2026-01-27&to=2026-01-30

// Sync database
POST /sync
```

### Query Parameters
- `page` - Pagination page number
- `limit` - Results per page
- `movieId` - Filter by movie ID (optional)
- `from` - Filter from date (optional)
- `to` - Filter to date (optional)

### Response Format
```json
{
  "page": 1,
  "limit": 20,
  "total": 1234,
  "data": [
    {
      "id": 1,
      "movieID": "HO00000945",
      "title": "Avatar: The Way of Water",
      "cinemaId": 5,
      "screenName": "Screen 1",
      "showTime": "2026-01-28T18:30:00Z",
      "rating": "PG-13",
      "length": 192,
      "format": "3D",
      "genere": "Sci-Fi",
      "imageUrl": "https://..."
    }
  ]
}
```

---

## 🚀 Usage Guide

### Running the Frontend
```bash
cd frontend
npm run dev        # Development server on http://localhost:5173
npm run build      # Build for production
npm run preview    # Preview production build
```

### Example Workflows

#### 1. Sync Latest Data
1. Click "Sync Database" button
2. Wait for sync to complete
3. Table auto-refreshes with new data

#### 2. Search Specific Movie
1. Enter Movie ID (e.g., HO00000945)
2. Click "Search"
3. Table updates with matching shows

#### 3. Filter by Date Range
1. Set "From Date" to start date
2. Set "To Date" to end date
3. Click "Search"
4. View shows within date range

#### 4. Browse with Pagination
1. Select items per page (20, 50, 100)
2. Use Previous/Next buttons or enter page number
3. Results dynamically update

#### 5. Reset All Filters
1. Click "Reset" button
2. All filters cleared
3. Returns to page 1 with default 20 per page

---

## 🎨 Component Structure

```
App.tsx (Main Component)
├── Header Section
│   ├── Title & Subtitle
│   └── Sync Button with loading state
├── Filter Panel
│   ├── Movie ID search input
│   ├── From Date picker
│   ├── To Date picker
│   ├── Per-page limit selector
│   ├── Search button
│   └── Reset button
├── Results Info
│   └── Count display & loading indicator
├── Shows Table
│   ├── Table headers
│   └── Table body with data rows
└── Pagination Controls
    ├── Previous button
    ├── Page input field
    ├── Total pages display
    └── Next button
```

---

## 🔧 State Management

```typescript
const [data, setData] = useState<Show[]>([])          // Current page results
const [page, setPage] = useState(1)                    // Current page number
const [limit, setLimit] = useState(20)                 // Items per page
const [total, setTotal] = useState(0)                  // Total results count
const [loading, setLoading] = useState(false)          // Loading state
const [syncing, setSyncing] = useState(false)          // Sync operation state
const [error, setError] = useState("")                 // Error messages

// Filter states
const [searchMovieId, setSearchMovieId] = useState("")  // Movie ID filter
const [fromDate, setFromDate] = useState("")            // From date filter
const [toDate, setToDate] = useState("")                // To date filter
```

---

## 📝 Key Functions

### `buildQueryString(page)`
Constructs API query string with all active filters
```typescript
// Example output:
// ?page=2&limit=50&movieId=HO00000945&from=2026-01-27&to=2026-01-30
```

### `fetchShows(page)`
Fetches shows from API with current filters
- Handles loading states
- Manages errors
- Updates results

### `handleSync()`
Triggers database synchronization
- Shows loading spinner
- Calls POST /sync endpoint
- Auto-refreshes results
- Displays errors if sync fails

### `handleSearch()`
Executes search with current filters
- Resets page to 1
- Rebuilds query string
- Fetches fresh results

### `handleReset()`
Clears all filters and returns to default state
- Clears search fields
- Resets limit to 20
- Goes back to page 1

---

## 🎯 Styling Details

### Colors
```css
bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900  /* Background */
from-blue-600 to-blue-700                                     /* Header */
bg-slate-700 border border-slate-600                          /* Cards */
bg-blue-600 hover:bg-blue-700                                 /* Buttons */
bg-slate-600 text-white                                       /* Inputs */
```

### Spacing & Layout
- **Max-width**: 7xl container (80rem)
- **Padding**: 8 units (2rem) vertical, 4-8 units horizontal
- **Gap**: 4 units (1rem) between filter elements
- **Rounded**: lg (0.5rem) for inputs, standard for buttons

### Typography
- **Header**: 4xl bold
- **Subheader**: 2-3xl semibold
- **Labels**: sm semibold
- **Body**: sm regular
- **Mono**: font-mono for IDs and times

---

## 📱 Responsive Breakpoints

```typescript
// Mobile: Single column
className="grid grid-cols-1"

// Tablet & up: 2 columns (md:)
className="md:grid-cols-2"

// Large: 4 columns (lg:)
className="lg:grid-cols-4"
```

---

## ✅ Testing Checklist

- [ ] Sync button syncs database
- [ ] Movie ID search filters results
- [ ] Date range filtering works
- [ ] Per-page limit changes results count
- [ ] Pagination navigates correctly
- [ ] Reset clears all filters
- [ ] Error messages display
- [ ] Loading states show
- [ ] Mobile responsive
- [ ] Dark theme renders correctly

---

## 🚀 Future Enhancements

Potential features to add:
- Export data to CSV
- Movie detail modal/drawer
- Advanced analytics dashboard
- Real-time search suggestions
- Favorites/bookmarks
- Show ratings and reviews
- Theater information
- Seat availability
- Ticket booking integration
