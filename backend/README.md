# Enpointe Backend - Movie Shows Synchronization System

## Overview

This backend application synchronizes movie show data from an external API into a PostgreSQL database using a two-table architecture with Prisma ORM. The system maintains data consistency through a staging-to-master pattern, ensuring reliable data reconciliation and change tracking.

---

## Architecture & Workflow

```
External API (JSON Data)
         ↓
   data/allShows.json
         ↓
[syncFromApi.ts] → Loads and upserts into SyncShow table
         ↓
    SyncShow Table (Staging)
         ↓
[reconcileToMaster.ts] → Compares, reconciles, and syncs to MasterShow
         ↓
   MasterShow Table (Authoritative)
         ↓
  Application Consumption
```

---

## Data Models

### 1. **SyncShow** (Staging Table)
Acts as a temporary staging area for data coming from the external API.

| Field | Type | Notes |
|-------|------|-------|
| `id` | INT | Auto-increment primary key |
| `movieID` | STRING | Movie identifier from API |
| `cinemaId` | INT | Cinema/theater identifier |
| `screenName` | STRING | Screen/auditorium name |
| `showTime` | DATETIME | Show time |
| `title` | STRING | Movie title |
| `rating` | STRING (nullable) | Movie rating (e.g., PG, R) |
| `length` | INT (nullable) | Movie duration in minutes |
| `format` | STRING (nullable) | Format (e.g., 2D, 3D, IMAX) |
| `genere` | STRING (nullable) | Movie genre |
| `isActive` | STRING (nullable) | Active status flag |
| `imageUrl` | STRING (nullable) | Movie poster/image URL |
| `createdAt` | DATETIME | Timestamp (auto) |
| `updatedAt` | DATETIME | Timestamp (auto) |

**Unique Constraint:** `(movieID, cinemaId, screenName, showTime)` - Prevents duplicate show instances

---

### 2. **MasterShow** (Authoritative Table)
Holds the authoritative/canonical version of show data after reconciliation.

**Same schema as SyncShow** - Acts as the single source of truth for the application.

---

## Core Processes

### Process 1: `syncFromApi.ts` - Data Ingestion

**Purpose:** Load movie show data from JSON file and populate the SyncShow table.

**Workflow:**

1. **Load JSON Data**
   - Reads from `data/allShows.json`
   - Expected format:
     ```json
     {
       "data": {
         "allShows": [
           {
             "movie_showTime": "2026-01-28T18:30:00Z",
             "screen_name": "Screen 1",
             "is_active": "1",
             "movie_ID": "MOV123",
             "movie_title": "Movie Title",
             "movie_rating": "PG-13",
             "movie_length": 120,
             "movie_format": "2D",
             "cinema_id": 5,
             "movie_genere": "Action",
             "movie_image_new": "https://..."
           }
         ]
       }
     }
     ```

2. **Batch Processing**
   - Shows are split into chunks of **100 records** using `chunk()` utility
   - Batching improves database performance and prevents transaction timeout

3. **Upsert Operation** (Update or Insert)
   - For each show, it uses the unique constraint key: `(movieID, cinemaId, screenName, showTime)`
   - **If show exists:** Updates all attributes (title, rating, length, format, genre, status, image)
   - **If show is new:** Creates a new record

4. **Transaction Management**
   - All operations within a batch are wrapped in a Prisma transaction
   - Ensures atomicity - all succeed or all fail together

**Output:** SyncShow table updated with latest data from API

---

### Process 2: `reconcileToMaster.ts` - Data Reconciliation

**Purpose:** Compare SyncShow (staging) with MasterShow (authoritative) and synchronize differences.

**Workflow:**

1. **Fetch All SyncShow Records**
   - Retrieves all current records from the staging table

2. **Batch Process Records**
   - Splits records into chunks of **100** for efficient processing

3. **For Each Record, Check Status:**

   **Case 1: No Master Record Exists**
   - Action: Create new record in MasterShow
   - Counter: `inserted++`
   - Data: All fields copied from SyncShow

   **Case 2: Master Record Exists & Data Changed**
   - Action: Update MasterShow with new values
   - Counter: `updated++`
   - Detection: `hasChanged()` function compares:
     - title, rating, length, format, genre, isActive, imageUrl
   - Updated fields only: (keeps id, timestamps)

   **Case 3: Master Record Exists & Data Unchanged**
   - Action: Skip
   - Counter: `unchanged++`

4. **Batch Transaction**
   - All insert/update operations collected and executed in a single transaction
   - Only executes if there are actual changes

5. **Result Logging**
   - Displays summary: Inserted, Updated, Unchanged counts

**Output:** MasterShow table synchronized with current SyncShow data

---

## Service Utilities

### `chunk.ts` - Array Chunking

```typescript
export function chunk<T>(arr: T[], size: number): T[][]
```

**Purpose:** Splits a large array into smaller arrays (chunks).

**Example:**
```typescript
const shows = [show1, show2, show3, ..., show201];
const batches = chunk(shows, 100);
// Result: [
//   [show1, show2, ..., show100],
//   [show101, show102, ..., show200],
//   [show201]
// ]
```

