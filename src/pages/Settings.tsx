import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Moon, Sun, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-sm font-semibold text-foreground ml-3">Settings</h1>
      </header>
      <main className="max-w-xl mx-auto p-6 space-y-6">
        <section className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><User className="h-4 w-4" /> Profile</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
              <Input defaultValue="Jane Doe" className="bg-muted/50 border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <Input defaultValue="jane@university.edu" className="bg-muted/50 border-border" />
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><Moon className="h-4 w-4" /> Appearance</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </section>

        <section className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2"><BookOpen className="h-4 w-4" /> Learning Preferences</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Show code examples</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Auto-play simulations</span>
            <Switch defaultChecked />
          </div>
        </section>

        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
      </main>
    </div>
  );
};

export default SettingsPage;
