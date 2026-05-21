import { Activity, Stethoscope, Monitor, Pill, HeartPulse, Accessibility, FlaskConical, CircuitBoard, BarChart3, FolderOpen, Settings, Home, Search, Bell, ChevronRight, Play, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Simulations", icon: Monitor, path: "/simulation" },
  { label: "Circuit Builder", icon: CircuitBoard, path: "/circuit-builder" },
  { label: "Community", icon: MessageSquare, path: "/community" },
  { label: "My Progress", icon: BarChart3, path: "/progress" },
  { label: "Saved Projects", icon: FolderOpen, path: "/saved" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const categories = [
  {
    title: "Diagnostic Devices",
    icon: Stethoscope,
    items: [
      { name: "ECG Machine", desc: "12-lead cardiac diagnostics" },
      { name: "EEG System", desc: "Brain wave acquisition" },
      { name: "Ultrasound", desc: "Echo & doppler imaging" },
    ],
  },
  {
    title: "Monitoring Devices",
    icon: Monitor,
    items: [
      { name: "Patient Monitor", desc: "Multi-parameter vitals" },
      { name: "Pulse Oximeter", desc: "SpO₂ + plethysmography" },
      { name: "Holter Recorder", desc: "Ambulatory ECG" },
    ],
  },
  {
    title: "Therapeutic Devices",
    icon: Pill,
    items: [
      { name: "Infusion Pump", desc: "Drug delivery control" },
      { name: "Defibrillator", desc: "Cardiac rhythm therapy" },
      { name: "Electrosurgical", desc: "Cut & coagulation unit" },
    ],
  },
  {
    title: "Life Support Devices",
    icon: HeartPulse,
    items: [
      { name: "Ventilator", desc: "Mechanical respiration" },
      { name: "Anesthesia Machine", desc: "Gas + ventilation mix" },
      { name: "ECMO Console", desc: "Extracorporeal oxygenation" },
    ],
  },
  {
    title: "Rehabilitation Devices",
    icon: Accessibility,
    items: [
      { name: "TENS Unit", desc: "Nerve stimulation" },
      { name: "Smart Prosthetics", desc: "EMG-driven actuation" },
      { name: "Gait Analyzer", desc: "Motion + force sensing" },
    ],
  },
  {
    title: "Laboratory / Analytical Devices",
    icon: FlaskConical,
    items: [
      { name: "Blood Analyzer", desc: "CBC & chemistry panels" },
      { name: "Centrifuge", desc: "Sample separation" },
      { name: "Spectrophotometer", desc: "Absorbance measurement" },
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
      <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-lg text-foreground font-medium">Sim-ie</span>
          </div>
          <p className="accent-italic text-xs text-muted-foreground mt-1 ml-7">lab notebook</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="border border-border rounded-md p-3 bg-card">
            <p className="accent-italic text-xs text-primary mb-1">tip</p>
            <p className="text-xs text-foreground/80 leading-relaxed">Try Fault Injection Mode to study device error patterns.</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 notebook-grid">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search simulations…  e.g. ECG, MRI" className="pl-10 bg-card border-border" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>
            <div
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full border border-border bg-accent flex items-center justify-center text-sm text-accent-foreground cursor-pointer hover-tint"
            >
              J
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Welcome */}
          <section className="animate-fade-in max-w-5xl">
            <p className="accent-italic text-primary text-sm mb-1">Today's Page</p>
            <h1 className="text-2xl text-foreground font-medium">Welcome back, Jane</h1>
            <p className="text-sm text-muted-foreground mt-1">Continue documenting your biomedical experiments.</p>
            <div className="w-16 h-px bg-border mt-4" />
          </section>

          {/* Featured */}
          <section className="animate-fade-in max-w-5xl" style={{ animationDelay: "0.05s", opacity: 0 }}>
            <div className="paper-card p-6 flex items-center justify-between gap-6">
              <div className="flex-1">
                <span className="accent-italic text-xs text-primary">featured experiment</span>
                <h2 className="text-lg text-foreground font-medium mt-1">Build an ECG Machine from Scratch</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-md">
                  Sensor integration · signal amplification · real-time monitoring
                </p>
                <Button onClick={() => navigate("/simulation")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Play className="h-4 w-4 mr-2" /> Start Experiment
                </Button>
              </div>
              <div className="hidden md:flex w-40 h-32 items-center justify-center border border-border rounded-md bg-accent/40 p-2">
                <EcgMachineIcon className="w-full h-full text-primary" />
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="animate-fade-in max-w-5xl" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="accent-italic text-lg text-foreground">Simulation Categories</h2>
              <span className="text-xs text-muted-foreground">{categories.length} sections</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.title} className="paper-card p-5 hover-tint cursor-pointer group">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                    <cat.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    <h3 className="accent-italic text-foreground">{cat.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {cat.items.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-foreground">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4 text-primary hover:bg-accent" onClick={() => navigate("/simulation")}>
                    Open
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Continue Learning */}
          <section className="animate-fade-in max-w-5xl pb-8" style={{ animationDelay: "0.15s", opacity: 0 }}>
            <h2 className="accent-italic text-lg text-foreground mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentSims.map((sim) => (
                <div key={sim.name} className="paper-card p-4">
                  <p className="text-sm text-foreground mb-3">{sim.name}</p>
                  <div className="w-full bg-muted rounded-full h-1 mb-3">
                    <div className="bg-primary h-1 rounded-full" style={{ width: `${sim.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground accent-italic">{sim.progress}% complete</span>
                    <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-accent h-7" onClick={() => navigate("/simulation")}>
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
