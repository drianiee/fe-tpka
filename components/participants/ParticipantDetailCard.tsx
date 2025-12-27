"use client";

import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { participantsService } from "@/lib/services/participants.service";
import { authService } from "@/lib/services/auth.service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getApiErrorMessage } from "@/lib/api/errors";
import type {
  ParticipantDetailResponse,
  ParticipantScheduleItem,
} from "@/lib/types/participants";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Pill({ text }: { text: string }) {
  return <Badge variant="secondary">{text}</Badge>;
}

export function ParticipantDetailCard({ id }: { id: string }) {
  const qDetail = useQuery({
    queryKey: [API_ENDPOINTS.PARTICIPANTS.DETAIL(id)],
    queryFn: () => participantsService.detail(id),
    enabled: Boolean(id),
  });

  const mResend = useMutation({
    mutationFn: (email: string) => authService.resendVerify({ email }),
    onSuccess: (data) => {
      toast.success(data?.message ?? "Link verifikasi telah berhasil dikirim");
    },
    onError: (e: unknown) => toast.error(getApiErrorMessage(e)),
  });

  if (!id) {
    return (
      <Card className="p-4 space-y-2">
        <div className="text-sm text-muted-foreground">
          ID peserta tidak ditemukan.
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/admin/peserta">Kembali</Link>
        </Button>
      </Card>
    );
  }

  if (qDetail.isLoading) {
    return (
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">Memuat...</div>
      </Card>
    );
  }

  if (qDetail.isError || !qDetail.data) {
    return (
      <Card className="p-4 space-y-3">
        <div className="text-sm text-muted-foreground">
          Gagal memuat detail peserta.
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/admin/peserta">Kembali</Link>
        </Button>
      </Card>
    );
  }

  const data: ParticipantDetailResponse = qDetail.data;
  const p = data.participant;
  const schedules: ParticipantScheduleItem[] = data.schedules ?? [];

  const isVerified = Boolean(p.email_verified_at);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-lg font-semibold">{p.name}</div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm text-muted-foreground">{p.email}</div>

            {isVerified ? (
              <Badge variant="default">Verified</Badge>
            ) : (
              <Badge variant="secondary">Unverified</Badge>
            )}

            {!isVerified ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={mResend.isPending}
                onClick={() => mResend.mutate(p.email)}
              >
                {mResend.isPending ? "Mengirim..." : "Kirim ulang verifikasi"}
              </Button>
            ) : null}
          </div>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/admin/peserta">Kembali</Link>
        </Button>
      </div>

      <Separator />

      <div className="grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">ID</span>
          <span className="font-medium">{p.id}</span>
        </div>

        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Verified</span>
          <span className="font-medium">{isVerified ? "Ya" : "Belum"}</span>
        </div>

        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Profile completed</span>
          <span className="font-medium">
            {p.profile_completed_at ? "Ya" : "Belum"}
          </span>
        </div>

        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Total schedules</span>
          <span className="font-medium">
            {data.total_schedules ?? schedules.length}
          </span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="font-medium">Jadwal yang diikuti</div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Jadwal</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Status Jadwal</TableHead>
                <TableHead>Mitra</TableHead>
                <TableHead>Status Peserta</TableHead>
                <TableHead>Quiz</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {schedules.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Tidak ada jadwal
                  </TableCell>
                </TableRow>
              ) : (
                schedules.map((s) => (
                  <TableRow key={s.schedule_id}>
                    <TableCell>{s.schedule_id}</TableCell>
                    <TableCell>{s.date}</TableCell>
                    <TableCell>
                      {s.start_time} - {s.end_time}
                    </TableCell>
                    <TableCell>
                      <Pill text={s.status_jadwal} />
                    </TableCell>
                    <TableCell>
                      {s.is_partner ? (s.partner?.name ?? "-") : "-"}
                    </TableCell>
                    <TableCell>
                      <Pill text={s.participant_status} />
                    </TableCell>
                    <TableCell>
                      {s.quiz_url ? (
                        <Button asChild size="sm" variant="outline">
                          <a href={s.quiz_url} target="_blank" rel="noreferrer">
                            Buka
                          </a>
                        </Button>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
