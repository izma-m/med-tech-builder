import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Hash, Volume2, Pin, Search, Send, Smile, Paperclip, Code,
  Users, Crown, Shield, GraduationCap, ChevronDown, Plus,
  Heart, Brain, Scan, CircuitBoard, Briefcase, MessageSquare,
  ThumbsUp, Flame, Lightbulb, Reply, ArrowLeft, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const communities = [
  { id: "general", name: "General Biomedical", icon: Activity, color: "text-primary" },
  { id: "ecg", name: "ECG & Signals", icon: Heart, color: "text-primary" },
  { id: "imaging", name: "Medical Imaging", icon: Scan, color: "text-neon-cyan" },
  { id: "circuits", name: "Circuit Design", icon: CircuitBoard, color: "text-neon-blue" },
  { id: "careers", name: "Internship & Careers", icon: Briefcase, color: "text-muted-foreground" },
];

const channels = [
  { id: "general", name: "general", icon: Hash },
  { id: "questions", name: "questions", icon: Hash },
  { id: "projects", name: "projects", icon: Hash },
  { id: "resources", name: "resources", icon: Hash },
  { id: "announcements", name: "announcements", icon: Volume2 },
];

const mockMessages = [
  {
    id: 1, user: "Dr. Sarah Chen", avatar: "SC", role: "Mentor",
    time: "Today at 2:34 PM", pinned: true,
    text: "Welcome to the ECG & Signals community! 🎉 Feel free to ask questions about signal processing, circuit design, or any simulation-related topics.",
    reactions: [{ emoji: "👍", count: 12 }, { emoji: "🔥", count: 5 }],
  },
  {
    id: 2, user: "Ahmed Khan", avatar: "AK", role: "Student",
    time: "Today at 3:12 PM",
    text: "Has anyone tried the new arrhythmia simulation mode? The waveform patterns are really accurate compared to the textbook!",
    reactions: [{ emoji: "💡", count: 3 }],
  },
  {
    id: 3, user: "Prof. Williams", avatar: "PW", role: "Admin",
    time: "Today at 3:45 PM",
    text: "Great observation Ahmed! The arrhythmia model uses actual clinical data patterns. Try adjusting the heart rate slider to see how different rates affect the QRS complex morphology.",
    reactions: [{ emoji: "👍", count: 8 }, { emoji: "💡", count: 4 }],
  },
  {
    id: 4, user: "Maria Lopez", avatar: "ML", role: "Student",
    time: "Today at 4:02 PM",
    text: "I built a bandpass filter circuit in the Circuit Builder — sharing it here for anyone working on the ECG lab assignment.",
    reactions: [{ emoji: "🔥", count: 7 }, { emoji: "👍", count: 3 }],
    hasCode: true, code: `// Bandpass Filter: 0.05 - 100 Hz\nconst fc_low = 0.05;\nconst fc_high = 100;\nconst order = 2; // Butterworth`,
  },
  {
    id: 5, user: "James Patel", avatar: "JP", role: "Student",
    time: "Today at 4:30 PM",
    text: "Can someone explain the difference between the INA128 and AD620 instrumentation amplifiers for ECG applications?",
    reactions: [],
  },
];

const onlineMembers = [
  { name: "Dr. Sarah Chen", role: "Mentor", status: "online" },
  { name: "Prof. Williams", role: "Admin", status: "online" },
  { name: "Ahmed Khan", role: "Student", status: "online" },
  { name: "Maria Lopez", role: "Student", status: "online" },
  { name: "James Patel", role: "Student", status: "idle" },
  { name: "Fatima Ali", role: "Student", status: "online" },
  { name: "David Kim", role: "Mentor", status: "idle" },
];

const roleConfig: Record<string, { color: string; icon: typeof Crown }> = {
  Admin: { color: "text-destructive", icon: Crown },
  Mentor: { color: "text-neon-blue", icon: Shield },
  Student: { color: "text-primary", icon: GraduationCap },
};

