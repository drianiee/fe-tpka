"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { schedulesService } from "@/lib/services/schedules.service";
import type { ScheduleDetail } from "@/lib/types/schedules";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getApiErrorMessage } from "@/lib/api/errors";
import { formatRupiah, hhmm } from "@/lib/utils/format";
import { formatDateTime } from "@/lib/utils/datetime";
import { StatusBadge } from "@/lib/utils/status";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ================= VALIDATION ================= */

const addSchema = z.object({
  user_id: z
    .number()
    .int("User ID harus bilangan bulat")
    .positive("User ID harus > 0"),
});

type AddForm = z.infer<typeof addSchema>;

/* ================= PAGE ================= */

export default function AdminScheduleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const scheduleId = Number(id);

  /* ===== DETAIL ===== */
  const detailQuery = useQuery({
    queryKey: [API_ENDPOINTS.SCHEDULES.DETAIL(scheduleId)],
    queryFn: () => schedulesService.detail(scheduleId),
    enabled: Number.isFinite(scheduleId),
  });

  /* ===== FORM ===== */
  const form = useForm<AddForm>({
    resolver: zodResolver(addSchema),
    defaultValues: {
      user_id: undefined,
    },
  });

  /* ===== ADD PARTICIPANT ===== */
  const addMut = useMutation({
    mutationFn: (v: AddForm) =>
      schedulesService.addParticipant(scheduleId, { user_id: v.user_id }),

    onSuccess: (res) => {
      toast.success(res.message ?? "Peserta ditambahkan");
      qc.invalidateQueries({
        queryKey: [API_ENDPOINTS.SCHEDULES.DETAIL(scheduleId)],
      });
      form.reset();
    },

    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  /* ===== REMOVE PARTICIPANT ===== */
  const delMut = useMutation({
    mutationFn: (userId: number) =>
      schedulesService.removeParticipant(scheduleId, userId),

    onSuccess: (res) => {
      toast.success(res.message ?? "Peserta dihapus");
      qc.invalidateQueries({
        queryKey: [API_ENDPOINTS.SCHEDULES.DETAIL(scheduleId)],
      });
    },

    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  /* ===== STATE HANDLING ===== */
  if (detailQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (detailQuery.isError || !detailQuery.data) {
    return <p className="text-sm text-destructive">Gagal load schedule</p>;
  }

  const d: ScheduleDetail = detailQuery.data;
  const participants = d.participants ?? [];
  const packages = d.packages ?? [];

  return (
    <div className="space-y-4">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Schedule #{d.id}</h1>
          <p className="text-sm text-muted-foreground">
            {d.date} • {hhmm(d.start_time)} - {hhmm(d.end_time)}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>

      {/* ===== INFO CARD ===== */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Harga</div>
            <div>{formatRupiah(d.price)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Kapasitas</div>
            <div>{d.capacity}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Peserta</div>
            <div>{d.current_participants}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Partner</div>
            <div>{d.partner?.name ?? "-"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <StatusBadge status={d.status} />
          </div>
        </div>

        <div>
          <div className="text-muted-foreground text-sm mb-1">Paket Soal</div>
          {packages.length === 0 ? (
            <span className="text-sm text-muted-foreground">-</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {packages.map((p) => (
                <Badge key={p.id} variant="outline">
                  {p.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ===== PARTICIPANTS ===== */}
      <Card className="p-4 space-y-4">
        <form
          className="flex gap-3 items-end"
          onSubmit={form.handleSubmit((v) => addMut.mutate(v))}
        >
          <div className="space-y-2">
            <Label>User ID</Label>
            <Input
              type="number"
              {...form.register("user_id", { valueAsNumber: true })}
            />
            {form.formState.errors.user_id && (
              <p className="text-sm text-destructive">
                {form.formState.errors.user_id.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={addMut.isPending}>
            Add Participant
          </Button>
        </form>

        <Separator />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {participants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Belum ada peserta
                </TableCell>
              </TableRow>
            ) : (
              participants.map((p, i) => (
                <TableRow key={p.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{formatDateTime(p.registered_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => delMut.mutate(p.id)}
                      disabled={delMut.isPending}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
