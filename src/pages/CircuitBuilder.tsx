import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CircuitBoard, Trash2, X, MousePointer, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type CompType =
  | "resistor" | "capacitor" | "inductor" | "potentiometer"
  | "diode" | "bjt" | "mosfet" | "opamp" | "timer555"
  | "vsource_dc" | "vsource_ac" | "signal_gen" | "ground"
  | "electrode" | "photodiode" | "piezo";

type Placed = { id: number; type: CompType; x: number; y: number; label?: string };

const SNAP = 20;
const snap = (n: number) => Math.round(n / SNAP) * SNAP;

const LIB_GROUPS: { id: string; title: string; items: { type: CompType; label: string }[] }[] = [
  {
    id: "passives", title: "Passives", items: [
      { type: "resistor", label: "Resistor" },
      { type: "capacitor", label: "Capacitor" },
      { type: "inductor", label: "Inductor" },
      { type: "potentiometer", label: "Potentiometer" },
    ],
  },
  {
    id: "actives", title: "Actives / Semiconductors", items: [
      { type: "diode", label: "Diode" },
      { type: "bjt", label: "Transistor (BJT)" },
      { type: "mosfet", label: "Transistor (MOSFET)" },
      { type: "opamp", label: "Op-Amp" },
      { type: "timer555", label: "555 Timer" },
    ],
  },
  {
    id: "sources", title: "Sources & Ground", items: [
      { type: "vsource_dc", label: "DC Source" },
      { type: "vsource_ac", label: "AC Source" },
      { type: "signal_gen", label: "Signal Generator" },
      { type: "ground", label: "Ground" },
    ],
  },
  {
    id: "biomed", title: "Biomedical / Sensors", items: [
      { type: "electrode", label: "ECG Electrode" },
      { type: "photodiode", label: "SpO₂ Photodiode" },
      { type: "piezo", label: "Piezoelectric Crystal" },
    ],
  },
];

const Pin = ({ cx, cy }: { cx: number; cy: number }) => (
  <circle cx={cx} cy={cy} r={2.4} fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth={0.8} />
);

