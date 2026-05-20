import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Hash, Search, Send, Paperclip, Code, Pin, Plus, ArrowLeft,
  Heart, Scan, CircuitBoard, Briefcase, Activity, Reply, ThumbsUp, Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const communities = [
  { id: "general", name: "General Biomedical", icon: Activity },
  { id: "ecg", name: "ECG & Signals", icon: Heart },
  { id: "imaging", name: "Medical Imaging", icon: Scan },
  { id: "circuits", name: "Circuit Design", icon: CircuitBoard },
  { id: "careers", name: "Internship & Careers", icon: Briefcase },
];

const channels = ["general", "questions", "projects", "resources", "announcements"];

type Message = {
  id: number;
  user: string;
  role: "Mentor" | "Admin" | "Student";
  time: string;
  text: string;
  pinned?: boolean;
  code?: string;
  replies?: { user: string; time: string; text: string }[];
};

const fmtTime = (d = new Date()) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const seedGeneral: Message[] = [
  {
    id: 1, user: "Dr. Sarah Jansen", role: "Mentor",
    time: "2:34 PM", pinned: true,
    text: "Welcome to the community. Post questions about signal processing, circuit design, or any simulation work.",
  },
  {
    id: 2, user: "Ahmed Khan", role: "Student",
    time: "3:12 PM",
    text: "Has anyone tried the new arrhythmia simulation mode? The waveform patterns match clinical data very well.",
  },
  {
    id: 3, user: "Prof. Williams", role: "Admin",
    time: "3:45 PM",
    text: "Good observation, Ahmed. Try adjusting the heart rate slider to see how QRS morphology changes across rates.",
  },
];

const seedQuestions: Message[] = [
  {
    id: 10, user: "James Patel", role: "Student",
    time: "4:30 PM",
    text: "Can someone explain the difference between INA128 and AD620 instrumentation amplifiers for ECG applications?",
  },
];

const seedProjects: Message[] = [
  {
    id: 20, user: "Maria Lopez", role: "Student",
    time: "4:02 PM",
    text: "Sharing my bandpass filter circuit for anyone working on the ECG lab assignment.",
    code: `// Bandpass Filter: 0.05 – 100 Hz
const fc_low  = 0.05;
const fc_high = 100;
const order   = 2; // Butterworth`,
  },
];

const initialMessages: Record<string, Message[]> = {
  general: seedGeneral,
  questions: seedQuestions,
  projects: seedProjects,
  resources: [],
  announcements: [],
};

const mentorReplies = [
  "Great point — try logging the value over a full cycle to confirm.",
  "Nice. Have you checked the datasheet for the recommended gain configuration?",
  "Good question. Look at the bandpass response between 0.05 Hz and 100 Hz.",
  "Solid observation. Cross-reference it with the textbook chapter on biopotential amplifiers.",
  "Run it once more under fault mode and compare the trace.",
];

const onlineMembers = [
  { name: "Dr. Sarah Jansen", role: "Mentor", status: "online" },
  { name: "Prof. Williams", role: "Admin", status: "online" },
  { name: "Ahmed Khan", role: "Student", status: "online" },
  { name: "Maria Lopez", role: "Student", status: "online" },
  { name: "James Patel", role: "Student", status: "idle" },
  { name: "Fatima Ali", role: "Student", status: "online" },
];

const roleColor: Record<string, string> = {
  Admin: "text-destructive",
  Mentor: "text-primary",
  Student: "text-foreground",
};

