import { Activity, Heart, Brain, Monitor, Cpu, Zap, Radio, Scan, Microscope, CircuitBoard, Filter, BarChart3, BookOpen, FolderOpen, Settings, Home, Search, Bell, ChevronRight, Play } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Simulations", icon: Monitor, path: "/simulation" },
  { label: "Circuit Builder", icon: CircuitBoard, path: "/circuit-builder" },
  { label: "Community", icon: Activity, path: "/community" },
  { label: "My Progress", icon: BarChart3, path: "/progress" },
  { label: "Saved Projects", icon: FolderOpen, path: "/saved" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const categories = [
  {
    title: "Bio-Signals",
    icon: Heart,
    color: "text-primary",
    items: [
      { name: "ECG", desc: "Electrocardiogram signals" },
      { name: "EEG", desc: "Brain wave analysis" },
      { name: "EMG", desc: "Muscle signal processing" },
    ],
  },
  {
    title: "Medical Devices",
    icon: Monitor,
    color: "text-neon-blue",
    items: [
      { name: "Patient Monitor", desc: "Multi-parameter monitoring" },
      { name: "Ventilator", desc: "Respiratory system simulation" },
      { name: "Infusion Pump", desc: "Drug delivery systems" },
    ],
  },
  {
    title: "Imaging Systems",
    icon: Scan,
    color: "text-neon-cyan",
    items: [
      { name: "X-Ray", desc: "Radiographic imaging" },
      { name: "CT Scan", desc: "Computed tomography" },
      { name: "MRI", desc: "Magnetic resonance imaging" },
    ],
  },
  {
    title: "Circuit Systems",
    icon: Cpu,
    color: "text-primary",
    items: [
      { name: "Amplifiers", desc: "Signal amplification" },
      { name: "Filters", desc: "Noise reduction circuits" },
      { name: "Sensors", desc: "Biomedical sensor circuits" },
    ],
  },
];

const recentSims = [
  { name: "ECG Signal Analysis", progress: 65 },
  { name: "Op-Amp Filter Design", progress: 40 },
  { name: "Patient Monitor Setup", progress: 20 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-5 flex items-center gap-2 border-b border-border">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground glow-text-green">ClinSim</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="bg-muted rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Pro Tip</p>
            <p className="text-xs text-foreground">Try Fault Injection Mode to simulate device errors</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder='Search simulations... (e.g. "ECG", "MRI")' className="pl-10 bg-muted/50 border-border" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div
              onClick={() => navigate("/profile")}
              className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary cursor-pointer hover:bg-primary/30 transition-colors"
            >
              J
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Welcome */}
          <section className="animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground">Welcome back, <span className="text-primary glow-text-green">Jane</span></h1>
            <p className="text-muted-foreground mt-1">Continue building biomedical systems</p>
          </section>

          {/* Featured */}
          <section className="animate-fade-in" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-neon-blue/5 p-6 glow-green">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded-full mb-3">Featured</span>
                  <h2 className="text-xl font-bold text-foreground mb-1">Build an ECG Machine from Scratch</h2>
                  <p className="text-sm text-muted-foreground mb-4">Learn sensor integration, signal amplification, and real-time monitoring</p>
                  <Button onClick={() => navigate("/simulation")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Play className="h-4 w-4 mr-2" /> Start Simulation
                  </Button>
                </div>
                <div className="hidden md:block">
                  <Heart className="h-24 w-24 text-primary/20 animate-float" />
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Simulation Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div key={cat.title} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <cat.icon className={`h-5 w-5 ${cat.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground">{cat.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {cat.items.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.name}</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4 text-primary hover:bg-primary/10" onClick={() => navigate("/simulation")}>
                    Explore
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Continue Learning */}
          <section className="animate-fade-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentSims.map((sim) => (
                <div key={sim.name} className="bg-card border border-border rounded-xl p-4">
                  <p className="text-sm font-medium text-foreground mb-2">{sim.name}</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                    <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${sim.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{sim.progress}% complete</span>
                    <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-primary/10 h-7" onClick={() => navigate("/simulation")}>
                      Resume
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
