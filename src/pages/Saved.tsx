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
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-sm font-semibold text-foreground ml-3">Saved Projects</h1>
      </header>
      <main className="max-w-3xl mx-auto p-6 space-y-3">
        {savedItems.map((item) => (
          <div key={item.name} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {item.type === "circuit" ? <CircuitBoard className="h-5 w-5 text-neon-blue" /> : <FileText className="h-5 w-5 text-primary" />}
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-primary/10" onClick={() => navigate(item.type === "circuit" ? "/circuit-builder" : "/simulation")}>
                <Play className="h-3 w-3 mr-1" /> Resume
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
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
