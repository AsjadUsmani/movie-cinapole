/**
 * Application-wide constants
 */

export const CONSTANTS = {
  BATCH_SIZE: 100,
  DATA_FILE_PATH: "./data/allShows.json",
  LOG_MESSAGES: {
    SYNC_START: "Loading shows from JSON...",
    SYNC_LOADED: (count: number) => `Loaded ${count} shows`,
    SYNC_COMPLETE: "Sync table updated successfully.",
    RECONCILE_START: "Reconciling SyncShow → MasterShow...",
    RECONCILE_COMPLETE: (inserted: number, updated: number, unchanged: number) =>
      `Done. Inserted: ${inserted}, Updated: ${updated}, Unchanged: ${unchanged}`,
  },
};

export default CONSTANTS;
