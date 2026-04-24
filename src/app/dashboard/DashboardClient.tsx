"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Check, Loader2, Inbox, LogOut, Code2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

import { createLog } from "@/app/actions";
import { useGravity } from "@/hooks/useGravity";
import ActivityChart from "./ActivityChart";

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

const formSchema = z.object({
  language: z.string().min(1, "Language is required"),
  hours: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Hours must be a positive number",
  }),
  project: z.string().min(1, "Project name is required"),
  mood: z.string().min(1, "Mood is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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

export default function DashboardClient({ 
  initialLogs, 
  initialStats, 
  initialActivityData,
  user 
}: { 
  initialLogs: any[], 
  initialStats: any, 
  initialActivityData: any[],
  user: any 
}) {
  useGravity();
  
  const [logs, setLogs] = useState(initialLogs);
  const [stats, setStats] = useState(initialStats);
  const [activityData, setActivityData] = useState(initialActivityData);

  useEffect(() => {
    setLogs(initialLogs);
    setStats(initialStats);
    setActivityData(initialActivityData);
  }, [initialLogs, initialStats, initialActivityData]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "",
      hours: "",
      project: "",
      mood: "",
      notes: "",
    },
  });

  const selectedLanguage = watch("language");
  const selectedMood = watch("mood");

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      
      const result = await createLog(formData);
      
      if (result.success) {
        toast.success("Session logged successfully!");
        reset();
      }
    } catch (e) {
      toast.error("Failed to log session. Please try again.");
      console.error(e);
    }
  };

  const getLanguageColor = (lang: string) => {
    return LANGUAGES.find((l) => l.id === lang)?.color || "bg-gray-500";
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      {/* Top Bar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Code2 size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">DevLog</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-accent/50 border border-border">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold overflow-hidden">
              {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : user.name?.[0]}
            </div>
            <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Current Streak", value: stats.streak, unit: " days", icon: "🔥", color: "text-amber-500" },
            { label: "Total Hours", value: Math.floor(stats.totalHours), unit: "h", icon: "⏱" },
            { label: "Top Language", value: stats.topLanguage, unit: "", icon: "💻" },
            { label: "This Week", value: stats.thisWeek, unit: " logs", icon: "📅" }
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-[10px] p-5 shadow-sm hover:border-primary/30 transition-colors">
              <div className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">
                {stat.icon} {stat.label}
              </div>
              <div className="text-2xl font-bold text-foreground">
                {typeof stat.value === 'number' ? <AnimatedCounter value={stat.value} /> : stat.value}{stat.unit}
              </div>
            </div>
          ))}
        </div>

        {/* Activity Chart */}
        <ActivityChart data={activityData} />

        {/* Form and Recent Logs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Log Session Form */}
          <div className="lg:col-span-5 bg-card border border-border rounded-[10px] p-6 shadow-sm h-fit">
            <h2 className="text-lg font-semibold mb-6">Log a Session</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label className={errors.language ? "text-destructive" : ""}>Language</Label>
                <Select 
                  value={selectedLanguage} 
                  onValueChange={(val) => setValue("language", val || "", { shouldValidate: true })}
                >
                  <SelectTrigger className={errors.language ? "border-destructive/50" : ""}>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${l.color}`}></div>
                          {l.id}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && <p className="text-[10px] text-destructive font-medium">{errors.language.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className={errors.hours ? "text-destructive" : ""}>Hours</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0.5"
                  placeholder="2.5"
                  className={errors.hours ? "border-destructive/50" : ""}
                  {...register("hours")}
                />
                {errors.hours && <p className="text-[10px] text-destructive font-medium">{errors.hours.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className={errors.project ? "text-destructive" : ""}>Project Name</Label>
                <Input
                  placeholder="e.g. Personal Portfolio"
                  className={errors.project ? "border-destructive/50" : ""}
                  {...register("project")}
                />
                {errors.project && <p className="text-[10px] text-destructive font-medium">{errors.project.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className={errors.mood ? "text-destructive" : ""}>Mood</Label>
                <div className="flex justify-between">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`h-10 w-10 flex items-center justify-center text-xl rounded-md border transition-all ${
                        selectedMood === m 
                          ? "bg-primary/20 border-primary shadow-[0_0_10px_rgba(124,111,224,0.2)]" 
                          : "bg-input border-transparent hover:bg-accent/50"
                      }`}
                      onClick={() => setValue("mood", m, { shouldValidate: true })}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                {errors.mood && <p className="text-[10px] text-destructive font-medium">{errors.mood.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Textarea
                  placeholder="What did you work on today?"
                  className="resize-none h-24"
                  {...register("notes")}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-semibold shadow-lg shadow-primary/20"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log Session"}
              </Button>
            </form>
          </div>

          {/* Recent Logs Table */}
          <div className="lg:col-span-7 bg-card border border-border rounded-[10px] overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-border bg-accent/10">
              <h3 className="font-semibold text-sm">Recent Activity</h3>
            </div>
            
            <div className="flex-1 overflow-auto">
              {logs.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Inbox className="w-10 h-10 mb-4 opacity-50" />
                  <p className="font-medium text-foreground">No logs yet</p>
                  <p className="text-sm mt-1">Your coding history will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-muted-foreground uppercase bg-accent/10 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Activity</th>
                        <th className="px-4 py-3 font-semibold">Time</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                        {logs.map((log) => (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors group"
                          >
                            <td className="px-4 py-4 font-mono text-muted-foreground whitespace-nowrap">
                              {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-semibold text-foreground truncate max-w-[150px]">{log.project}</div>
                              <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                                <div className={`w-1.5 h-1.5 rounded-full ${getLanguageColor(log.language)}`}></div>
                                <span className="text-muted-foreground uppercase">{log.language}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-mono font-bold text-foreground">
                              {log.hours.toFixed(1)}h
                            </td>
                            <td className="px-4 py-4 text-lg">
                              {log.mood}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {logs.length > 0 && (
              <div className="p-4 border-t border-border bg-accent/5 text-[10px] text-muted-foreground text-center">
                Showing last {logs.length} sessions
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
