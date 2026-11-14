import React, { useEffect, useImperativeHandle, useRef } from 'react';
import type { ParticleFxType } from '../types/cosmic';

export interface ParticleBurstHandle {
  burst: (x: number, y: number, color: string, fx: ParticleFxType, big?: boolean) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  gravity: number;
}

export const ParticleBurstCanvas = React.forwardRef<ParticleBurstHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (!ctx) return;
      if (particlesRef.current.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const next: Particle[] = [];
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.alpha -= p.decay;
        if (p.alpha <= 0.02) continue;

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        next.push(p);
      }
      ctx.globalAlpha = 1;
      particlesRef.current = next;
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    burst(x: number, y: number, color: string, fx: ParticleFxType, big = false) {
      const count = big ? 48 : fx === 'fireworks' ? 28 : 16;
      const palette = [color, '#ffffff', '#fde047', '#ff8ec4', '#00f3ff'];

      for (let i = 0; i < count; i++) {
        const angle =
          fx === 'plasma'
            ? (i / count) * Math.PI * 2
            : Math.random() * Math.PI * 2;
        const speed =
          fx === 'fireworks'
            ? 2.8 + Math.random() * (big ? 8.5 : 5.5)
            : fx === 'plasma'
            ? 2.2 + Math.random() * 4.2
            : 1.8 + Math.random() * 4.5;

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (fx === 'fireworks' ? 1.5 : 0.4),
          size: big ? 2.4 + Math.random() * 3.2 : 1.6 + Math.random() * 2.4,
          alpha: 1,
          decay: fx === 'plasma' ? 0.018 : 0.024 + Math.random() * 0.015,
          color:
            fx === 'fireworks' || big
              ? palette[(Math.random() * palette.length) | 0]
              : color,
          gravity: fx === 'plasma' ? -0.02 : 0.11,
        });
      }
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      aria-hidden="true"
    />
  );
});
ParticleBurstCanvas.displayName = 'ParticleBurstCanvas';
