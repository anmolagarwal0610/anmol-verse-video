
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

const ThemeToggle = () => {
  // Assume dark mode is default, so initial state is true if no preference.
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const darkMode = savedTheme === 'dark';
      setIsDarkMode(darkMode);
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // If no saved theme, respect system preference but default to dark for this design
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark); // Set based on preference, or true if not supported
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
         // If the design is dark-first, we might not want to remove 'dark' unless explicitly light
         // For now, let's assume we always add 'dark' if it's the default.
         document.documentElement.classList.add('dark'); // Enforce dark if it's the design default
      }
    }
    // Since the new design is dark-first, ensure 'dark' class is on html if not already set
    if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true); // Sync state
    }

  }, []);

  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      // For this dark-first design, "toggling" might mean switching to a hypothetical light variant
      // or doing nothing if light mode is not fully supported/desired for this aesthetic.
      // For now, let's assume toggling removes 'dark' for a potential light mode.
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    // Removed fixed positioning, className="rounded-full p-2 text-cloud-white hover:bg-sky-blue-tint/20"
    // Toggle component itself might have internal padding, adjust if needed via its props or parent styling.
    <Toggle 
      pressed={isDarkMode} 
      onPressedChange={toggleDarkMode}
      aria-label="Toggle theme"
      className="text-cloud-white data-[state=on]:bg-sky-blue-tint/30 hover:bg-sky-blue-tint/20 rounded-full p-2"
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Toggle>
  );
};

export default ThemeToggle;
