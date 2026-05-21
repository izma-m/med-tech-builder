import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CircuitBoard, Trash2, X, MousePointer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

type CompType = "electrode" | "opamp" | "resistor" | "capacitor" | "ground";
type Placed = { id: number; type: CompType; x: number; y: number };

const SNAP = 20;
const LIBRARY: { type: CompType; label: string }[] = [
  { type: "electrode", label: "Input Electrode" },
  { type: "opamp", label: "Op-Amp" },
  { type: "resistor", label: "Resistor" },
  { type: "capacitor", label: "Capacitor" },
  { type: "ground", label: "Ground" },
];

const snap = (n: number) => Math.round(n / SNAP) * SNAP;

// Pin marker — solder-point at component connection node
const Pin = ({ cx, cy }: { cx: number; cy: number }) => (
  <circle cx={cx} cy={cy} r={2.4} fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth={0.8} />
);

// Inline SVG symbol — designed to sit in an 80x40 box centered on (40,20)
const Symbol = ({ type, className = "" }: { type: CompType; className?: string }) => {
  const stroke = "hsl(var(--ink))";
  const sw = 1.5;
  switch (type) {
    case "electrode":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <circle cx="18" cy="20" r="10" fill="hsl(var(--card))" stroke={stroke} strokeWidth={sw} />
          <circle cx="18" cy="20" r="3" fill={stroke} />
          <line x1="28" y1="20" x2="78" y2="20" stroke={stroke} strokeWidth={sw} />
          <Pin cx={78} cy={20} />
        </svg>
      );
    case "opamp":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="13" x2="20" y2="13" stroke={stroke} strokeWidth={sw} />
          <line x1="2" y1="27" x2="20" y2="27" stroke={stroke} strokeWidth={sw} />
          <polygon points="20,4 20,36 62,20" fill="hsl(var(--card))" stroke={stroke} strokeWidth={sw} />
          <text x="24" y="16" fontSize="9" fill={stroke}>−</text>
          <text x="24" y="32" fontSize="9" fill={stroke}>+</text>
          <line x1="62" y1="20" x2="78" y2="20" stroke={stroke} strokeWidth={sw} />
          <Pin cx={2} cy={13} />
          <Pin cx={2} cy={27} />
          <Pin cx={78} cy={20} />
        </svg>
      );
    case "resistor":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="18" y2="20" stroke={stroke} strokeWidth={sw} />
          <polyline points="18,20 22,10 30,30 38,10 46,30 54,10 62,20" fill="none" stroke={stroke} strokeWidth={sw} />
          <line x1="62" y1="20" x2="78" y2="20" stroke={stroke} strokeWidth={sw} />
          <Pin cx={2} cy={20} />
          <Pin cx={78} cy={20} />
        </svg>
      );
    case "capacitor":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="36" y2="20" stroke={stroke} strokeWidth={sw} />
          <line x1="36" y1="6" x2="36" y2="34" stroke={stroke} strokeWidth={sw} />
          <line x1="44" y1="6" x2="44" y2="34" stroke={stroke} strokeWidth={sw} />
          <line x1="44" y1="20" x2="78" y2="20" stroke={stroke} strokeWidth={sw} />
          <Pin cx={2} cy={20} />
          <Pin cx={78} cy={20} />
        </svg>
      );
    case "ground":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="40" y1="2" x2="40" y2="18" stroke={stroke} strokeWidth={sw} />
          <line x1="22" y1="18" x2="58" y2="18" stroke={stroke} strokeWidth={sw} />
          <line x1="28" y1="25" x2="52" y2="25" stroke={stroke} strokeWidth={sw} />
          <line x1="34" y1="32" x2="46" y2="32" stroke={stroke} strokeWidth={sw} />
          <Pin cx={40} cy={2} />
        </svg>
      );
  }
};

