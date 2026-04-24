import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Timer, Flame, BarChart3, Code2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl leading-none pb-0.5">
            D
          </div>
          <span className="font-semibold text-lg tracking-tight">DevLog</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 sm:py-32 text-center">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground max-w-4xl mb-6">
          Track what you build,<br className="hidden sm:block" /> every day.
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
          Log your coding sessions. Watch your streaks grow.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 h-14 bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started — it&apos;s free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="ghost" className="w-full sm:w-auto text-base px-8 h-14 border border-border">
              Sign In
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Join 200+ developers tracking their growth
        </p>
      </main>

      {/* Feature Strip */}
      <section className="border-t border-border bg-card py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded bg-background border border-border flex items-center justify-center mb-6">
              <Timer className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Log sessions</h3>
            <p className="text-muted-foreground">
              Language, hours, project, mood in 10 seconds.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded bg-background border border-border flex items-center justify-center mb-6">
              <Flame className="w-6 h-6 text-amber" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Build streaks</h3>
            <p className="text-muted-foreground">
              See your consistency as a heatmap.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded bg-background border border-border flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-3">See your stats</h3>
            <p className="text-muted-foreground">
              Hours by language, top projects, weekly trends.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} DevLog. All rights reserved.</p>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          GitHub
        </a>
      </footer>
    </div>
  );
}
