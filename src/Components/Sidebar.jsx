// Sidebar shows a list of earthquakes; clicking focuses the map
function Sidebar({ earthquakes, onSelect }) {
  const isLoading = !earthquakes || earthquakes.length === 0;

  return (
    <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur p-4 rounded-2xl shadow-lg overflow-y-auto h-[85vh] w-full md:w-96 border border-black/5 dark:border-white/10">
      <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
        Recent Earthquakes
      </h2>

      {isLoading ? (
        <ul className="space-y-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <li key={idx} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse">
              <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
              <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
              <div className="h-2 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-2">
          {earthquakes.slice(0, 20).map((eq) => (
            <li
              key={eq.id}
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 text-sm text-gray-900 dark:text-gray-100 border border-black/5 dark:border-white/10 hover:border-emerald-400/60 hover:shadow transition cursor-pointer"
              onClick={() => onSelect && onSelect(eq)}
            >
              <p className="font-semibold leading-snug line-clamp-2">{eq.properties.place}</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(eq.properties.time).toLocaleString()}
                </p>
                <p className="text-xs">
                  Mag: {" "}
                  <span
                    className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-md font-bold ${
                      eq.properties.mag >= 6
                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                        : eq.properties.mag >= 4
                        ? "bg-orange-400/10 text-orange-500"
                        : "bg-yellow-400/10 text-yellow-600"
                    }`}
                  >
                    {eq.properties.mag}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Sidebar;
