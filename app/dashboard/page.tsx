"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { PageShell } from "@/components/common/PageShell";
import { Protected } from "@/components/common/Protected";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { dashboardService } from "@/lib/services/dashboard.service";
import { authService } from "@/lib/services/auth.service";
import { clearToken } from "@/lib/utils/storage";
import { getApiErrorMessage } from "@/lib/api/errors";

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardInner />
    </Protected>
  );
}

function DashboardInner() {
  const router = useRouter();

  const dashboardQuery = useQuery({
    queryKey: ["dashboard", { limit: 10 }],
    queryFn: () => dashboardService.getDashboard(10),
  });

  async function onLogout() {
    try {
      await authService.logout();
    } catch (e: unknown) {
      toast.error(getApiErrorMessage(e));
    } finally {
      clearToken();
      toast.success("Logout");
      router.replace("/login");
    }
  }

  const data = dashboardQuery.data;

  return (
    <PageShell
      title="Dashboard"
      description="Ringkasan peserta & jadwal terdekat"
      right={
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      }
    >
      {dashboardQuery.isLoading ? (
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      ) : dashboardQuery.isError ? (
        <div className="text-sm text-destructive">
          {getApiErrorMessage(dashboardQuery.error)}
        </div>
      ) : !data ? (
        <div className="text-sm text-muted-foreground">Data dashboard kosong.</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Total Peserta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{data.totals.participants}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Jadwal Terdekat</CardTitle>
            </CardHeader>
            <CardContent>
              {data.latest_schedules.length === 0 ? (
                <div className="text-sm text-muted-foreground">Tidak ada jadwal aktif.</div>
              ) : (
                <div className="space-y-3">
                  {data.latest_schedules.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-md border p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">
                          #{s.id} • {s.date} • {s.start_time} - {s.end_time}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Kapasitas: {s.current_participants}/{s.capacity} • Harga: {s.price} •{" "}
                          {s.is_partner ? "Partner" : "Non-partner"}
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">{s.status ?? "-"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </PageShell>
  );
}
