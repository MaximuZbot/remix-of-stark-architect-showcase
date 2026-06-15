import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Matter from "matter-js";
import RobotEyes from "@/components/RobotEyes";

interface PhysicsItem {
  id: string;
  label: string;
  width: number;
  height: number;
  homeX: number;
  homeY: number;
  type: "text" | "subtitle" | "description" | "button" | "badge" | "pill";
  link?: string;
  isExternal?: boolean;
}

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isSandbox, setIsSandbox] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [showMobilePrompt, setShowMobilePrompt] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const itemsRef = useRef<PhysicsItem[]>([]);
  const bodiesMapRef = useRef<Array<{ id: string; body: Matter.Body; width: number; height: number; homeX: number; homeY: number }>>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null; active: boolean; explode: boolean }>({
    x: null,
    y: null,
    active: false,
    explode: false,
  });
  const parallaxRef = useRef({ x: 0, y: 0 });
  const watermarkRef = useRef({ x: 0, y: 0 });
  const isDraggingBlobRef = useRef(false);
  const blobBodyRef = useRef<Matter.Body | null>(null);
  const blobDOMRef = useRef<HTMLDivElement>(null);
  const scrambleIntervals = useRef<Record<string, any>>({});
  const [textMap, setTextMap] = useState<Record<string, string>>({});
  const isGyroActive = useRef(false);
  const nameScrambledRef = useRef(false);

  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (!engineRef.current || !containerRef.current) return;
    const sandboxMode = containerRef.current.dataset.sandbox === "true";
    if (!sandboxMode) return;

    const { beta, gamma } = e;
    if (beta === null || gamma === null) return;

    // gamma: left/right tilt [-90, 90] -> gravity x
    // beta: front/back tilt [-180, 180] -> gravity y
    const gravX = Math.min(Math.max(gamma / 45, -1), 1) * 0.75;
    const gravY = Math.min(Math.max(beta / 45, -1), 1) * 0.75;

    engineRef.current.gravity.x = gravX;
    engineRef.current.gravity.y = gravY;
  };

  const enableTiltPhysics = (callback?: () => void) => {
    if (isGyroActive.current) {
      if (callback) callback();
      return;
    }

    if (typeof window !== "undefined" && typeof DeviceOrientationEvent !== "undefined") {
      const requestPermission = (DeviceOrientationEvent as any).requestPermission;
      if (typeof requestPermission === "function") {
        requestPermission()
          .then((response: string) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
              isGyroActive.current = true;
            }
            if (callback) callback();
          })
          .catch((err: any) => {
            console.error("Gyroscope permission error:", err);
            if (callback) callback();
          });
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
        isGyroActive.current = true;
        if (callback) callback();
      }
    } else {
      console.warn("DeviceOrientationEvent is not supported in this environment");
      if (callback) callback();
    }
  };

  const handleToggleSandbox = () => {
    const nextInteractive = !isInteractive;

    if (typeof window !== "undefined") {
      // Auto-scroll back to Hero top for clean presentation
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (nextInteractive) {
      enableTiltPhysics(() => {
        // Show full-screen calibration overlay on mobile/tablet screens
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
          setShowMobilePrompt(true);
          setTimeout(() => setShowMobilePrompt(false), 2500);
        }

        // Delay interactive physics activation on desktop if scrolled down to let scroll finish
        const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 768;
        if (!isMobileDevice && scrollY > 100) {
          setTimeout(() => {
            setIsInteractive(true);
          }, 500);
        } else {
          setIsInteractive(true);
        }
      });
    } else {
      setIsInteractive(false);
      setShowMobilePrompt(false);
      // Rebuild System: Destroy old physics bodies and recreate new ones instantly to prevent sticking/glitches
      if (engineRef.current && itemsRef.current.length > 0) {
        const { Composite, Bodies } = Matter;
        const world = engineRef.current.world;

        // 1. Remove current physics bodies from Matter world
        if (bodiesMapRef.current.length > 0) {
          Composite.remove(world, bodiesMapRef.current.map((b) => b.body));
        }

        // 2. Re-create new bodies at their exact starting positions
        const newBodies = itemsRef.current.map((item) => {
          const body = Bodies.rectangle(item.homeX, item.homeY, item.width, item.height, {
            restitution: 0.6,
            friction: 0.1,
            frictionAir: 0.02,
            label: item.id,
          });
          return { id: item.id, body, width: item.width, height: item.height, homeX: item.homeX, homeY: item.homeY };
        });

        // 3. Clear text scrambles and name scrambled ref so they can scramble again on hover
        nameScrambledRef.current = false;
        setTextMap({});

        // 4. Update the refs and add the new bodies to the world
        bodiesMapRef.current = newBodies;
        Composite.add(world, newBodies.map((b) => b.body));
      }
    }
  };

  const triggerScramble = (itemId: string, originalText: string) => {
    const item = itemsRef.current.find((it) => it.id === itemId);
    if (!item) return;
    if (item.type !== "text" && item.type !== "pill" && item.type !== "button") return;

    if (scrambleIntervals.current[itemId]) {
      clearInterval(scrambleIntervals.current[itemId]);
    }

    const chars = "!@#$%^&*()_+{}:\"<>?,./;[]=-~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let iteration = 0;

    scrambleIntervals.current[itemId] = setInterval(() => {
      setTextMap((prev) => {
        const scrambled = originalText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        return { ...prev, [itemId]: scrambled };
      });

      if (iteration >= originalText.length) {
        clearInterval(scrambleIntervals.current[itemId]);
        delete scrambleIntervals.current[itemId];
      }
      iteration += 1 / 3;
    }, 24);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update isSandbox mode automatically on scroll or interactivity toggle
  useEffect(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;
    const isMobile = width < 768;

    if (isInteractive) {
      setIsSandbox(true);
    } else {
      setIsSandbox(isMobile ? false : scrollY > 60);
    }
  }, [scrollY, isInteractive]);

  // Dynamically create/remove the Energy Blob physics body on desktop when interactive
  useEffect(() => {
    if (!engineRef.current || !containerRef.current) return;
    const world = engineRef.current.world;
    const container = containerRef.current;

    const isMobile = container.clientWidth < 768;

    if (isInteractive && !isMobile) {
      const { Composite, Bodies } = Matter;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Spawn Blob near bottom-center (where the Play button is)
      const blobRadius = 35;
      const blobBody = Bodies.circle(width / 2, height - 150, blobRadius, {
        restitution: 1.0, // High bounciness!
        friction: 0.02, // Lower friction
        frictionAir: 0.005, // Lower air resistance so it flies and bounces longer!
        label: "blob",
      });

      blobBodyRef.current = blobBody;
      Composite.add(world, blobBody);

      // Global mouseup to release Blob dragging
      const handleGlobalMouseUp = () => {
        if (isDraggingBlobRef.current) {
          isDraggingBlobRef.current = false;
          if (blobBodyRef.current) {
            Matter.Body.setStatic(blobBodyRef.current, false);
          }
        }
      };

      window.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        window.removeEventListener("mouseup", handleGlobalMouseUp);
        if (blobBodyRef.current) {
          Composite.remove(world, blobBodyRef.current);
          blobBodyRef.current = null;
        }
        isDraggingBlobRef.current = false;
      };
    }
  }, [isInteractive]);

  // Broken neon sign tube rendering helpers
  const renderFlickeringText = (text: string, flickerIndices: number[]) => {
    return text.split("").map((char, index) => {
      const isFlicker = flickerIndices.includes(index);
      let flickerClass = "";
      if (isFlicker) {
        flickerClass = index % 3 === 0 
          ? "animate-neon-flicker-slow" 
          : index % 3 === 1 
            ? "animate-neon-flicker-fast" 
            : "animate-neon-flicker-rapid";
      } else {
        flickerClass = "opacity-[0.85]";
      }
      return (
        <span 
          key={index} 
          className={`${flickerClass} transition-opacity duration-300`}
          style={{
            WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.7)",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const { Engine, World, Bodies, Body, Composite, Events, Mouse, MouseConstraint, Runner } = Matter;

    // 1. Initialize Engine & Runner
    const engine = Engine.create({
      gravity: { x: 0, y: 0 }, // Start with 0 gravity (Grid Rebuild mode)
    });
    engineRef.current = engine;

    const runner = Runner.create();
    runnerRef.current = runner;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const isMobile = width < 768;

    // 2. Define home positions based on layout
    const leftOffset = isMobile ? Math.max(16, width * 0.06) : width * 0.08;
    
    const desktopItems: PhysicsItem[] = [
      { id: "name", type: "text", label: "MOHITH KANNA", width: 900, height: 90, homeX: leftOffset + 450, homeY: height * 0.35 },
      { id: "sub", type: "subtitle", label: "AI Solo Builder // Computer Vision & Automation", width: 440, height: 40, homeX: leftOffset + 220, homeY: height * 0.48 },
      { id: "desc", type: "description", label: "I build custom computer vision pipelines (YOLO), coordinate automated business workflows, and ship full-stack applications.", width: 450, height: 65, homeX: leftOffset + 225, homeY: height * 0.59 },
      { id: "btn1", type: "button", label: "EXPLORE SYSTEMS", width: 170, height: 48, homeX: leftOffset + 85, homeY: height * 0.72, link: "/projects" },
      { id: "btn2", type: "button", label: "INITIATE CONTACT", width: 170, height: 48, homeX: leftOffset + 270, homeY: height * 0.72, link: "#contact" },
      
      // Floating Tech pills scattered on the right side
      { id: "pill1", type: "pill", label: "YOLOv8", width: 85, height: 35, homeX: width * 0.70, homeY: height * 0.30 },
      { id: "pill2", type: "pill", label: "React", width: 85, height: 35, homeX: width * 0.85, homeY: height * 0.35 },
      { id: "pill3", type: "pill", label: "TypeScript", width: 110, height: 35, homeX: width * 0.73, homeY: height * 0.44 },
      { id: "pill4", type: "pill", label: "Python", width: 90, height: 35, homeX: width * 0.86, homeY: height * 0.52 },
      { id: "pill5", type: "pill", label: "Automation", width: 120, height: 35, homeX: width * 0.70, homeY: height * 0.60 },
      { id: "pill6", type: "pill", label: "Vibe Coder", width: 115, height: 35, homeX: width * 0.82, homeY: height * 0.68 },
    ];

    // Dynamic dimensions for mobile items to prevent clipping/cutoff
    const nameWidth = width - 2 * leftOffset;
    const subWidth = width - 2 * leftOffset;
    const descWidth = width - 2 * leftOffset;
    const btnWidth = (width - 2 * leftOffset - 12) / 2;

    const mobileItems: PhysicsItem[] = [
      { id: "name", type: "text", label: "MOHITH KANNA", width: nameWidth, height: 48, homeX: leftOffset + nameWidth / 2, homeY: height * 0.18 },
      { id: "sub", type: "subtitle", label: "AI Solo Builder // Computer Vision & Automation", width: subWidth, height: 38, homeX: leftOffset + subWidth / 2, homeY: height * 0.28 },
      { id: "desc", type: "description", label: "I build custom computer vision pipelines (YOLO) and automated web systems.", width: descWidth, height: 50, homeX: leftOffset + descWidth / 2, homeY: height * 0.38 },
      { id: "btn1", type: "button", label: "EXPLORE SYSTEMS", width: btnWidth, height: 42, homeX: leftOffset + btnWidth / 2, homeY: height * 0.48, link: "/projects" },
      { id: "btn2", type: "button", label: "INITIATE CONTACT", width: btnWidth, height: 42, homeX: leftOffset + btnWidth + 12 + btnWidth / 2, homeY: height * 0.48, link: "#contact" },
      
      // Dynamic pill spacing
      { id: "pill1", type: "pill", label: "YOLOv8", width: 75, height: 32, homeX: leftOffset + 37.5, homeY: height * 0.58 },
      { id: "pill2", type: "pill", label: "React", width: 70, height: 32, homeX: leftOffset + 75 + 10 + 35, homeY: height * 0.58 },
      { id: "pill3", type: "pill", label: "TypeScript", width: 95, height: 32, homeX: leftOffset + 155 + 10 + 47.5, homeY: height * 0.58 },
      { id: "pill4", type: "pill", label: "Python", width: 80, height: 32, homeX: leftOffset + 40, homeY: height * 0.66 },
      { id: "pill5", type: "pill", label: "Automation", width: 100, height: 32, homeX: leftOffset + 80 + 10 + 50, homeY: height * 0.66 },
    ];

    const currentItems = isMobile ? mobileItems : desktopItems;
    itemsRef.current = currentItems;

    // 3. Create Rigid Bodies for items
    const bodies = currentItems.map((item) => {
      const body = Bodies.rectangle(item.homeX, item.homeY, item.width, item.height, {
        restitution: 0.6, // Bounciness
        friction: 0.1,
        frictionAir: 0.02,
        label: item.id,
      });
      return { id: item.id, body, width: item.width, height: item.height, homeX: item.homeX, homeY: item.homeY };
    });
    bodiesMapRef.current = bodies;

    // Add items to world
    Composite.add(engine.world, bodies.map((b) => b.body));

    // 4. Create Boundary Walls (Solid obstacles)
    const wallThickness = 100;
    const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true });
    const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true });
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true });

    Composite.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // 5. Mouse Constraint initialized dynamically in useEffect below based on isInteractive state

    // 6. Physics Loop - update absolute CSS transforms on DOM elements
    Events.on(engine, "afterUpdate", () => {
      const sandboxMode = (containerRef.current as any).dataset.sandbox === "true";
      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;
      const active = mouseRef.current.active && mX !== null && mY !== null;

      // Update ambient glow position & color dynamically with richer neon gradients
      const glowEl = document.getElementById("hero-ambient-glow");
      if (glowEl) {
        if (active && mX !== null && mY !== null) {
          glowEl.style.background = `radial-gradient(circle 500px at ${mX}px ${mY}px, rgba(245, 158, 11, 0.14) 0%, rgba(251, 191, 36, 0.06) 40%, rgba(139, 92, 246, 0.02) 75%, transparent 100%)`;
        } else {
          glowEl.style.background = `radial-gradient(circle 700px at 50% 50%, rgba(245, 158, 11, 0.06) 0%, rgba(251, 191, 36, 0.03) 60%, transparent 100%)`;
        }
      }

      // Smooth parallax effect for grid background and watermark
      const gridEl = document.getElementById("hero-grid-backdrop");
      if (gridEl) {
        let targetX = 0;
        let targetY = 0;
        if (active && mX !== null && mY !== null) {
          targetX = (mX - width / 2) * -0.015;
          targetY = (mY - height / 2) * -0.015;
        }
        parallaxRef.current.x += (targetX - parallaxRef.current.x) * 0.08;
        parallaxRef.current.y += (targetY - parallaxRef.current.y) * 0.08;
        gridEl.style.transform = `translate3d(${parallaxRef.current.x}px, ${parallaxRef.current.y}px, 0)`;
      }

      const watermarkEl = document.getElementById("hero-watermark-backdrop");
      if (watermarkEl) {
        let targetX = 0;
        let targetY = 0;
        if (active && mX !== null && mY !== null) {
          targetX = (mX - width / 2) * -0.007;
          targetY = (mY - height / 2) * -0.007;
        }
        watermarkRef.current.x += (targetX - watermarkRef.current.x) * 0.08;
        watermarkRef.current.y += (targetY - watermarkRef.current.y) * 0.08;
        watermarkEl.style.transform = `translate3d(${watermarkRef.current.x}px, ${watermarkRef.current.y}px, 0)`;
      }

      // Physics click scramble force
      if (mouseRef.current.explode && mX !== null && mY !== null) {
        bodiesMapRef.current.forEach((b) => {
          const dx = b.body.position.x - mX;
          const dy = b.body.position.y - mY;
          const dist = Math.hypot(dx, dy) || 1;
          
          if (dist < 220) {
            const force = (1 - dist / 220) * 0.08;
            Matter.Body.applyForce(b.body, b.body.position, {
              x: (dx / dist) * force,
              y: (dy / dist) * force,
            });
          }
        });
        mouseRef.current.explode = false;
      }

      // Dragging Blob update (Desktop Only)
      if (blobBodyRef.current && blobDOMRef.current) {
        if (isDraggingBlobRef.current && mX !== null && mY !== null) {
          Matter.Body.setPosition(blobBodyRef.current, { x: mX, y: mY });
          Matter.Body.setVelocity(blobBodyRef.current, { x: 0, y: 0 });
        }

        const bx = blobBodyRef.current.position.x - 40; // 40px visual radius (width 80)
        const by = blobBodyRef.current.position.y - 40;
        blobDOMRef.current.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
      }

      // Render loop DOM bindings - dynamic map loop
      bodiesMapRef.current.forEach((b) => {
        const el = document.getElementById(`phys-${b.id}`);
        if (!el) return;

        if (!sandboxMode) {
          // Smooth LERP back to exact home position and angle
          const targetX = b.homeX;
          const targetY = b.homeY;
          const currentX = b.body.position.x;
          const currentY = b.body.position.y;
          
          const nextX = currentX + (targetX - currentX) * 0.12;
          const nextY = currentY + (targetY - currentY) * 0.12;
          const nextAngle = b.body.angle + (0 - b.body.angle) * 0.12;
          
          Body.setPosition(b.body, { x: nextX, y: nextY });
          Body.setAngle(b.body, nextAngle);
          Body.setVelocity(b.body, { x: 0, y: 0 });
          Body.setAngularVelocity(b.body, 0);
        }

        // Map body simulation coordinates to absolute 3D DOM offsets
        const x = b.body.position.x - b.width / 2;
        const y = b.body.position.y - b.height / 2;

        // Magnifying glass lens effect: Scale items up slightly when the desktop Energy Blob is hovering over them
        let scaleStr = "";
        if (blobBodyRef.current && !isMobile) {
          const dx = b.body.position.x - blobBodyRef.current.position.x;
          const dy = b.body.position.y - blobBodyRef.current.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const activeRadius = 75; // trigger distance

          if (dist < activeRadius) {
            // Smoothly scale up to 1.18x based on proximity
            const scaleFactor = 1 + (1 - dist / activeRadius) * 0.18;
            scaleStr = ` scale(${scaleFactor})`;
            el.style.zIndex = "35"; // Elevate above other elements
          } else {
            el.style.zIndex = "20";
          }
        } else {
          el.style.zIndex = "20";
        }

        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${b.body.angle}rad)${scaleStr}`;
      });
    });

    // Run Matter.js Engine
    Runner.run(runner, engine);

    // 8. Staggered scramble on entry (only for short items)
    const entryTimeout = setTimeout(() => {
      currentItems.forEach((item, index) => {
        if (item.type === "text" || item.type === "pill" || item.type === "button") {
          // Do not scramble Mohith Kanna's name on entry (starts fully visible, only scrambles once on hover)
          if (item.id === "name") return;
          setTimeout(() => {
            triggerScramble(item.id, item.label);
          }, index * 65);
        }
      });
    }, 350);

    return () => {
      clearTimeout(entryTimeout);
      Runner.stop(runner);
      Engine.clear(engine);
      World.clear(engine.world, false);
      window.removeEventListener("deviceorientation", handleOrientation);
      Object.values(scrambleIntervals.current).forEach(clearInterval);
    };
  }, []);
  // Update DOM dataset state to share mode with Events handler performance-safe
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.dataset.sandbox = isSandbox ? "true" : "false";
      
      if (engineRef.current) {
        // Toggle gravity
        engineRef.current.gravity.y = isSandbox ? 0.75 : 0;
        if (!isSandbox) {
          engineRef.current.gravity.x = 0;
          engineRef.current.gravity.y = 0;
        }
      }
    }
  }, [isSandbox]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A" || target.tagName === "BUTTON") return;
    mouseRef.current.explode = true;
  };

  // Dynamic Scroll Calculations
  const H = typeof window !== "undefined" ? window.innerHeight : 800;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const glowStart = 60;
  const glowEnd = H * 0.45;
  const scrollFactor = Math.min(Math.max((scrollY - glowStart) / (glowEnd - glowStart), 0), 1);

  // Physics elements fade out smoothly over a wider range to prevent sudden disappearing
  const physicsFadeStart = H * 0.5;
  const physicsFadeEnd = H * 1.2;
  const contentOpacity = scrollY > physicsFadeStart
    ? Math.max(0, 1 - (scrollY - physicsFadeStart) / (physicsFadeEnd - physicsFadeStart))
    : 1;

  // Background grid/orbs and watermark stay fully visible and static
  const bgFadeOpacity = 1;
  const watermarkScrollY = 0;

  // Watermark Neon Glow styling parameters (constant opacity at bottom, no fadeout!)
  const watermarkOpacity = 0.02 + scrollFactor * 0.83; // Opacity goes 0.02 -> 0.85
  const glowRadius = scrollFactor * 16;
  const glowAlpha = scrollFactor * 0.65;

  return (
    <div className="relative w-full h-screen md:h-[260vh] bg-[#030305]">
      <style>{`
        @keyframes tilt-phone {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        .animate-tilt-phone {
          animation: tilt-phone 2.5s ease-in-out infinite;
          transform-origin: center center;
        }
        @keyframes spin-loader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-loader {
          animation: spin-loader 1.5s linear infinite;
        }
        @keyframes morph-blob {
          0%, 100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
          25% { border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; }
          50% { border-radius: 30% 70% 60% 40% / 50% 60% 40% 50%; }
          75% { border-radius: 60% 40% 30% 70% / 40% 50% 60% 50%; }
        }
        @keyframes rotate-blob {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-morph-blob {
          animation: morph-blob 6s ease-in-out infinite, rotate-blob 12s linear infinite;
        }
      `}</style>
      <section 
        ref={containerRef}
        className={`sticky top-0 w-full h-screen min-h-[640px] overflow-hidden flex items-center select-none ${
          isInteractive ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
      >
        {/* 0. Floating Ambient Mesh Gradient Orbs — warm amber palette */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block" style={{ opacity: bgFadeOpacity }}>
          <div className="absolute top-[10%] left-[15%] w-[35rem] h-[35rem] rounded-full bg-amber-500/[0.04] blur-[120px] mix-blend-screen pointer-events-none animate-float-slow z-0" />
          <div className="absolute bottom-[10%] right-[10%] w-[40rem] h-[40rem] rounded-full bg-amber-400/[0.03] blur-[150px] mix-blend-screen pointer-events-none animate-float-reverse z-0" />
          <div className="absolute top-[35%] right-[25%] w-[25rem] h-[25rem] rounded-full bg-purple-500/5 blur-[100px] mix-blend-screen pointer-events-none animate-float-slow z-0" style={{ animationDelay: "-7s" }} />
        </div>

        {/* 1. Interactive Ambient Glow */}
        <div id="hero-ambient-glow" className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 hidden md:block" style={{ opacity: bgFadeOpacity }} />

        {/* 2. Grid Backdrop lines with blueprint tick dots */}
        <div 
          id="hero-grid-backdrop"
          className="absolute inset-0 z-0 pointer-events-none hidden md:block"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px),
              linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            backgroundPosition: "center center",
            willChange: "transform",
            opacity: 0.05 * bgFadeOpacity,
          }}
        />

        {/* 3. Giant Watermark Background Text (Watermark Graffiti) with 3D Parallax & Neon Flicker */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
          <div 
            id="hero-watermark-backdrop"
            className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-4 font-display font-extrabold uppercase"
            style={{ 
              willChange: "transform, opacity",
              opacity: watermarkOpacity,
            }}
          >
            <div 
              style={{ textShadow: glowRadius > 0 ? `0 0 ${glowRadius}px rgba(255, 255, 255, ${glowAlpha})` : "none" }}
              className="text-[clamp(3.2rem,8.5vw,8rem)] tracking-wider leading-none flex justify-center"
            >
              {renderFlickeringText("Tony Stark", [0, 3, 8])}
            </div>
            <div 
              style={{ textShadow: glowRadius > 0 ? `0 0 ${glowRadius}px rgba(255, 255, 255, ${glowAlpha})` : "none" }}
              className="text-[clamp(1.9rem,5.8vw,4.8rem)] tracking-wider leading-none flex justify-center mt-2"
            >
              {renderFlickeringText("Is The First", [4, 9])}
            </div>
            <div 
              style={{ textShadow: glowRadius > 0 ? `0 0 ${glowRadius}px rgba(255, 255, 255, ${glowAlpha})` : "none" }}
              className="text-[clamp(3.2rem,8.5vw,8rem)] tracking-wider leading-none flex justify-center mt-2"
            >
              {renderFlickeringText("Vibe Coder", [0, 3, 7])}
            </div>
          </div>
        </div>

        {/* 4. Global Dark Vignette */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/80 via-transparent to-black/80"
        />

        {/* 5. Physics Sandbox DOM Elements Container */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none" 
          style={{ opacity: contentOpacity }}
        >
          {itemsRef.current.map((item) => {
            let classStyles = "";
            const currentText = textMap[item.id] || item.label;
            let innerContent = currentText;
            const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

            if (item.type === "text") {
              classStyles = "font-display font-black text-white leading-none tracking-tighter text-[clamp(1.4rem,6.8vw,1.9rem)] md:text-8xl flex items-center justify-start select-none uppercase cursor-grab active:cursor-grabbing whitespace-nowrap";
              if (isInteractive) classStyles += " animate-subtle-text-glow";
            } else if (item.type === "subtitle") {
              classStyles = "text-zinc-200 font-semibold text-[clamp(0.7rem,2.6vw,0.85rem)] md:text-base tracking-tight leading-none border-l border-zinc-800 pl-4 flex items-center select-none cursor-grab active:cursor-grabbing";
              if (isInteractive) classStyles += " animate-subtle-text-glow";
            } else if (item.type === "description") {
              classStyles = "text-zinc-400 text-[clamp(0.65rem,2.4vw,0.78rem)] leading-relaxed border-l border-zinc-800 pl-4 flex items-center select-none cursor-grab active:cursor-grabbing";
              if (isInteractive) classStyles += " animate-subtle-text-glow";
            } else if (item.type === "pill") {
              classStyles = "border border-zinc-800 bg-[#090b0c] text-zinc-300 text-xs font-medium flex items-center justify-center rounded-lg select-none hover:border-zinc-500 transition-colors cursor-grab active:cursor-grabbing";
              if (isInteractive) classStyles += " animate-subtle-glow";
            } else if (item.type === "button") {
              const isContact = item.link === "#contact";
              let btnStyles = isContact
                ? "border border-zinc-800 text-zinc-300 hover:text-white font-mono font-semibold text-[10px] md:text-xs tracking-wider uppercase rounded-lg flex items-center justify-center cursor-pointer"
                : "bg-white text-black font-mono font-semibold text-[10px] md:text-xs tracking-wider uppercase rounded-lg flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer";
              if (isInteractive) btnStyles += " animate-subtle-glow";

              // On mobile during active sandbox, make elements non-interactive so scrolling works natively
              const pointerClass = (isInteractive && isMobile) ? "pointer-events-none" : "pointer-events-auto";
              btnStyles += ` ${pointerClass}`;

              return isContact ? (
                <a
                  key={item.id}
                  id={`phys-${item.id}`}
                  href="#contact"
                  style={{
                    position: "absolute",
                    width: item.width,
                    height: item.height,
                    transformOrigin: "center center",
                    willChange: "transform",
                  }}
                  className={btnStyles}
                >
                  {currentText}
                </a>
              ) : (
                <Link
                  key={item.id}
                  id={`phys-${item.id}`}
                  to="/projects"
                  style={{
                    position: "absolute",
                    width: item.width,
                    height: item.height,
                    transformOrigin: "center center",
                    willChange: "transform",
                  }}
                  className={btnStyles}
                >
                  {currentText}
                </Link>
              );
            }

            // On mobile during active sandbox, make elements non-interactive so scrolling works natively
            const pointerClass = (isInteractive && isMobile) ? "pointer-events-none" : "pointer-events-auto";

            return (
              <div
                key={item.id}
                id={`phys-${item.id}`}
                style={{
                  position: "absolute",
                  width: item.width,
                  height: item.height,
                  transformOrigin: "center center",
                  willChange: "transform",
                }}
                className={`${classStyles} ${pointerClass}`}
                onMouseEnter={() => {
                  if (item.type === "text" || item.type === "pill" || item.type === "button") {
                    if (item.id === "name") {
                      if (!nameScrambledRef.current) {
                        nameScrambledRef.current = true;
                        triggerScramble(item.id, item.label);
                      }
                    } else {
                      triggerScramble(item.id, item.label);
                    }
                  }
                }}
              >
                {innerContent}
              </div>
            );
          })}
        {/* 5.5. Draggable Energy Blob Controller (Desktop Only) */}
        {isInteractive && !isMobile && (
          <div
            ref={blobDOMRef}
            id="phys-blob"
            onMouseDown={(e) => {
              e.preventDefault();
              isDraggingBlobRef.current = true;
              if (blobBodyRef.current) {
                Matter.Body.setStatic(blobBodyRef.current, true);
              }
            }}
            style={{
              position: "absolute",
              width: 80, // diameter
              height: 80,
              transformOrigin: "center center",
              willChange: "transform",
              zIndex: 40,
            }}
            className="cursor-grab active:cursor-grabbing flex items-center justify-center select-none pointer-events-auto"
          >
            {/* Morphing Glassmorphic Lens Layer */}
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-[12px] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18)_0%,rgba(245,158,11,0.12)_35%,transparent_75%)] shadow-[inset_0_4px_12px_rgba(255,255,255,0.2),inset_0_-4px_12px_rgba(0,0,0,0.3),0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(245,158,11,0.12)] border border-white/20 animate-morph-blob" />
            
            {/* High-tech tech circle decoration overlays (spins opposite direction) */}
            <div className="absolute w-[82%] h-[82%] rounded-full border border-white/10 border-dashed pointer-events-none" style={{ animation: "rotate-blob 12s linear infinite reverse" }} />
            
            {/* Centered static text */}
            <span className="relative z-10 font-mono text-[9px] text-zinc-300 font-bold uppercase tracking-[0.2em] select-none pointer-events-none drop-shadow-sm">
              DRAG
            </span>
          </div>
        )}
        </div>

        {/* 6. Controls: Sandbox Interactivity Trigger — z-[9999] on mobile so fallen blocks can't cover it */}
        <div 
          className="absolute bottom-24 left-6 right-6 md:left-auto md:right-10 md:bottom-10 z-[9999] md:z-30 flex items-center justify-center md:justify-start gap-4"
        >
          <button
            onClick={handleToggleSandbox}
            className={`px-5 py-3 border font-mono font-semibold text-xs tracking-wider rounded-lg uppercase transition-all duration-300 shadow-lg pointer-events-auto ${
              isInteractive
                ? "bg-amber-500 border-amber-500 text-black hover:bg-amber-600"
                : "bg-zinc-900 border-zinc-800 text-white hover:border-zinc-500"
            }`}
          >
            {isInteractive ? "[ Rebuild System ]" : "[ Play Sandbox / Interact ]"}
          </button>
        </div>

        {/* 7. Scroll Down Indicator */}
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 text-zinc-500 pointer-events-none"
          style={{ opacity: bgFadeOpacity }}
        >
          <span className="text-[9px] font-mono tracking-[0.25em] uppercase">
            {isSandbox ? "TOSS BLOCKS // SCROLL PAST TO DISCOVER" : "SCROLL TO DISCOVER"}
          </span>
          <div className="w-[1px] h-10 bg-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-zinc-500 rounded-full animate-scroll-dash" />
          </div>
        </div>
      </section>

      {/* 6.5. Mobile Calibration / Interactivity Overlay */}
      {showMobilePrompt && (
        <div 
          className="fixed inset-0 bg-[#060608]/98 z-[10000] flex flex-col items-center justify-center p-8 backdrop-blur-md w-screen h-screen"
        >
          <div className="flex flex-col items-center max-w-sm w-full text-center">
            {/* Top title */}
            <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-500 uppercase mb-12">
              [ GYRO CALIBRATION ]
            </span>

            {/* Illustration Graphic */}
            <div className="relative w-48 h-32 flex items-center justify-center mb-8">
              <svg 
                viewBox="0 0 64 64" 
                className="w-full h-full" 
                fill="none" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {/* Horizon line */}
                <line x1="8" y1="36" x2="56" y2="36" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" strokeDasharray="1 3" />
                
                {/* Tilting Phone body */}
                <g className="animate-tilt-phone">
                  <rect x="23" y="10" width="18" height="44" rx="4" fill="#060608" stroke="white" strokeWidth="1.5" />
                  {/* Speaker slot */}
                  <line x1="30" y1="14" x2="34" y2="14" stroke="white" strokeWidth="1" />
                  {/* Home indicator bar (iPhone gesture line) */}
                  <line x1="29" y1="50" x2="35" y2="50" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                </g>

                {/* Left curved arrow */}
                <path d="M 18,28 C 14,29 11,32 9,35" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
                <polyline points="13,35 9,35 10,31" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />

                {/* Right curved arrow */}
                <path d="M 46,28 C 50,29 53,32 55,35" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
                <polyline points="51,35 55,35 54,31" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
              </svg>
            </div>

            {/* Dotted separator */}
            <div className="w-16 border-t border-dotted border-zinc-800 opacity-60 mb-8" />

            {/* Main title */}
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-[0.2em] uppercase mb-4">
              TILT TO CONTROL
            </h2>

            {/* Subtitle */}
            <p className="font-mono text-[9px] tracking-[0.15em] text-zinc-400 max-w-[260px] leading-relaxed uppercase mb-16">
              Tilt your phone left and right to move the blocks
            </p>

            {/* Spinner loader */}
            <div className="mb-4">
              <svg className="w-5 h-5 animate-spin-loader text-zinc-600" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="16 38" strokeLinecap="round" />
              </svg>
            </div>

            {/* Footer text */}
            <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase animate-pulse">
              PHYSICS WILL ACTIVATE
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
