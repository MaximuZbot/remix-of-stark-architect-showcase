import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Github, Mail } from "lucide-react";

/* ── Morse / Signal Line SVG ────────────────────────────────── */
const SignalLine = () => (
  <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden z-10">
    <svg
      className="w-full h-full"
      viewBox="0 0 1200 2"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Static baseline */}
      <line
        x1="0" y1="1" x2="1200" y2="1"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="2"
      />
      {/* Animated pulse that travels left-to-right */}
      <line
        x1="0" y1="1" x2="200" y2="1"
        stroke="url(#signalGrad)"
        strokeWidth="2"
        className="animate-signal-sweep"
      />
      <defs>
        <linearGradient id="signalGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

/* ── Footer Component ───────────────────────────────────────── */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // When footer is entering the viewport from below,
      // map its position to a subtle upward parallax shift (0 → -20px)
      if (rect.top < windowH && rect.bottom > 0) {
        const progress = 1 - rect.top / windowH; // 0→1 as it enters
        setParallaxY(Math.min(progress * -20, 0));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative z-20 -mt-16"
      style={{
        transform: `translateY(${parallaxY}px)`,
        willChange: "transform",
      }}
    >
      {/* ── Frosted Glass Top Edge ───────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-[1px] pointer-events-none" />

      {/* ── Upward Shadow Cast ───────────────────────────────── */}
      <div
        className="absolute -top-12 left-0 right-0 h-12 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 40%, transparent 100%)",
        }}
      />

      {/* ── Signal / Morse Line ─────────────────────────────── */}
      <SignalLine />

      {/* ── Footer Content ──────────────────────────────────── */}
      <div className="bg-[hsl(0,0%,3%)] border-t border-white/[0.06] pt-14 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-minimal text-foreground mb-4">MOHITH KANNA</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Full Product Builder — AI Systems, Web Apps,
                <br className="hidden sm:block" />
                Automation & Computer Vision.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-minimal text-foreground mb-4">QUICK LINKS</h4>
              <nav className="space-y-2">
                <Link to="/projects" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
                <Link to="/#capabilities" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Capabilities
                </Link>
                <Link to="/#about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link to="/#contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
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
                  href="mailto:mohithkanna1@gmail.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06] mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Mohith Kanna. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