const Community = () => {
  const navigate = useNavigate();
  const [activeCommunity, setActiveCommunity] = useState("ecg");
  const [activeChannel, setActiveChannel] = useState("general");
  const [message, setMessage] = useState("");
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, Message[]>>(initialMessages);
  const [coLearning, setCoLearning] = useState(false);
  const feedEndRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<number | null>(null);

  const currentCommunity = communities.find(c => c.id === activeCommunity);
  const feed = messagesByChannel[activeChannel] ?? [];

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feed.length, activeChannel]);

  useEffect(() => () => {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
  }, []);

  const send = () => {
    const text = message.trim();
    if (!text) return;
    const channel = activeChannel;
    const userMsg: Message = {
      id: Date.now(),
      user: "User (Student)",
      role: "Student",
      time: fmtTime(),
      text,
    };
    setMessagesByChannel((prev) => ({
      ...prev,
      [channel]: [...(prev[channel] ?? []), userMsg],
    }));
    setMessage("");

    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        user: "Dr. Sarah Jansen",
        role: "Mentor",
        time: fmtTime(),
        text: mentorReplies[Math.floor(Math.random() * mentorReplies.length)],
      };
      setMessagesByChannel((prev) => ({
        ...prev,
        [channel]: [...(prev[channel] ?? []), reply],
      }));
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Communities rail */}
      <div className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="p-4 border-b border-sidebar-border flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="h-8 w-8 text-muted-foreground hover:bg-accent">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="accent-italic text-sm text-foreground">Communities</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {communities.map((c) => (
              <button
                key={c.id}
                onClick={() => { setActiveCommunity(c.id); setActiveChannel("general"); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeCommunity === c.id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-accent"
                }`}
              >
                <c.icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span className="truncate">{c.name}</span>
              </button>
            ))}
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent transition-colors mt-2">
              <Plus className="h-3.5 w-3.5" />
              <span className="accent-italic">new community</span>
            </button>
          </div>
        </ScrollArea>
      </div>

      {/* Channels */}
      <div className="w-56 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <p className="accent-italic text-xs text-primary">{currentCommunity?.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">channel index</p>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-0.5">
            {channels.map((ch) => (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  activeChannel === ch
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <Hash className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                {ch}
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent border border-border flex items-center justify-center text-[11px] text-accent-foreground">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground truncate">Jane Doe</p>
              <p className="text-[10px] text-primary accent-italic">online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 notebook-grid">
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span className="accent-italic text-foreground">{activeChannel}</span>
            <span className="text-xs text-muted-foreground ml-2">— {currentCommunity?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={coLearning ? "default" : "outline"}
              onClick={() => setCoLearning((v) => !v)}
              className={`text-xs ${coLearning ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-border hover:bg-accent"}`}
            >
              <Plus className="h-3 w-3 mr-1" />
              {coLearning ? "End session" : "Start Co-Learning Session"}
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search notes…" className="h-8 pl-8 text-xs w-44 bg-card" />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-accent">
              <Pin className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {coLearning && (
          <div className="px-6 py-2 border-b border-border bg-accent/60">
            <p className="text-xs text-accent-foreground">
              <span className="accent-italic">Active room</span> · #{activeChannel}-Lab · 1 participant — waiting for partner…
            </p>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {feed.length === 0 && (
              <p className="text-sm text-muted-foreground accent-italic text-center py-8">
                no notes yet in #{activeChannel}
              </p>
            )}
            {feed.map((msg) => (
              <article key={msg.id} className="group">
                {msg.pinned && (
                  <div className="flex items-center gap-1 text-[10px] text-primary mb-1 accent-italic">
                    <Pin className="h-2.5 w-2.5" /> pinned note
                  </div>
                )}
                <header className="flex items-baseline gap-2 mb-1">
                  <span className={`text-sm font-medium ${roleColor[msg.role]}`}>{msg.user}</span>
                  <span className="text-[11px] text-muted-foreground accent-italic">— {msg.role}</span>
                  <span className="text-[11px] text-muted-foreground ml-auto">{msg.time}</span>
                </header>
                <p className="text-sm text-foreground/85 leading-relaxed pl-3 border-l border-border">
                  {msg.text}
                </p>
                {msg.code && (
                  <pre className="mt-2 ml-3 text-xs font-mono text-foreground/80 bg-muted rounded border border-border p-3 overflow-x-auto">
                    {msg.code}
                  </pre>
                )}
                <div className="hidden group-hover:flex items-center gap-3 mt-2 ml-3 text-muted-foreground">
                  <button className="flex items-center gap-1 text-[11px] hover:text-primary transition-colors">
                    <ThumbsUp className="h-3 w-3" /> agree
                  </button>
                  <button className="flex items-center gap-1 text-[11px] hover:text-primary transition-colors">
                    <Lightbulb className="h-3 w-3" /> insight
                  </button>
                  <button className="flex items-center gap-1 text-[11px] hover:text-primary transition-colors">
                    <Reply className="h-3 w-3" /> reply
                  </button>
                </div>
              </article>
            ))}
            <div ref={feedEndRef} />
          </div>
        </ScrollArea>

        {/* Composer */}
        <div className="p-4 border-t border-border bg-card">
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="max-w-3xl mx-auto flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background focus-within:border-primary transition-colors"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Add a note to #${activeChannel}…`}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button type="button" className="text-muted-foreground hover:text-primary transition-colors">
              <Code className="h-4 w-4" />
            </button>
            <button type="button" className="text-muted-foreground hover:text-primary transition-colors">
              <Paperclip className="h-4 w-4" />
            </button>
            <Button type="submit" size="icon" className="h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Members */}
      <div className="w-56 border-l border-border bg-sidebar hidden lg:flex flex-col shrink-0">
        <div className="p-4 border-b border-sidebar-border">
          <p className="accent-italic text-xs text-primary">Active members</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{onlineMembers.filter(m => m.status === "online").length} online</p>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-0.5">
            {onlineMembers.map((m) => (
              <div key={m.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer transition-colors">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center text-[10px] text-foreground">
                    {m.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-card ${m.status === "online" ? "bg-primary" : "bg-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs truncate ${roleColor[m.role]}`}>{m.name}</p>
                  <p className="text-[10px] text-muted-foreground accent-italic">{m.role.toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Community;
