import { useEffect, useRef } from "react";
import robotHead from "@/assets/robot-head.png.asset.json";

interface RobotEyesProps {
  className?: string;
}

const RobotEyes = ({ className = "" }: RobotEyesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let spacing = 0;
    let dotRadius = 0;
    let eyeRadius = 0;
    let pupilRadius = 0;
    let eyeSpacing = 0;

    const mouse = { x: 0, y: 0 };

    // Head sway physics
    let hX = 0, hY = 0, hvX = 0, hvY = 0;
    // Pupil physics
    let lpX = 0, lpY = 0, lpvX = 0, lpvY = 0;
    let rpX = 0, rpY = 0, rpvX = 0, rpvY = 0;

    const springStiffness = 0.05;
    const damping = 0.72;

    let blinkSquish = 1;
    let isBlinking = false;

    let rafId = 0;
    let blinkTimeout: ReturnType<typeof setTimeout> | undefined;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = canvas.width = Math.max(1, rect.width * dpr);
      height = canvas.height = Math.max(1, rect.height * dpr);

      if (mouse.x === 0) {
        mouse.x = width / 2;
        mouse.y = height / 2;
      }

      spacing = width / 44;
      dotRadius = spacing * 0.38;
      eyeRadius = width * 0.17;
      pupilRadius = eyeRadius * 0.42;
      eyeSpacing = width * 0.23;

      hX = width / 2;
      hY = height / 2;
      lpX = hX - eyeSpacing;
      lpY = hY;
      rpX = hX + eyeSpacing;
      rpY = hY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      mouse.x = (e.touches[0].clientX - rect.left) * dpr;
      mouse.y = (e.touches[0].clientY - rect.top) * dpr;
    };

    const triggerBlink = () => {
      if (isBlinking) return;
      isBlinking = true;
      const start = Date.now();
      const duration = 110;
      const doubleBlink = Math.random() < 0.25;
      const animate = () => {
        const elapsed = Date.now() - start;
        if (elapsed < duration) {
          blinkSquish = 1 - (elapsed / duration) * 0.92;
          requestAnimationFrame(animate);
        } else if (elapsed < duration * 2) {
          blinkSquish = 0.08 + ((elapsed - duration) / duration) * 0.92;
          requestAnimationFrame(animate);
        } else {
          blinkSquish = 1;
          isBlinking = false;
          if (doubleBlink) {
            blinkTimeout = setTimeout(triggerBlink, 140);
          } else {
            blinkTimeout = setTimeout(triggerBlink, Math.random() * 5000 + 3000);
          }
        }
      };
      animate();
    };

    const updatePupil = (
      eyeCX: number,
      eyeCY: number,
      curX: number,
      curY: number,
      pvX: number,
      pvY: number,
      maxPupilOffset: number
    ): [number, number, number, number] => {
      const dx = mouse.x - eyeCX;
      const dy = mouse.y - eyeCY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const targetPX = eyeCX + (dx / dist) * Math.min(dist * 0.25, maxPupilOffset);
      const targetPY = eyeCY + (dy / dist) * Math.min(dist * 0.25, maxPupilOffset);
      pvX = (pvX + (targetPX - curX) * 0.15) * 0.65;
      pvY = (pvY + (targetPY - curY) * 0.15) * 0.65;
      return [curX + pvX, curY + pvY, pvX, pvY];
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const canvasCenterX = width / 2;
      const canvasCenterY = height / 2;

      // Head sway
      const maxHeadSway = width * 0.12;
      const dxHead = mouse.x - canvasCenterX;
      const dyHead = mouse.y - canvasCenterY;
      const distHead = Math.sqrt(dxHead * dxHead + dyHead * dyHead) || 1;
      const targetHX = canvasCenterX + (dxHead / distHead) * Math.min(distHead * 0.1, maxHeadSway);
      const targetHY = canvasCenterY + (dyHead / distHead) * Math.min(distHead * 0.1, maxHeadSway);
      hvX = (hvX + (targetHX - hX) * springStiffness) * damping;
      hvY = (hvY + (targetHY - hY) * springStiffness) * damping;
      hX += hvX;
      hY += hvY;

      const leftEyeCenterX = hX - eyeSpacing;
      const rightEyeCenterX = hX + eyeSpacing;
      const eyesCenterY = hY;

      const maxPupilOffset = eyeRadius - pupilRadius - spacing * 0.5;
      [lpX, lpY, lpvX, lpvY] = updatePupil(leftEyeCenterX, eyesCenterY, lpX, lpY, lpvX, lpvY, maxPupilOffset);
      [rpX, rpY, rpvX, rpvY] = updatePupil(rightEyeCenterX, eyesCenterY, rpX, rpY, rpvX, rpvY, maxPupilOffset);

      ctx.shadowBlur = spacing * 1.5;
      ctx.shadowColor = "#00f3ff";

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          let isLeftEye = false;
          let isRightEye = false;
          let isLeftPupil = false;
          let isRightPupil = false;

          const squish = Math.max(0.01, blinkSquish);

          const dXLe = x - leftEyeCenterX;
          const dYLe = (y - eyesCenterY) / squish;
          if (dXLe * dXLe + dYLe * dYLe <= eyeRadius * eyeRadius) isLeftEye = true;

          const dXRe = x - rightEyeCenterX;
          const dYRe = (y - eyesCenterY) / squish;
          if (dXRe * dXRe + dYRe * dYRe <= eyeRadius * eyeRadius) isRightEye = true;

          const dXLp = x - lpX;
          const dYLp = y - lpY;
          if (dXLp * dXLp + dYLp * dYLp <= pupilRadius * pupilRadius) isLeftPupil = true;

          const dXRp = x - rpX;
          const dYRp = y - rpY;
          if (dXRp * dXRp + dYRp * dYRp <= pupilRadius * pupilRadius) isRightPupil = true;

          if ((isLeftEye && !isLeftPupil) || (isRightEye && !isRightPupil)) {
            ctx.fillStyle = "#26ffff";
            ctx.shadowBlur = spacing * 1.5;
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.save();
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#061314";
            ctx.beginPath();
            ctx.arc(x, y, dotRadius * 0.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    blinkTimeout = setTimeout(triggerBlink, 3000);
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      if (blinkTimeout) clearTimeout(blinkTimeout);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className={`robot-widget-container ${className}`}>
      <img src={robotHead.url} alt="Robot companion" className="robot-shell" draggable={false} />
      <canvas ref={canvasRef} className="robot-eyes-canvas" />
    </div>
  );
};

export default RobotEyes;
