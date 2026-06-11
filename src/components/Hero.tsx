import { useState, useEffect, useRef } from "react";
import alleyAsset from "@/assets/hero-alley.png.asset.json";
import robotsAsset from "@/assets/hero-robots.png.asset.json";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const frame = useRef<number>();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const handleMove = (e: MouseEvent) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        setParallax({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  // Fade-out as the user scrolls past the fold.
  const contentOpacity = Math.max(0, 1 - scrollY / 400);

  return (
    <section className="relative w-full h-screen min-h-[640px] overflow-hidden bg-black">
      {/* LAYER 1 — Alleyway background (graffiti stays bold) */}
      <div
        className="absolute inset-0 z-10 will-change-transform"
        style={{
          transform: `translate3d(${parallax.x * -12}px, ${parallax.y * -12}px, 0) scale(1.08)`,
        }}
      >
        <img
          src={alleyAsset.url}
          alt="Industrial alleyway with graffiti wall and neon light"
          className="w-full h-full object-cover object-center"
        />
        {/* Light global wash so the graffiti reads strong on the open right side */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Neon light glow over the overhead tube */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/4 w-[34%] h-16 bg-amber-400/30 blur-2xl rounded-full" />
        <div className="absolute top-[6%] left-1/2 -translate-x-1/4 w-[44%] h-40 bg-amber-300/15 blur-3xl rounded-full" />
      </div>

      {/* LAYER 1.5 — Focused legibility scrim behind the text zone only */}
      <div className="absolute inset-0 z-[15] pointer-events-none bg-gradient-to-r from-black/90 via-black/55 to-transparent md:via-black/35" />
      {/* Mobile: extra bottom + top darkening so text never fights the scene */}
      <div className="absolute inset-0 z-[15] pointer-events-none bg-gradient-to-b from-black/70 via-transparent to-black/80 md:hidden" />

      {/* LAYER 3 — Foreground robots cutout (planted, stationary) */}
      <div className="absolute bottom-0 right-0 z-20 h-full pointer-events-none">
        <img
          src={robotsAsset.url}
          alt="Two robots and a robotic cat standing in the alleyway"
          className="h-[42%] sm:h-[55%] md:h-full w-auto object-contain object-bottom ml-auto"
        />
      </div>

      {/* LAYER 2 — Headline + description (above scrim, in front of background) */}
      <div
        className="absolute inset-0 z-30 flex items-start md:items-center pt-28 md:pt-0 will-change-transform"
        style={{
          transform: `translate3d(${parallax.x * -6}px, ${parallax.y * -6}px, 0)`,
          opacity: contentOpacity,
        }}
      >
        <div className="w-full md:w-[58%] px-6 md:px-12 lg:px-20">
          <h1 className="font-display font-extrabold uppercase text-white tracking-tighter leading-[0.92] text-[clamp(2.75rem,8vw,6rem)] [text-shadow:0_2px_30px_rgba(0,0,0,0.6)]">
            Mohith
            <br />
            Kanna
          </h1>
          <p className="mt-6 text-zinc-200 font-semibold text-base md:text-lg max-w-xl leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]">
            AI-Powered Solo Builder | Computer Vision (YOLO) | Automation &amp; App Developer
          </p>
          <p className="mt-4 text-zinc-300 text-base md:text-xl max-w-xl leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]">
            I build AI-powered software, computer vision systems, and automation tools that replace manual workflows and ship fast.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
