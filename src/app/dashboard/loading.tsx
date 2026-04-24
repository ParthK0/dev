export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background animate-pulse">
      {/* Top Bar Skeleton */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-muted"></div>
          <div className="h-5 w-24 bg-muted rounded"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-muted"></div>
          <div className="h-4 w-20 bg-muted rounded"></div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-8">
        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-[10px] p-5 shadow-sm h-28">
              <div className="h-4 w-20 bg-muted rounded mb-4"></div>
              <div className="h-8 w-24 bg-muted rounded"></div>
            </div>
          ))}
        </div>

        {/* Form Skeleton */}
        <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm">
          <div className="h-6 w-32 bg-muted rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="h-4 w-16 bg-muted rounded"></div>
              <div className="h-10 w-full bg-muted rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-16 bg-muted rounded"></div>
              <div className="h-10 w-full bg-muted rounded"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-16 bg-muted rounded"></div>
            <div className="h-20 w-full bg-muted rounded"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-card border border-border rounded-[10px] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-accent/30 h-12"></div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center border-b border-border/50 pb-4 last:border-0 last:pb-0">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-4 w-20 bg-muted rounded"></div>
                <div className="h-4 w-16 bg-muted rounded"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
