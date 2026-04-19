import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Moon, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-background notebook-grid">
      <header className="h-14 border-b border-border bg-card flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="ml-3">
          <p className="accent-italic text-[11px] text-muted-foreground leading-none">Preferences</p>
          <h1 className="text-sm text-foreground font-medium leading-tight mt-0.5">Settings</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-8 space-y-6">
        <section className="paper-card p-6 space-y-5">
          <div>
            <p className="accent-italic text-sm text-primary flex items-center gap-2"><User className="h-3.5 w-3.5" /> Profile</p>
            <div className="w-8 h-px bg-border mt-2" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Full Name</label>
              <Input defaultValue="Jane Doe" className="field-underline" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Email</label>
              <Input defaultValue="jane@university.edu" className="field-underline" />
            </div>
          </div>
        </section>

        <section className="paper-card p-6 space-y-4">
          <div>
            <p className="accent-italic text-sm text-primary flex items-center gap-2"><Moon className="h-3.5 w-3.5" /> Appearance</p>
            <div className="w-8 h-px bg-border mt-2" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Dark mode</p>
              <p className="text-xs text-muted-foreground">Default is light notebook theme</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </section>

        <section className="paper-card p-6 space-y-4">
          <div>
            <p className="accent-italic text-sm text-primary flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" /> Learning</p>
            <div className="w-8 h-px bg-border mt-2" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Show code examples</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Auto-play simulations</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Show notebook grid</span>
            <Switch defaultChecked />
          </div>
        </section>

        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Save Changes
        </Button>
      </main>
    </div>
  );
};

export default SettingsPage;
