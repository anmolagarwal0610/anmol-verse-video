
import React from 'react';
import ThemeToggle from './ThemeToggle';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import InspirationSection from './InspirationSection';
import CtaSection from './CtaSection';

const MainContent = () => {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-8 mt-12 z-10">
      <ThemeToggle />
      
      <HeroSection />
      <FeatureSection />
      <InspirationSection />
      <CtaSection />
    </main>
  );
};

export default MainContent;
