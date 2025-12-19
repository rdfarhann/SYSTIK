import { Button } from "@/components/ui/button"
import RealtimeDate from "./realtime-date"
import { Card } from "@/components/ui/card"
import {
  Plus,
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Calendar,
  LucideIcon,
} from "lucide-react"

export default function DashboardHero() {
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border bg-background">
              <Ticket className="h-7 w-7 text-muted-foreground" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                SYSTIK
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistem Ticketing & Support Internal
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground">
              <RealtimeDate />
            </div>

            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Create New Ticket
            </Button>
          </div>
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* TOTAL */}
        <StatCard
          title="Total Ticket"
          value="128"
          description="Semua tiket"
          icon={Ticket}
        />

        {/* OPEN */}
        <StatCard
          title="Open"
          value="34"
          description="Menunggu diproses"
          icon={Clock}
        />

        {/* IN PROGRESS */}
        <StatCard
          title="In Progress"
          value="56"
          description="Sedang dikerjakan"
          icon={Loader}
          spin
        />

        {/* CLOSED */}
        <StatCard
          title="Closed"
          value="30"
          description="Selesai"
          icon={CheckCircle}
        />

        {/* CANCELED */}
        <StatCard
          title="Canceled"
          value="8"
          description="Dibatalkan"
          icon={XCircle}
        />
      </div>
    </div>
  )
}

/* ================= REUSABLE STAT CARD ================= */

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  spin = false,
}: {
  title: string
  value: string
  description: string
  icon:LucideIcon
  spin?: boolean
}) {
  return (
    <Card className="rounded-xl p-4 transition hover:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {title}
        </p>
        <Icon
          className={`h-5 w-5 text-muted-foreground ${
            spin ? "animate-spin" : ""
          }`}
        />
      </div>

      <p className="mt-4 text-3xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </Card>
  )
}