const Community = () => {
  const navigate = useNavigate();
  const [activeCommunity, setActiveCommunity] = useState("ecg");
  const [activeChannel, setActiveChannel] = useState("general");
  const [message, setMessage] = useState("");

  const currentCommunity = communities.find(c => c.id === activeCommunity);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Server icons sidebar */}
      <div className="w-[72px] bg-card/50 border-r border-border flex flex-col items-center py-3 gap-2 shrink-0">
        <Button
          variant="ghost" size="icon"
          onClick={() => navigate("/dashboard")}
          className="w-12 h-12 rounded-2xl bg-muted hover:bg-primary/20 hover:rounded-xl transition-all mb-2"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Button>
        <div className="w-8 h-[2px] bg-border rounded-full mb-1" />
        {communities.map((c) => (
          <button
            key={c.id}
            onClick={() => { setActiveCommunity(c.id); setActiveChannel("general"); }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:rounded-xl ${
              activeCommunity === c.id
                ? "bg-primary/20 rounded-xl"
                : "bg-muted hover:bg-muted/80"
            }`}
            title={c.name}
          >
            <c.icon className={`h-5 w-5 ${activeCommunity === c.id ? c.color : "text-muted-foreground"}`} />
          </button>
        ))}
        <div className="w-8 h-[2px] bg-border rounded-full my-1" />
        <button className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center hover:bg-primary/20 hover:rounded-xl transition-all text-primary">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Channels sidebar */}
      <div className="w-60 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <button className="flex items-center justify-between w-full">
            <h2 className="font-semibold text-foreground text-sm">{currentCommunity?.name}</h2>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2">
              Text Channels
            </p>
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                  activeChannel === ch.id
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <ch.icon className="h-4 w-4 shrink-0" />
                {ch.name}
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t border-border bg-card/50">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary text-xs">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">Jane Doe</p>
              <p className="text-[10px] text-primary">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <header className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-foreground text-sm">{activeChannel}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search messages..." className="h-7 pl-8 text-xs w-44 bg-muted/50" />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Pin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl">
            {mockMessages.map((msg) => (
              <div key={msg.id} className={`group flex gap-3 ${msg.pinned ? "relative" : ""}`}>
                {msg.pinned && (
                  <div className="absolute -top-2 left-10 flex items-center gap-1 text-[10px] text-primary">
                    <Pin className="h-2.5 w-2.5" /> Pinned
                  </div>
                )}
                <Avatar className="h-9 w-9 shrink-0 mt-0.5">
                  <AvatarFallback className="bg-muted text-xs text-foreground">{msg.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-semibold ${roleConfig[msg.role]?.color || "text-foreground"}`}>
                      {msg.user}
                    </span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-border">
                      {msg.role}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{msg.text}</p>
                  {msg.hasCode && msg.code && (
                    <pre className="mt-2 text-xs font-mono text-primary/80 bg-muted rounded-lg p-3 border border-border overflow-x-auto">
                      {msg.code}
                    </pre>
                  )}
                  {msg.reactions.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {msg.reactions.map((r, i) => (
                        <button key={i} className="flex items-center gap-1 text-xs bg-muted hover:bg-muted/80 border border-border rounded-full px-2 py-0.5 transition-colors">
                          <span>{r.emoji}</span>
                          <span className="text-muted-foreground">{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Hover actions */}
                  <div className="hidden group-hover:flex items-center gap-1 mt-1">
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Flame className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Lightbulb className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Reply className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2 border border-border focus-within:border-primary/30 transition-colors">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="h-5 w-5" />
            </button>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${activeChannel}`}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <div className="flex items-center gap-1.5">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Code className="h-4 w-4" />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Paperclip className="h-4 w-4" />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Smile className="h-4 w-4" />
              </button>
              <Button size="icon" className="h-7 w-7 rounded-lg bg-primary text-primary-foreground">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Members */}
      <div className="w-60 border-l border-border bg-card/50 hidden lg:flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Online — {onlineMembers.filter(m => m.status === "online").length}
          </h3>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-0.5">
            {onlineMembers.map((member) => {
              const config = roleConfig[member.role];
              return (
                <div key={member.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-muted text-[10px] text-foreground">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                      member.status === "online" ? "bg-primary" : "bg-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${config?.color || "text-foreground"}`}>{member.name}</p>
                    <p className="text-[10px] text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Community;
