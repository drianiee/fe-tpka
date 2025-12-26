"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { schedulesService } from "@/lib/services/schedules.service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getApiErrorMessage } from "@/lib/api/errors";

import { usePartnersQuery } from "@/lib/hooks/usePartnersQuery";
import { useQuestionPackagesQuery } from "@/lib/hooks/useQuestionPackagesQuery";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SearchableCombobox } from "@/components/common/SearchableCombobox";

/* ================= VALIDATION ================= */

const schema = z.object({
  date: z.string().min(1),
  start_time: z.string().min(1),
  price: z.number().min(0),

  is_partner: z.boolean(),
  partner_id: z.number().optional(),
  capacity: z.number().min(1),

  package_ids: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof schema>;

/* ================= COMPONENT ================= */

export function AddScheduleDialog() {
  const [open, setOpen] = React.useState(false);
  const qc = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: 150000,
      is_partner: false,
      capacity: 50,
      package_ids: [],
    },
  });

  const isPartner = useWatch({ control: form.control, name: "is_partner" });

  /* ===== UI state ===== */
  const [partnerOpen, setPartnerOpen] = React.useState(false);
  const [partnerQuery, setPartnerQuery] = React.useState("");

  const [pkgOpen, setPkgOpen] = React.useState(false);
  const [pkgQuery, setPkgQuery] = React.useState("");

  /* ===== data ===== */
  const { qPartners, partners } = usePartnersQuery({
    enabled: open && isPartner,
    q: partnerQuery,
  });

  const { qPkgs, packages } = useQuestionPackagesQuery({
    enabled: open && isPartner,
    q: pkgQuery,
  });

  /* ===== mutation ===== */
  const createMut = useMutation({
    mutationFn: (v: FormValues) =>
      schedulesService.create({
        date: v.date,
        start_time: v.start_time,
        price: v.price,
        capacity: v.capacity,
        is_partner: v.is_partner,
        partner_id: v.is_partner ? v.partner_id : undefined,
        package_id: v.is_partner ? v.package_ids : undefined,
      }),

    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: [API_ENDPOINTS.SCHEDULES.BASE] });
      setOpen(false);
      form.reset();
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Jadwal</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) => createMut.mutate(v))}
        >
          <div>
            <Label>Tanggal</Label>
            <Input type="date" {...form.register("date")} />
          </div>

          <div>
            <Label>Jam Mulai</Label>
            <Input type="time" {...form.register("start_time")} />
          </div>

          <div>
            <Label>Harga</Label>
            <Input
              type="number"
              {...form.register("price", { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label>Mitra?</Label>
            <Controller
              control={form.control}
              name="is_partner"
              render={({ field }) => (
                <Select
                  value={field.value ? "yes" : "no"}
                  onValueChange={(v) => field.onChange(v === "yes")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Tidak</SelectItem>
                    <SelectItem value="yes">Ya</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {isPartner ? (
            <>
              <Controller
                control={form.control}
                name="partner_id"
                render={({ field }) => (
                  <SearchableCombobox
                    value={field.value ?? null}
                    onChange={field.onChange}
                    options={partners.map((p) => ({
                      id: p.id,
                      label: p.name,
                    }))}
                    open={partnerOpen}
                    onOpenChange={setPartnerOpen}
                    search={partnerQuery}
                    onSearchChange={setPartnerQuery}
                    loading={qPartners.isLoading}
                    placeholder="Pilih partner"
                  />
                )}
              />

              <Controller
                control={form.control}
                name="package_ids"
                render={({ field }) => (
                  <SearchableCombobox
                    multiple
                    value={field.value ?? []}
                    onChange={field.onChange}
                    options={packages.map((p) => ({
                      id: p.id,
                      label: p.name,
                    }))}
                    open={pkgOpen}
                    onOpenChange={setPkgOpen}
                    search={pkgQuery}
                    onSearchChange={setPkgQuery}
                    loading={qPkgs.isLoading}
                    placeholder="Pilih paket soal"
                  />
                )}
              />
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Non-mitra: paket soal otomatis memakai semua yang aktif.
            </p>
          )}

          <div>
            <Label>Kapasitas</Label>
            <Input
              type="number"
              {...form.register("capacity", { valueAsNumber: true })}
            />
          </div>

          <Button className="w-full" disabled={createMut.isPending}>
            {createMut.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
