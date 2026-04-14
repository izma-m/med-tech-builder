import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Zap, Brain, CircuitBoard } from "lucide-react";
import { Button } from "@/components/ui/button";

const skills = [
  { name: "Signal Understanding", progress: 72, icon: Zap, color: "bg-primary" },
  { name: "Circuit Design", progress: 45, icon: CircuitBoard, color: "bg-neon-blue" },
  { name: "System Thinking", progress: 60, icon: Brain, color: "bg-neon-cyan" },
];

const achievements = [
  { name: "First Simulation", desc: "Completed your first simulation", unlocked: true },
  { name: "Circuit Architect", desc: "Built 5 circuits", unlocked: true },
  { name: "Signal Master", desc: "Analyzed all bio-signal types", unlocked: false },
  { name: "Fault Finder", desc: "Detected 10 faults", unlocked: false },
];

const Progress = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-sm font-semibold text-foreground ml-3">My Progress</h1>
      </header>
      <main className="max-w-3xl mx-auto p-6 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Skill Progress</h2>
          <div className="space-y-4">
            {skills.map((s) => (
              <div key={s.name} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <s.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                  </div>
                  <span className="text-xs font-mono text-primary">{s.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`${s.color} h-2 rounded-full transition-all`} style={{ width: `${s.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <div key={a.name} className={`border rounded-xl p-4 ${a.unlocked ? "bg-card border-primary/20" : "bg-muted/30 border-border opacity-50"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className={`h-4 w-4 ${a.unlocked ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium text-foreground">{a.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Progress;
