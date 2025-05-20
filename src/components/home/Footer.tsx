
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const Footer = () => {
  return (
    <footer className="py-8 border-t border-indigo-100 dark:border-indigo-900/30">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700 mr-2">
            DumbLabs.AI
          </span>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
