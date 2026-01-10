import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-minimal text-foreground hover:text-muted-foreground transition-colors duration-300">
          MOHITH KANNA
        </Link>
        
        <div className="flex items-center space-x-8">
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

        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
