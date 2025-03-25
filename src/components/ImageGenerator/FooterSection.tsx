
const FooterSection = () => {
  return (
    <footer className="py-6 border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AnmolVerse. All rights reserved.
        </p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
