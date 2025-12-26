"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { partnersService } from "@/lib/services/partners.service";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getApiErrorMessage } from "@/lib/api/errors";

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

/* ================= VALIDATION ================= */

const schema = z.object({
  name: z.string().min(1, "Nama mitra wajib diisi"),
  code: z.string().optional(),
  contact_name: z.string().optional(),

  // optional tapi kalau diisi harus email valid; string kosong dianggap "tidak diisi"
  contact_email: z
    .union([z.string().email("Email tidak valid"), z.literal("")])
    .optional(),

  contact_phone: z.string().optional(),

  // ✅ wajib boolean (biar resolver cocok dengan useForm)
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

/* ================= COMPONENT ================= */

export function AddPartnerDialog() {
  const [open, setOpen] = React.useState(false);
  const qc = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      is_active: true,
    },
  });

  const createMut = useMutation({
    mutationFn: (v: FormValues) =>
      partnersService.create({
        name: v.name,
        code: v.code?.trim() ? v.code.trim() : undefined,
        contact_name: v.contact_name?.trim() ? v.contact_name.trim() : undefined,
        contact_email:
          v.contact_email && v.contact_email !== "" ? v.contact_email : undefined,
        contact_phone: v.contact_phone?.trim()
          ? v.contact_phone.trim()
          : undefined,
        is_active: v.is_active,
      }),
    onSuccess: (res) => {
      toast.success(res.message || "Partner berhasil dibuat");
      qc.invalidateQueries({ queryKey: [API_ENDPOINTS.PARTNERS.BASE] });
      setOpen(false);
      form.reset();
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Partner</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Mitra</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) => createMut.mutate(v))}
        >
          <div className="space-y-1">
            <Label>Nama Mitra</Label>
            <Input placeholder="Masukkan Nama Instansi Mitra" {...form.register("name")} />
          </div>

          <div className="space-y-1">
            <Label>Kode Mitra</Label>
            <Input placeholder="Masukkan Kode Mitra" {...form.register("code")} />
          </div>

          <div className="space-y-1">
            <Label >Nama PIC</Label>
            <Input placeholder="Masukkan Nama PIC" {...form.register("contact_name")} />
          </div>

          <div className="space-y-1">
            <Label>Email PIC</Label>
            <Input
              type="email"
              placeholder="Contoh: andrian@mitraa.com"
              {...form.register("contact_email")}
            />
          </div>

          <div className="space-y-1">
            <Label>Nomor PIC</Label>
            <Input placeholder="Contoh: 08123456789" {...form.register("contact_phone")} />
          </div>

          <div className="space-y-1">
            <Label>Status Kemitraan</Label>
            <Controller
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <Select
                  value={field.value ? "active" : "inactive"}
                  onValueChange={(v) => field.onChange(v === "active")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              )}
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
