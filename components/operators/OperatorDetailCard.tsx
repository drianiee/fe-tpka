"use client";

import Link from "next/link";
import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { operatorsService } from "@/lib/services/operators.service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { OperatorDetailResponse } from "@/lib/types/operators";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ActiveBadge({ active }: { active?: boolean | null }) {
  if (active === false) return <Badge variant="secondary">Nonaktif</Badge>;
  return <Badge variant="default">Aktif</Badge>;
}

export function OperatorDetailCard({ id }: { id: string }) {
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const qDetail = useQuery({
    queryKey: [API_ENDPOINTS.ADMIN.OPERATOR_DETAIL(id)],
    queryFn: () => operatorsService.detail(id),
    enabled: Boolean(id),
  });

  const operator = qDetail.data?.operator;

  const mStatus = useMutation({
    mutationFn: (nextActive: boolean) =>
      operatorsService.updateStatus(id, nextActive),
    onSuccess: (data) => {
      toast.success(data.message || "Status operator berhasil diupdate.");

      qc.setQueryData<OperatorDetailResponse>(
        [API_ENDPOINTS.ADMIN.OPERATOR_DETAIL(id)],
        { operator: data.operator }
      );

      qc.invalidateQueries({ queryKey: [API_ENDPOINTS.ADMIN.OPERATORS] });

      // kalau dialog terbuka, tutup setelah sukses
      setConfirmOpen(false);
    },
    onError: (e: unknown) => toast.error(getApiErrorMessage(e)),
  });

  if (!id) {
    return (
      <Card className="p-4 space-y-2">
        <div className="text-sm text-muted-foreground">
          ID operator tidak ditemukan.
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/admin/operators">Kembali</Link>
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

  if (qDetail.isError || !operator) {
    return (
      <Card className="p-4 space-y-3">
        <div className="text-sm text-muted-foreground">
          Gagal memuat detail operator.
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/admin/operators">Kembali</Link>
        </Button>
      </Card>
    );
  }

  const isActive = operator.is_active === true;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">{operator.name}</div>
          <div className="text-sm text-muted-foreground">{operator.email}</div>
        </div>

        <div className="flex items-center gap-2">
          <ActiveBadge active={operator.is_active} />

          {isActive ? (
            // ✅ Nonaktifkan: pakai dialog konfirmasi
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" disabled={mStatus.isPending}>
                  Nonaktifkan
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Nonaktifkan operator?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Operator yang nonaktif tidak bisa login. Kamu yakin ingin
                    menonaktifkan <span className="font-medium">{operator.name}</span>?
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={mStatus.isPending}>
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={mStatus.isPending}
                    onClick={(e) => {
                      e.preventDefault();
                      mStatus.mutate(false);
                    }}
                  >
                    {mStatus.isPending ? "Menyimpan..." : "Ya, nonaktifkan"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            // ✅ Aktifkan: langsung tanpa dialog
            <Button
              type="button"
              variant="default"
              disabled={mStatus.isPending}
              onClick={() => mStatus.mutate(true)}
            >
              {mStatus.isPending ? "Menyimpan..." : "Aktifkan"}
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">ID</span>
          <span className="font-medium">{operator.id}</span>
        </div>

        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Role</span>
          <span className="font-medium">{operator.role}</span>
        </div>

        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Verified</span>
          <span className="font-medium">
            {operator.email_verified_at ? "Ya" : "Belum"}
          </span>
        </div>
      </div>

      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard/admin/operators">Kembali</Link>
      </Button>
    </Card>
  );
}
