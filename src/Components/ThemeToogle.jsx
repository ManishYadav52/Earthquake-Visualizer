
// Simple dark/light toggle button
function ThemeToggle({ darkMode, setDarkMode }) {
    return (
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 rounded-lg bg-yellow-400 dark:bg-gray-700 text-black dark:text-white shadow"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    );
  }
  
  export default ThemeToggle;
  