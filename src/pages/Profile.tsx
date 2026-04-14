import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Link2, Calendar, UserPlus, MessageSquare,
  Award, Zap, Brain, Heart, CircuitBoard, Activity, Eye,
  Users, BarChart3, BookOpen, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const skills = [
  { name: "ECG Analysis", level: 82, icon: Heart },
  { name: "Circuit Design", level: 65, icon: CircuitBoard },
  { name: "Signal Processing", level: 70, icon: Activity },
  { name: "Medical Imaging", level: 45, icon: Brain },
];

const projects = [
  { title: "ECG Signal Analyzer", desc: "Real-time ECG signal processing with arrhythmia detection", progress: 92, type: "Simulation" },
  { title: "Bandpass Filter Circuit", desc: "Active Butterworth bandpass filter for biomedical signals", progress: 100, type: "Circuit" },
  { title: "Patient Monitor Dashboard", desc: "Multi-parameter patient monitoring system simulation", progress: 55, type: "Simulation" },
  { title: "EEG Amplifier Design", desc: "Low-noise instrumentation amplifier for EEG acquisition", progress: 30, type: "Circuit" },
];

const activityFeed = [
  { text: "Completed ECG Signal Simulation", time: "2 hours ago", icon: Heart, color: "text-primary" },
  { text: "Built a bandpass filter circuit", time: "5 hours ago", icon: CircuitBoard, color: "text-neon-blue" },
  { text: "Posted in #medical-imaging", time: "Yesterday", icon: MessageSquare, color: "text-neon-cyan" },
  { text: "Earned 'Signal Master' badge", time: "2 days ago", icon: Award, color: "text-primary" },
  { text: "Started Patient Monitor simulation", time: "3 days ago", icon: Activity, color: "text-neon-blue" },
  { text: "Connected with Dr. Sarah Chen", time: "4 days ago", icon: Users, color: "text-muted-foreground" },
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
  { name: "Quick Learner", desc: "Complete 3 simulations in a day", earned: false },
  { name: "Lab Expert", desc: "Master all device simulations", earned: false },
];

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <header className="h-14 border-b border-border flex items-center px-4 shrink-0 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground mr-3">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-sm font-semibold text-foreground">Profile</h1>
      </header>

      <ScrollArea className="h-[calc(100vh-56px)]">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Profile card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Banner */}
            <div className="h-28 bg-gradient-to-r from-primary/20 via-neon-blue/10 to-primary/5 relative">
              <div className="absolute inset-0 ecg-grid" />
            </div>
            {/* Info */}
            <div className="px-6 pb-6 -mt-10">
              <div className="flex items-end justify-between mb-4">
                <Avatar className="h-20 w-20 border-4 border-card">
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">JD</AvatarFallback>
                </Avatar>
                <div className="flex gap-2 mt-12">
                  <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                    <MessageSquare className="h-4 w-4 mr-1.5" /> Message
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <UserPlus className="h-4 w-4 mr-1.5" /> Connect
                  </Button>
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground">Jane Doe</h2>
              <p className="text-sm text-primary font-medium">Biomedical Engineering Student</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Ziauddin University</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined Jan 2025</span>
                <span className="flex items-center gap-1"><Link2 className="h-3 w-3" /> github.com/janedoe</span>
              </div>
              <p className="text-sm text-foreground/80 mt-3 max-w-lg">
                Passionate about biomedical signal processing and medical device design. Building the future of healthcare technology one circuit at a time. 🔬
              </p>
              {/* Stats */}
              <div className="flex gap-6 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">128</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Connections</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">24</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">12</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Simulations</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">3</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Badges</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Skills & Progress
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground flex items-center gap-2">
                      <skill.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {skill.name}
                    </span>
                    <span className="text-xs text-primary font-mono">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" /> Achievements
            </h3>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                    badge.earned
                      ? "border-primary/30 bg-primary/5 glow-green"
                      : "border-border bg-muted/50 opacity-50"
                  }`}
                >
                  <Award className={`h-4 w-4 ${badge.earned ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-xs font-medium text-foreground">{badge.name}</p>
                    <p className="text-[10px] text-muted-foreground">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs: Projects / Activity / Connections */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-muted border border-border">
              <TabsTrigger value="projects" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <BookOpen className="h-3 w-3 mr-1" /> Projects
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <BarChart3 className="h-3 w-3 mr-1" /> Activity
              </TabsTrigger>
              <TabsTrigger value="connections" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Users className="h-3 w-3 mr-1" /> Connections
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.title} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-border mb-2">{proj.type}</Badge>
                        <h4 className="text-sm font-semibold text-foreground">{proj.title}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{proj.desc}</p>
                    <div className="space-y-2">
                      <div className="w-full bg-muted rounded-full h-1">
                        <div className="bg-primary h-1 rounded-full" style={{ width: `${proj.progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{proj.progress}% complete</span>
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-primary hover:bg-primary/10">
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="bg-card border border-border rounded-xl divide-y divide-border">
                {activityFeed.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{item.text}</p>
                      <p className="text-[10px] text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="connections">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {connections.map((conn) => (
                  <div key={conn.name} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/20 transition-all">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted text-xs text-foreground">
                        {conn.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{conn.name}</p>
                      <p className="text-[10px] text-muted-foreground">{conn.role} · {conn.institution}</p>
                      <p className="text-[10px] text-muted-foreground">{conn.mutual} mutual connections</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs border-border hover:bg-muted shrink-0">
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
