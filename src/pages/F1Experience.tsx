import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import F1Scene, { ScrollState } from "@/components/f1/F1Scene";
import { Volume2, VolumeX, Sparkles, HelpCircle, Eye, EyeOff, Layers } from "lucide-react";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Technical spec sheet is loaded directly into the final scene spec grid.

export const F1Experience: React.FC = () => {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  const BACKGROUND_COLORS = useMemo(() => [
    "#f2f0eb", // Intro (Warm neutral cream)
    "#e6eff2", // Aero (Cyan wind tunnel tint)
    "#e8ebf0", // Wheels (Steel metallic tint)
    "#eceaf0", // Cockpit (Slate/safety purple tint)
    "#f0ebe8", // Pilot POV (Warm cockpit beige)
    "#ebedf2", // Rear Wing (Active blue tint)
    "#e1e6eb", // CAD Climax (Blueprint slate blue)
  ], []);

  const [activeScene, setActiveScene] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [panelHidden, setPanelHidden] = useState(false);
  const [drsActive, setDrsActive] = useState(false);
  const [viewMode, setViewMode] = useState<"auto" | "showroom" | "cad">("auto");
  const [showTipBubble, setShowTipBubble] = useState(false);
  const hasShownTipBubbleRef = useRef(false);

  useEffect(() => {
    if (activeScene === 6 && !hasShownTipBubbleRef.current) {
      hasShownTipBubbleRef.current = true;
      setShowTipBubble(true);
      const timer = setTimeout(() => {
        setShowTipBubble(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeScene]);

  const activeBgColor = (viewMode === "cad" || (viewMode === "auto" && activeScene === 6))
    ? "#e1e6eb"
    : BACKGROUND_COLORS[activeScene] || "#f2f0eb";

  const handleViewModeToggle = () => {
    const isCurrentlyCad = viewMode === "cad" || (viewMode === "auto" && activeScene === 6);
    setViewMode(isCurrentlyCad ? "showroom" : "cad");
  };

  const scrollToScene = (index: number) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(index * window.innerHeight);
    } else {
      window.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  // Sound toggles and V6 engine synth references (for soft, elegant background purr)
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc1bRef = useRef<OscillatorNode | null>(null);
  const subOscRef = useRef<OscillatorNode | null>(null);
  const turboOscRef = useRef<OscillatorNode | null>(null);
  const turboGainRef = useRef<GainNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize the shared scroll state
  const scrollState = useRef<ScrollState>({
    progress: 0,
    carDrive: 0,
    cameraRig: 0,
    mouseX: 0,
    mouseY: 0,
    activeGroup: "none",
    drsActive: false,
  });

  // Sync manual DRS toggle to scrollState ref for the 3D loop
  useEffect(() => {
    scrollState.current.drsActive = drsActive;
  }, [drsActive]);



  // Web Audio Synth for a soft, elegant background V6 hybrid purr
  const startSynth = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // 1. Gentle low-frequency combustion saw
      const osc1 = ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(62, ctx.currentTime); // Low purr

      const osc1b = ctx.createOscillator();
      osc1b.type = "triangle";
      osc1b.frequency.setValueAtTime(62.5, ctx.currentTime);

      // 2. Deep sub-harmonic exhaust note
      const subOsc = ctx.createOscillator();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(31, ctx.currentTime);

      // 3. Very subtle high-frequency turbo whistle
      const turboOsc = ctx.createOscillator();
      turboOsc.type = "sine";
      turboOsc.frequency.setValueAtTime(320, ctx.currentTime);
      const turboGain = ctx.createGain();
      turboGain.gain.setValueAtTime(0.003, ctx.currentTime);

      // 4. Low-pass filter to keep the engine sound warm and background-friendly
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      // 5. Master Gain
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0, ctx.currentTime);

      // Connections
      osc1.connect(filter);
      osc1b.connect(filter);
      subOsc.connect(filter);
      turboOsc.connect(turboGain);
      
      filter.connect(gain);
      turboGain.connect(gain);
      gain.connect(ctx.destination);

      // Start
      osc1.start();
      osc1b.start();
      subOsc.start();
      turboOsc.start();

      // Store refs
      osc1Ref.current = osc1;
      osc1bRef.current = osc1b;
      subOscRef.current = subOsc;
      turboOscRef.current = turboOsc;
      turboGainRef.current = turboGain;
      gainNodeRef.current = gain;

      // Soft fade-in
      gain.gain.setTargetAtTime(0.04, ctx.currentTime, 0.5);
    } catch (e) {
      console.warn("Synth initialization failed", e);
    }
  };

  const stopSynth = () => {
    try {
      if (osc1Ref.current) { osc1Ref.current.stop(); osc1Ref.current = null; }
      if (osc1bRef.current) { osc1bRef.current.stop(); osc1bRef.current = null; }
      if (subOscRef.current) { subOscRef.current.stop(); subOscRef.current = null; }
      if (turboOscRef.current) { turboOscRef.current.stop(); turboOscRef.current = null; }
    } catch (e) {}
    turboGainRef.current = null;
    gainNodeRef.current = null;
  };

  // Keep engine sound soft and reactive to scroll speed
  const updateSynthPitch = (scrollSpeed: number) => {
    if (!gainNodeRef.current || !osc1Ref.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Scale pitch slightly with scrolling activity
    const pitchFactor = Math.min(1.0, Math.abs(scrollSpeed) * 0.05);
    const targetFreq = 62 + pitchFactor * 35;
    
    osc1Ref.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.1);
    if (osc1bRef.current) osc1bRef.current.frequency.setTargetAtTime(targetFreq + 0.5, ctx.currentTime, 0.1);
    if (subOscRef.current) subOscRef.current.frequency.setTargetAtTime(targetFreq * 0.5, ctx.currentTime, 0.1);
    if (turboOscRef.current) turboOscRef.current.frequency.setTargetAtTime(targetFreq * 5, ctx.currentTime, 0.08);
  };

  useEffect(() => {
    if (soundEnabled) {
      startSynth();
    } else {
      stopSynth();
    }
    return () => stopSynth();
  }, [soundEnabled]);

  useEffect(() => {
    // 1. Initialize Lenis smooth scroll (automotive glide physics)
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.95,
      infinite: false,
    });

    let destroyed = false;
    let lastTime = 0;
    function raf(time: number) {
      if (destroyed) return;
      lenis.raf(time);
      
      // Calculate scroll speed to update engine pitch and vignette intensity
      const dt = time - lastTime;
      if (dt > 0) {
        const speed = lenis.velocity;
        updateSynthPitch(speed);

        // Dynamic G-Force vignette speed warp
        if (vignetteRef.current) {
          const velocity = Math.abs(speed);
          const intensity = Math.min(0.35, velocity * 0.08); // Darken up to 35%
          const scale = 1.0 + Math.min(0.04, velocity * 0.015); // Zoom up to 4%
          
          vignetteRef.current.style.background = `radial-gradient(circle, transparent ${82 - intensity * 60}%, rgba(0,0,0,${intensity * 0.42}) 150%)`;
          vignetteRef.current.style.transform = `scale(${scale})`;
        }
      }
      lastTime = time;
      
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    lenisRef.current = lenis;

    // 2. Track mouse position for subtle camera parallax
    const handleMouseMove = (e: MouseEvent) => {
      scrollState.current.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.current.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 3. Construct GSAP ScrollTrigger timeline
    const ctx = gsap.context(() => {
      const state = scrollState.current;

      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollWrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5, // Easing scrub delay
          onUpdate: (self) => {
            const p = self.progress;
            state.progress = p;
            setScrollProgress(p);
            
            // Set active scene index and activeGroup name based on scroll progress
            const segment = 1 / 7;
            let currentScene = 0;
            let group = "none";
            
            if (p < segment) {
              currentScene = 0;
              group = "none";
            } else if (p < segment * 2) {
              currentScene = 1;
              group = "frontWingNose";
            } else if (p < segment * 3) {
              currentScene = 2;
              group = "wheels";
            } else if (p < segment * 4) {
              currentScene = 3;
              group = "cockpit";
            } else if (p < segment * 5) {
              currentScene = 4;
              group = "cockpit"; // Pilot view focused on steering wheel mesh
            } else if (p < segment * 6) {
              currentScene = 5;
              group = "rearWing";
            } else {
              currentScene = 6;
              group = "none";
            }
            
            setActiveScene((prev) => {
              if (prev !== currentScene) {
                setViewMode("auto");
              }
              return currentScene;
            });
            state.activeGroup = group;
          },
        },
      });

      // Segment Scroll Steps across the 700vh height
      
      // Scene 1 -> 2: Transition to Front Aero (Wheels begin turning slowly)
      mainTl.to(state, {
        cameraRig: 1.0,
        carDrive: 0.8,
        ease: "power1.inOut",
        duration: 2,
      });

      // Scene 2 -> 3: Transition to Wheels (Fully rotating)
      mainTl.to(state, {
        cameraRig: 2.0,
        carDrive: 2.5,
        ease: "power1.inOut",
        duration: 2,
      });

      // Scene 3 -> 4: Transition to Cockpit & Halo (Rotating fast)
      mainTl.to(state, {
        cameraRig: 3.0,
        carDrive: 3.5,
        ease: "power1.inOut",
        duration: 2,
      });

      // Scene 4 -> 5: Transition to Pilot View (Rotating faster)
      mainTl.to(state, {
        cameraRig: 4.0,
        carDrive: 4.5,
        ease: "power1.inOut",
        duration: 2,
      });

      // Scene 5 -> 6: Transition to Rear Wing & DRS (Rotating very fast)
      mainTl.to(state, {
        cameraRig: 5.0,
        carDrive: 5.5,
        ease: "power1.inOut",
        duration: 2,
      });

      // Scene 6 -> 7: Transition to Wind Tunnel / CAD Climax
      mainTl.to(state, {
        cameraRig: 6.0,
        carDrive: -1.8,
        ease: "power1.inOut",
        duration: 2,
      });
    }, scrollWrapperRef);

    // Clean up
    return () => {
      destroyed = true;
      ctx.revert();
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [soundEnabled]);

  return (
    <div className="relative min-h-screen bg-[#f2f0eb] text-stone-900 overflow-x-hidden select-none font-sans">
      
      {/* 3D Scene Layer */}
      <F1Scene scrollState={scrollState} viewMode={viewMode} bgColor={activeBgColor} />

      {/* Dynamic Speed G-Force Vignette Overlay */}
      <div 
        ref={vignetteRef}
        className="fixed inset-0 z-[12] pointer-events-none transition-all duration-300 ease-out"
        style={{
          background: "radial-gradient(circle, transparent 80%, rgba(0,0,0,0) 150%)",
          transform: "scale(1.0)"
        }}
      />

      {/* Small Right-aligned Footer Watermark (Only visible in Scene 7) */}
      <div 
        className={`fixed bottom-8 right-8 z-[25] pointer-events-none select-none font-display font-extrabold uppercase tracking-widest transition-all duration-1000 ease-out ${
          activeScene === 6
            ? "opacity-80 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <span className="text-[10px] text-stone-450 font-mono tracking-widest mr-2">CHASSIS //</span>
        <span className="text-base text-stone-900 tracking-widest">RB20</span>
      </div>

      {/* FIXED CONTROLS OVERLAY */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-stone-900 text-[10px] font-bold tracking-widest font-sans uppercase">
            RED BULL RB20
          </span>
          <span className="text-stone-500 text-[8px] uppercase tracking-wider font-mono">
            MUSEUM EXHIBIT
          </span>
        </div>
      </div>

      {/* RIGHT SIDE CONTROLS OVERLAY */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {/* CAD Mode Toggle Button with Tooltip and Speech Bubble Prompt */}
        <div className="relative group flex flex-col items-center">
          <button
            onClick={handleViewModeToggle}
            className={`flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 bg-[#f2f0eb]/80 backdrop-blur-md text-stone-700 hover:scale-105 transition-all cursor-pointer shadow-sm ${
              (viewMode === "cad" || (viewMode === "auto" && activeScene === 6)) ? "border-amber-500 text-amber-600 bg-amber-50/50" : ""
            }`}
            title="Switch car view style"
          >
            <Layers size={16} className={(viewMode === "cad" || (viewMode === "auto" && activeScene === 6)) ? "text-amber-600 animate-pulse" : ""} />
          </button>
          
          {/* Hovering prompt for discoverability */}
          <div className="absolute top-12 right-0 bg-stone-900/90 text-[8px] text-[#fbf9f6] px-2.5 py-1.5 rounded-lg shadow-md whitespace-nowrap font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none uppercase">
            Click to switch Showroom / CAD Blueprint view
          </div>

          {/* Timed Speech Bubble Popup at Scene 7 (Premium Glassmorphic Redesign) */}
          <div
            className={`absolute top-14 right-0 bg-[#fbf9f6]/95 text-stone-700 text-[9px] font-mono tracking-wider px-3.5 py-2.5 rounded-xl shadow-md border border-stone-200/50 backdrop-blur-md whitespace-nowrap transition-all duration-500 ease-out pointer-events-none uppercase after:content-[''] after:absolute after:bottom-full after:right-4 after:border-[6px] after:border-transparent after:border-b-[#fbf9f6]/95 ${
              showTipBubble
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-2 scale-90 pointer-events-none"
            }`}
          >
            <span className="text-amber-600 font-bold font-sans mr-1 animate-pulse">★</span> Switch Showroom / CAD views here!
          </div>
        </div>

        {/* Narrative Info Overlay Toggle */}
        <button
          onClick={() => setPanelHidden(!panelHidden)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 bg-[#f2f0eb]/80 backdrop-blur-md text-stone-700 hover:scale-105 transition-all cursor-pointer shadow-sm"
          title={panelHidden ? "Show details" : "Hide details"}
        >
          {panelHidden ? <Eye size={16} className="text-stone-900" /> : <EyeOff size={16} />}
        </button>

        {/* Sound Controller */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 bg-[#f2f0eb]/80 backdrop-blur-md text-stone-700 hover:scale-105 transition-all cursor-pointer shadow-sm"
          title={soundEnabled ? "Mute engine purr" : "Unmute engine purr"}
        >
          {soundEnabled ? <Volume2 size={16} className="text-stone-900" /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Bottom Scene Navigation / Pagination HUD Capsule */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[90%] max-w-lg px-5 py-2.5 bg-[#fbf9f6]/95 border border-stone-200/50 shadow-md backdrop-blur-md rounded-full font-mono text-[9px] tracking-widest text-stone-700 select-none pointer-events-auto">
        {/* Previous Button */}
        <button
          onClick={() => activeScene > 0 && scrollToScene(activeScene - 1)}
          className={`flex items-center gap-1.5 transition-opacity duration-300 ${
            activeScene > 0 ? "opacity-60 hover:opacity-100 cursor-pointer" : "opacity-0 cursor-default pointer-events-none"
          }`}
        >
          <span>←</span> PREVIOUS
        </button>

        {/* Center Indicators */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
              <button
                key={idx}
                onClick={() => scrollToScene(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                  activeScene === idx ? "bg-stone-900 scale-125" : "bg-stone-300 hover:bg-stone-450"
                }`}
                title={`Go to scene ${idx + 1}`}
              />
            ))}
          </div>
          <span className="uppercase text-[8px] text-stone-500 mt-0.5 font-mono">
            SCENE 0{activeScene + 1} / 07
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={() => activeScene < 6 && scrollToScene(activeScene + 1)}
          className={`flex items-center gap-1.5 transition-opacity duration-300 ${
            activeScene < 6 ? "opacity-60 hover:opacity-100 cursor-pointer" : "opacity-0 cursor-default pointer-events-none"
          }`}
        >
          NEXT <span>→</span>
        </button>
      </div>



      {/* ========================================================
          SCROLLING TARGET WRAPPER
          ======================================================== */}
      <div ref={scrollWrapperRef} className="relative z-20 h-[700vh] w-full">
        
        {/* SCENE 1: Introduction (Editorial Left-Aligned Layout) */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-start pointer-events-none">
          <div
            className={`max-w-xl p-8 mx-6 md:mx-24 transition-all duration-1000 ease-out pointer-events-auto ${
              activeScene === 0 && !panelHidden
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 -translate-x-12 scale-95 pointer-events-none"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-250/30 bg-[#fbf9f6]/50 backdrop-blur-md text-stone-500 text-[9px] tracking-widest uppercase font-mono mb-6 shadow-sm">
              <Sparkles size={10} className="text-amber-600" /> EXHIBIT PRESENTATION
            </div>
            
            <h1 className="text-6xl md:text-8xl font-foldit font-bold text-stone-900 tracking-tighter leading-[0.8] uppercase">
              Geometry<br />
              <span className="font-sans font-light italic text-amber-700 lowercase tracking-normal">of speed</span>
            </h1>
            
            <p className="mt-6 text-stone-500 font-sans text-[11px] leading-relaxed tracking-wider max-w-xs uppercase">
              An editorial walkthrough of the Red Bull RB20. Every curve, duct, and carbon surface engineered for absolute performance.
            </p>
            
            <div className="mt-8 text-stone-450 text-[9px] font-mono tracking-widest uppercase">
              CREATIVE DIRECTION // DESIGN STUDIO
            </div>
            
            {/* Horizontal Links at the bottom left */}
            <div className="mt-12 flex gap-6 text-[8px] font-mono tracking-widest text-stone-400 uppercase">
              <a href="#behance" className="hover:text-stone-900 transition-colors">BEHANCE</a>
              <span>//</span>
              <a href="#instagram" className="hover:text-stone-900 transition-colors">INSTAGRAM</a>
              <span>//</span>
              <a href="#linkedin" className="hover:text-stone-900 transition-colors">LINKEDIN</a>
            </div>
            
            <p className="mt-4 text-[7px] font-mono tracking-wider text-stone-400 uppercase">
              Tip: Click the 3-stack layers icon at the top-right to toggle CAD blueprint
            </p>
          </div>
          
          {/* Faint Telemetry on bottom right */}
          <div
            className={`absolute bottom-24 right-12 text-right hidden md:block transition-all duration-1000 ${
              activeScene === 0 && !panelHidden ? "opacity-40" : "opacity-0"
            }`}
          >
            <span className="text-stone-755 text-[9px] font-mono tracking-widest block uppercase">
              MODEL: RED BULL RB20
            </span>
            <span className="text-stone-500 text-[8px] font-mono tracking-wider block mt-1">
              45.0311° N, 14.2810° E // TELEMETRY OK
            </span>
          </div>
        </section>
 
        {/* SCENE 2: Aerodynamics (Editorial Left-Aligned Cardless) */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-start pointer-events-none">
          <div
            className={`max-w-sm text-left p-6 mx-12 md:mx-24 transition-all duration-1000 ease-out relative pointer-events-auto ${
              activeScene === 1 && !panelHidden
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 -translate-x-12 scale-95 pointer-events-none"
            }`}
          >
            <button
              onClick={() => setPanelHidden(true)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer pointer-events-auto"
              title="Hide description"
            >
              <EyeOff size={12} />
            </button>
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 01 // AIRFLOW
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-stone-900 mt-2 mb-4 leading-none uppercase">
              Front Wing<br />
              <span className="font-normal italic text-stone-700 lowercase">& nose</span>
            </h2>
            <p className="text-stone-600 text-xs leading-relaxed max-w-xs mt-2">
              The front wing directs high-velocity air around the front wheels and channels it into the underbody tunnels. Every curve and flap angle is calibrated to minimize drag while maximizing front-end bite and downforce.
            </p>
          </div>
        </section>

        {/* SCENE 3: Wheel Technology */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-start pointer-events-none">
          <div
            className={`max-w-sm text-left p-6 mx-12 md:mx-24 bg-[#fbf9f6]/85 border border-stone-200/40 backdrop-blur-lg rounded-2xl shadow-lg transition-all duration-1000 ease-out relative pointer-events-auto ${
              activeScene === 2 && !panelHidden
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 -translate-x-10 scale-95 pointer-events-none"
            }`}
          >
            <button
              onClick={() => setPanelHidden(true)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer pointer-events-auto"
              title="Hide description"
            >
              <EyeOff size={12} />
            </button>
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 02 // DYNAMICS
            </span>
            <h2 className="text-3xl font-serif font-normal text-stone-900 mt-2 mb-3">
              Wheel Assemblies
            </h2>
            <p className="text-stone-600 text-xs leading-relaxed">
              Tires translate downforce into mechanical traction. Carbon wishbones channel suspension loads directly into the monocoque structure, while brake ducts scoop cooling air to keep carbon-composite discs in their optimal window.
            </p>
          </div>
        </section>

        {/* SCENE 4: Cockpit & Halo */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-end pointer-events-none">
          <div
            className={`max-w-sm text-left p-6 mx-12 md:mx-24 bg-[#fbf9f6]/85 border border-stone-200/40 backdrop-blur-lg rounded-2xl shadow-lg transition-all duration-1000 ease-out relative pointer-events-auto ${
              activeScene === 3 && !panelHidden
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-10 scale-95 pointer-events-none"
            }`}
          >
            <button
              onClick={() => setPanelHidden(true)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer pointer-events-auto"
              title="Hide description"
            >
              <EyeOff size={12} />
            </button>
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 03 // SAFETY CELL
            </span>
            <h2 className="text-3xl font-serif font-normal text-stone-900 mt-2 mb-3">
              The Cockpit & Halo
            </h2>
            <p className="text-stone-600 text-xs leading-relaxed">
              Designed as an extension of the driver. The titanium Halo safety structure is aerodynamically shaped to direct clean air into the engine airbox above the driver's head, protecting them from large track debris.
            </p>
          </div>
        </section>

        {/* SCENE 5: Pilot View (Steering Wheel POV) */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-start pointer-events-none">
          <div
            className={`max-w-sm text-left p-6 mx-12 md:mx-24 bg-[#fbf9f6]/85 border border-stone-200/40 backdrop-blur-lg rounded-2xl shadow-lg transition-all duration-1000 ease-out relative pointer-events-auto ${
              activeScene === 4 && !panelHidden
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 -translate-x-10 scale-95 pointer-events-none"
            }`}
          >
            <button
              onClick={() => setPanelHidden(true)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer pointer-events-auto"
              title="Hide description"
            >
              <EyeOff size={12} />
            </button>
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 04 // PILOT POV
            </span>
            <h2 className="text-3xl font-serif font-normal text-stone-900 mt-2 mb-3">
              Driver Cockpit
            </h2>
            <p className="text-stone-600 text-xs leading-relaxed">
              From the driver's eye level, the steering wheel is the tactical command center. Over 30 rotary dials and buttons control engine mapping modes, entry differentials, and energy recovery, while a central LCD screen feeds critical telemetry at 220 mph.
            </p>
          </div>
        </section>

        {/* SCENE 6: Rear Section & DRS */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-end pointer-events-none">
          <div
            className={`max-w-sm text-left p-6 mx-12 md:mx-24 bg-[#fbf9f6]/85 border border-stone-200/40 backdrop-blur-lg rounded-2xl shadow-lg transition-all duration-1000 ease-out relative pointer-events-auto ${
              activeScene === 5 && !panelHidden
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-10 scale-95 pointer-events-none"
            }`}
          >
            <button
              onClick={() => setPanelHidden(true)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer pointer-events-auto"
              title="Hide description"
            >
              <EyeOff size={12} />
            </button>
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 05 // ACTIVE AERO
            </span>
            <h2 className="text-3xl font-serif font-normal text-stone-900 mt-2 mb-3">
              Rear Wing & DRS
            </h2>
            <p className="text-stone-600 text-xs leading-relaxed">
              The Drag Reduction System (DRS) pivots the main rear wing flap open on straights, cutting aerodynamic drag by over 20%. When closed, the multi-element spoon wing generates massive downforce to stabilize the rear under braking.
            </p>

            {/* Interactive DRS Toggle */}
            <div className="mt-4 pt-2 border-t border-stone-200/60 flex items-center gap-2">
              <button
                onClick={() => setDrsActive(!drsActive)}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-wider transition-all duration-300 cursor-pointer pointer-events-auto ${
                  drsActive
                    ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                    : "bg-white/80 text-stone-700 border-stone-200 hover:bg-stone-55"
                }`}
              >
                DRS WING: {drsActive ? "OPEN (ACTIVE)" : "CLOSED (INACTIVE)"}
              </button>
            </div>
          </div>
        </section>
        <section className="sticky top-0 h-screen w-full flex items-center justify-between px-6 md:px-24 z-30 pointer-events-none">
          
          {/* Left Column: Description & Actions */}
          <div
            className={`max-w-sm text-left transition-all duration-1000 ease-out pointer-events-auto ${
              activeScene === 6 && !panelHidden
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 -translate-x-12 scale-95 pointer-events-none"
            }`}
          >
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT CATALOG // SPECIFICATIONS
            </span>
            <h2 className="text-5xl md:text-7xl font-serif font-light text-stone-900 mt-2 mb-4 leading-none uppercase">
              Technical<br />
              <span className="font-normal italic text-stone-700 lowercase">presence</span>
            </h2>
            <p className="text-stone-600 text-xs leading-relaxed max-w-xs mt-2 font-sans">
              The final CAD wireframe climax exposes the underlying geometry of the RB20. An intricate structural mesh designed for absolute wind tunnel efficiency.
            </p>
            
            <p className="text-[8px] font-mono text-amber-705/80 mt-4 uppercase animate-pulse flex items-center gap-1.5 pointer-events-auto">
              <HelpCircle size={10} /> Tip: Click the 3-stack layers icon at the top-right to toggle showroom livery
            </p>
            
            {/* Sub-footer contact details */}
            <div className="mt-8 pt-4 border-t border-stone-350/40 max-w-xs">
              <p className="text-stone-450 text-[8px] font-mono tracking-widest uppercase">
                INTERESTED IN COLLABORATING?
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:mohithkanna1@gmail.com"
                  className="px-5 py-2 text-center rounded-full border border-stone-950 bg-stone-900 text-white hover:bg-stone-800 text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer w-full"
                >
                  Get In Touch
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Specs Grid */}
          <div
            className={`w-full max-w-md p-6 bg-[#fbf9f6]/45 border border-stone-200/20 backdrop-blur-md rounded-2xl shadow-sm transition-all duration-1000 ease-out pointer-events-auto ${
              activeScene === 6 && !panelHidden
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-12 scale-95 pointer-events-none"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-stone-400 text-[8px] font-mono tracking-widest uppercase">
                RB20 CORE ARCHITECTURE
              </span>
              <button
                onClick={() => setPanelHidden(true)}
                className="text-stone-400 hover:text-stone-950 transition-colors cursor-pointer"
                title="Hide specs"
              >
                <EyeOff size={12} />
              </button>
            </div>

            {/* Minimalist Monospaced Specs rows */}
            <div className="border-t border-stone-350/30 divide-y divide-stone-350/30 font-mono text-[10px] text-stone-850">
              <div className="flex justify-between py-2.5 px-1">
                <span className="text-stone-400 uppercase">POWER UNIT</span>
                <span className="text-stone-900 font-semibold text-right">RBPTH002 V6 Turbo Hybrid</span>
              </div>
              <div className="flex justify-between py-2.5 px-1">
                <span className="text-stone-400 uppercase">CHASSIS</span>
                <span className="text-stone-900 font-semibold text-right">Carbon-Composite Monocoque</span>
              </div>
              <div className="flex justify-between py-2.5 px-1">
                <span className="text-stone-400 uppercase">MIN WEIGHT</span>
                <span className="text-stone-900 font-semibold text-right">798 KG (with driver)</span>
              </div>
              <div className="flex justify-between py-2.5 px-1">
                <span className="text-stone-400 uppercase">DIMENSIONS</span>
                <span className="text-stone-900 font-semibold text-right">5.51m (L) × 2.00m (W)</span>
              </div>
              <div className="flex justify-between py-2.5 px-1">
                <span className="text-stone-400 uppercase">ACTIVE DRS</span>
                <span className="text-stone-900 font-semibold text-right">Hydraulic Slot Flap</span>
              </div>
              <div className="flex justify-between py-2.5 px-1">
                <span className="text-stone-400 uppercase">SUSPENSION</span>
                <span className="text-stone-900 font-semibold text-right">Wishbone Pull/Pushrod</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default F1Experience;
