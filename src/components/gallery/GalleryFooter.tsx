
import { Link } from 'react-router-dom';

const GalleryFooter = () => {
  return (
    <footer className="py-6 border-t border-border bg-background"> {/* bg-background and border-border from theme */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground"> {/* Muted text */}
          © {new Date().getFullYear()} DumbLabs.AI. All rights reserved. {/* Changed from ShortsGen */}
        </p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* Links: Muted text, hover to primary (Cool Lilac) */}
          <Link to="/terms-of-use" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
          <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default GalleryFooter;
