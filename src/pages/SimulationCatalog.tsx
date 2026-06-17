import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Activity, Stethoscope, Monitor, Pill, HeartPulse, Accessibility, FlaskConical,
  CircuitBoard, BarChart3, FolderOpen, Settings, Home, Search, Bell, ChevronRight,
  MessageSquare, User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import logoAsset from "@/assets/sim-ie-logo.png.asset.json";

const navItems = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Simulations", icon: Monitor, path: "/simulation" },
  { label: "Circuit Builder", icon: CircuitBoard, path: "/circuit-builder" },
  { label: "Community", icon: MessageSquare, path: "/community" },
  { label: "My Profile", icon: User, path: "/profile" },
  { label: "My Progress", icon: BarChart3, path: "/progress" },
  { label: "Saved Projects", icon: FolderOpen, path: "/saved" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const categories = [
  {
    title: "Diagnostic Devices", icon: Stethoscope,
    items: [
      { name: "ECG Machine", slug: "ecg-machine", desc: "12-lead cardiac diagnostics" },
      { name: "EEG System", slug: "eeg-system", desc: "Brain wave acquisition" },
      { name: "Ultrasound", slug: "ultrasound", desc: "Echo & doppler imaging" },
      { name: "MRI Scanner", slug: "mri", desc: "Magnetic resonance imaging" },
    ],
  },
  {
    title: "Monitoring Devices", icon: Monitor,
    items: [
      { name: "Patient Monitor", slug: "patient-monitor", desc: "Multi-parameter vitals" },
      { name: "Pulse Oximeter", slug: "pulse-oximeter", desc: "SpO₂ + plethysmography" },
      { name: "Holter Recorder", slug: "holter", desc: "Ambulatory ECG" },
    ],
  },
  {
    title: "Therapeutic Devices", icon: Pill,
    items: [
      { name: "Infusion Pump", slug: "infusion-pump", desc: "Drug delivery control" },
      { name: "Defibrillator", slug: "defibrillator", desc: "Cardiac rhythm therapy" },
      { name: "Electrosurgical Unit", slug: "esu", desc: "Cut & coagulation unit" },
    ],
  },
  {
    title: "Life Support Devices", icon: HeartPulse,
    items: [
      { name: "Ventilator", slug: "ventilator", desc: "Mechanical respiration" },
      { name: "Anesthesia Machine", slug: "anesthesia", desc: "Gas + ventilation mix" },
      { name: "ECMO Console", slug: "ecmo", desc: "Extracorporeal oxygenation" },
    ],
  },
  {
    title: "Rehabilitation Devices", icon: Accessibility,
    items: [
      { name: "TENS Unit", slug: "tens", desc: "Nerve stimulation" },
      { name: "Smart Prosthetics", slug: "prosthetics", desc: "EMG-driven actuation" },
      { name: "Gait Analyzer", slug: "gait", desc: "Motion + force sensing" },
    ],
  },
  {
    title: "Laboratory / Analytical Devices", icon: FlaskConical,
    items: [
      { name: "Blood Analyzer", slug: "blood-analyzer", desc: "CBC & chemistry panels" },
      { name: "Centrifuge", slug: "centrifuge", desc: "Sample separation" },
      { name: "Spectrophotometer", slug: "spectro", desc: "Absorbance measurement" },
    ],
  },
];

const SimulationCatalog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = categories
    .map((cat) => {
      const catMatch = cat.title.toLowerCase().includes(q);
      const items = q
        ? cat.items.filter(
            (it) => catMatch || it.name.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)
          )
        : cat.items;
      return { ...cat, items };
    })
    .filter((cat) => !q || cat.items.length > 0 || cat.title.toLowerCase().includes(q));

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Sim-ie logo" className="h-6 w-6 object-contain" />
            <span className="text-lg text-foreground font-medium">Sim-ie</span>
          </div>
          <p className="accent-italic text-xs text-muted-foreground mt-1 ml-8">lab notebook</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path === "/simulation" && location.pathname.startsWith("/simulation"));
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
      </aside>

      <div className="flex-1 flex flex-col min-w-0 notebook-grid">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search devices…  e.g. ECG, MRI, Infusion Pump"
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <div
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full border border-border bg-accent flex items-center justify-center text-sm text-accent-foreground cursor-pointer hover-tint"
            >
              J
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <section className="max-w-5xl">
            <p className="accent-italic text-primary text-sm mb-1">Catalog</p>
            <h1 className="text-2xl text-foreground font-medium">Simulation Library</h1>
            <div className="flex items-baseline gap-3 mt-1">
              <h2 className="accent-italic text-base text-foreground">Simulation Categories</h2>
              <span className="text-xs text-muted-foreground italic">
                there are 6 main categories in which the medical devices are classified based on their function
              </span>
            </div>
            <div className="w-16 h-px bg-border mt-4" />
          </section>

          <section className="max-w-5xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((cat) => (
              <div key={cat.title} className="paper-card p-5">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                  <cat.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  <h3 className="accent-italic text-foreground">{cat.title}</h3>
                </div>
                <div className="space-y-1">
                  {cat.items.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => navigate(`/simulation/${item.slug}`)}
                      className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded hover-tint group"
                    >
                      <div>
                        <p className="text-sm text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full paper-card p-8 text-center">
                <p className="text-sm text-muted-foreground">No devices match "{query}".</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default SimulationCatalog;
