"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getDashboardData() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const userId = session.user.id

  const logs = await prisma.log.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  // Calculate stats
  let totalHours = 0
  const languages: Record<string, number> = {}
  
  logs.forEach(log => {
    totalHours += log.hours
    languages[log.language] = (languages[log.language] || 0) + 1
  })

  const topLanguage = Object.keys(languages).sort((a, b) => languages[b] - languages[a])[0] || "None"

  // Calculate streak (simplistic consecutive days based on 'date' field YYYY-MM-DD)
  let streak = 0
  if (logs.length > 0) {
    const today = new Date().toISOString().split("T")[0]
    const dates = [...new Set(logs.map(l => l.date))].sort().reverse()
    
    let current = new Date(today)
    for (const d of dates) {
      if (d === current.toISOString().split("T")[0]) {
        streak++
        current.setDate(current.getDate() - 1)
      } else if (d === new Date(current.getTime() - 86400000).toISOString().split("T")[0]) {
         // if the latest log was yesterday
         current.setDate(current.getDate() - 1)
         streak++
         current.setDate(current.getDate() - 1)
      } else {
        break
      }
    }
    // Simple fix if they logged today or yesterday
    if (dates[0] !== today && dates[0] !== new Date(Date.now() - 86400000).toISOString().split("T")[0]) {
      streak = 0
    }
  }

  const thisWeekLogs = logs.filter(l => {
    const d = new Date(l.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return d >= weekAgo
  })

  return {
    logs: logs.slice(0, 10), // Return top 10 recent
    stats: {
      totalHours: Math.round(totalHours * 10) / 10,
      streak,
      topLanguage,
      thisWeek: thisWeekLogs.length
    }
  }
}

export async function createLog(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const language = formData.get("language") as string
  const hours = parseFloat(formData.get("hours") as string)
  const project = formData.get("project") as string
  const mood = formData.get("mood") as string
  const notes = formData.get("notes") as string
  const date = new Date().toISOString().split("T")[0]

  if (!language || isNaN(hours) || !project || !mood) {
    throw new Error("Missing required fields")
  }

  await prisma.log.create({
    data: {
      userId: session.user.id,
      date,
      language,
      hours,
      project,
      mood,
      notes: notes || null
    }
  })

  revalidatePath("/dashboard")
  return { success: true }
}
