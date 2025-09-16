import React, { useEffect, useMemo, useState } from "react"; // React basics
import axios from "axios";
import Sidebar from "./Components/Sidebar";
import MapView from "./Components/MapView";
import ThemeToggle from "./Components/ThemeToogle";

// Main app component
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [earthquakes, setEarthquakes] = useState([]); // all quakes from API
  const [isLoading, setIsLoading] = useState(true); // UI: loading state
  const [error, setError] = useState(null); // UI: error message
  const [feed, setFeed] = useState("day"); // hour | day | week
  const [searchQuery, setSearchQuery] = useState(""); // filter by place text
  const [minMag, setMinMag] = useState(0); // filter by minimum magnitude
  const [focusedEq, setFocusedEq] = useState(null); // which quake to focus on map
  const mapRef = React.useRef(null); // access Leaflet map instance

  // Simple helper: map feed key -> USGS URL
  const FEED_URLS = {
    hour: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
    day: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
    week: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
  };

  // Derive filtered quakes once and reuse
  const filteredQuakes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return earthquakes
      .filter((f) => (f.properties?.mag ?? 0) >= minMag)
      .filter((f) => (query ? (f.properties?.place || "").toLowerCase().includes(query) : true));
  }, [earthquakes, minMag, searchQuery]);

  // Initialize state from URL
  // Read filters from URL on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const feedParam = params.get("feed");
    const qParam = params.get("q");
    const magParam = params.get("mag");
    if (feedParam && ["hour", "day", "week"].includes(feedParam)) setFeed(feedParam);
    if (qParam) setSearchQuery(qParam);
    if (magParam && !Number.isNaN(parseFloat(magParam))) setMinMag(parseFloat(magParam));
  }, []);

  // Sync state to URL
  // Keep URL in sync (shareable links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("feed", feed);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    params.set("mag", String(minMag));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [feed, searchQuery, minMag]);

  // Fetching data from USGS API with auto-refresh and switchable feeds
  // Fetch USGS data + 60s auto-refresh
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(FEED_URLS[feed] || FEED_URLS.day);
        if (!mounted) return;
        setEarthquakes(res.data.features);
      } catch (err) {
        if (!mounted) return;
        setError("Failed to load earthquakes. Please try again.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [feed]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black">
        <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/50 bg-white/80 dark:bg-gray-900/60 border-b border-black/5 dark:border-white/10">
          <div className="mx-auto max-w-7xl px-3 py-2 flex items-center justify-between flex-nowrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 grid place-items-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow">
                🌍
              </div>
              <div className="min-w-0">
                <h1 className="text-base md:text-lg font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap truncate max-w-[45vw] md:max-w-[35vw]">
                  Earthquake Visualizer
                </h1>
                <p className="hidden lg:block text-xs text-gray-500 dark:text-gray-400">Live seismic activity from USGS</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Time range: 1h / 24h / 7d */}
              <div className="hidden sm:flex items-center gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 text-xs">
                {[
                  { key: "hour", label: "1h" },
                  { key: "day", label: "24h" },
                  { key: "week", label: "7d" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setFeed(opt.key)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      feed === opt.key
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {/* Search + Min magnitude + Reset view (desktop) */}
              <div className="hidden md:flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search place..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-72 px-3 py-2 rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
                />
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="hidden lg:inline">Min Mag</span>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={minMag}
                    onChange={(e) => setMinMag(parseFloat(e.target.value))}
                  />
                  <span className="w-8 text-right font-semibold">{minMag}</span>
                </div>
                {/* <button
                  onClick={() => {
                    if (!mapRef.current) return;
                    mapRef.current.setView([20, 0], 2);
                    setFocusedEq(null);
                  }}
                  className="px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-black/5 dark:border-white/10 hover:bg-white/90 dark:hover:bg-gray-700"
                >
                  Reset view
                </button> */}
              </div>
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-col md:flex-row gap-5">
            <Sidebar earthquakes={filteredQuakes} onSelect={setFocusedEq} />
            <div className="flex-1">
              {error && (
                <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              {isLoading ? (
                <div className="h-[85vh] w-full rounded-2xl border border-black/5 dark:border-white/10 bg-gray-100 dark:bg-gray-800 animate-pulse" />
              ) : (
                <MapView earthquakes={filteredQuakes} darkMode={darkMode} focus={focusedEq} ref={mapRef} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
