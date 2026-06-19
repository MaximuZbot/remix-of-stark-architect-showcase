import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import F1Scene, { ScrollState } from "@/components/f1/F1Scene";
import { ArrowLeft, Volume2, VolumeX, Sparkles, HelpCircle } from "lucide-react";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Project Data mapping to F1 parts
const PROJECTS = [
  {
    part: "AERODYNAMICS",
    title: "Project Aero Configurator",
    tech: "React Three Fiber • WebGL",
    desc: "A custom 3D aerodynamic editor that models boundary-layer wind-tunnel airflow using custom shaders.",
    link: "/project/aero",
  },
  {
    part: "POWER UNIT",
    title: "AI Power Grid Optimizer",
    tech: "Python • PyTorch • Next.js",
    desc: "Machine learning control system predicting and balancing hybrid powertrain grid thermal metrics.",
    link: "/project/powertrain",
  },
  {
    part: "SUSPENSION & CHASSIS",
    title: "Rigid Body Physics Engine",
    tech: "TypeScript • Matter.js",
    desc: "A rigid body physics workspace simulating track tire contact forces and suspension load paths.",
    link: "/project/physics",
  },
  {
    part: "DRS WING",
    title: "Active DRS Racing Telemetry",
    tech: "Node.js • WebSockets • Canvas",
    desc: "High-speed multiplayer canvas interface showing real-time DRS opening and track speed overlays.",
    link: "/project/racing-engine",
  },
];

