import { createSupabaseServer } from "@/lib/supabase/server"

// Interface untuk deret waktu (Array)
export interface ChartDataPoint {
  date: string
  count: number
}

// Interface untuk ringkasan angka (Single Object)
export interface TicketSummary {
  total: number
  open: number
  inProgress: number
  closed: number
}

export async function getDashboardStats() {
  const supabase = await createSupabaseServer()
  
  const { data, error } = await supabase
    .from("tickets")
    .select("status, created_at")

  if (error || !data) {
    return {
      summary: { total: 0, open: 0, inProgress: 0, closed: 0 },
      chartData: []
    }
  }

  // 1. Logika Summary (Objek Tunggal)
  const summary: TicketSummary = {
    total: data.length,
    open: data.filter(t => t.status === "OPEN").length,
    inProgress: data.filter(t => t.status === "IN_PROGRESS").length,
    closed: data.filter(t => t.status === "CLOSED").length,
  }

  // 2. Logika Chart (Array of Objects)
  const chartGroup = data.reduce<Record<string, ChartDataPoint>>((acc, t) => {
    const date = new Date(t.created_at).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, count: 0 }
    }
    acc[date].count += 1
    return acc
  }, {})

  return {
    summary,
    chartData: Object.values(chartGroup) // Mengubah Map ke Array agar tidak error .length
  }
}