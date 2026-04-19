import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CircuitBoard, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const savedItems = [
  { name: "ECG Amplifier Circuit", type: "circuit", date: "Apr 10, 2026" },
  { name: "EEG Signal Analysis", type: "simulation", date: "Apr 8, 2026" },
  { name: "Bandpass Filter Design", type: "circuit", date: "Apr 5, 2026" },
];

const Saved = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background notebook-grid">
      <header className="h-14 border-b border-border bg-card flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="ml-3">
          <p className="accent-italic text-[11px] text-muted-foreground leading-none">Archive</p>
          <h1 className="text-sm text-foreground font-medium leading-tight mt-0.5">Saved Projects</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-8 space-y-3">
        <p className="accent-italic text-sm text-primary mb-2">§ Notebook entries</p>
        {savedItems.map((item) => (
          <div key={item.name} className="paper-card p-4 flex items-center justify-between hover-tint">
            <div className="flex items-center gap-3">
              {item.type === "circuit"
                ? <CircuitBoard className="h-4 w-4 text-primary" strokeWidth={1.5} />
                : <FileText className="h-4 w-4 text-primary" strokeWidth={1.5} />}
              <div>
                <p className="text-sm text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground accent-italic">{item.type} · saved {item.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-accent" onClick={() => navigate(item.type === "circuit" ? "/circuit-builder" : "/simulation")}>
                <Play className="h-3 w-3 mr-1" /> Resume
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-accent h-8 w-8">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Saved;
