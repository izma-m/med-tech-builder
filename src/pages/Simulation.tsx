import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw, AlertTriangle, Zap, Radio, Filter, Monitor, BookOpen, Code, Lightbulb, CircuitBoard, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const systemBlocks = [
  { name: "Sensor", icon: Radio, desc: "Electrode picks up cardiac electrical signals from the body surface" },
  { name: "Amplifier", icon: Zap, desc: "Instrumentation amplifier boosts microvolt-level signals to measurable range" },
  { name: "Filter", icon: Filter, desc: "Bandpass filter (0.05-100Hz) removes noise and baseline wander" },
  { name: "Output", icon: Monitor, desc: "ADC converts analog signal to digital for display and analysis" },
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

      // Grid
      ctx.strokeStyle = "hsla(152, 80%, 50%, 0.05)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      if (!isPlaying) { animationId = requestAnimationFrame(draw); return; }

      // ECG line
      const speed = heartRate[0] / 72;
      ctx.beginPath();
      ctx.strokeStyle = "hsl(152, 80%, 50%)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "hsl(152, 80%, 50%)";
      ctx.shadowBlur = 10;

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

        // Add noise
        val += (Math.random() - 0.5) * noiseLevel[0] * 0.005;

        const py = mid - val * (h * 0.3);
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

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
      <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground">ECG Signal Simulation</h1>
          {mode === "fault" && (
            <span className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
              <AlertTriangle className="h-3 w-3" /> Fault Mode
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)} className="text-muted-foreground">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => { setMode("normal"); setHeartRate([72]); setNoiseLevel([10]); }}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left - Controls */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border p-4 space-y-5 shrink-0 overflow-y-auto">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Parameters</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground">Heart Rate</span>
                  <span className="text-primary font-mono">{heartRate[0]} bpm</span>
                </div>
                <Slider value={heartRate} onValueChange={setHeartRate} min={40} max={180} step={1} className="[&_[role=slider]]:bg-primary" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground">Noise Level</span>
                  <span className="text-primary font-mono">{noiseLevel[0]}%</span>
                </div>
                <Slider value={noiseLevel} onValueChange={setNoiseLevel} min={0} max={100} step={1} className="[&_[role=slider]]:bg-primary" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Simulation Mode</h3>
            <div className="space-y-1.5">
              {(["normal", "arrhythmia", "fault"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors capitalize ${
                    mode === m ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {m === "fault" ? "Fault Mode ⚠️" : m}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center - Waveform */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative p-4">
            <canvas ref={canvasRef} className="w-full h-full rounded-xl border border-border bg-card/50" />
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
              <span className="text-xs font-mono text-primary">{heartRate[0]} BPM</span>
            </div>
          </div>

          {/* Bottom - Learning tabs */}
          <div className="border-t border-border p-4 shrink-0">
            <Tabs defaultValue="concept">
              <TabsList className="bg-muted border border-border">
                <TabsTrigger value="concept" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <BookOpen className="h-3 w-3 mr-1" /> Concept
                </TabsTrigger>
                <TabsTrigger value="circuit" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <CircuitBoard className="h-3 w-3 mr-1" /> Circuit
                </TabsTrigger>
                <TabsTrigger value="code" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Code className="h-3 w-3 mr-1" /> Code
                </TabsTrigger>
                <TabsTrigger value="reallife" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Lightbulb className="h-3 w-3 mr-1" /> Real-Life
                </TabsTrigger>
              </TabsList>
              <TabsContent value="concept" className="mt-3">
                <p className="text-sm text-muted-foreground">An ECG measures the electrical activity of the heart using electrodes placed on the skin. The PQRST complex represents atrial depolarization (P), ventricular depolarization (QRS), and ventricular repolarization (T).</p>
              </TabsContent>
              <TabsContent value="circuit" className="mt-3">
                <p className="text-sm text-muted-foreground">The ECG circuit uses an instrumentation amplifier (INA128) with a gain of ~1000, followed by a bandpass filter (0.05–100 Hz) using active Butterworth topology, and a 50/60 Hz notch filter for powerline interference.</p>
              </TabsContent>
              <TabsContent value="code" className="mt-3">
                <pre className="text-xs font-mono text-primary/80 bg-muted rounded-lg p-3 overflow-x-auto">{`// Arduino ECG Reader
int ecgPin = A0;
void setup() {
  Serial.begin(9600);
}
void loop() {
  int val = analogRead(ecgPin);
  Serial.println(val);
  delay(10); // ~100 Hz sampling
}`}</pre>
              </TabsContent>
              <TabsContent value="reallife" className="mt-3">
                <p className="text-sm text-muted-foreground">In hospitals, 12-lead ECG machines use 10 electrodes to generate 12 different views of the heart's electrical activity. Modern devices include automated arrhythmia detection and wireless data transmission to central monitoring stations.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right - System breakdown */}
        <aside className="w-full lg:w-56 border-t lg:border-t-0 lg:border-l border-border p-4 shrink-0 overflow-y-auto">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">System Breakdown</h3>
          <div className="space-y-2">
            {systemBlocks.map((block, i) => (
              <button
                key={block.name}
                onClick={() => setActiveBlock(activeBlock === i ? null : i)}
                className={`w-full text-left rounded-xl border p-3 transition-all ${
                  activeBlock === i ? "border-primary/40 bg-primary/5 glow-green" : "border-border bg-card hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <block.icon className={`h-4 w-4 ${activeBlock === i ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium text-foreground">{block.name}</span>
                </div>
                {activeBlock === i && (
                  <p className="text-xs text-muted-foreground mt-1 animate-fade-in">{block.desc}</p>
                )}
              </button>
            ))}
          </div>
          {/* Flow arrows */}
          <div className="flex flex-col items-center mt-4 gap-1">
            <span className="text-[10px] text-muted-foreground tracking-widest">INPUT → PROCESS → OUTPUT</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Simulation;
