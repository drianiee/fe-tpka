"use client";

import * as React from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useQuestionPackagesQuery } from "@/lib/hooks/useQuestionPackagesQuery";
import { questionPackagesService } from "@/lib/services/questionPackages.service";
import type { QuestionPackage } from "@/lib/types/question-packages";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ActiveFilter = "all" | "active" | "inactive";

export function QuestionPackagesTable() {
  const qc = useQueryClient();

  const [qText, setQText] = React.useState("");
  const [active, setActive] = React.useState<ActiveFilter>("all");
  const [perPage, setPerPage] = React.useState(20);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [qText, active, perPage]);

  const is_active =
    active === "all" ? undefined : active === "active" ? true : false;

  const { qPkgs } = useQuestionPackagesQuery({
    q: qText,
    is_active,
    per_page: perPage,
    page,
  });

  const res = qPkgs.data;
  const rows = res?.data ?? [];

  const statusMut = useMutation({
    mutationFn: (args: { id: number; is_active: boolean }) =>
      questionPackagesService.updateStatus(args.id, { is_active: args.is_active }),
    onSuccess: (r) => {
      toast.success(r.message ?? "Status diupdate");
      qc.invalidateQueries({ queryKey: [API_ENDPOINTS.QUESTION_PACKAGES.BASE] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => questionPackagesService.destroy(id),
    onSuccess: (r) => {
      toast.success(r.message ?? "Package dihapus");
      qc.invalidateQueries({ queryKey: [API_ENDPOINTS.QUESTION_PACKAGES.BASE] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full gap-2 md:max-w-md">
          <Input
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            placeholder="Cari package..."
          />
          <Button type="button" variant="outline" onClick={() => setQText("")}>
            Reset
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={active}
            onChange={(e) => setActive(e.target.value as ActiveFilter)}
          >
            <option value="all">Semua</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>

          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            {[10, 20, 50, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n}/hal
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Total Soal</TableHead>
              <TableHead>Total Durasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  {qPkgs.isLoading ? "Memuat..." : "Data tidak ditemukan"}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((it: QuestionPackage, idx: number) => (
                <TableRow key={it.id}>
                  <TableCell>{(page - 1) * perPage + (idx + 1)}</TableCell>
                  <TableCell className="font-medium">{it.name}</TableCell>
                  <TableCell>{it.total_questions ?? "-"}</TableCell>
                  <TableCell>{it.total_duration_minutes ?? "-"}</TableCell>
                  <TableCell>
                    {it.is_active ? (
                      <Badge variant="secondary">Aktif</Badge>
                    ) : (
                      <Badge variant="outline">Nonaktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        statusMut.mutate({ id: it.id, is_active: !it.is_active })
                      }
                      disabled={statusMut.isPending}
                    >
                      {it.is_active ? "Nonaktifkan" : "Aktifkan"}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMut.mutate(it.id)}
                      disabled={deleteMut.isPending}
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

      {res && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Menampilkan <span className="text-foreground font-medium">{res.from ?? 0}</span>–
            <span className="text-foreground font-medium">{res.to ?? 0}</span> dari{" "}
            <span className="text-foreground font-medium">{res.total ?? 0}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || qPkgs.isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <span>
              Page <span className="text-foreground font-medium">{page}</span> /{" "}
              <span className="text-foreground font-medium">{res.last_page}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= res.last_page || qPkgs.isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
