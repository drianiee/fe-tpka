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

/* ================= VALIDATION =================
   IMPORTANT:
   - angka disimpan sebagai string di form (biar resolver gak jadi unknown)
   - conditional required (partner & packages) pakai setError di submit
*/

const schema = z.object({
  date: z.string().min(1, "Tanggal wajib diisi"),
  start_time: z.string().min(1, "Jam mulai wajib diisi"),

  price: z
    .string()
    .min(1, "Harga wajib diisi")
    .refine((v) => !Number.isNaN(Number(v)), "Harga harus angka")
    .refine((v) => Number(v) >= 0, "Harga minimal 0"),

  is_partner: z.boolean(),

  partner_id: z.number().optional(),

  capacity: z
    .string()
    .min(1, "Kapasitas wajib diisi")
    .refine((v) => !Number.isNaN(Number(v)), "Kapasitas harus angka")
    .refine((v) => Number(v) >= 1, "Kapasitas minimal 1"),

  package_ids: z.array(z.number()),
});

type FormValues = z.infer<typeof schema>;

/* ================= COMPONENT ================= */

export function AddScheduleDialog() {
  const [open, setOpen] = React.useState(false);
  const qc = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: "",
      start_time: "",
      price: "150000",
      is_partner: false,
      partner_id: undefined,
      capacity: "50",
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

  const { qPkgs } = useQuestionPackagesQuery({
    enabled: open && isPartner,
    q: pkgQuery,
    is_active: true,
    per_page: 50,
    page: 1,
  });

  // ambil list dari response paginated
  const packages = qPkgs.data?.data ?? [];

  /* ===== reset field saat toggle non-mitra ===== */
  React.useEffect(() => {
    if (!isPartner) {
      form.setValue("partner_id", undefined);
      form.setValue("package_ids", []);
      form.clearErrors(["partner_id", "package_ids"]);
      setPartnerQuery("");
      setPkgQuery("");
    }
  }, [isPartner, form]);

  /* ===== mutation ===== */
  const createMut = useMutation({
    mutationFn: (v: FormValues) =>
      schedulesService.create({
        date: v.date,
        start_time: v.start_time,
        price: Number(v.price),
        capacity: Number(v.capacity),
        is_partner: v.is_partner,
        partner_id: v.is_partner ? v.partner_id : undefined,

        // NOTE:
        // kalau backend kamu single package_id, pakai v.package_ids[0]
        // kalau backend kamu sudah terima array, keep v.package_ids
        package_id: v.is_partner ? v.package_ids : undefined,
      }),
    onSuccess: (res) => {
      toast.success(res.message ?? "Jadwal berhasil dibuat");
      qc.invalidateQueries({ queryKey: [API_ENDPOINTS.SCHEDULES.BASE] });
      setOpen(false);
      form.reset({
        date: "",
        start_time: "",
        price: "150000",
        is_partner: false,
        partner_id: undefined,
        capacity: "50",
        package_ids: [],
      });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  function onSubmit(v: FormValues) {
    if (v.is_partner) {
      let hasError = false;

      if (!v.partner_id) {
        form.setError("partner_id", {
          type: "manual",
          message: "Partner wajib dipilih untuk jadwal mitra",
        });
        hasError = true;
      }

      if (!v.package_ids || v.package_ids.length === 0) {
        form.setError("package_ids", {
          type: "manual",
          message: "Minimal pilih 1 paket soal untuk jadwal mitra",
        });
        hasError = true;
      }

      if (hasError) return;
    }

    createMut.mutate(v);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Jadwal</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <Label>Tanggal</Label>
            <Input type="date" {...form.register("date")} />
            {form.formState.errors.date && (
              <p className="text-sm text-destructive">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Jam Mulai</Label>
            <Input type="time" {...form.register("start_time")} />
            {form.formState.errors.start_time && (
              <p className="text-sm text-destructive">
                {form.formState.errors.start_time.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Harga</Label>
            <Input type="number" {...form.register("price")} />
            {form.formState.errors.price && (
              <p className="text-sm text-destructive">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
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
              <div className="space-y-1">
                <Label>Partner</Label>
                <Controller
                  control={form.control}
                  name="partner_id"
                  render={({ field }) => (
                    <SearchableCombobox
                      value={field.value ?? null}
                      onChange={(val) => {
                        field.onChange(val);
                        form.clearErrors("partner_id");
                      }}
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
                {form.formState.errors.partner_id && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.partner_id.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Paket Soal</Label>
                <Controller
                  control={form.control}
                  name="package_ids"
                  render={({ field }) => (
                    <SearchableCombobox
                      multiple
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        form.clearErrors("package_ids");
                      }}
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
                {form.formState.errors.package_ids && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.package_ids.message as string}
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Non-mitra: paket soal otomatis memakai semua yang aktif.
            </p>
          )}

          <div className="space-y-1">
            <Label>Kapasitas</Label>
            <Input type="number" {...form.register("capacity")} />
            {form.formState.errors.capacity && (
              <p className="text-sm text-destructive">
                {form.formState.errors.capacity.message}
              </p>
            )}
          </div>

          <Button className="w-full" disabled={createMut.isPending}>
            {createMut.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
