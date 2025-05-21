
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle'; // Ensure this is correctly styled by new button variants

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    // Initialize based on system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="fixed top-20 right-4 z-40">
      <Toggle 
        pressed={isDarkMode} 
        onPressedChange={toggleDarkMode}
        aria-label="Toggle theme"
        // Use ghost variant for better styling with new theme, icons will use foreground color
        className="rounded-full p-2 data-[state=on]:bg-light-cyan data-[state=on]:text-off-black data-[state=off]:text-foreground"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Toggle>
    </div>
  );
};

export default ThemeToggle;
