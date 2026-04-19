import { useNavigate } from "react-router-dom";
import { ArrowLeft, MousePointer, Cpu, Zap, Radio, CircuitBoard, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const components = [
  { name: "Resistor", icon: Minus, symbol: "R" },
  { name: "Capacitor", icon: Zap, symbol: "C" },
  { name: "Op-Amp", icon: Cpu, symbol: "U" },
  { name: "Sensor", icon: Radio, symbol: "S" },
];

const SNAP = 20;

const CircuitBuilder = () => {
  const navigate = useNavigate();
  const [placed, setPlaced] = useState<{ name: string; x: number; y: number; id: number }[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / SNAP) * SNAP;
    const y = Math.round((e.clientY - rect.top) / SNAP) * SNAP;
    setPlaced((prev) => [...prev, { name: dragging, x, y, id: Date.now() }]);
    setDragging(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CircuitBoard className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <div>
            <p className="accent-italic text-[11px] text-muted-foreground leading-none">Workspace</p>
            <h1 className="text-sm text-foreground font-medium leading-tight mt-0.5">Circuit Builder</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPlaced([])} className="text-xs border-border hover:bg-accent">
            <Trash2 className="h-3 w-3 mr-1" /> Clear
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
            Simulate Output
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Components panel */}
        <aside className="w-52 border-r border-border bg-card p-4 space-y-1 shrink-0">
          <p className="accent-italic text-xs text-primary mb-3">§ Components</p>
          {components.map((c) => (
            <div
              key={c.name}
              draggable
              onDragStart={() => setDragging(c.name)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-border bg-card cursor-grab active:cursor-grabbing hover-tint text-sm"
            >
              <div className="w-7 h-7 rounded border border-border flex items-center justify-center bg-background">
                <c.icon className="h-3.5 w-3.5 text-foreground" strokeWidth={1.5} />
              </div>
              <span className="text-foreground">{c.name}</span>
              <span className="ml-auto accent-italic text-[11px] text-muted-foreground">{c.symbol}</span>
            </div>
          ))}

          <div className="pt-4 mt-4 border-t border-border">
            <p className="accent-italic text-xs text-primary mb-2">§ Notes</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Drag components onto the graph paper. Items snap to the {SNAP}px grid for clean schematic alignment.
            </p>
          </div>
        </aside>

        {/* Workspace */}
        <div
          className="flex-1 graph-paper relative overflow-hidden"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {placed.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <MousePointer className="h-6 w-6 mb-3 opacity-40" strokeWidth={1.5} />
              <p className="accent-italic text-sm">Drag components onto the graph paper</p>
              <p className="text-xs mt-1">Snap-to-grid · {SNAP}px</p>
            </div>
          )}
          {placed.map((p) => {
            const comp = components.find((c) => c.name === p.name);
            return (
              <div
                key={p.id}
                className="absolute bg-card border border-border rounded px-2.5 py-1.5 flex items-center gap-2 cursor-move hover:border-primary transition-colors shadow-[0_1px_0_hsl(var(--border))]"
                style={{ left: p.x - 36, top: p.y - 14 }}
              >
                {comp && <comp.icon className="h-3.5 w-3.5 text-foreground" strokeWidth={1.5} />}
                <span className="text-xs text-foreground">{p.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CircuitBuilder;
