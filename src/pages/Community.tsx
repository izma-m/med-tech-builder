import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Hash, Search, Send, Paperclip, Code, Pin, Plus, ArrowLeft, X,
  Heart, Scan, CircuitBoard, Briefcase, Activity, Reply, SmilePlus, Copy,
  Calendar, Users, Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Community = { id: string; name: string; icon: any; channels: string[] };

const initialCommunities: Community[] = [
  { id: "general", name: "General Biomedical", icon: Activity, channels: ["general", "questions", "projects", "resources", "announcements"] },
  { id: "ecg", name: "ECG & Signals", icon: Heart, channels: ["general", "questions", "projects", "resources", "announcements"] },
  { id: "imaging", name: "Medical Imaging", icon: Scan, channels: ["general", "questions", "projects"] },
  { id: "circuits", name: "Circuit Design", icon: CircuitBoard, channels: ["general", "questions", "projects"] },
  { id: "careers", name: "Internship & Careers", icon: Briefcase, channels: ["general", "questions"] },
];

type Reaction = { emoji: string; count: number; reacted: boolean };
type SessionCard = {
  topic: string; duration: string; host: string;
};
type Message = {
  id: number;
  user: string;
  role: "Mentor" | "Admin" | "Student" | "System";
  time: string;
  text?: string;
  pinned?: boolean;
  code?: { language: string; content: string };
  attachments?: { name: string; type: "image" | "file"; previewUrl?: string }[];
  reactions?: Reaction[];
  replies?: { user: string; time: string; text: string }[];
  session?: SessionCard;
};

const fmtTime = (d = new Date()) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const seedKey = (cid: string, ch: string) => `${cid}:${ch}`;

const seedMessages: Record<string, Message[]> = {
  [seedKey("ecg", "general")]: [
    { id: 1, user: "Dr. Sarah Jansen", role: "Mentor", time: "2:34 PM", pinned: true,
      text: "Welcome to the community. Post questions about signal processing, circuit design, or any simulation work." },
    { id: 2, user: "Ahmed Khan", role: "Student", time: "3:12 PM",
      text: "Has anyone tried the new arrhythmia simulation mode? The waveform patterns match clinical data very well.",
      reactions: [{ emoji: "👍", count: 3, reacted: false }] },
  ],
  [seedKey("ecg", "projects")]: [
    { id: 20, user: "Maria Lopez", role: "Student", time: "4:02 PM",
      text: "Sharing my bandpass filter for the ECG lab assignment.",
      code: {
        language: "ts",
        content: `// Bandpass Filter: 0.05 – 100 Hz
const fc_low  = 0.05;
const fc_high = 100;
const order   = 2; // Butterworth`,
      },
      reactions: [
        { emoji: "🚀", count: 2, reacted: false },
        { emoji: "❤️", count: 1, reacted: false },
      ],
    },
  ],
};

const mentorReplies = [
  "Great point — try logging the value over a full cycle to confirm.",
  "Nice. Have you checked the datasheet for the recommended gain configuration?",
  "Good question. Look at the bandpass response between 0.05 Hz and 100 Hz.",
  "Solid observation. Cross-reference it with the textbook chapter on biopotential amplifiers.",
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
  System: "text-primary",
};

const EMOJIS = ["👍", "❤️", "🚀", "🎯", "💡", "👏", "🔥", "🤔"];

