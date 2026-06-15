import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force scroll to top on reload, and clear hash if present to prevent browser native scroll-to-id
    const handleInitialScroll = () => {
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      window.scrollTo(0, 0);
    };

    // Run immediately on mount
    handleInitialScroll();

    // Add load event listener to override browser native auto-scroll
    window.addEventListener("load", handleInitialScroll);
    
    // Fallback timer
    const timer = setTimeout(handleInitialScroll, 100);

    return () => {
      window.removeEventListener("load", handleInitialScroll);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Delay slightly to ensure the DOM has finished rendering
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToHash;
