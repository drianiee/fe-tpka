"use client";

import { AddScheduleDialog } from "@/components/schedules/AddScheduleDialog";
import { SchedulesTable } from "@/components/schedules/SchedulesTable";
import { Separator } from "@/components/ui/separator";

export default function AdminSchedulesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Schedules</h1>
          <p className="text-sm text-muted-foreground">Kelola jadwal tes</p>
        </div>
        <AddScheduleDialog />
      </div>

      <Separator />

      <SchedulesTable />
    </div>
  );
}
