import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import EcgBackground from "@/components/EcgBackground";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background ecg-grid">
      <EcgBackground />
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 glow-green">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground glow-text-green">ClinSim</h1>
          </div>

          <h2 className="text-lg font-semibold text-foreground text-center mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm text-center mb-6">Sign in to continue your simulations</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50 border-border focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/50 border-border focus:border-primary"
              />
            </div>

            <div className="text-right">
              <button type="button" className="text-xs text-primary hover:underline">Forgot Password?</button>
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">Don't have an account? </span>
            <button onClick={() => navigate("/signup")} className="text-sm text-primary hover:underline font-medium">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
