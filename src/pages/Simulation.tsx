import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw, AlertTriangle, Zap, Radio, Filter, Monitor, BookOpen, Code, Lightbulb, CircuitBoard, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const systemBlocks = [
  { name: "Sensor", icon: Radio, desc: "Electrode picks up cardiac electrical signals from the body surface." },
  { name: "Amplifier", icon: Zap, desc: "Instrumentation amplifier boosts microvolt-level signals to a measurable range." },
  { name: "Filter", icon: Filter, desc: "Bandpass filter (0.05–100 Hz) removes noise and baseline wander." },
  { name: "Output", icon: Monitor, desc: "ADC converts analog signal to digital for display and analysis." },
];

const Simulation = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heartRate, setHeartRate] = useState([72]);
  const [noiseLevel, setNoiseLevel] = useState([10]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<"normal" | "arrhythmia" | "fault">("normal");
  const [activeBlock, setActiveBlock] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const styles = getComputedStyle(document.documentElement);
    const sage = styles.getPropertyValue("--sage").trim() || "165 35% 45%";
    const grid = styles.getPropertyValue("--grid-line-strong").trim() || "30 15% 80%";
    const gridFine = styles.getPropertyValue("--grid-line").trim() || "30 12% 88%";

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Fine grid
      ctx.strokeStyle = `hsla(${gridFine} / 0.6)`;
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      // Major grid
      ctx.strokeStyle = `hsla(${grid} / 0.7)`;
      for (let x = 0; x < w; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      if (!isPlaying) { animationId = requestAnimationFrame(draw); return; }

      const speed = heartRate[0] / 72;
      ctx.beginPath();
      ctx.strokeStyle = `hsl(${sage})`;
      ctx.lineWidth = 1.75;

      const mid = h / 2;
      for (let x = 0; x < w; x++) {
        const t = (x + offset * speed) * 0.015;
        const cycle = t % (Math.PI * 2);
        let val = 0;

        if (mode === "arrhythmia") {
          const irregular = Math.sin(t * 0.3) * 0.3;
          if (cycle < 0.5) val = Math.sin(cycle * Math.PI * 4) * (0.3 + irregular);
          else if (cycle < 1.5) val = 0;
          else if (cycle < 2.0) val = Math.sin((cycle - 1.5) * Math.PI * 2) * (1.0 + irregular * 0.5);
          else if (cycle < 2.3) val = -Math.sin((cycle - 2.0) * Math.PI * 3.3) * 0.3;
          else val = Math.sin(cycle * 0.5) * 0.05;
        } else if (mode === "fault") {
          if (Math.random() < 0.02) val = (Math.random() - 0.5) * 2;
          else if (cycle < 2.0) val = Math.sin((cycle - 1.5) * Math.PI * 2) * 0.5;
          else val = 0;
        } else {
          if (cycle < 0.5) val = Math.sin(cycle * Math.PI * 4) * 0.3;
          else if (cycle < 1.2) val = 0;
          else if (cycle < 1.5) val = -Math.sin((cycle - 1.2) * Math.PI * 3.3) * 0.2;
          else if (cycle < 2.0) val = Math.sin((cycle - 1.5) * Math.PI * 2) * 1.0;
          else if (cycle < 2.3) val = -Math.sin((cycle - 2.0) * Math.PI * 3.3) * 0.3;
          else if (cycle < 3.5) val = 0;
          else if (cycle < 4.5) val = Math.sin((cycle - 3.5) * Math.PI) * 0.2;
          else val = 0;
        }

        val += (Math.random() - 0.5) * noiseLevel[0] * 0.005;

        const py = mid - val * (h * 0.3);
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();

      offset += 2;
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [heartRate, noiseLevel, isPlaying, mode]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="accent-italic text-[11px] text-muted-foreground leading-none">Experiment 01</p>
            <h1 className="text-sm text-foreground font-medium leading-tight mt-0.5">ECG Signal Acquisition</h1>
          </div>
          {mode === "fault" && (
            <span className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded">
              <AlertTriangle className="h-3 w-3" /> Fault Mode
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate("/community")} className="text-muted-foreground hover:text-primary hover:bg-accent text-xs hidden sm:flex">
            <MessageSquare className="h-4 w-4 mr-1" /> Discuss
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-accent text-xs hidden sm:flex">
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)} className="text-muted-foreground hover:bg-accent">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent" onClick={() => { setMode("normal"); setHeartRate([72]); setNoiseLevel([10]); }}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 notebook-grid">
        {/* Left - Parameters (notebook style) */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-card/60 p-6 space-y-6 shrink-0 overflow-y-auto">
          <div>
            <p className="accent-italic text-xs text-primary mb-3">§ Parameters</p>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2 items-baseline">
                  <span className="text-foreground">Heart Rate</span>
                  <span className="font-mono text-primary text-xs">{heartRate[0]} bpm</span>
                </div>
                <Slider value={heartRate} onValueChange={setHeartRate} min={40} max={180} step={1} />
                <div className="border-b border-dotted border-border mt-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2 items-baseline">
                  <span className="text-foreground">Noise Level</span>
                  <span className="font-mono text-primary text-xs">{noiseLevel[0]}%</span>
                </div>
                <Slider value={noiseLevel} onValueChange={setNoiseLevel} min={0} max={100} step={1} />
                <div className="border-b border-dotted border-border mt-3" />
              </div>
            </div>
          </div>

          <div>
            <p className="accent-italic text-xs text-primary mb-3">§ Mode</p>
            <div className="space-y-1">
              {(["normal", "arrhythmia", "fault"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors capitalize ${
                    mode === m ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {m === "fault" ? "Fault mode" : m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="accent-italic text-xs text-primary mb-2">§ Notes</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Adjust heart rate to observe how the QRS complex changes morphology under different physiological conditions.
            </p>
          </div>
        </aside>

        {/* Center - Plot */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative p-6">
            <div className="absolute top-8 left-8 z-10">
              <p className="accent-italic text-xs text-primary">Fig. 1 — Lead II tracing</p>
            </div>
            <canvas ref={canvasRef} className="w-full h-full rounded border border-border bg-card" />
            <div className="absolute bottom-8 right-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ink-pulse" />
              <span className="text-[11px] font-mono text-primary">{heartRate[0]} BPM</span>
            </div>
          </div>

          <div className="border-t border-border bg-card p-4 shrink-0">
            <Tabs defaultValue="concept">
              <TabsList className="bg-muted border border-border">
                <TabsTrigger value="concept" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <BookOpen className="h-3 w-3 mr-1" /> Concept
                </TabsTrigger>
                <TabsTrigger value="circuit" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <CircuitBoard className="h-3 w-3 mr-1" /> Circuit
                </TabsTrigger>
                <TabsTrigger value="code" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <Code className="h-3 w-3 mr-1" /> Code
                </TabsTrigger>
                <TabsTrigger value="reallife" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <Lightbulb className="h-3 w-3 mr-1" /> Real-Life
                </TabsTrigger>
              </TabsList>
              <TabsContent value="concept" className="mt-3">
                <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">
                  An ECG measures the electrical activity of the heart using surface electrodes. The <span className="accent-italic text-primary">PQRST</span> complex represents atrial depolarization (P), ventricular depolarization (QRS), and ventricular repolarization (T).
                </p>
              </TabsContent>
              <TabsContent value="circuit" className="mt-3">
                <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">
                  Uses an instrumentation amplifier (INA128) with gain ≈ 1000, followed by a bandpass filter (0.05–100 Hz) using active Butterworth topology, and a 50/60 Hz notch filter for powerline interference.
                </p>
              </TabsContent>
              <TabsContent value="code" className="mt-3">
                <pre className="text-xs font-mono text-foreground/80 bg-muted rounded border border-border p-3 overflow-x-auto">{`// Arduino ECG Reader
int ecgPin = A0;
void setup() { Serial.begin(9600); }
void loop() {
  int val = analogRead(ecgPin);
  Serial.println(val);
  delay(10); // ~100 Hz sampling
}`}</pre>
              </TabsContent>
              <TabsContent value="reallife" className="mt-3">
                <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">
                  Hospital 12-lead ECG machines use 10 electrodes to generate 12 different views of the heart's electrical activity, often with automated arrhythmia detection and wireless transmission to central monitoring stations.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right - System diagram */}
        <aside className="w-full lg:w-60 border-t lg:border-t-0 lg:border-l border-border bg-card/60 p-6 shrink-0 overflow-y-auto">
          <p className="accent-italic text-xs text-primary mb-4">§ Signal Path</p>
          <div className="space-y-0">
            {systemBlocks.map((block, i) => (
              <div key={block.name}>
                <button
                  onClick={() => setActiveBlock(activeBlock === i ? null : i)}
                  className={`w-full text-left rounded border p-3 transition-colors ${
                    activeBlock === i ? "border-primary bg-accent" : "border-border bg-card hover-tint"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <block.icon className={`h-4 w-4 ${activeBlock === i ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.5} />
                    <span className="text-sm text-foreground">{block.name}</span>
                  </div>
                  {activeBlock === i && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed animate-fade-in">{block.desc}</p>
                  )}
                </button>
                {i < systemBlocks.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-4 bg-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <p className="accent-italic text-[11px] text-muted-foreground tracking-wider text-center">
              input → process → output
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Simulation;
