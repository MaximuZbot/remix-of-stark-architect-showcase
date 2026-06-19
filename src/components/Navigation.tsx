import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-minimal text-foreground hover:text-muted-foreground transition-colors duration-300">
          MOHITH KANNA
        </Link>
        
        <div className="hidden md:flex items-center space-x-12">
          <Link to="/projects" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            PROJECTS
          </Link>
          <div className="text-minimal text-muted-foreground/50 font-semibold tracking-wider flex items-center gap-1.5 cursor-not-allowed select-none" title="Coming Soon">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></span>
            🏎️ F1 3D (COMING SOON)
          </div>
          <Link to="/#capabilities" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            CAPABILITIES
          </Link>
          <Link to="/#about" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            ABOUT
          </Link>
          <Link to="/#tech" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            TECH
          </Link>
          <Link to="/#contact" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            CONTACT
          </Link>
        </div>

        <div className="hidden md:block w-[40px]">
          {/* Spacing alignment helper instead of toggle */}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-6 py-6 space-y-4">
            <Link to="/projects" onClick={closeMenu} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              PROJECTS
            </Link>
            <div className="block text-minimal text-muted-foreground/50 font-semibold cursor-not-allowed select-none" title="Coming Soon">
              🏎️ F1 3D EXPERIENCE (COMING SOON)
            </div>
            <Link to="/#capabilities" onClick={closeMenu} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              CAPABILITIES
            </Link>
            <Link to="/#about" onClick={closeMenu} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              ABOUT
            </Link>
            <Link to="/#tech" onClick={closeMenu} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              TECH
            </Link>
            <Link to="/#contact" onClick={closeMenu} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              CONTACT
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
