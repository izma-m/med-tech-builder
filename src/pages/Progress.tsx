import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Zap, Brain, CircuitBoard, Heart, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const skills = [
  { name: "Signal Understanding", progress: 72, icon: Zap },
  { name: "Circuit Design", progress: 45, icon: CircuitBoard },
  { name: "System Thinking", progress: 60, icon: Brain },
  { name: "Bio-Signal Analysis", progress: 80, icon: Heart },
];

const log = [
  { date: "Apr 18", entry: "Completed ECG arrhythmia simulation", category: "Simulation", score: "92%" },
  { date: "Apr 16", entry: "Built bandpass filter circuit", category: "Circuit", score: "100%" },
  { date: "Apr 14", entry: "Patient monitor dashboard — UI", category: "Simulation", score: "55%" },
  { date: "Apr 11", entry: "EEG amplifier schematic draft", category: "Circuit", score: "30%" },
  { date: "Apr 09", entry: "Signal processing reading week 3", category: "Concept", score: "—" },
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
    <div className="min-h-screen bg-background notebook-grid">
      <header className="h-14 border-b border-border bg-card flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="ml-3">
          <p className="accent-italic text-[11px] text-muted-foreground leading-none">Tracking Sheet</p>
          <h1 className="text-sm text-foreground font-medium leading-tight mt-0.5">My Progress</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Skills */}
        <section>
          <p className="accent-italic text-sm text-primary mb-4">§ Skill Log</p>
          <div className="paper-card divide-y divide-border">
            {skills.map((s) => (
              <div key={s.name} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <s.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
                    <span className="text-sm text-foreground">{s.name}</span>
                  </div>
                  <span className="text-xs font-mono text-primary">{s.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div className="bg-primary h-1 rounded-full" style={{ width: `${s.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity log table */}
        <section>
          <p className="accent-italic text-sm text-primary mb-4">§ Lab Log</p>
          <div className="paper-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-2.5 accent-italic text-xs text-muted-foreground font-normal">date</th>
                  <th className="text-left px-5 py-2.5 accent-italic text-xs text-muted-foreground font-normal">entry</th>
                  <th className="text-left px-5 py-2.5 accent-italic text-xs text-muted-foreground font-normal">category</th>
                  <th className="text-right px-5 py-2.5 accent-italic text-xs text-muted-foreground font-normal">score</th>
                </tr>
              </thead>
              <tbody>
                {log.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/40 transition-colors">
                    <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{row.date}</td>
                    <td className="px-5 py-3 text-foreground">{row.entry}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground accent-italic">{row.category.toLowerCase()}</td>
                    <td className="px-5 py-3 text-xs font-mono text-primary text-right">{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Achievements */}
        <section>
          <p className="accent-italic text-sm text-primary mb-4">§ Achievements</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <div
                key={a.name}
                className={`paper-card p-4 flex items-center gap-3 ${a.unlocked ? "" : "opacity-50"}`}
              >
                <Award className={`h-4 w-4 ${a.unlocked ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Progress;