const CircuitBuilder = () => {
  const navigate = useNavigate();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [dragging, setDragging] = useState<CompType | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [rf, setRf] = useState([100]); // kΩ
  const [rin, setRin] = useState([10]); // kΩ
  const gain = 1 + rf[0] / rin[0];

  const addAt = (type: CompType, x: number, y: number) => {
    setPlaced((prev) => [...prev, { id: Date.now() + Math.random(), type, x: snap(x), y: snap(y) }]);
  };

  const placeNext = (type: CompType) => {
    const baseY = 200;
    const startX = 120;
    const stepX = 100;
    const x = startX + placed.length * stepX;
    addAt(type, x, baseY);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragging || !workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    addAt(dragging, e.clientX - rect.left, e.clientY - rect.top);
    setDragging(null);
  };

  const remove = (id: number) =>
    setPlaced((prev) => prev.filter((p) => p.id !== id));

  // Sort by x for chain order
  const chain = [...placed].sort((a, b) => a.x - b.x);

  const simulate = () => {
    const types = chain.map((c) => c.type);
    const hasElectrode = types.includes("electrode");
    const hasOpAmp = types.includes("opamp");
    const hasFilter = types.includes("resistor") || types.includes("capacitor");
    const hasGround = types.includes("ground");

    if (!hasElectrode || !hasOpAmp || !hasFilter || !hasGround || chain.length < 4) {
      toast.error("Open Circuit detected in filter stage.", {
        description: "Required chain: Electrode → Op-Amp → Resistor/Capacitor → Ground.",
      });
      return;
    }
    // Check no large gaps (>240px) between consecutive components — that's "disconnected"
    for (let i = 1; i < chain.length; i++) {
      if (chain[i].x - chain[i - 1].x > 240) {
        toast.error("Open Circuit detected in filter stage.", {
          description: `Gap between ${chain[i - 1].type} and ${chain[i].type} is too large.`,
        });
        return;
      }
    }
    setDrawer(true);
  };

  // Connection path between consecutive components
  const linkPath = chain
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x + 40} ${c.y}`)
    .join(" ");

  // Output waveform depends on which components present
  const hasOpAmp = chain.some((c) => c.type === "opamp");
  const hasCap = chain.some((c) => c.type === "capacitor");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CircuitBoard className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <div>
            <p className="accent-italic text-[11px] text-muted-foreground leading-none">Workspace</p>
            <h1 className="text-sm text-foreground font-medium leading-tight mt-0.5">Circuit Builder</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPlaced([]);
              setDrawer(false);
            }}
            className="text-xs border-border hover:bg-accent"
          >
            <Trash2 className="h-3 w-3 mr-1" /> Clear
          </Button>
          <Button
            size="sm"
            onClick={simulate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
          >
            Simulate Output
          </Button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Components panel */}
        <aside className="w-56 border-r border-border bg-card p-4 space-y-2 shrink-0">
          <p className="accent-italic text-xs text-primary mb-3">§ Components</p>
          {LIBRARY.map((c) => (
            <button
              key={c.type}
              draggable
              onDragStart={() => setDragging(c.type)}
              onClick={() => placeNext(c.type)}
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-md border border-border bg-card cursor-pointer hover-tint text-sm text-left"
            >
              <div className="w-14 h-7 shrink-0">
                <Symbol type={c.type} className="w-full h-full" />
              </div>
              <span className="text-foreground text-xs leading-tight">{c.label}</span>
            </button>
          ))}
          <div className="pt-4 mt-2 border-t border-border space-y-3">
            <p className="accent-italic text-xs text-primary">§ Op-Amp Gain</p>
            <div className="rounded-md border border-border bg-background p-3 space-y-3">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Zap className="h-3 w-3 text-primary" />
                <span>Non-inverting · A<sub>v</sub> = 1 + R<sub>f</sub>/R<sub>in</sub></span>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-foreground">R<sub>f</sub></span>
                  <span className="font-mono text-primary">{rf[0]} kΩ</span>
                </div>
                <Slider value={rf} onValueChange={setRf} min={1} max={1000} step={1} />
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-foreground">R<sub>in</sub></span>
                  <span className="font-mono text-primary">{rin[0]} kΩ</span>
                </div>
                <Slider value={rin} onValueChange={setRin} min={1} max={200} step={1} />
              </div>
              <div className="border-t border-border pt-2 flex items-baseline justify-between">
                <span className="accent-italic text-[11px] text-muted-foreground">computed gain</span>
                <span className="font-mono text-sm text-primary">{gain.toFixed(1)}×</span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-border">
            <p className="accent-italic text-xs text-primary mb-2">§ Notes</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Click a component to drop it in the next slot, or drag it onto the graph paper. Snap-to-grid at {SNAP}px. Build a chain: Electrode → Op-Amp → Resistor/Capacitor → Ground.
            </p>
          </div>
        </aside>

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <div
            ref={workspaceRef}
            className="flex-1 graph-paper relative overflow-hidden"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {/* connection wires */}
            {chain.length > 1 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d={linkPath}
                  stroke="hsl(var(--primary))"
                  strokeWidth={1.5}
                  fill="none"
                  strokeDasharray="0"
                />
              </svg>
            )}

            {placed.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                <MousePointer className="h-6 w-6 mb-3 opacity-40" strokeWidth={1.5} />
                <p className="accent-italic text-sm">Click or drag components onto the graph paper</p>
                <p className="text-xs mt-1">Snap-to-grid · {SNAP}px</p>
              </div>
            )}

            {placed.map((p) => (
              <div
                key={p.id}
                className="absolute group"
                style={{ left: p.x, top: p.y - 20, width: 80, height: 40 }}
              >
                <Symbol type={p.type} className="w-full h-full" />
                <button
                  onClick={() => remove(p.id)}
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-card border border-border text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-warning transition-opacity flex items-center justify-center"
                  aria-label="Remove"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 text-[9px] accent-italic text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {p.type}
                </span>
              </div>
            ))}
          </div>

          {/* Output drawer */}
          {drawer && (
            <div className="border-t border-border bg-card p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="accent-italic text-xs text-primary">§ Simulated Output</p>
                  <p className="text-[11px] text-muted-foreground">
                    chain: {chain.map((c) => c.type).join(" → ")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:bg-accent"
                  onClick={() => setDrawer(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-32 rounded border border-border bg-background graph-paper relative overflow-hidden">
                <svg viewBox="0 0 800 120" preserveAspectRatio="none" className="w-full h-full">
                  <OutputWave amplified={hasOpAmp} smoothed={hasCap} />
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3 text-[11px]">
                <Metric label="Amplitude" value={hasOpAmp ? "1.0 V" : "0.05 V"} />
                <Metric label="Noise" value={hasCap ? "low" : "high"} />
                <Metric label="Stages" value={`${chain.length}`} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-border rounded px-3 py-2 bg-background">
    <p className="accent-italic text-[10px] text-muted-foreground">{label}</p>
    <p className="font-mono text-foreground">{value}</p>
  </div>
);

// Static periodic ECG-like SVG path; visual indicator of output
const OutputWave = ({ amplified, smoothed }: { amplified: boolean; smoothed: boolean }) => {
  const amp = amplified ? 38 : 6;
  const wobble = smoothed ? 0 : 4;
  const mid = 60;
  let d = `M 0 ${mid}`;
  for (let x = 0; x <= 800; x += 4) {
    const cycle = ((x % 200) / 200) * Math.PI * 2;
    let v = 0;
    if (cycle < 0.6) v = Math.sin(cycle * Math.PI * 4) * 0.25;
    else if (cycle < 1.8) v = 0;
    else if (cycle < 2.2) v = Math.sin((cycle - 1.8) * Math.PI * 2.5);
    else if (cycle < 2.5) v = -Math.sin((cycle - 2.2) * Math.PI * 3.3) * 0.3;
    else if (cycle < 4.5) v = Math.sin((cycle - 3.5) * Math.PI) * 0.25;
    const noise = (Math.sin(x * 7.31) + Math.sin(x * 13.7)) * wobble * 0.5;
    d += ` L ${x} ${mid - v * amp + noise}`;
  }
  return <path d={d} fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5} />;
};

export default CircuitBuilder;
