import { Link } from "react-router-dom";
import { Linkedin, Github, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-minimal text-foreground mb-4">MOHITH KANNA</h3>
            <p className="text-muted-foreground text-sm">
              AI-Powered Solo Builder specializing in computer vision, automation, and app development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-minimal text-foreground mb-4">QUICK LINKS</h4>
            <nav className="space-y-2">
              <Link to="/projects" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
              <a href="#capabilities" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Capabilities
              </a>
              <a href="#about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-minimal text-foreground mb-4">CONNECT</h4>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/mohithkanna"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/mohithkanna"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@mohithkanna.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Mohith Kanna. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