**Why Used:**
- Prevents memory overload with large datasets
- Improves database query performance
- Reduces transaction size to avoid timeout
- Better resource management

---

## Setup & Configuration

### Prerequisites

```json
{
  "dependencies": {
    "@prisma/client": "^6.19.2",
    "@prisma/adapter-mariadb": "^7.3.0",
    "axios": "^1.13.4",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "prisma": "^6.19.2",
    "tsx": "^4.21.0",
    "typescript": "^5.9.3"
  }
}
```

### Environment Setup

Create `.env` file in project root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/enpointe_db"
```

### Database Migration

```bash
# Apply pending migrations
npx prisma migrate dev --name init

# Reset database (development only)
npx prisma migrate reset
```

---

## Running the Processes

### 1. Sync from API
```bash
npx tsx src/syncFromApi.ts
```

**Output:**
```
Loading shows from JSON...
Loaded 1234 shows
Sync table updated successfully.
```

### 2. Reconcile to Master
```bash
npx tsx src/reconcileToMaster.ts
```

**Output:**
```
Reconciling SyncShow → MasterShow...
Done. Inserted: 45, Updated: 120, Unchanged: 1069
```

### 3. View Database
```bash
npx prisma studio
```

Opens interactive UI to browse/edit data.

---

## Data Flow Example

### Scenario: Movie show from API arrives

**Step 1: SyncFromApi**
```
API JSON: {
  movieID: "MOV456",
  cinema_id: 3,
  screen_name: "Screen 2",
  showTime: "2026-02-15T19:00:00Z",
  title: "Avatar 2",
  rating: "PG-13"
}
↓
SyncShow.upsert()
↓
SyncShow Table:
- movieID: MOV456, cinemaId: 3, screenName: "Screen 2", showTime: 2026-02-15T19:00:00Z
- title: Avatar 2, rating: PG-13, ...
```

**Step 2: ReconcileToMaster**
```
hasChanged(SyncShow record, MasterShow record)?
  
  Case A: MasterShow doesn't exist
  → Create new MasterShow record
  → inserted++
  
  Case B: MasterShow exists, data different
  → Update MasterShow fields
  → updated++
  
  Case C: MasterShow exists, data same
  → No action
  → unchanged++
```

---

## Key Design Patterns

### 1. **Two-Table Pattern**
- **SyncShow:** Transient, updated frequently from API
- **MasterShow:** Stable, only updated when changes detected
- Prevents direct API data from corrupting authoritative records

### 2. **Upsert Strategy**
- Handles both new records and updates in one operation
- Uses composite unique key to identify duplicates

### 3. **Batch Processing**
- Improves performance and prevents timeout
- Better resource utilization
- Atomic transactions per batch

### 4. **Change Detection**
- Only updates MasterShow when data actually changed
- Reduces unnecessary database writes
- Tracks change statistics

### 5. **Transaction Management**
- All operations use Prisma transactions
- Ensures data consistency
- Automatic rollback on error

---

## Error Handling

Both scripts include error handling:

```typescript
syncFromApi()
  .catch(console.error)           // Logs errors to console
  .finally(() => prisma.$disconnect()); // Always closes DB connection
```

**Common Errors:**
- `DATABASE_URL` not set → Check `.env` file
- Database not running → Verify PostgreSQL service
- Schema mismatch → Run `npx prisma migrate dev`
- Invalid JSON → Check `data/allShows.json` format

---

## Performance Considerations

| Aspect | Current | Notes |
|--------|---------|-------|
| Batch Size | 100 records | Can adjust in `chunk()` calls |
| Transaction Type | Per-batch | Groups operations for efficiency |
| Unique Constraint | 4-field composite | Prevents duplicate shows |
| Change Detection | Field-by-field | Granular tracking |

**Optimization Tips:**
- Increase batch size for larger datasets
- Add database indexes on frequently queried fields
- Use connection pooling for concurrent access
- Archive old records periodically

---

## Technology Stack

- **Runtime:** Node.js with TypeScript
- **ORM:** Prisma (v6.19.2)
- **Database:** PostgreSQL
- **Data Processing:** Array chunking utility
- **Environment:** dotenv for configuration
- **Executor:** tsx for TypeScript execution

---

## File Structure

```
├── src/
│   ├── syncFromApi.ts              # API data ingestion
│   ├── reconcileToMaster.ts        # Data reconciliation
│   ├── services/
│   │   └── chunk.ts                # Batch utility
│   ├── data/
│   │   └── allShows.json           # Source data
│   └── generated/
│       └── prisma/                 # Auto-generated client
├── prisma/
│   ├── schema.prisma               # Data schema definition
│   └── migrations/                 # Migration history
├── package.json
├── tsconfig.json
└── prisma.config.ts
```

---

## Summary

This backend implements a robust movie show synchronization system that:
1. ✅ Loads external API data into a staging table (SyncShow)
2. ✅ Compares staged data with authoritative records (MasterShow)
3. ✅ Intelligently reconciles differences (insert/update/skip)
4. ✅ Maintains data consistency through transactions
5. ✅ Provides detailed change tracking
6. ✅ Handles large datasets efficiently through batching

The dual-table approach ensures data reliability while the batch processing ensures scalability.
