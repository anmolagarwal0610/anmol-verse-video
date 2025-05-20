
import { Link } from 'react-router-dom';

const GalleryFooter = () => {
  return (
    <footer className="py-6 border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ShortsGen. All rights reserved.
        </p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
          <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default GalleryFooter;

