
import React from 'react';
import Navbar from '@/components/Navbar';

export const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-16">
      {children}
    </div>
  </div>
);
