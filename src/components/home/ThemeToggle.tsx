
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="fixed top-20 right-4 z-40">
      <Toggle 
        pressed={isDarkMode} 
        onPressedChange={toggleDarkMode}
        aria-label="Toggle dark mode"
        className="rounded-full p-2"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Toggle>
    </div>
  );
};

export default ThemeToggle;
