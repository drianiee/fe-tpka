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
import { Badge } from "@/components/ui/badge";

const addSchema = z.object({
  user_id: z
    .number()
    .finite("user_id harus angka")
    .int("user_id harus bilangan bulat")
    .positive("user_id harus angka"),
});

type AddForm = z.infer<typeof addSchema>;

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

export default function AdminScheduleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const scheduleId = Number(params.id);

  const detailQuery = useQuery({
    queryKey: [API_ENDPOINTS.SCHEDULES.DETAIL(scheduleId)],
    queryFn: (): Promise<ScheduleDetail> => schedulesService.detail(scheduleId),
    enabled: Number.isFinite(scheduleId),
  });

  const form = useForm<AddForm, unknown, AddForm>({
    resolver: zodResolver<AddForm, unknown, AddForm>(addSchema),
    defaultValues: { user_id: 0 },
    mode: "onSubmit",
  });

  const addMut = useMutation({
    mutationFn: (values: AddForm) =>
      schedulesService.addParticipant(scheduleId, { user_id: values.user_id }),
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({
        queryKey: [API_ENDPOINTS.SCHEDULES.DETAIL(scheduleId)],
      });
      detailQuery.refetch();
      form.reset({ user_id: 0 });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const delMut = useMutation({
    mutationFn: (userId: number) =>
      schedulesService.removeParticipant(scheduleId, userId),
    onSuccess: (res) => {
      toast.success(res.message || "Peserta dihapus");
      qc.invalidateQueries({
        queryKey: [API_ENDPOINTS.SCHEDULES.DETAIL(scheduleId)],
      });
      detailQuery.refetch();
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const d = detailQuery.data;

  if (detailQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }
  if (detailQuery.isError || !d) {
    return (
      <p className="text-sm text-destructive">Gagal load detail schedule</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Detail Schedule #{d.id}</h1>
          <p className="text-sm text-muted-foreground">
            {d.date} • {hhmm(d.start_time)} - {hhmm(d.end_time)}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>

      <Card className="p-4 space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Harga</div>
            <div className="font-medium">{formatRupiah(d.price)}</div>
          </div>

          <div>
            <div className="text-muted-foreground">Kapasitas</div>
            <div className="font-medium">{d.capacity}</div>
          </div>

          <div>
            <div className="text-muted-foreground">Peserta Terdaftar</div>
            <div className="font-medium">{d.current_participants}</div>
          </div>

          <div>
            <div className="text-muted-foreground">Paket Soal</div>
            <div className="font-medium">{d.package?.name ?? "-"}</div>
          </div>

          <div>
            <div className="text-muted-foreground">Status</div>
            <div className="font-medium">
              <Badge>{d.status}</Badge>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {d.quiz_url ? (
            <a
              className="text-sm underline"
              href={d.quiz_url}
              target="_blank"
              rel="noreferrer"
            >
              Buka Quiz
            </a>
          ) : (
            <span className="text-muted-foreground">Quiz URL: -</span>
          )}
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div>
          <h2 className="font-semibold">Participants</h2>
          <p className="text-sm text-muted-foreground">
            Tambahkan peserta pakai user_id
          </p>
        </div>

        <form
          className="flex flex-col md:flex-row gap-3 items-end"
          onSubmit={form.handleSubmit((v) => addMut.mutate(v))}
        >
          <div className="w-full md:w-72 space-y-2">
            <Label htmlFor="user_id">user_id</Label>
            <Input
              id="user_id"
              type="number"
              inputMode="numeric"
              {...form.register("user_id", { valueAsNumber: true })}
            />
            {form.formState.errors.user_id?.message ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.user_id.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={addMut.isPending}>
            {addMut.isPending ? "Menambahkan..." : "Add Participant"}
          </Button>
        </form>

        <Separator />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-15">No</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {d.participants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground"
                  >
                    Belum ada peserta
                  </TableCell>
                </TableRow>
              ) : (
                d.participants.map((p, idx) => (
                  <TableRow key={p.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{formatDateTime(p.registered_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={delMut.isPending}
                        onClick={() => delMut.mutate(p.id)}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
