import { getDashboardData } from "@/app/actions"
import DashboardClient from "./DashboardClient"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const { logs, stats } = await getDashboardData()

  return (
    <DashboardClient 
      initialLogs={logs} 
      initialStats={stats} 
      user={session.user}
    />
  )
}
