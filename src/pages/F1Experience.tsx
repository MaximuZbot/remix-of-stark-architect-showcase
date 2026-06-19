import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import F1Scene, { ScrollState } from "@/components/f1/F1Scene";
import { ArrowLeft, Volume2, VolumeX, Sparkles, HelpCircle } from "lucide-react";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Technical spec sheet is loaded directly into the final scene spec grid.

export const F1Experience: React.FC = () => {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  
  const [activeScene, setActiveScene] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

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
  });



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

    let lastTime = 0;
    function raf(time: number) {
      lenis.raf(time);
      
      // Calculate scroll speed to update engine pitch
      const dt = time - lastTime;
      if (dt > 0) {
        const speed = lenis.velocity;
        updateSynthPitch(speed);
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
            let currentScene = 0;
            let group = "none";
            
            if (p < 0.14) {
              currentScene = 0;
              group = "none";
            } else if (p < 0.28) {
              currentScene = 1;
              group = "frontWingNose";
            } else if (p < 0.42) {
              currentScene = 2;
              group = "wheels";
            } else if (p < 0.56) {
              currentScene = 3;
              group = "cockpit";
            } else if (p < 0.70) {
              currentScene = 4;
              group = "cockpit"; // Pilot view focused on steering wheel mesh
            } else if (p < 0.85) {
              currentScene = 5;
              group = "rearWing";
            } else {
              currentScene = 6;
              group = "none";
            }
            
            setActiveScene(currentScene);
            state.activeGroup = group;
          },
        },
      });

      // Segment Scroll Steps across the 700vh height
      
      // Scene 1 -> 2: Transition to Front Aero
      mainTl.to(state, {
        cameraRig: 1.0,
        carDrive: 0,
        ease: "power1.inOut",
        duration: 2,
      });

      // Scene 2 -> 3: Transition to Wheels (Apply subtle wheel spin)
      mainTl.to(state, {
        cameraRig: 2.0,
        carDrive: 1.8, // Subtle display roll speed
        ease: "power1.inOut",
        duration: 2,
      });

      // Scene 3 -> 4: Transition to Cockpit & Halo
      mainTl.to(state, {
        cameraRig: 3.0,
        carDrive: 1.8,
        ease: "power1.inOut",
        duration: 2,
      });

      // Scene 4 -> 5: Transition to Pilot View (Steering Wheel POV)
      mainTl.to(state, {
        cameraRig: 4.0,
        carDrive: 1.8,
        ease: "power1.inOut",
        duration: 2,
      });

      // Scene 5 -> 6: Transition to Rear Wing & DRS
      mainTl.to(state, {
        cameraRig: 5.0,
        carDrive: 1.8,
        ease: "power1.inOut",
        duration: 2,
      });

      // Scene 6 -> 7: Transition to Final Showcase
      mainTl.to(state, {
        cameraRig: 6.0,
        carDrive: 1.8,
        ease: "power1.inOut",
        duration: 2,
      });
    }, scrollWrapperRef);

    // Clean up
    return () => {
      ctx.revert();
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [soundEnabled]);

  return (
    <div className="relative min-h-screen bg-[#f9f8f6] text-stone-900 overflow-x-hidden select-none font-sans">
      
      {/* 3D Scene Layer */}
      <F1Scene scrollState={scrollState} />

      {/* FIXED CONTROLS OVERLAY */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 bg-[#f9f8f6]/80 backdrop-blur-md text-stone-700 hover:bg-stone-900 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex flex-col">
          <span className="text-stone-900 text-[10px] font-bold tracking-widest font-sans uppercase">
            RED BULL RB20
          </span>
          <span className="text-stone-500 text-[8px] uppercase tracking-wider font-mono">
            MUSEUM EXHIBIT
          </span>
        </div>
      </div>

      {/* Sound Controller */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 bg-[#f9f8f6]/80 backdrop-blur-md text-stone-700 hover:scale-105 transition-all cursor-pointer shadow-sm"
        title={soundEnabled ? "Mute engine purr" : "Unmute engine purr"}
      >
        {soundEnabled ? <Volume2 size={16} className="text-stone-900" /> : <VolumeX size={16} />}
      </button>

      {/* Bottom Scene Navigation / Pagination HUD */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-full max-w-2xl px-6 pointer-events-none font-mono text-[9px] tracking-widest text-[#ffffff] mix-blend-difference select-none">
        {/* Previous Button */}
        <button
          onClick={() => activeScene > 0 && scrollToScene(activeScene - 1)}
          className={`flex items-center gap-1.5 pointer-events-auto transition-opacity duration-300 ${
            activeScene > 0 ? "opacity-60 hover:opacity-100 cursor-pointer" : "opacity-0 cursor-default"
          }`}
        >
          <span>←</span> PREVIOUS
        </button>

        {/* Center Indicators */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1.5 pointer-events-auto">
            {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
              <button
                key={idx}
                onClick={() => scrollToScene(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                  activeScene === idx ? "bg-[#ffffff] scale-125" : "bg-[#ffffff]/30 hover:bg-[#ffffff]/70"
                }`}
                title={`Go to scene ${idx + 1}`}
              />
            ))}
          </div>
          <span className="uppercase text-[8px] text-[#ffffff]/60 mt-0.5 font-mono">
            SCENE 0{activeScene + 1} / 07
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={() => activeScene < 6 && scrollToScene(activeScene + 1)}
          className={`flex items-center gap-1.5 pointer-events-auto transition-opacity duration-300 ${
            activeScene < 6 ? "opacity-60 hover:opacity-100 cursor-pointer" : "opacity-0 cursor-default"
          }`}
        >
          NEXT <span>→</span>
        </button>
      </div>



      {/* ========================================================
          SCROLLING TARGET WRAPPER
          ======================================================== */}
      <div ref={scrollWrapperRef} className="relative z-20 h-[700vh] w-full">
        
        {/* SCENE 1: Introduction */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-center pointer-events-none">
          <div
            className={`max-w-3xl text-center transition-all duration-1000 ease-out mix-blend-difference text-white ${
              activeScene === 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-white/70 text-[9px] tracking-widest uppercase font-mono mb-6 shadow-sm">
              <Sparkles size={10} className="text-white/80" /> TECHNICAL PRESENTATION
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-normal text-white tracking-tight leading-tight">
              The Geometry of Speed
            </h1>
            <p className="mt-6 text-white/70 font-sans text-xs tracking-widest uppercase max-w-md mx-auto">
              An editorial walkthrough of the Red Bull RB20
            </p>
          </div>
        </section>
 
        {/* SCENE 2: Aerodynamics */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-start pointer-events-none">
          <div
            className={`max-w-md text-left px-12 md:px-24 transition-all duration-1000 ease-out mix-blend-difference text-white ${
              activeScene === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-white/50 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 01 // AIRFLOW
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-white mt-2 mb-4">
              Front Wing & Nose
            </h2>
            <p className="text-white/70 text-xs leading-relaxed">
              The front wing directs high-velocity air around the front wheels and channels it into the underbody tunnels. Every curve and flap angle is calibrated to minimize drag while maximizing front-end bite and downforce.
            </p>
          </div>
        </section>

        {/* SCENE 3: Wheel Technology */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-start pointer-events-none">
          <div
            className={`max-w-md text-left px-12 md:px-24 transition-all duration-1000 ease-out mix-blend-difference text-white ${
              activeScene === 2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-white/50 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 02 // DYNAMICS
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-white mt-2 mb-4">
              Wheel Assemblies
            </h2>
            <p className="text-white/70 text-xs leading-relaxed">
              Tires translate downforce into mechanical traction. Carbon wishbones channel suspension loads directly into the monocoque structure, while brake ducts scoop cooling air to keep carbon-composite discs in their optimal window.
            </p>
          </div>
        </section>

        {/* SCENE 4: Cockpit & Halo */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-end pointer-events-none">
          <div
            className={`max-w-md text-left px-12 md:px-24 transition-all duration-1000 ease-out mix-blend-difference text-white ${
              activeScene === 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <span className="text-white/50 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 03 // SAFETY CELL
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-white mt-2 mb-4">
              The Cockpit & Halo
            </h2>
            <p className="text-white/70 text-xs leading-relaxed">
              Designed as an extension of the driver. The titanium Halo safety structure is aerodynamically shaped to direct clean air into the engine airbox above the driver's head, protecting them from large track debris.
            </p>
          </div>
        </section>

        {/* SCENE 5: Pilot View (Steering Wheel POV) */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-start pointer-events-none">
          <div
            className={`max-w-md text-left px-12 md:px-24 transition-all duration-1000 ease-out mix-blend-difference text-white ${
              activeScene === 4 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-white/50 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 04 // PILOT POV
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-white mt-2 mb-4">
              Driver Cockpit
            </h2>
            <p className="text-white/70 text-xs leading-relaxed">
              From the driver's eye level, the steering wheel is the tactical command center. Over 30 rotary dials and buttons control engine mapping modes, entry differentials, and energy recovery, while a central LCD screen feeds critical telemetry at 220 mph.
            </p>
          </div>
        </section>

        {/* SCENE 6: Rear Section & DRS */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-end pointer-events-none">
          <div
            className={`max-w-md text-left px-12 md:px-24 transition-all duration-1000 ease-out mix-blend-difference text-white ${
              activeScene === 5 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <span className="text-white/50 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 05 // ACTIVE AERO
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-white mt-2 mb-4">
              Rear Wing & DRS
            </h2>
            <p className="text-white/70 text-xs leading-relaxed">
              The Drag Reduction System (DRS) pivots the main rear wing flap open on straights, cutting aerodynamic drag by over 20%. When closed, the multi-element spoon wing generates massive downforce to stabilize the rear under braking.
            </p>
          </div>
        </section>

        {/* SCENE 7: Final Showcase & Editorial Portfolio */}
        <section className="sticky top-0 h-screen w-full flex flex-col justify-center items-center z-30">
          <div
            className={`w-full max-w-6xl px-8 flex flex-col items-center transition-all duration-1000 ease-out ${
              activeScene === 6 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
            }`}
          >
            <div className="text-center mb-6 mix-blend-difference text-white">
              <span className="text-white/50 text-[9px] font-mono tracking-widest uppercase">
                EXHIBIT CATALOG // TECHNICAL SPECIFICATION
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-white mt-2">
                Engineering Showcase
              </h2>
              <p className="text-white/50 text-[9px] font-mono uppercase tracking-widest mt-2">
                RB20 Technical Specifications & Core Architecture
              </p>
            </div>

            {/* Minimalist Monospaced Specs Grid */}
            <div className="w-full max-w-4xl border-t border-white/20 divide-y divide-white/20 font-mono text-xs mix-blend-difference text-white mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 py-3.5 gap-4">
                <div className="flex justify-between md:justify-start gap-8 px-2">
                  <span className="text-white/50 w-32 shrink-0">POWER UNIT</span>
                  <span className="text-white/90 font-semibold text-right md:text-left">Red Bull RBPTH002 V6 Turbo Hybrid</span>
                </div>
                <div className="flex justify-between md:justify-start gap-8 px-2">
                  <span className="text-white/50 w-32 shrink-0">CHASSIS</span>
                  <span className="text-white/90 font-semibold text-right md:text-left">Carbon-Composite Monocoque</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 py-3.5 gap-4">
                <div className="flex justify-between md:justify-start gap-8 px-2">
                  <span className="text-white/50 w-32 shrink-0">MIN WEIGHT</span>
                  <span className="text-white/90 font-semibold text-right md:text-left">798 KG (with driver & ballast)</span>
                </div>
                <div className="flex justify-between md:justify-start gap-8 px-2">
                  <span className="text-white/50 w-32 shrink-0">DIMENSIONS</span>
                  <span className="text-white/90 font-semibold text-right md:text-left">5,510mm (L) × 2,000mm (W)</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 py-3.5 gap-4 border-b border-white/20">
                <div className="flex justify-between md:justify-start gap-8 px-2">
                  <span className="text-white/50 w-32 shrink-0">ACTIVE DRS</span>
                  <span className="text-white/90 font-semibold text-right md:text-left">Hydraulic Multi-Element Flap</span>
                </div>
                <div className="flex justify-between md:justify-start gap-8 px-2">
                  <span className="text-white/50 w-32 shrink-0">SUSPENSION</span>
                  <span className="text-white/90 font-semibold text-right md:text-left">Carbon Wishbone Pull/Pushrod</span>
                </div>
              </div>
            </div>

            {/* Sub-footer contact details (Not mixed-blended, so it sits cleanly on off-white or overlay bg) */}
            <div className="text-center mt-4">
              <p className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
                INTERESTED IN COLLABORATING?
              </p>
              <div className="mt-3 flex gap-4 justify-center">
                <a
                  href="/#contact"
                  className="px-6 py-2 rounded-full border border-stone-950 bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                >
                  Get In Touch
                </a>
                <Link
                  to="/"
                  className="px-6 py-2 rounded-full border border-stone-200 text-stone-600 hover:text-stone-900 bg-[#f9f8f6]/90 hover:bg-stone-50 text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                >
                  Classic Portfolio
                </Link>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
};

export default F1Experience;
