import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Link2, Calendar, UserPlus, MessageSquare,
  Award, Heart, CircuitBoard, Activity, Brain, Eye, Users, BarChart3, BookOpen, Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const skills = [
  { name: "ECG Analysis", level: 82, icon: Heart },
  { name: "Circuit Design", level: 65, icon: CircuitBoard },
  { name: "Signal Processing", level: 70, icon: Activity },
  { name: "Medical Imaging", level: 45, icon: Brain },
];

const projects = [
  { title: "ECG Signal Analyzer", objective: "Detect arrhythmias from real-time ECG data using bandpass filtering and QRS detection.", outcome: "Achieved 92% detection accuracy across 4 arrhythmia classes.", progress: 92, type: "Simulation" },
  { title: "Bandpass Filter Circuit", objective: "Design a 0.05–100 Hz active Butterworth filter for biomedical signal acquisition.", outcome: "Stable response with <2 dB ripple in passband.", progress: 100, type: "Circuit" },
  { title: "Patient Monitor Dashboard", objective: "Build a multi-parameter monitoring simulation (HR, SpO₂, BP).", outcome: "In progress — UI complete, signal pipeline pending.", progress: 55, type: "Simulation" },
  { title: "EEG Amplifier Design", objective: "Design a low-noise instrumentation amplifier for EEG acquisition.", outcome: "Schematic drafted; awaiting noise-floor measurement.", progress: 30, type: "Circuit" },
];

const activityFeed = [
  { text: "Completed ECG Signal Simulation", time: "2 hours ago", icon: Heart },
  { text: "Built a bandpass filter circuit", time: "5 hours ago", icon: CircuitBoard },
  { text: "Posted in #medical-imaging", time: "yesterday", icon: MessageSquare },
  { text: "Earned 'Signal Master' badge", time: "2 days ago", icon: Award },
  { text: "Started Patient Monitor simulation", time: "3 days ago", icon: Activity },
  { text: "Connected with Dr. Sarah Chen", time: "4 days ago", icon: Users },
];

const connections = [
  { name: "Dr. Sarah Chen", role: "Mentor", institution: "MIT", mutual: 5 },
  { name: "Ahmed Khan", role: "Student", institution: "Stanford", mutual: 12 },
  { name: "Prof. Williams", role: "Admin", institution: "Johns Hopkins", mutual: 8 },
  { name: "Maria Lopez", role: "Student", institution: "UCLA", mutual: 3 },
  { name: "David Kim", role: "Mentor", institution: "KAIST", mutual: 6 },
  { name: "Fatima Ali", role: "Student", institution: "Oxford", mutual: 2 },
];

const badges = [
  { name: "Signal Master", desc: "Complete 5 signal simulations", earned: true },
  { name: "Circuit Pro", desc: "Build 3 complete circuits", earned: true },
  { name: "Community Star", desc: "50+ helpful posts", earned: true },
  { name: "Quick Learner", desc: "3 simulations in a day", earned: false },
  { name: "Lab Expert", desc: "Master all device simulations", earned: false },
];

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <div className="min-h-screen bg-background notebook-grid">
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:bg-accent mr-3">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <p className="accent-italic text-[11px] text-muted-foreground leading-none">Researcher Profile</p>
      </header>

      <ScrollArea className="h-[calc(100vh-56px)]">
        <div className="max-w-4xl mx-auto p-8 space-y-6">
          {/* Profile header — academic */}
          <div className="paper-card p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-full border border-border bg-accent flex items-center justify-center text-2xl text-accent-foreground">
                  JD
                </div>
                <div>
                  <h2 className="text-xl text-foreground font-medium">Jane Doe</h2>
                  <p className="accent-italic text-sm text-primary mt-0.5">Biomedical Engineering Student</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Ziauddin University</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined Jan 2025</span>
                    <span className="flex items-center gap-1"><Link2 className="h-3 w-3" /> github.com/janedoe</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-border hover:bg-accent">
                  <MessageSquare className="h-4 w-4 mr-1.5" /> Message
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <UserPlus className="h-4 w-4 mr-1.5" /> Connect
                </Button>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-border">
              <p className="accent-italic text-xs text-primary mb-2">§ Bio</p>
              <p className="text-sm text-foreground/85 leading-relaxed max-w-2xl">
                Researching biomedical signal processing and medical-device design. Currently focused on low-noise amplification for portable ECG systems.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-border">
              {[
                { label: "Connections", value: "128" },
                { label: "Projects", value: "24" },
                { label: "Simulations", value: "12" },
                { label: "Badges", value: "3" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl text-foreground font-medium">{s.value}</p>
                  <p className="accent-italic text-[11px] text-muted-foreground">{s.label.toLowerCase()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="paper-card p-6">
            <p className="accent-italic text-sm text-primary mb-4">§ Skills & Progress</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {skills.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground flex items-center gap-2">
                      <s.icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                      {s.name}
                    </span>
                    <span className="text-xs font-mono text-primary">{s.level}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1">
                    <div className="bg-primary h-1 rounded-full" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="paper-card p-6">
            <p className="accent-italic text-sm text-primary mb-4">§ Achievements</p>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <div
                  key={b.name}
                  className={`flex items-center gap-2 px-3 py-2 rounded border transition-colors ${
                    b.earned ? "border-primary bg-accent" : "border-border bg-muted opacity-60"
                  }`}
                >
                  <Award className={`h-4 w-4 ${b.earned ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-foreground">{b.name}</p>
                    <p className="text-[10px] text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-muted border border-border">
              <TabsTrigger value="projects" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <BookOpen className="h-3 w-3 mr-1" /> Projects
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <BarChart3 className="h-3 w-3 mr-1" /> Activity
              </TabsTrigger>
              <TabsTrigger value="connections" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Users className="h-3 w-3 mr-1" /> Connections
              </TabsTrigger>
            </TabsList>

            {/* Projects — mini lab reports */}
            <TabsContent value="projects" className="space-y-3">
              {projects.map((p) => (
                <article key={p.title} className="paper-card p-5">
                  <header className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="accent-italic text-[11px] text-primary mb-0.5">{p.type.toLowerCase()} · report</p>
                      <h4 className="text-base text-foreground font-medium">{p.title}</h4>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-accent">
                      <Eye className="h-3 w-3 mr-1" /> View
                    </Button>
                  </header>
                  <div className="space-y-2 pl-3 border-l border-border">
                    <div>
                      <p className="accent-italic text-[11px] text-muted-foreground">objective</p>
                      <p className="text-xs text-foreground/85">{p.objective}</p>
                    </div>
                    <div>
                      <p className="accent-italic text-[11px] text-muted-foreground">outcome</p>
                      <p className="text-xs text-foreground/85">{p.outcome}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-1">
                      <div className="bg-primary h-1 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground accent-italic">{p.progress}%</span>
                  </div>
                </article>
              ))}
            </TabsContent>

            <TabsContent value="activity">
              <div className="paper-card divide-y divide-border">
                {activityFeed.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <item.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
                    <p className="text-sm text-foreground flex-1">{item.text}</p>
                    <p className="text-[11px] text-muted-foreground accent-italic">{item.time}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="connections">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {connections.map((c) => (
                  <div key={c.name} className="paper-card p-4 flex items-center gap-3 hover-tint">
                    <div className="w-10 h-10 rounded-full bg-accent border border-border flex items-center justify-center text-xs text-accent-foreground">
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground accent-italic">{c.role.toLowerCase()} · {c.institution}</p>
                      <p className="text-[10px] text-muted-foreground">{c.mutual} mutual</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs border-border hover:bg-accent">
                      <UserPlus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Profile;
