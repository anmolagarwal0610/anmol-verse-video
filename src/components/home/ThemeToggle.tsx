
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

const ThemeToggle = () => {
  // For this theme, "dark mode" is the only mode. This toggle can be a placeholder or removed.
  // If kept, it won't change visual appearance as light and dark vars are the same.
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to true as it's a dark theme

  useEffect(() => {
    // Always apply 'dark' class if it's not already there.
    // Or, better, since the theme is dark by default, this component might be redundant
    // unless it's used to switch between two *different* dark themes in the future.
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(true); // Reflect that the theme is dark
  }, []);

  const toggleDarkMode = () => {
    // This function would need to toggle between different themes if desired.
    // For now, it just toggles a state.
    // setIsDarkMode(!isDarkMode);
    // document.documentElement.classList.toggle('dark'); // This would toggle if .dark had different vars
    console.log("Theme toggle clicked, but the site is primarily dark-themed.");
  };

  return (
    <div className="fixed top-20 right-4 z-40">
      <Toggle 
        pressed={isDarkMode} 
        onPressedChange={toggleDarkMode}
        aria-label="Toggle theme"
        // Updated toggle styling for dark theme
        className="rounded-full p-2 bg-[rgba(var(--card-rgb),0.5)] border border-[rgba(var(--border),0.3)] hover:bg-[rgba(var(--card-rgb),0.8)] text-foreground"
      >
        {isDarkMode ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-foreground" />}
      </Toggle>
    </div>
  );
};

export default ThemeToggle;
