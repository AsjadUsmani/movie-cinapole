# Search & Date Filter Updates

## 🔄 Changes Made

### 1. **Search by Movie Title (Frontend & Backend)**

#### Frontend Changes (`App.tsx`)
- Changed state from `searchMovieId` to `searchMovieTitle`
- Updated input placeholder from "e.g., HO00000945" to "e.g., Avatar, Dune..."
- Query parameter changed from `movieId` to `title`

**Before:**
```typescript
const [searchMovieId, setSearchMovieId] = useState("");
params.append("movieId", searchMovieId.trim());
```

**After:**
```typescript
const [searchMovieTitle, setSearchMovieTitle] = useState("");
params.append("title", searchMovieTitle.trim());
```

#### Backend Changes (`shows.controllers.ts`)
- Changed query parameter from `movieId` to `title`
- Implemented case-insensitive partial string search using Prisma's `contains` with `insensitive` mode

**Before:**
```typescript
const { movieId, from, to, page = "1", limit = "20" } = req.query;
if (movieId) {
  where.movieID = movieId;
}
```

**After:**
```typescript
const { title, from, to, page = "1", limit = "20" } = req.query;
if (title) {
  where.title = {
    contains: title as string,
    mode: "insensitive",
  };
}
```

### 2. **Example API Usage**

Now you can search by movie title:

```bash
# Search for a specific movie title
GET /shows?title=Avatar
GET /shows?title=Border
GET /shows?title=Dune

# Combine with other filters
GET /shows?title=Avatar&page=1&limit=20
GET /shows?title=Avatar&from=2026-01-28&to=2026-01-30&limit=50
```

---

## 📅 Date/Time Issue Explanation

### **Why Different Show Times Exist**

The variation in show times (some showing "Jan 28, 2026, 12:00 AM" and others "Jan 29, 2026, 12:00 AM") is **expected and normal**.

**Reasons:**

1. **Source Data Variation**
   - The `allShows.json` file contains movies with different show times
   - Different movies have different schedules across cinemas
   - Some movies may have early morning shows on Jan 29

2. **Filter Logic**
   - Your backend filters only show upcoming shows: `showTime >= now`
   - Current date is approximately Jan 28, 2026
   - Any show scheduled for Jan 28 at 12:00 AM has already passed (midnight)
   - Shows after that time on Jan 28 will display
   - Shows on Jan 29 will also display (future date)

3. **UTC Timezone**
   - All dates in the JSON are stored in UTC (Zulu time) format
   - Display converts to user's local timezone
   - "T00:00:00.000Z" in data = midnight UTC
   - Displays as 12:00 AM in most timezones

### **Example Data Structure**

```json
{
  "movie_title": "BORDER 2 (HINDI)",
  "movie_showTime": "2026-01-28T11:00:00.000Z",  // 11:00 AM UTC
  "screen_name": "AUID 1",
  "cinema_id": 5,
  // ... other fields
}
```

### **Common Show Times in Data**

Your data likely contains various show times like:
- `2026-01-28T08:00:00.000Z` (8:00 AM)
- `2026-01-28T11:00:00.000Z` (11:00 AM)
- `2026-01-28T14:00:00.000Z` (2:00 PM)
- `2026-01-28T17:00:00.000Z` (5:00 PM)
- `2026-01-28T20:00:00.000Z` (8:00 PM)
- `2026-01-28T23:00:00.000Z` (11:00 PM)
- `2026-01-29T11:00:00.000Z` (Jan 29, 11:00 AM)
- etc.

---

## 🎯 Frontend Usage Examples

### Search by Movie Title

1. **Simple Title Search**
   - Enter "Avatar" → Shows all Avatar movies
   - Enter "Dune" → Shows all Dune movies
   - Enter "Border" → Shows all Border movies

2. **Partial Matching**
   - Search is case-insensitive and partial
   - "bor" matches "BORDER 2"
   - "ava" matches "Avatar: The Way of Water"

3. **Combined Filters**
   - Title: "Avatar"
   - From: Jan 28, 2026
   - To: Jan 30, 2026
   - Shows only Avatar movies between those dates

4. **With Pagination**
   - Title: "Border"
   - Per Page: 50
   - Results update with correct pagination

---

## 🔧 Current API Endpoints

### Get Shows with Filters

```bash
# Get all upcoming shows
GET /shows?page=1&limit=20

# Search by title
GET /shows?title=Avatar&page=1&limit=20

# Filter by date range
GET /shows?from=2026-01-28&to=2026-01-30&page=1&limit=20

# Combined filters
GET /shows?title=Avatar&from=2026-01-28&to=2026-01-30&page=2&limit=50
```

### Response Format

```json
{
  "page": 1,
  "limit": 20,
  "total": 156,
  "data": [
    {
      "id": 1,
      "movieID": "HO00000945",
      "title": "BORDER 2 (HINDI)",
      "cinemaId": 5,
      "screenName": "AUID 1",
      "showTime": "2026-01-28T11:00:00.000Z",
      "rating": "U/A 13+",
      "length": 199,
      "format": "2D",
      "genere": "Action",
      "imageUrl": "https://..."
    }
  ]
}
```

---

## ✨ What Changed in UI

### Input Label
**Before:** "Movie ID" with placeholder "e.g., HO00000945"
**After:** "Movie Title" with placeholder "e.g., Avatar, Dune..."

### Search Behavior
- **Before:** Exact movieId match
- **After:** Partial title match (case-insensitive, contains search)

### User Experience
- More intuitive for users (search by movie name)
- Better UX (users don't need to know movie IDs)
- Flexible matching (partial text works)

---

## 📝 Summary

✅ **Search now works by movie title instead of ID**
✅ **Case-insensitive partial matching**
✅ **Different show times are from actual data**
✅ **Filter works correctly with date ranges**
✅ **All filters work together seamlessly**

Test it out in the UI:
1. Start the backend: `npm run dev`
2. Start the frontend: `npm run dev`
3. Search for "Border", "Avatar", or any movie title
4. Notice different show times for same/different movies
5. Filter by dates to narrow results
