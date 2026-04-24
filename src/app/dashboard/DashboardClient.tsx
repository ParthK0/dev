"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Check, Loader2, Inbox } from "lucide-react";
import { createLog } from "@/app/actions";
import { useGravity } from "@/hooks/useGravity";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const spring = useSpring(0, { bounce: 0, duration: duration * 1000 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

const LANGUAGES = [
  { id: "TypeScript", color: "bg-blue-500" },
  { id: "JavaScript", color: "bg-yellow-400" },
  { id: "Python", color: "bg-yellow-500" },
  { id: "Java", color: "bg-orange-500" },
  { id: "C++", color: "bg-indigo-500" },
  { id: "Go", color: "bg-teal-500" },
  { id: "Rust", color: "bg-orange-600" },
  { id: "Other", color: "bg-gray-500" },
];

const MOODS = ["😴", "😐", "🙂", "😊", "🔥"];

type LogEntry = any;
type Stats = any;

export default function DashboardClient({ initialLogs, initialStats, user }: { initialLogs: LogEntry[], initialStats: Stats, user: any }) {
  useGravity();
  
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [stats, setStats] = useState<Stats>(initialStats);
  
  // Keep local state in sync with server data
  useEffect(() => {
    setLogs(initialLogs);
    setStats(initialStats);
  }, [initialLogs, initialStats]);

  const [language, setLanguage] = useState("");
  const [hours, setHours] = useState("");
  const [project, setProject] = useState("");
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!language || !hours || !project || !mood) return;

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("language", language);
      formData.append("hours", hours);
      formData.append("project", project);
      formData.append("mood", mood);
      formData.append("notes", notes);
      
      await createLog(formData);
      
      setShowSuccess(true);
      setHours("");
      setProject("");
      setNotes("");
      setMood("");
      setTimeout(() => setShowSuccess(false), 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLanguageColor = (lang: string) => {
    return LANGUAGES.find((l) => l.id === lang)?.color || "bg-gray-500";
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl leading-none pb-0.5">
            D
          </div>
          <span className="font-semibold text-lg tracking-tight">DevLog</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2 text-foreground">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center border border-border overflow-hidden">
              {user.image ? <img src={user.image} alt="Avatar" /> : user.name?.[0] || "U"}
            </div>
            <span className="hidden sm:inline">{user.name}</span>
          </div>
          <form action={async () => {
            // we will pass this as a prop or do a normal link for simplicity since it's client
          }}>
             <Link href="/api/auth/signout" className="text-muted-foreground hover:text-foreground transition-colors ml-4">
              Sign Out
            </Link>
          </form>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-[10px] p-5 shadow-sm">
            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              🔥 Current Streak
            </div>
            <div className="text-3xl font-bold text-foreground flex items-center gap-2">
              <AnimatedCounter value={stats.streak} /> days
              {stats.streak > 0 && (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="inline-block"
                >
                  🔥
                </motion.span>
              )}
            </div>
          </div>
          <div className="bg-card border border-border rounded-[10px] p-5 shadow-sm">
            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              ⏱ Total Hours
            </div>
            <div className="text-3xl font-bold text-foreground">
              <AnimatedCounter value={Math.floor(stats.totalHours)} />h
            </div>
          </div>
          <div className="bg-card border border-border rounded-[10px] p-5 shadow-sm">
            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              💻 Top Language
            </div>
            <div className="text-3xl font-bold text-foreground">
              {stats.topLanguage}
            </div>
          </div>
          <div className="bg-card border border-border rounded-[10px] p-5 shadow-sm">
            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              📅 This Week
            </div>
            <div className="text-3xl font-bold text-foreground">
              {stats.thisWeek} sessions
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Log a Session</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={(val) => setLanguage(val || "")} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hours (0.5 steps)</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="2.5"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="e.g. Personal Portfolio"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Mood</Label>
                <div className="flex gap-2">
                  {MOODS.map((m) => (
                    <motion.button
                      key={m}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={mood === m ? { scale: 1.2 } : { scale: 1 }}
                      className={`h-10 w-10 flex items-center justify-center text-xl rounded-md transition-colors ${
                        mood === m ? "bg-accent border border-ring" : "bg-input hover:bg-accent/50"
                      }`}
                      onClick={() => setMood(m)}
                    >
                      {m}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you work on today?"
                className="resize-none h-20"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || showSuccess}
                className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground relative"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="submitting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                  ) : showSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center text-success gap-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>Logged!</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Log Session
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-card border border-border rounded-[10px] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-accent/30">
            <h3 className="font-semibold text-sm">Recent Logs</h3>
          </div>
          
          {logs.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
              <Inbox className="w-10 h-10 mb-4 opacity-50" />
              <p>No sessions logged yet.</p>
              <p className="text-sm">Start above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-accent/10 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Language</th>
                    <th className="px-6 py-3 font-medium">Hours</th>
                    <th className="px-6 py-3 font-medium">Project</th>
                    <th className="px-6 py-3 font-medium">Mood</th>
                    <th className="px-6 py-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {logs.map((log) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: -20, backgroundColor: 'rgba(124, 111, 224, 0.3)' }}
                        animate={{ opacity: 1, y: 0, backgroundColor: 'transparent' }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-muted-foreground whitespace-nowrap">
                          {log.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent text-xs font-medium border border-border">
                            <span className={`w-2 h-2 rounded-full ${getLanguageColor(log.language)}`}></span>
                            {log.language}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">
                          {log.hours.toFixed(1)}h
                        </td>
                        <td className="px-6 py-4 font-medium max-w-[150px] truncate">
                          {log.project}
                        </td>
                        <td className="px-6 py-4 text-xl">
                          {log.mood}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground max-w-[200px] truncate">
                          {log.notes || "—"}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
