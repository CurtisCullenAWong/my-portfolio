import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseOpacity: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Nebula {
  x: number;
  y: number;
  z: number;
  color1: string;
  color2: string;
  r: number;
}

interface ShootingStar {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  speed: number;
  length: number;
  opacity: number;
}

interface ConstellationLine {
  starA: number;
  starB: number;
}

export function UniverseParallax() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 3D projection parameters
    const fov = 350;

    // Generate stars
    const starCount = 350;
    const stars: Star[] = [];
    const colors = [
      "rgba(232, 230, 227, ", // Warm white `#e8e6e3`
      "rgba(165, 180, 252, ", // Light Indigo-200
      "rgba(196, 181, 253, ", // Light Purple-300
      "rgba(147, 197, 253, ", // Light Blue-300
      "rgba(253, 244, 215, ", // Light Amber-100
    ];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        // Distribute stars in a wide 3D space
        x: (Math.random() - 0.5) * width * 3,
        y: (Math.random() - 0.5) * height * 3,
        z: Math.random() * 900 + 100, // 100 to 1000 depth
        size: Math.random() * 1.5 + 0.5,
        baseOpacity: Math.random() * 0.6 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Precalculate constellations for the first 60 stars
    const constellationCount = 60;
    const constellationLines: ConstellationLine[] = [];
    const maxConnectionDist = 250;

    for (let i = 0; i < constellationCount; i++) {
      for (let j = i + 1; j < constellationCount; j++) {
        const s1 = stars[i];
        const s2 = stars[j];
        
        // 3D distance check
        const dx = s1.x - s2.x;
        const dy = s1.y - s2.y;
        const dz = s1.z - s2.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < maxConnectionDist && Math.random() < 0.25) {
          constellationLines.push({ starA: i, starB: j });
        }
      }
    }

    // Nebulae clusters in 3D
    const nebulae: Nebula[] = [
      {
        x: -width * 0.4,
        y: -height * 0.3,
        z: 950,
        color1: "rgba(30, 18, 64, 0.45)", // deep violet
        color2: "rgba(30, 18, 64, 0)",
        r: 450,
      },
      {
        x: width * 0.5,
        y: height * 0.2,
        z: 850,
        color1: "rgba(10, 32, 48, 0.38)", // deep teal
        color2: "rgba(10, 32, 48, 0)",
        r: 500,
      },
      {
        x: -width * 0.1,
        y: height * 0.4,
        z: 750,
        color1: "rgba(43, 16, 43, 0.22)", // dark magenta-indigo
        color2: "rgba(43, 16, 43, 0)",
        r: 350,
      },
    ];

    // Shooting stars state
    let shootingStar: ShootingStar | null = null;
    let framesSinceLastMeteor = 0;

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse between -0.5 and 0.5 relative to viewport center
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      mouseRef.current.targetX = nx * 120; // Max horizontal camera parallax shift
      mouseRef.current.targetY = ny * 80;  // Max vertical camera parallax shift
    };

    const handleMouseLeave = () => {
      // Return camera smoothly to center
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Re-adjust nebula coordinates based on new dimensions
      nebulae[0].x = -width * 0.4;
      nebulae[0].y = -height * 0.3;
      nebulae[1].x = width * 0.5;
      nebulae[1].y = height * 0.2;
      nebulae[2].x = -width * 0.1;
      nebulae[2].y = height * 0.4;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let time = 0;
    const animate = () => {
      time++;
      
      // Clear screen
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, width, height);

      // Lerp mouse camera coordinates for smooth movement
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Slow constant circular drift to simulate background cosmic flow
      const driftX = Math.sin(time * 0.0008) * 15;
      const driftY = Math.cos(time * 0.0008) * 10;

      const camX = mouse.x + driftX;
      const camY = mouse.y + driftY;

      // 1. Draw Nebulae (Composite behind stars)
      nebulae.forEach((neb) => {
        // Project center coordinate
        const rx = neb.x - camX * 0.3; // low parallax factor for far nebulas
        const ry = neb.y - camY * 0.3;
        
        const scale = fov / neb.z;
        const sx = rx * scale + width / 2;
        const sy = ry * scale + height / 2;
        const sRadius = neb.r * scale;

        if (sx + sRadius > 0 && sx - sRadius < width && sy + sRadius > 0 && sy - sRadius < height) {
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sRadius);
          grad.addColorStop(0, neb.color1);
          grad.addColorStop(0.5, neb.color1.replace(/[\d.]+\)$/, "0.15)"));
          grad.addColorStop(1, neb.color2);
          
          ctx.beginPath();
          ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      // Project all stars first to avoid duplicate computation
      const projectedStars = stars.map((star) => {
        const rx = star.x - camX * (400 / star.z); // depth-based parallax factor
        const ry = star.y - camY * (400 / star.z);
        const scale = fov / star.z;
        const sx = rx * scale + width / 2;
        const sy = ry * scale + height / 2;
        const size = Math.max(0.1, star.size * scale);
        
        const twinkleVal = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        // Map sine from [-1, 1] to [0.2, 1.0] for twinkle opacity modulation
        const currentOpacity = star.baseOpacity * (0.35 + 0.65 * (twinkleVal * 0.5 + 0.5));
        
        return {
          sx,
          sy,
          size,
          opacity: currentOpacity,
          color: star.color,
          inBounds: sx >= 0 && sx <= width && sy >= 0 && sy <= height,
        };
      });

      // 2. Draw Faint Constellation Lines
      ctx.beginPath();
      constellationLines.forEach((line) => {
        const sA = projectedStars[line.starA];
        const sB = projectedStars[line.starB];
        
        if (sA.inBounds && sB.inBounds) {
          // Average opacity to render smooth constellation lines
          const avgOpacity = (sA.opacity + sB.opacity) * 0.06;
          ctx.moveTo(sA.sx, sA.sy);
          ctx.lineTo(sB.sx, sB.sy);
          ctx.strokeStyle = `rgba(165, 180, 252, ${avgOpacity})`;
          ctx.lineWidth = 0.45;
          ctx.stroke();
        }
      });

      // 3. Draw Stars
      projectedStars.forEach((p) => {
        if (p.inBounds) {
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity.toFixed(3)})`;
          ctx.fill();
        }
      });

      // 4. Update and Draw Shooting Star
      framesSinceLastMeteor++;
      if (!shootingStar && framesSinceLastMeteor > 180 && Math.random() < 0.005) {
        // Spawn a shooting star
        const startX = Math.random() * width;
        const startY = Math.random() * (height * 0.4);
        const angle = Math.PI / 6 + Math.random() * (Math.PI / 6); // Slanted downward angle
        
        shootingStar = {
          x: (startX - width / 2) * 1.5,
          y: (startY - height / 2) * 1.5,
          z: 300 + Math.random() * 200, // Mid depth
          dx: Math.cos(angle),
          dy: Math.sin(angle),
          speed: 15 + Math.random() * 12,
          length: 50 + Math.random() * 40,
          opacity: 1.0,
        };
        framesSinceLastMeteor = 0;
      }

      if (shootingStar) {
        // Move shooting star
        shootingStar.x += shootingStar.dx * shootingStar.speed;
        shootingStar.y += shootingStar.dy * shootingStar.speed;
        shootingStar.opacity -= 0.025; // fade rate

        if (shootingStar.opacity <= 0) {
          shootingStar = null;
        } else {
          // Project shooting star to 2D
          const rx1 = shootingStar.x - camX * (400 / shootingStar.z);
          const ry1 = shootingStar.y - camY * (400 / shootingStar.z);
          const scale = fov / shootingStar.z;
          const sx1 = rx1 * scale + width / 2;
          const sy1 = ry1 * scale + height / 2;

          // Back project the tail
          const rx2 = (shootingStar.x - shootingStar.dx * shootingStar.length) - camX * (400 / shootingStar.z);
          const ry2 = (shootingStar.y - shootingStar.dy * shootingStar.length) - camY * (400 / shootingStar.z);
          const sx2 = rx2 * scale + width / 2;
          const sy2 = ry2 * scale + height / 2;

          // Draw the tail gradient
          const grad = ctx.createLinearGradient(sx1, sy1, sx2, sy2);
          grad.addColorStop(0, `rgba(235, 240, 255, ${shootingStar.opacity})`);
          grad.addColorStop(1, `rgba(165, 180, 252, 0)`);

          ctx.beginPath();
          ctx.moveTo(sx1, sy1);
          ctx.lineTo(sx2, sy2);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none"
    />
  );
}