const Symbol = ({ type, className = "" }: { type: CompType; className?: string }) => {
  const s = "hsl(var(--ink))";
  const sw = 1.5;
  switch (type) {
    case "resistor":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="18" y2="20" stroke={s} strokeWidth={sw} />
          <polyline points="18,20 22,10 30,30 38,10 46,30 54,10 62,20" fill="none" stroke={s} strokeWidth={sw} />
          <line x1="62" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <Pin cx={2} cy={20} /><Pin cx={78} cy={20} />
        </svg>
      );
    case "capacitor":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="36" y2="20" stroke={s} strokeWidth={sw} />
          <line x1="36" y1="6" x2="36" y2="34" stroke={s} strokeWidth={sw} />
          <line x1="44" y1="6" x2="44" y2="34" stroke={s} strokeWidth={sw} />
          <line x1="44" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <Pin cx={2} cy={20} /><Pin cx={78} cy={20} />
        </svg>
      );
    case "inductor":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="18" y2="20" stroke={s} strokeWidth={sw} />
          <path d="M18,20 a4,4 0 0 1 8,0 a4,4 0 0 1 8,0 a4,4 0 0 1 8,0 a4,4 0 0 1 8,0 a4,4 0 0 1 8,0" fill="none" stroke={s} strokeWidth={sw} />
          <line x1="62" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <Pin cx={2} cy={20} /><Pin cx={78} cy={20} />
        </svg>
      );
    case "potentiometer":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="18" y2="20" stroke={s} strokeWidth={sw} />
          <polyline points="18,20 22,10 30,30 38,10 46,30 54,10 62,20" fill="none" stroke={s} strokeWidth={sw} />
          <line x1="62" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <line x1="40" y1="0" x2="40" y2="10" stroke={s} strokeWidth={sw} />
          <polygon points="36,10 44,10 40,16" fill={s} />
          <Pin cx={2} cy={20} /><Pin cx={78} cy={20} /><Pin cx={40} cy={0} />
        </svg>
      );
    case "diode":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="32" y2="20" stroke={s} strokeWidth={sw} />
          <polygon points="32,10 32,30 50,20" fill="hsl(var(--card))" stroke={s} strokeWidth={sw} />
          <line x1="50" y1="10" x2="50" y2="30" stroke={s} strokeWidth={sw} />
          <line x1="50" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <Pin cx={2} cy={20} /><Pin cx={78} cy={20} />
        </svg>
      );
    case "bjt":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <circle cx="40" cy="20" r="14" fill="hsl(var(--card))" stroke={s} strokeWidth={sw} />
          <line x1="32" y1="10" x2="32" y2="30" stroke={s} strokeWidth={sw} />
          <line x1="2" y1="20" x2="32" y2="20" stroke={s} strokeWidth={sw} />
          <line x1="32" y1="14" x2="50" y2="6" stroke={s} strokeWidth={sw} />
          <line x1="32" y1="26" x2="50" y2="34" stroke={s} strokeWidth={sw} />
          <line x1="50" y1="6" x2="50" y2="0" stroke={s} strokeWidth={sw} />
          <line x1="50" y1="34" x2="50" y2="40" stroke={s} strokeWidth={sw} />
          <Pin cx={2} cy={20} /><Pin cx={50} cy={0} /><Pin cx={50} cy={40} />
        </svg>
      );
    case "mosfet":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="28" y2="20" stroke={s} strokeWidth={sw} />
          <line x1="30" y1="8" x2="30" y2="32" stroke={s} strokeWidth={sw} />
          <line x1="34" y1="10" x2="34" y2="16" stroke={s} strokeWidth={sw} />
          <line x1="34" y1="18" x2="34" y2="22" stroke={s} strokeWidth={sw} />
          <line x1="34" y1="24" x2="34" y2="30" stroke={s} strokeWidth={sw} />
          <line x1="34" y1="13" x2="56" y2="6" stroke={s} strokeWidth={sw} />
          <line x1="34" y1="27" x2="56" y2="34" stroke={s} strokeWidth={sw} />
          <line x1="56" y1="6" x2="56" y2="0" stroke={s} strokeWidth={sw} />
          <line x1="56" y1="34" x2="56" y2="40" stroke={s} strokeWidth={sw} />
          <Pin cx={2} cy={20} /><Pin cx={56} cy={0} /><Pin cx={56} cy={40} />
        </svg>
      );
    case "opamp":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="13" x2="20" y2="13" stroke={s} strokeWidth={sw} />
          <line x1="2" y1="27" x2="20" y2="27" stroke={s} strokeWidth={sw} />
          <polygon points="20,4 20,36 62,20" fill="hsl(var(--card))" stroke={s} strokeWidth={sw} />
          <text x="24" y="16" fontSize="9" fill={s}>−</text>
          <text x="24" y="32" fontSize="9" fill={s}>+</text>
          <line x1="62" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <Pin cx={2} cy={13} /><Pin cx={2} cy={27} /><Pin cx={78} cy={20} />
        </svg>
      );
    case "timer555":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <rect x="20" y="6" width="40" height="28" fill="hsl(var(--card))" stroke={s} strokeWidth={sw} rx={2} />
          <text x="40" y="24" fontSize="8" fill={s} textAnchor="middle">555</text>
          <line x1="2" y1="13" x2="20" y2="13" stroke={s} strokeWidth={sw} />
          <line x1="2" y1="27" x2="20" y2="27" stroke={s} strokeWidth={sw} />
          <line x1="60" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <Pin cx={2} cy={13} /><Pin cx={2} cy={27} /><Pin cx={78} cy={20} />
        </svg>
      );
    case "vsource_dc":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="32" y2="20" stroke={s} strokeWidth={sw} />
          <line x1="32" y1="10" x2="32" y2="30" stroke={s} strokeWidth={sw} strokeWidth={2.5} />
          <line x1="40" y1="14" x2="40" y2="26" stroke={s} strokeWidth={sw} />
          <line x1="40" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <text x="20" y="12" fontSize="8" fill={s}>+</text>
          <Pin cx={2} cy={20} /><Pin cx={78} cy={20} />
        </svg>
      );
    case "vsource_ac":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="22" y2="20" stroke={s} strokeWidth={sw} />
          <circle cx="40" cy="20" r="14" fill="hsl(var(--card))" stroke={s} strokeWidth={sw} />
          <path d="M30,20 q5,-10 10,0 t10,0" fill="none" stroke={s} strokeWidth={sw} />
          <line x1="54" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <Pin cx={2} cy={20} /><Pin cx={78} cy={20} />
        </svg>
      );
    case "signal_gen":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <rect x="14" y="6" width="52" height="28" rx={3} fill="hsl(var(--card))" stroke={s} strokeWidth={sw} />
          <path d="M22,20 q4,-8 8,0 t8,0 t8,0 t8,0" fill="none" stroke={s} strokeWidth={sw} />
          <line x1="66" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <Pin cx={78} cy={20} />
        </svg>
      );
    case "ground":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="40" y1="2" x2="40" y2="18" stroke={s} strokeWidth={sw} />
          <line x1="22" y1="18" x2="58" y2="18" stroke={s} strokeWidth={sw} />
          <line x1="28" y1="25" x2="52" y2="25" stroke={s} strokeWidth={sw} />
          <line x1="34" y1="32" x2="46" y2="32" stroke={s} strokeWidth={sw} />
          <Pin cx={40} cy={2} />
        </svg>
      );
    case "electrode":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <circle cx="18" cy="20" r="10" fill="hsl(var(--card))" stroke={s} strokeWidth={sw} />
          <circle cx="18" cy="20" r="3" fill={s} />
          <line x1="28" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <Pin cx={78} cy={20} />
        </svg>
      );
    case "photodiode":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="32" y2="20" stroke={s} strokeWidth={sw} />
          <polygon points="32,10 32,30 50,20" fill="hsl(var(--card))" stroke={s} strokeWidth={sw} />
          <line x1="50" y1="10" x2="50" y2="30" stroke={s} strokeWidth={sw} />
          <line x1="50" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <line x1="58" y1="4" x2="52" y2="10" stroke={s} strokeWidth={sw} />
          <line x1="64" y1="6" x2="58" y2="12" stroke={s} strokeWidth={sw} />
          <Pin cx={2} cy={20} /><Pin cx={78} cy={20} />
        </svg>
      );
    case "piezo":
      return (
        <svg viewBox="0 0 80 40" className={className}>
          <line x1="2" y1="20" x2="30" y2="20" stroke={s} strokeWidth={sw} />
          <rect x="30" y="10" width="20" height="20" fill="hsl(var(--card))" stroke={s} strokeWidth={sw} />
          <text x="40" y="25" fontSize="8" fill={s} textAnchor="middle">PZT</text>
          <line x1="50" y1="20" x2="78" y2="20" stroke={s} strokeWidth={sw} />
          <Pin cx={2} cy={20} /><Pin cx={78} cy={20} />
        </svg>
      );
  }
};