const detectLanguage = (s: string) => {
  if (/\b(def |import |print\()/.test(s)) return "python";
  if (/\b(const |let |function |=>)/.test(s)) return "ts";
  if (/#include|int main/.test(s)) return "cpp";
  return "txt";
};

// very light syntax highlighting via spans
const highlightLine = (line: string) => {
  const tokens = line.split(/(\b(?:const|let|var|function|return|if|else|for|while|import|from|def|print|int|float|void|class)\b|\/\/.*$|".*?"|'.*?'|\b\d+(?:\.\d+)?\b)/g);
  return tokens.map((t, i) => {
    if (!t) return null;
    if (/^\/\//.test(t)) return <span key={i} className="text-muted-foreground italic">{t}</span>;
    if (/^["']/.test(t)) return <span key={i} className="text-primary">{t}</span>;
    if (/^\d/.test(t)) return <span key={i} className="text-warning">{t}</span>;
    if (/^(const|let|var|function|return|if|else|for|while|import|from|def|print|int|float|void|class)$/.test(t))
      return <span key={i} className="text-primary font-medium">{t}</span>;
    return <span key={i}>{t}</span>;
  });
};

const CodeBlock = ({ language, content }: { language: string; content: string }) => {
  const copy = () => { navigator.clipboard.writeText(content); toast.success("Code copied"); };
  return (
    <div className="mt-2 rounded-md border border-border bg-muted overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1 bg-card border-b border-border">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{language}</span>
        <button onClick={copy} className="text-[11px] flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <Copy className="h-3 w-3" /> Copy code
        </button>
      </div>
      <pre className="text-xs font-mono p-3 overflow-x-auto leading-relaxed">
        {content.split("\n").map((line, i) => (
          <div key={i}>{highlightLine(line)}</div>
        ))}
      </pre>
    </div>
  );
};

const CommunityPage = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>(initialCommunities);
  const [activeCommunity, setActiveCommunity] = useState("ecg");
  const [activeChannel, setActiveChannel] = useState("general");
  const [message, setMessage] = useState("");
  const [codeMode, setCodeMode] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<{ name: string; type: "image" | "file"; previewUrl?: string }[]>([]);
  const [messagesByKey, setMessagesByKey] = useState<Record<string, Message[]>>(seedMessages);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");

  const [newCommunityOpen, setNewCommunityOpen] = useState(false);
  const [ncName, setNcName] = useState("");
  const [ncDesc, setNcDesc] = useState("");
  const [ncRules, setNcRules] = useState("");

  const [sessionOpen, setSessionOpen] = useState(false);
  const [sessTopic, setSessTopic] = useState("");
  const [sessDuration, setSessDuration] = useState("60");

  const feedEndRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentCommunity = communities.find(c => c.id === activeCommunity)!;
  const key = seedKey(activeCommunity, activeChannel);
  const feed = messagesByKey[key] ?? [];

  useEffect(() => { feedEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [feed.length, key]);
  useEffect(() => () => { if (replyTimer.current) window.clearTimeout(replyTimer.current); }, []);

  const pushMessage = (k: string, msg: Message) => {
    setMessagesByKey((prev) => ({ ...prev, [k]: [...(prev[k] ?? []), msg] }));
  };

  const send = () => {
    const text = message.trim();
    if (!text && pendingAttachments.length === 0) return;
    const k = key;
    const userMsg: Message = {
      id: Date.now(),
      user: "User (Student)",
      role: "Student",
      time: fmtTime(),
      text: codeMode ? undefined : text || undefined,
      code: codeMode && text ? { language: detectLanguage(text), content: text } : undefined,
      attachments: pendingAttachments.length ? pendingAttachments : undefined,
      reactions: [],
    };
    pushMessage(k, userMsg);
    setMessage(""); setCodeMode(false); setPendingAttachments([]);

    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1, user: "Dr. Sarah Jansen", role: "Mentor", time: fmtTime(),
        text: mentorReplies[Math.floor(Math.random() * mentorReplies.length)],
        reactions: [],
      };
      pushMessage(k, reply);
    }, 3000);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const next = files.map((f) => ({
      name: f.name,
      type: f.type.startsWith("image/") ? ("image" as const) : ("file" as const),
      previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setPendingAttachments((prev) => [...prev, ...next]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const toggleReaction = (msgId: number, emoji: string) => {
    setMessagesByKey((prev) => {
      const list = (prev[key] ?? []).map((m) => {
        if (m.id !== msgId) return m;
        const rx = [...(m.reactions ?? [])];
        const i = rx.findIndex((r) => r.emoji === emoji);
        if (i >= 0) {
          const r = rx[i];
          const count = r.count + (r.reacted ? -1 : 1);
          if (count <= 0) rx.splice(i, 1);
          else rx[i] = { ...r, count, reacted: !r.reacted };
        } else {
          rx.push({ emoji, count: 1, reacted: true });
        }
        return { ...m, reactions: rx };
      });
      return { ...prev, [key]: list };
    });
  };

  const submitReply = () => {
    if (!replyTo || !replyText.trim()) return;
    setMessagesByKey((prev) => {
      const list = (prev[key] ?? []).map((m) =>
        m.id === replyTo.id
          ? { ...m, replies: [...(m.replies ?? []), { user: "User (Student)", time: fmtTime(), text: replyText.trim() }] }
          : m
      );
      return { ...prev, [key]: list };
    });
    setReplyText("");
  };

  const createCommunity = () => {
    if (!ncName.trim()) { toast.error("Community name required"); return; }
    const id = ncName.toLowerCase().replace(/\s+/g, "-").slice(0, 24);
    const newC: Community = { id, name: ncName.trim(), icon: Activity, channels: ["general", "questions", "projects"] };
    setCommunities((prev) => [...prev, newC]);
    setActiveCommunity(id); setActiveChannel("general");
    setNewCommunityOpen(false); setNcName(""); setNcDesc(""); setNcRules("");
    toast.success(`Community "${newC.name}" created`);
  };

  const startSession = () => {
    if (!sessTopic.trim()) { toast.error("Add a session topic"); return; }
    const card: Message = {
      id: Date.now(), user: "Co-Learning System", role: "System", time: fmtTime(),
      session: { topic: sessTopic.trim(), duration: `${sessDuration} min`, host: "User (Student)" },
      reactions: [],
    };
    pushMessage(key, card);
    setSessionOpen(false); setSessTopic(""); setSessDuration("60");
    toast.success("Session posted to channel");
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
              <button key={c.id}
                onClick={() => { setActiveCommunity(c.id); setActiveChannel(c.channels[0]); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeCommunity === c.id ? "bg-accent text-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-accent"
                }`}>
                <c.icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span className="truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t border-sidebar-border">
          <button onClick={() => setNewCommunityOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span className="accent-italic">new community</span>
          </button>
        </div>
      </div>

      {/* Channels */}
      <div className="w-56 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <p className="accent-italic text-xs text-primary">{currentCommunity?.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">channel index</p>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-0.5">
            {currentCommunity.channels.map((ch) => (
              <button key={ch} onClick={() => setActiveChannel(ch)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  activeChannel === ch ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent"
                }`}>
                <Hash className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />{ch}
              </button>
            ))}
          </div>
        </ScrollArea>
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
            <Button size="sm" variant="outline" onClick={() => setSessionOpen(true)}
              className="text-xs border-border hover:bg-accent">
              <Plus className="h-3 w-3 mr-1" /> Start Co-Learning Session
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search notes…" className="h-8 pl-8 text-xs w-44 bg-card" />
            </div>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
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

                  {msg.session ? (
                    <div className="mt-1 ml-3 rounded-md border border-primary bg-accent/40 p-4">
                      <div className="flex items-start gap-3">
                        <Video className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="accent-italic text-[11px] text-primary">§ co-learning session</p>
                          <p className="text-sm font-medium text-foreground">{msg.session.topic}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Host: {msg.session.host} · Duration: {msg.session.duration}
                          </p>
                        </div>
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                          onClick={() => toast.success("Joining session…")}>
                          Join Session
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {msg.text && (
                        <p className="text-sm text-foreground/85 leading-relaxed pl-3 border-l border-border">{msg.text}</p>
                      )}
                      {msg.code && <div className="ml-3"><CodeBlock language={msg.code.language} content={msg.code.content} /></div>}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 ml-3 grid grid-cols-2 gap-2 max-w-md">
                          {msg.attachments.map((a, i) => (
                            <div key={i} className="border border-border rounded p-2 bg-card">
                              {a.type === "image" && a.previewUrl
                                ? <img src={a.previewUrl} alt={a.name} className="w-full h-24 object-cover rounded" />
                                : <div className="h-24 flex items-center justify-center text-[11px] text-muted-foreground">📎 {a.name}</div>}
                              <p className="text-[10px] text-muted-foreground truncate mt-1">{a.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Reactions row */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 ml-3">
                      {msg.reactions.map((r) => (
                        <button key={r.emoji} onClick={() => toggleReaction(msg.id, r.emoji)}
                          className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                            r.reacted ? "border-primary bg-accent" : "border-border bg-card hover:bg-accent"
                          }`}>
                          {r.emoji} <span className="font-mono text-[10px] ml-1">{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {!msg.session && (
                    <div className="flex items-center gap-3 mt-2 ml-3 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="flex items-center gap-1 text-[11px] hover:text-primary transition-colors">
                            <SmilePlus className="h-3 w-3" /> react
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align="start">
                          <div className="flex gap-1">
                            {EMOJIS.map((e) => (
                              <button key={e} onClick={() => toggleReaction(msg.id, e)}
                                className="text-base hover:bg-accent rounded p-1 transition-colors">{e}</button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <button onClick={() => { setReplyTo(msg); setReplyText(""); }}
                        className="flex items-center gap-1 text-[11px] hover:text-primary transition-colors">
                        <Reply className="h-3 w-3" /> reply
                        {msg.replies && msg.replies.length > 0 && (
                          <span className="font-mono text-[10px] ml-0.5">({msg.replies.length})</span>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Inline reply thread preview */}
                  {msg.replies && msg.replies.length > 0 && (
                    <div className="mt-2 ml-6 pl-3 border-l-2 border-border space-y-1">
                      {msg.replies.map((r, i) => (
                        <div key={i} className="text-[11px]">
                          <span className="text-foreground font-medium">{r.user}</span>
                          <span className="text-muted-foreground ml-2">{r.time}</span>
                          <p className="text-foreground/80">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
              <div ref={feedEndRef} />
            </div>
          </ScrollArea>

          {/* Reply sidebar */}
          {replyTo && (
            <aside className="w-80 border-l border-border bg-card flex flex-col shrink-0">
              <div className="p-4 border-b border-border flex items-start justify-between gap-2">
                <div>
                  <p className="accent-italic text-xs text-primary">§ thread</p>
                  <p className="text-[11px] text-muted-foreground">replying to {replyTo.user}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setReplyTo(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="text-xs text-foreground/80 pl-3 border-l border-border">
                  {replyTo.text || replyTo.code?.content?.split("\n")[0]}
                </div>
                <div className="mt-4 space-y-2">
                  {(replyTo.replies ?? []).map((r, i) => (
                    <div key={i} className="border-b border-border pb-2">
                      <p className="text-[11px] text-foreground font-medium">{r.user} <span className="text-muted-foreground accent-italic ml-1">{r.time}</span></p>
                      <p className="text-xs text-foreground/85">{r.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-3 border-t border-border space-y-2">
                <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply…" className="text-xs min-h-[60px]" />
                <Button size="sm" onClick={submitReply}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                  Send reply
                </Button>
              </div>
            </aside>
          )}
        </div>

        {/* Composer */}
        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={(e) => { e.preventDefault(); send(); }}
            className="max-w-3xl mx-auto border border-border rounded-md bg-background focus-within:border-primary transition-colors">
            {pendingAttachments.length > 0 && (
              <div className="px-3 pt-3 flex flex-wrap gap-2">
                {pendingAttachments.map((a, i) => (
                  <div key={i} className="relative border border-border rounded p-1.5 bg-card">
                    {a.type === "image" && a.previewUrl
                      ? <img src={a.previewUrl} alt={a.name} className="w-16 h-16 object-cover rounded" />
                      : <div className="w-16 h-16 flex items-center justify-center text-[10px] text-muted-foreground">📎</div>}
                    <button type="button"
                      onClick={() => setPendingAttachments((p) => p.filter((_, j) => j !== i))}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center">
                      <X className="h-2.5 w-2.5" />
                    </button>
                    <p className="text-[9px] text-muted-foreground truncate mt-0.5 max-w-[64px]">{a.name}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 px-3 py-2">
              {codeMode ? (
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Paste your code snippet…"
                  className="flex-1 bg-transparent text-xs font-mono border-0 focus-visible:ring-0 min-h-[80px] resize-none p-0" />
              ) : (
                <input value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Add a note to #${activeChannel}…`}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
              )}
              <input ref={fileRef} type="file" multiple className="hidden" onChange={onFile} />
              <button type="button" onClick={() => setCodeMode((v) => !v)}
                className={`transition-colors ${codeMode ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                title="Code snippet">
                <Code className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="text-muted-foreground hover:text-primary transition-colors" title="Attach files">
                <Paperclip className="h-4 w-4" />
              </button>
              <Button type="submit" size="icon" className="h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
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

      {/* New community modal */}
      <Dialog open={newCommunityOpen} onOpenChange={setNewCommunityOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="accent-italic text-primary">§ Create a new community</DialogTitle>
            <DialogDescription>Set up a focused space for a topic.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Community name</Label>
              <Input value={ncName} onChange={(e) => setNcName(e.target.value)} placeholder="e.g. EEG Signal Processing" className="h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Description / topic focus</Label>
              <Textarea value={ncDesc} onChange={(e) => setNcDesc(e.target.value)} placeholder="What is this community about?" className="text-xs min-h-[60px]" />
            </div>
            <div>
              <Label className="text-xs">Rules &amp; regulations</Label>
              <Textarea value={ncRules} onChange={(e) => setNcRules(e.target.value)} placeholder="1. Be respectful…" className="text-xs min-h-[60px]" />
            </div>
            <p className="text-[11px] text-muted-foreground accent-italic">Default channels: #general, #questions, #projects</p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setNewCommunityOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={createCommunity} className="bg-primary text-primary-foreground hover:bg-primary/90">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Co-learning session modal */}
      <Dialog open={sessionOpen} onOpenChange={setSessionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="accent-italic text-primary">§ Start co-learning session</DialogTitle>
            <DialogDescription>Post a live study room into #{activeChannel}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Session topic</Label>
              <Input value={sessTopic} onChange={(e) => setSessTopic(e.target.value)} placeholder="e.g. ECG Filter Debugging Study Group" className="h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Duration</Label>
              <Select value={sessDuration} onValueChange={setSessDuration}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Start now · 30 min</SelectItem>
                  <SelectItem value="60">Start now · 1 hour</SelectItem>
                  <SelectItem value="120">Start now · 2 hours</SelectItem>
                  <SelectItem value="180">Start now · 3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Users className="h-3 w-3" /> Other online members will see a Join button on the card.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSessionOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={startSession} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Calendar className="h-3.5 w-3.5 mr-1" /> Post session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityPage;
