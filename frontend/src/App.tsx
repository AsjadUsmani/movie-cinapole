import { useEffect, useState, useCallback } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight, Loader } from "lucide-react";

type Show = {
  id: number;
  movieID: string;
  title: string;
  cinemaId: number;
  screenName: string;
  showTime: string;
  rating?: string;
  length?: number;
  format?: string;
  genere?: string;
  imageUrl?: string;
};

const API_BASE_URL = "http://localhost:3000";

export default function ShowsPage() {
  const [data, setData] = useState<Show[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  // Search and filter states
  const [searchMovieTitle, setSearchMovieTitle] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const buildQueryString = useCallback(
    (p = 1) => {
      const params = new URLSearchParams();
      params.append("page", p.toString());
      params.append("limit", limit.toString());

      if (searchMovieTitle.trim()) {
        params.append("title", searchMovieTitle.trim());
      }

      if (fromDate) {
        params.append("from", fromDate);
      }

      if (toDate) {
        params.append("to", toDate);
      }

      return params.toString();
    },
    [limit, searchMovieTitle, fromDate, toDate]
  );

  const fetchShows = useCallback(async (p = 1) => {
    setLoading(true);
    setError("");
    try {
      const queryString = buildQueryString(p);
      const res = await fetch(`${API_BASE_URL}/shows?${queryString}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      setData(json.data || []);
      setTotal(json.total || 0);
      setPage(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch shows");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  const handleSync = async () => {
    setSyncing(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/sync`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Sync failed with status: ${res.status}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      await fetchShows(1);
      setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchShows(1);
  };

  const handleReset = () => {
    setSearchMovieTitle("");
    setFromDate("");
    setToDate("");
    setLimit(20);
    setPage(1);
  };

  useEffect(() => {
    fetchShows(page);
  }, [page, limit, fetchShows]);

  const totalPages = Math.ceil(total / limit) || 1;
  const isLastPage = page >= totalPages;
  const isFirstPage = page === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">🎬 Movie Shows</h1>
              <p className="text-blue-100 mt-1">Browse and manage cinema shows</p>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing || loading}
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
            >
              {syncing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Loader2 className="w-5 h-5" />
                  Sync Database
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Filters Card */}
        <div className="bg-slate-700 rounded-lg shadow-xl p-6 mb-8 border border-slate-600">
          <h2 className="text-lg font-semibold text-white mb-4">Filters & Search</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Movie Title Search */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Movie Title
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g., Avatar, Dune..."
                  value={searchMovieTitle}
                  onChange={(e) => setSearchMovieTitle(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 bg-slate-600 text-white placeholder-slate-400 rounded-lg border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Per Page */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Per Page
              </label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-slate-300">
            <p className="text-sm">
              Showing{" "}
              <span className="font-semibold text-white">
                {data.length > 0 ? (page - 1) * limit + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-white">
                {Math.min(page * limit, total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">{total}</span> shows
            </p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-blue-400">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        {/* Shows Table */}
        <div className="bg-slate-700 rounded-lg shadow-xl overflow-hidden border border-slate-600">
          {data.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-lg">
                {loading ? "Loading shows..." : "No shows found. Try adjusting your filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-600 border-b border-slate-500">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Movie Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Movie ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Cinema
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Screen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Format
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Show Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600">
                  {data.map((show, idx) => (
                    <tr
                      key={show.id}
                      className={`hover:bg-slate-600 transition-colors ${
                        idx % 2 === 0 ? "bg-slate-700" : "bg-slate-750"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {show.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        <span className="bg-blue-900/30 px-2 py-1 rounded text-blue-300 text-xs font-mono">
                          {show.movieID}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {show.cinemaId}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {show.screenName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {show.format ? (
                          <span className="bg-purple-900/30 px-2 py-1 rounded text-purple-300 text-xs font-medium">
                            {show.format}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                        {new Date(show.showTime).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={isFirstPage || loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors border border-slate-600 hover:border-slate-500"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={page}
              onChange={(e) => {
                const newPage = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                setPage(newPage);
              }}
              className="w-16 px-3 py-2 bg-slate-700 text-white text-center rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-slate-300">
              of <span className="font-semibold text-white">{totalPages}</span>
            </span>
          </div>

          <button
            onClick={() => setPage((p) => (isLastPage ? p : p + 1))}
            disabled={isLastPage || loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors border border-slate-600 hover:border-slate-500"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