// ───────── Presets ─────────
type PresetNode = { id: string; label: string; explanation: string; signal: "raw" | "amplified" | "filtered" | "clean" };
type Preset = {
  id: string;
  name: string;
  description: string;
  components: { type: CompType; x: number; y: number; label?: string }[];
  nodes: { x: number; y: number; data: PresetNode }[];
};

const PRESETS: Preset[] = [
  {
    id: "ecg_instamp",
    name: "ECG Instrumentation Amplifier",
    description: "Three-op-amp instrumentation amp lifting millivolt ECG above noise floor.",
    components: [
      { type: "electrode", x: 80, y: 160, label: "RA" },
      { type: "electrode", x: 80, y: 260, label: "LA" },
      { type: "resistor", x: 220, y: 160 },
      { type: "resistor", x: 220, y: 260, label: "R_gain" },
      { type: "opamp", x: 360, y: 200 },
      { type: "resistor", x: 480, y: 200, label: "R_f" },
      { type: "ground", x: 360, y: 320 },
    ],
    nodes: [
      { x: 120, y: 200, data: { id: "n1", label: "Node 1 · Input", explanation: "Raw differential ECG from skin electrodes (≈0.5–4 mV) including 50/60 Hz mains hum and motion artifact.", signal: "raw" } },
      { x: 400, y: 200, data: { id: "n2", label: "Node 2 · Post-Amplification", explanation: "Instrumentation amplifier provides a non-inverting differential gain of ~11× to lift the bio-signal above the noise floor while rejecting common-mode interference.", signal: "amplified" } },
      { x: 560, y: 200, data: { id: "n3", label: "Node 3 · Output", explanation: "Clean amplified ECG ready for the ADC stage; CMRR > 90 dB suppresses mains pickup.", signal: "clean" } },
    ],
  },
  {
    id: "spo2_tia",
    name: "SpO₂ Transimpedance Amplifier",
    description: "Photodiode current → voltage conversion stage for pulse oximetry.",
    components: [
      { type: "photodiode", x: 80, y: 200 },
      { type: "opamp", x: 280, y: 200 },
      { type: "resistor", x: 400, y: 140, label: "R_f" },
      { type: "capacitor", x: 400, y: 260, label: "C_f" },
      { type: "ground", x: 280, y: 320 },
    ],
    nodes: [
      { x: 140, y: 200, data: { id: "n1", label: "Node 1 · Photocurrent", explanation: "Photodiode produces a few nA–µA current proportional to incident IR/red light passing through tissue.", signal: "raw" } },
      { x: 360, y: 200, data: { id: "n2", label: "Node 2 · I→V Conversion", explanation: "Transimpedance amp (R_f ≈ 1 MΩ) converts photocurrent to a usable voltage; C_f sets bandwidth and suppresses high-frequency noise.", signal: "filtered" } },
    ],
  },
  {
    id: "active_lpf",
    name: "Active Low-Pass Filter (Sallen-Key)",
    description: "2nd-order Sallen-Key LPF for anti-aliasing biopotential signals.",
    components: [
      { type: "signal_gen", x: 80, y: 200 },
      { type: "resistor", x: 200, y: 200 },
      { type: "resistor", x: 320, y: 200 },
      { type: "capacitor", x: 380, y: 280 },
      { type: "opamp", x: 440, y: 200 },
      { type: "capacitor", x: 300, y: 100 },
      { type: "ground", x: 380, y: 340 },
    ],
    nodes: [
      { x: 140, y: 200, data: { id: "n1", label: "Node 1 · Input", explanation: "Noisy wideband signal arriving from the previous stage with high-frequency components above the cutoff.", signal: "raw" } },
      { x: 280, y: 200, data: { id: "n2", label: "Node 2 · RC Network", explanation: "First RC pair sets the corner frequency; high-frequency content begins to attenuate at −20 dB/decade.", signal: "filtered" } },
      { x: 520, y: 200, data: { id: "n3", label: "Node 3 · Post-Filter", explanation: "Sallen-Key topology delivers a 2nd-order roll-off (−40 dB/decade) with unity gain; output is the clean band-limited signal.", signal: "clean" } },
    ],
  },
];

