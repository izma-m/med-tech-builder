import { useNavigate } from "react-router-dom";
import { ArrowLeft, MousePointer, Cpu, Zap, Radio, CircuitBoard, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const components = [
  { name: "Resistor", icon: Minus, color: "text-primary" },
  { name: "Capacitor", icon: Zap, color: "text-neon-blue" },
  { name: "Op-Amp", icon: Cpu, color: "text-neon-cyan" },
  { name: "Sensor", icon: Radio, color: "text-primary" },
];

const CircuitBuilder = () => {
  const navigate = useNavigate();
  const [placed, setPlaced] = useState<{ name: string; x: number; y: number }[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPlaced((prev) => [...prev, { name: dragging, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setDragging(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CircuitBoard className="h-5 w-5 text-primary" />
          <h1 className="text-sm font-semibold text-foreground">Circuit Builder</h1>
        </div>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">Simulate Output</Button>
      </header>

      <div className="flex-1 flex">
        {/* Components panel */}
        <aside className="w-48 border-r border-border p-4 space-y-2 shrink-0">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Components</h3>
          {components.map((c) => (
            <div
              key={c.name}
              draggable
              onDragStart={() => setDragging(c.name)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card cursor-grab hover:border-primary/30 transition-colors text-sm"
            >
              <c.icon className={`h-4 w-4 ${c.color}`} />
              <span className="text-foreground">{c.name}</span>
            </div>
          ))}
        </aside>

        {/* Workspace */}
        <div
          className="flex-1 ecg-grid relative"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {placed.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <MousePointer className="h-8 w-8 mb-3 opacity-30" />
              <p className="text-sm">Drag components here to build your circuit</p>
            </div>
          )}
          {placed.map((p, i) => {
            const comp = components.find((c) => c.name === p.name);
            return (
              <div
                key={i}
                className="absolute bg-card border border-primary/30 rounded-lg px-3 py-2 flex items-center gap-2 glow-green cursor-move"
                style={{ left: p.x - 40, top: p.y - 20 }}
              >
                {comp && <comp.icon className={`h-4 w-4 ${comp.color}`} />}
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
