import { useEffect, useRef } from "react";

/**
 * Subtle hand-drawn ECG line, sage on paper.
 * Used behind auth screens — calm, not flashy.
 */
const EcgBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const sage = getComputedStyle(document.documentElement).getPropertyValue("--sage").trim() || "165 35% 45%";

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawEcg = (y: number, amplitude: number, speed: number, opacity: number) => {
      const w = canvas.offsetWidth;
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${sage} / ${opacity})`;
      ctx.lineWidth = 1.25;

      for (let x = 0; x < w; x++) {
        const t = (x + offset * speed) * 0.01;
        const cycle = t % (Math.PI * 2);
        let val = 0;

        if (cycle < 0.5) val = Math.sin(cycle * Math.PI * 4) * 0.3;
        else if (cycle < 1.2) val = 0;
        else if (cycle < 1.5) val = -Math.sin((cycle - 1.2) * Math.PI * 3.3) * 0.2;
        else if (cycle < 2.0) val = Math.sin((cycle - 1.5) * Math.PI * 2) * 1.0;
        else if (cycle < 2.3) val = -Math.sin((cycle - 2.0) * Math.PI * 3.3) * 0.3;
        else if (cycle < 3.5) val = 0;
        else if (cycle < 4.5) val = Math.sin((cycle - 3.5) * Math.PI) * 0.2;
        else val = 0;

        const py = y + val * amplitude;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      drawEcg(h * 0.35, 36, 0.6, 0.18);
      drawEcg(h * 0.55, 26, 0.8, 0.12);
      drawEcg(h * 0.75, 30, 0.45, 0.1);

      offset += 1;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default EcgBackground;
