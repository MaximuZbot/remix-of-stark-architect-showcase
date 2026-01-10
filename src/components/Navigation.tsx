import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

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
          <a href="#capabilities" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            CAPABILITIES
          </a>
          <a href="#about" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            ABOUT
          </a>
          <a href="#tech" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            TECH
          </a>
          <a href="#contact" className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
            CONTACT
          </a>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
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
            <a href="#capabilities" onClick={closeMenu} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              CAPABILITIES
            </a>
            <a href="#about" onClick={closeMenu} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              ABOUT
            </a>
            <a href="#tech" onClick={closeMenu} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              TECH
            </a>
            <a href="#contact" onClick={closeMenu} className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300">
              CONTACT
            </a>
            
            {/* Mobile Theme Toggle */}
            <div className="pt-4 border-t border-border">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
