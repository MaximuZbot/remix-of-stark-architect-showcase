import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { useState, useEffect } from "react";
import heroMobileImage from "@/assets/hero-mobile.webp";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate fade-out opacity (starts fading at 100px, fully faded at 400px)
  const contentOpacity = Math.max(0, 1 - scrollY / 400);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroMobileImage})`,
          backgroundPosition: 'right center',
          transform: `translateY(${scrollY * 0.3}px) scale(1.1)`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Content with Fade Effect */}
      <div 
        className="relative z-10 text-center max-w-4xl mx-auto px-6 transition-opacity duration-100"
        style={{ opacity: contentOpacity }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white text-architectural mb-4 reveal">
          MOHITH KANNA
        </h1>
        <p className="text-lg md:text-xl text-white/90 font-light tracking-wide mb-6 reveal-delayed">
          AI-Powered Solo Builder | Computer Vision (YOLO) | Automation & App Developer
        </p>
        <p className="text-base md:text-lg text-white/70 font-light max-w-2xl mx-auto mb-12 reveal-delayed">
          I build AI-powered software, computer vision systems, and automation tools that replace manual workflows and ship fast.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 reveal-delayed">
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm"
            asChild
          >
            <Link to="/projects">View Projects</Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm"
            asChild
          >
            <a href="#contact">Work With Me</a>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm"
            asChild
          >
            <a href="https://www.linkedin.com/in/mohithkanna" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </a>
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 reveal-delayed">
        <div className="w-px h-16 bg-white/40" />
        <div className="text-minimal text-white/60 mt-4 rotate-90 origin-center">
          SCROLL
        </div>
      </div>
    </section>
  );
};

export default Hero;