// ───────── Node waveform ─────────
const NodeWaveform = ({ signal }: { signal: PresetNode["signal"] }) => {
  const path = useMemo(() => {
    const mid = 30;
    let d = `M 0 ${mid}`;
    for (let x = 0; x <= 200; x += 2) {
      const base = Math.sin(x * 0.08) * 14;
      let noise = 0;
      if (signal === "raw") noise = (Math.sin(x * 0.9) + Math.sin(x * 1.7)) * 6;
      else if (signal === "amplified") noise = Math.sin(x * 1.3) * 3;
      else if (signal === "filtered") noise = Math.sin(x * 0.4) * 1.5;
      const amp = signal === "amplified" || signal === "clean" ? 1.4 : signal === "filtered" ? 1.1 : 0.8;
      d += ` L ${x} ${mid - base * amp + noise}`;
    }
    return d;
  }, [signal]);
  return (
    <svg viewBox="0 0 200 60" className="w-full h-16">
      <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth={1.2} />
    </svg>
  );
};

const CircuitBuilder = () => {
  const navigate = useNavigate();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [dragging, setDragging] = useState<CompType | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [rf, setRf] = useState([100]);
  const [rin, setRin] = useState([10]);
  const gain = 1 + rf[0] / rin[0];
  const [activePreset, setActivePreset] = useState<Preset | null>(null);
  const [simulated, setSimulated] = useState(false);
  const [openNode, setOpenNode] = useState<PresetNode | null>(null);

  const addAt = (type: CompType, x: number, y: number, label?: string) => {
    setPlaced((prev) => [...prev, { id: Date.now() + Math.random(), type, x: snap(x), y: snap(y), label }]);
  };
  const placeNext = (type: CompType) => {
    const x = 120 + placed.length * 100;
    addAt(type, x, 200);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragging || !workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    addAt(dragging, e.clientX - rect.left, e.clientY - rect.top);
    setDragging(null);
  };
  const remove = (id: number) => setPlaced((prev) => prev.filter((p) => p.id !== id));

  const loadPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setActivePreset(p);
    setSimulated(false);
    setPlaced(
      p.components.map((c, i) => ({
        id: Date.now() + i, type: c.type, x: snap(c.x), y: snap(c.y), label: c.label,
      })),
    );
    toast.success(`Loaded preset: ${p.name}`, { description: p.description });
  };

  const chain = [...placed].sort((a, b) => a.x - b.x);

  const simulate = () => {
    if (activePreset) {
      setSimulated(true);
      setDrawer(true);
      toast.success("Simulation complete — click any node to inspect");
      return;
    }
    if (chain.length < 3) {
      toast.error("Open Circuit detected.", { description: "Place at least 3 connected components." });
      return;
    }
    setDrawer(true);
  };

  const linkPath = activePreset
    ? "" // preset wiring drawn separately
    : chain.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x + 40} ${c.y}`).join(" ");

  // Pre-wired preset wires connect components in placement order with right-angle elbows
  const presetWires = useMemo(() => {
    if (!activePreset) return "";
    const pts = activePreset.components.map((c) => ({ x: snap(c.x) + 40, y: snap(c.y) }));
    let d = "";
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      d += `M ${a.x} ${a.y} L ${(a.x + b.x) / 2} ${a.y} L ${(a.x + b.x) / 2} ${b.y} L ${b.x} ${b.y} `;
    }
    return d;
  }, [activePreset]);

  const hasOpAmp = chain.some((c) => c.type === "opamp");
  const hasCap = chain.some((c) => c.type === "capacitor");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CircuitBoard className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <div>
            <p className="accent-italic text-[11px] text-muted-foreground leading-none">Workspace</p>
            <h1 className="text-sm text-foreground font-medium leading-tight mt-0.5">Circuit Builder</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"
            onClick={() => { setPlaced([]); setDrawer(false); setActivePreset(null); setSimulated(false); }}
            className="text-xs border-border hover:bg-accent">
            <Trash2 className="h-3 w-3 mr-1" /> Clear
          </Button>
          <Button size="sm" onClick={simulate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
            Simulate Output
          </Button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Components panel */}
        <aside className="w-64 border-r border-border bg-card p-3 shrink-0 overflow-y-auto">
          <p className="accent-italic text-xs text-primary mb-2 px-1">§ Components</p>
          <Accordion type="multiple" defaultValue={["passives", "actives", "biomed"]} className="space-y-1">
            {LIB_GROUPS.map((g) => (
              <AccordionItem key={g.id} value={g.id} className="border border-border rounded-md bg-background/40">
                <AccordionTrigger className="px-2.5 py-1.5 text-xs hover:no-underline">
                  {g.title}
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-2 space-y-1">
                  {g.items.map((c) => (
                    <button key={c.type} draggable
                      onDragStart={() => setDragging(c.type)}
                      onClick={() => placeNext(c.type)}
                      className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded border border-border bg-card cursor-pointer hover-tint text-left">
                      <div className="w-12 h-6 shrink-0">
                        <Symbol type={c.type} className="w-full h-full" />
                      </div>
                      <span className="text-foreground text-[11px] leading-tight">{c.label}</span>
                    </button>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="pt-4 mt-3 border-t border-border space-y-3">
            <p className="accent-italic text-xs text-primary px-1">§ Op-Amp Gain</p>
            <div className="rounded-md border border-border bg-background p-3 space-y-3">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Zap className="h-3 w-3 text-primary" />
                <span>A<sub>v</sub> = 1 + R<sub>f</sub>/R<sub>in</sub></span>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>R<sub>f</sub></span>
                  <span className="font-mono text-primary">{rf[0]} kΩ</span>
                </div>
                <Slider value={rf} onValueChange={setRf} min={1} max={1000} step={1} />
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>R<sub>in</sub></span>
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
        </aside>

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Preset selector bar */}
          <div className="border-b border-border bg-card/70 px-4 py-2 flex items-center gap-3">
            <span className="accent-italic text-xs text-primary">§ Load Preset Device Circuit</span>
            <Select value={activePreset?.id ?? ""} onValueChange={loadPreset}>
              <SelectTrigger className="h-8 w-72 text-xs">
                <SelectValue placeholder="Choose a preset device circuit…" />
              </SelectTrigger>
              <SelectContent>
                {PRESETS.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activePreset && (
              <span className="text-[11px] text-muted-foreground truncate">{activePreset.description}</span>
            )}
          </div>

          <div
            ref={workspaceRef}
            className="flex-1 graph-paper relative overflow-hidden"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {/* wires */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {activePreset ? (
                <path d={presetWires} stroke="hsl(var(--primary))" strokeWidth={1.5} fill="none" />
              ) : chain.length > 1 ? (
                <path d={linkPath} stroke="hsl(var(--primary))" strokeWidth={1.5} fill="none" />
              ) : null}
            </svg>

            {placed.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                <MousePointer className="h-6 w-6 mb-3 opacity-40" strokeWidth={1.5} />
                <p className="accent-italic text-sm">Click, drag, or load a preset circuit</p>
                <p className="text-xs mt-1">Snap-to-grid · {SNAP}px</p>
              </div>
            )}

            {placed.map((p) => (
              <div key={p.id} className="absolute group"
                style={{ left: p.x, top: p.y - 20, width: 80, height: 40 }}>
                <Symbol type={p.type} className="w-full h-full" />
                {p.label && (
                  <span className="absolute left-1/2 -translate-x-1/2 -top-3 text-[9px] font-mono text-primary whitespace-nowrap">
                    {p.label}
                  </span>
                )}
                {!activePreset && (
                  <button onClick={() => remove(p.id)}
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-card border border-border text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-warning transition-opacity flex items-center justify-center"
                    aria-label="Remove">
                    <X className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            ))}

            {/* Interactive nodes for presets after simulation */}
            {activePreset && simulated && activePreset.nodes.map((n) => (
              <button
                key={n.data.id}
                onClick={() => setOpenNode(n.data)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group/node"
                style={{ left: n.x, top: n.y }}
                title={n.data.label}
              >
                <span className="block w-4 h-4 rounded-full bg-primary border-2 border-card shadow-[0_0_0_2px_hsl(var(--primary)/0.25)] animate-pulse" />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-primary bg-card/90 border border-border rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover/node:opacity-100 transition-opacity">
                  {n.data.id}
                </span>
              </button>
            ))}
          </div>

          {drawer && (
            <div className="border-t border-border bg-card p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="accent-italic text-xs text-primary">§ Simulated Output</p>
                  <p className="text-[11px] text-muted-foreground">
                    {activePreset ? activePreset.name : `chain: ${chain.map((c) => c.type).join(" → ")}`}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDrawer(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-32 rounded border border-border bg-background graph-paper relative overflow-hidden">
                <svg viewBox="0 0 800 120" preserveAspectRatio="none" className="w-full h-full">
                  <OutputWave gain={hasOpAmp ? gain : 1} smoothed={hasCap || !!activePreset} />
                </svg>
              </div>
              {activePreset && (
                <p className="text-[11px] text-muted-foreground mt-2 accent-italic">
                  ▸ Tip: click the highlighted nodes on the schematic to see per-stage waveforms and explanations.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Node explanation dialog */}
      <Dialog open={!!openNode} onOpenChange={(o) => !o && setOpenNode(null)}>
        <DialogContent className="max-w-md">
          {openNode && (
            <>
              <DialogHeader>
                <DialogTitle className="accent-italic text-primary">{openNode.label}</DialogTitle>
                <DialogDescription>Live behaviour at this point in the signal chain.</DialogDescription>
              </DialogHeader>
              <div className="border border-border rounded bg-background graph-paper p-2">
                <NodeWaveform signal={openNode.signal} />
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed mt-1">{openNode.explanation}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const OutputWave = ({ gain, smoothed }: { gain: number; smoothed: boolean }) => {
  const amp = Math.min(50, 3 + gain * 3.5);
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