export const F1Experience: React.FC = () => {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);
  
  const [activeScene, setActiveScene] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

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
    explode: 0,
    blueprint: 0,
    trackGenerate: 0,
    carDrive: 0,
    speedActive: 0,
    freeze: 0,
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
    lenisRef.current = lenis;

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

      {/* Bottom Monospaced Navigation HUD */}
      <div className="fixed bottom-6 left-0 right-0 z-50 px-12 md:px-24 flex items-center justify-between font-mono text-[9px] tracking-widest text-stone-500 pointer-events-auto">
        <button
          onClick={() => {
            if (activeScene > 0 && lenisRef.current) {
              lenisRef.current.scrollTo((activeScene - 1) * window.innerHeight);
            }
          }}
          className={`flex items-center gap-2 transition-all cursor-pointer ${
            activeScene > 0 ? "hover:text-stone-900 opacity-100" : "opacity-35 cursor-not-allowed"
          }`}
          disabled={activeScene === 0}
        >
          ← PREVIOUS
        </button>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex gap-2">
            {[...Array(7)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (lenisRef.current) {
                    lenisRef.current.scrollTo(i * window.innerHeight);
                  }
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  activeScene === i ? "bg-stone-950 scale-125" : "bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
          <span className="text-[8px] font-bold text-stone-900">
            SCENE {String(activeScene + 1).padStart(2, "0")} / 07
          </span>
        </div>

        <button
          onClick={() => {
            if (activeScene < 6 && lenisRef.current) {
              lenisRef.current.scrollTo((activeScene + 1) * window.innerHeight);
            }
          }}
          className={`flex items-center gap-2 transition-all cursor-pointer ${
            activeScene < 6 ? "hover:text-stone-900 opacity-100" : "opacity-35 cursor-not-allowed"
          }`}
          disabled={activeScene === 6}
        >
          NEXT →
        </button>
      </div>



      {/* ========================================================
          SCROLLING TARGET WRAPPER
          ======================================================== */}
      <div ref={scrollWrapperRef} className="relative h-[700vh] w-full">
        
        {/* SCENE 1: Introduction */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-start pointer-events-none">
          <div
            className={`max-w-md text-left px-12 md:px-16 transition-all duration-1000 ease-out ${
              activeScene === 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200/60 bg-[#fbf9f6]/80 backdrop-blur-sm text-stone-500 text-[9px] tracking-widest uppercase font-mono mb-6 shadow-sm">
              <Sparkles size={10} className="text-amber-600" /> TECHNICAL PRESENTATION
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-normal text-stone-900 tracking-tight leading-tight">
              The Geometry of Speed
            </h1>
            <p className="mt-6 text-stone-500 font-sans text-xs tracking-widest uppercase max-w-md">
              An editorial walkthrough of the Red Bull RB20
            </p>
          </div>
        </section>
 
        {/* SCENE 2: Aerodynamics */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-start pointer-events-none">
          <div
            className={`max-w-md text-left px-12 md:px-24 transition-all duration-1000 ease-out ${
              activeScene === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 01 // AIRFLOW
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-stone-900 mt-2 mb-4">
              Front Wing & Nose
            </h2>
            <p className="text-stone-600 text-xs leading-relaxed">
              The front wing directs high-velocity air around the front wheels and channels it into the underbody tunnels. Every curve and flap angle is calibrated to minimize drag while maximizing front-end bite and downforce.
            </p>
          </div>
        </section>

        {/* SCENE 3: Wheel Technology */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-start pointer-events-none">
          <div
            className={`max-w-md text-left px-12 md:px-24 transition-all duration-1000 ease-out ${
              activeScene === 2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 02 // DYNAMICS
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-stone-900 mt-2 mb-4">
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
            className={`max-w-md text-left px-12 md:px-24 transition-all duration-1000 ease-out ${
              activeScene === 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 03 // SAFETY CELL
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-stone-900 mt-2 mb-4">
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
            className={`max-w-md text-left px-12 md:px-24 transition-all duration-1000 ease-out ${
              activeScene === 4 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 04 // PILOT POV
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-stone-900 mt-2 mb-4">
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
            className={`max-w-md text-left px-12 md:px-24 transition-all duration-1000 ease-out ${
              activeScene === 5 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT SECTION 05 // ACTIVE AERO
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-stone-900 mt-2 mb-4">
              Rear Wing & DRS
            </h2>
            <p className="text-stone-600 text-xs leading-relaxed">
              The Drag Reduction System (DRS) pivots the main rear wing flap open on straights, cutting aerodynamic drag by over 20%. When closed, the multi-element spoon wing generates massive downforce to stabilize the rear under braking.
            </p>
          </div>
        </section>

        {/* SCENE 7: Final Showcase & Editorial Portfolio */}
        <section className="sticky top-0 h-screen w-full flex items-center justify-start pointer-events-none">
          <div
            className={`max-w-md text-left px-12 md:px-16 transition-all duration-1000 ease-out ${
              activeScene === 6 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-stone-400 text-[9px] font-mono tracking-widest uppercase">
              EXHIBIT CATALOG // TECHNICAL SPECIFICATIONS
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-stone-900 mt-2 mb-6">
              Engineering Showcase
            </h2>

            {/* Specifications Specs Sheet Grid */}
            <div className="w-full max-w-[340px] border-t border-stone-200/60 pt-6 font-mono text-[9px] tracking-widest text-stone-600">
              {[
                { name: "Power Unit", value: "Honda RBPTH002 V6 Turbo Hybrid" },
                { name: "Chassis Structure", value: "Molded carbon-composite monocoque" },
                { name: "Gearbox", value: "8-Speed direct-shift, hydraulic system" },
                { name: "Total Weight", value: "798 kg (with driver and instrumentation)" },
                { name: "Active Aero", value: "DRS Flap (85mm slot gap clearance)" },
                { name: "Braking System", value: "Carbon-carbon discs with Brembo calipers" }
              ].map((spec, i) => (
                <div key={i} className="flex justify-between py-2.5 border-b border-stone-200/30">
                  <span className="uppercase text-stone-400 mr-4">{spec.name}</span>
                  <span className="text-stone-900 font-bold uppercase text-right">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Sub-footer contact details */}
            <div className="mt-10 pointer-events-auto">
              <p className="text-stone-400 text-[8px] font-mono tracking-widest uppercase">
                INTERESTED IN COLLABORATING?
              </p>
              <div className="mt-4 flex gap-4">
                <a
                  href="/#contact"
                  className="px-6 py-2 rounded-full border border-stone-950 bg-stone-900 text-white hover:bg-stone-800 text-[10px] font-mono tracking-widest uppercase transition-all shadow-sm cursor-pointer"
                >
                  Get In Touch
                </a>
                <Link
                  to="/"
                  className="px-6 py-2 rounded-full border border-stone-200 text-stone-600 hover:text-stone-900 text-[10px] font-mono tracking-widest uppercase transition-all shadow-sm"
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
