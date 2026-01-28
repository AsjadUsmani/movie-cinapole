# Backend Folder Structure

This document describes the organized folder structure for the Enpointe backend application.

## Directory Layout

```
backend/
├── src/
│   ├── scripts/
│   │   ├── syncFromApi.ts              # Script to sync shows from API to SyncShow table
│   │   └── reconcileToMaster.ts        # Script to reconcile SyncShow to MasterShow table
│   │
│   ├── services/
│   │   └── (API routes, business logic, service layer)
│   │
│   ├── utils/
│   │   └── chunk.ts                    # Utility for chunking/batching arrays
│   │
│   ├── config/
│   │   └── index.ts                    # Configuration and environment variables
│   │
│   ├── constants/
│   │   └── index.ts                    # Application-wide constants
│   │
│   ├── types/
│   │   └── index.ts                    # TypeScript type definitions
│   │
│   ├── data/
│   │   └── allShows.json               # External API data (source)
│   │
│   └── generated/
│       └── prisma/                     # Auto-generated Prisma client and types
│
├── prisma/
│   ├── schema.prisma                   # Database schema definition
│   └── migrations/
│       └── 20260128075724_init/        # Migration history
│
├── tests/                              # Test files (Jest, Vitest, etc.)
│
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── prisma.config.ts                    # Prisma configuration
├── .env                                # Environment variables
├── .gitignore                          # Git ignore rules
└── README.md                           # Project documentation
```

## Folder Descriptions

### `src/scripts/`
**Purpose:** One-off scripts and CLI commands for data operations

- `syncFromApi.ts` - Loads data from JSON and syncs to SyncShow table
- `reconcileToMaster.ts` - Compares SyncShow and MasterShow, reconciles differences

**Run Commands:**
```bash
npx tsx src/scripts/syncFromApi.ts
npx tsx src/scripts/reconcileToMaster.ts
```

---

### `src/services/`
**Purpose:** Business logic, service layer, and reusable operations

*Future location for:*
- API route handlers
- Business logic functions
- Database service methods
- Third-party API integrations

---

### `src/utils/`
**Purpose:** Utility functions and helpers

- `chunk.ts` - Splits arrays into smaller batches for efficient processing

**Usage:**
```typescript
import { chunk } from "./utils/chunk.js";
const batches = chunk(largeArray, 100);
```

---

### `src/config/`
**Purpose:** Configuration management and environment variables

- `index.ts` - Centralized configuration for database, app settings, sync parameters

**Usage:**
```typescript
import config from "./config/index.js";
const dbUrl = config.database.url;
const batchSize = config.sync.batchSize;
```

---

### `src/constants/`
**Purpose:** Application-wide constants and hardcoded values

- `index.ts` - Log messages, batch sizes, and other constants

**Usage:**
```typescript
import CONSTANTS from "./constants/index.js";
console.log(CONSTANTS.LOG_MESSAGES.SYNC_START);
```

---

### `src/types/`
**Purpose:** TypeScript type definitions and interfaces

- `index.ts` - API response types, data model types

**Types Included:**
- `ApiShow` - External API show data structure
- `SyncShowData` - Internal sync table data structure

---

### `src/data/`
**Purpose:** Static data files and fixtures

- `allShows.json` - Source data from external API (for development/testing)

---

### `src/generated/`
**Purpose:** Auto-generated code by Prisma

⚠️ **Do not edit manually** - Regenerate with `npx prisma generate`

- `prisma/client.ts` - Prisma Client
- `prisma/models/` - Type definitions for MasterShow, SyncShow

---

### `prisma/`
**Purpose:** Database schema and migrations

- `schema.prisma` - Database schema definition (models, datasource, generator)
- `migrations/` - Migration history for version control

**Commands:**
```bash
npx prisma migrate dev --name <name>    # Create new migration
npx prisma migrate deploy               # Apply migrations (production)
npx prisma generate                     # Generate Prisma Client
```

---

### `tests/`
**Purpose:** Test files for unit and integration tests

*Future location for:*
- Jest/Vitest test files
- Test utilities
- Mock data and factories

---

## Key Points

### Separation of Concerns
- **Scripts:** One-off operations (syncFromApi, reconcileToMaster)
- **Services:** Reusable business logic
- **Utils:** Helper functions
- **Config:** Environment-specific settings
- **Constants:** Application-wide values
- **Types:** Type safety and documentation

### Import Paths
All imports use relative paths from their location:

```typescript
// From src/scripts/syncFromApi.ts
import { chunk } from "../utils/chunk.js";
import config from "../config/index.js";
import { ApiShow } from "../types/index.js";
```

### Running Scripts
```bash
# From project root
npx tsx src/scripts/syncFromApi.ts
npx tsx src/scripts/reconcileToMaster.ts

# Or add to package.json scripts:
"scripts": {
  "sync:api": "tsx src/scripts/syncFromApi.ts",
  "reconcile:master": "tsx src/scripts/reconcileToMaster.ts"
}
```

### Best Practices

1. **Config Management:** Never hardcode values - use `config/` folder
2. **Constants:** Keep magic strings in `constants/` folder
3. **Types:** Define types in `types/` folder for reusability
4. **Imports:** Use absolute or relative imports consistently
5. **Environment:** Always load `.env` via dotenv in entry points
6. **Scripts:** Keep scripts focused on single operations
7. **Services:** Move repeated logic to service layer

---

## Future Expansion

As the backend grows, consider adding:

```
src/
├── api/
│   ├── routes/          # Express/REST routes
│   ├── controllers/     # Request handlers
│   └── middleware/      # Authentication, validation, etc.
├── repositories/        # Database access layer
├── middleware/          # HTTP middleware
├── hooks/              # Custom logic hooks
└── docs/               # API documentation
```

