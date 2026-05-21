import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="relative min-h-screen flex items-center justify-center bg-background notebook-grid">
      <EcgBackground />
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-card border border-border rounded-md p-10">
          <div className="text-center mb-8">
            <p className="accent-italic text-primary text-sm tracking-wide mb-1">Lab Notebook · v1</p>
            <h1 className="text-3xl text-foreground font-medium">Sim-ie</h1>
            <div className="w-12 h-px bg-border mx-auto mt-3" />
          </div>

          <h2 className="accent-italic text-base text-ink-muted text-center mb-1">Welcome back</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">Sign in to continue your experiments</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-underline text-foreground"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-underline text-foreground"
              />
            </div>

            <div className="text-right">
              <button type="button" className="text-xs text-primary hover:underline accent-italic">Forgot password?</button>
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-sm text-muted-foreground">New here? </span>
            <button onClick={() => navigate("/signup")} className="text-sm text-primary hover:underline accent-italic">
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
