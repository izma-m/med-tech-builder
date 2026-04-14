import { useEffect, useRef } from "react";

const EcgBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

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
      ctx.strokeStyle = `hsla(152, 80%, 50%, ${opacity})`;
      ctx.lineWidth = 1.5;

      for (let x = 0; x < w; x++) {
        const t = (x + offset * speed) * 0.01;
        const ecgCycle = t % (Math.PI * 2);
        let val = 0;

        // Simulate ECG-like waveform
        if (ecgCycle < 0.5) val = Math.sin(ecgCycle * Math.PI * 4) * 0.3;
        else if (ecgCycle < 1.2) val = 0;
        else if (ecgCycle < 1.5) val = -Math.sin((ecgCycle - 1.2) * Math.PI * 3.3) * 0.2;
        else if (ecgCycle < 2.0) val = Math.sin((ecgCycle - 1.5) * Math.PI * 2) * 1.0;
        else if (ecgCycle < 2.3) val = -Math.sin((ecgCycle - 2.0) * Math.PI * 3.3) * 0.3;
        else if (ecgCycle < 3.5) val = 0;
        else if (ecgCycle < 4.5) val = Math.sin((ecgCycle - 3.5) * Math.PI) * 0.2;
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

      drawEcg(h * 0.3, 40, 0.8, 0.08);
      drawEcg(h * 0.5, 30, 1.0, 0.06);
      drawEcg(h * 0.7, 35, 0.6, 0.05);

      offset += 1.5;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default EcgBackground;
