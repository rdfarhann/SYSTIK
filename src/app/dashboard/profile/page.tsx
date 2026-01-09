import { createSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Settings } from "lucide-react"
import ProfileForm from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <section className="flex flex-1 flex-col gap-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-2xl border shadow-md">
          <Settings className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Settings</h1>
          <p className="text-[10px] text-muted-foreground font-bold opacity-80 uppercase tracking-widest mt-1">
            Account & Organization Management
          </p>
        </div>
      </div>

      <ProfileForm profile={profile} userEmail={user.email!} />
    </section>
  )
}