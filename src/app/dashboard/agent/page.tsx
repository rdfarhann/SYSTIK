import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"

export default async function AgentDashboardPage() {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  // 🔐 AGENT ONLY
  if (profile?.role !== "agent") {
    redirect("/dashboard/agent")
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Agent Dashboard</h1>
    </div>
  )
}
