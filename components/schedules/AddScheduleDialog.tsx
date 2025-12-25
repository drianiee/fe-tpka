"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { schedulesService } from "@/lib/services/schedules.service";
import { getApiErrorMessage } from "@/lib/api/errors";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

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

/**
 * ✅ Tidak pakai preprocess/coerce
 * Number parsing dilakukan oleh RHF via valueAsNumber
 */
const schema = z.object({
  date: z.string().min(1, "Tanggal wajib"),
  start_time: z.string().min(1, "Jam mulai wajib"),
  price: z.number().finite("Harga tidak valid").min(0, "Harga tidak valid"),
  is_partner: z.enum(["true", "false"]),
  capacity: z
    .number()
    .finite("Kapasitas tidak valid")
    .int("Kapasitas harus bilangan bulat")
    .min(1, "Kapasitas minimal 1"),
  package_id: z
    .number()
    .finite("Paket tidak valid")
    .int("Paket harus bilangan bulat")
    .positive("Paket wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

export function AddScheduleDialog() {
  const [open, setOpen] = React.useState(false);
  const qc = useQueryClient();

  // ✅ samakan juga 3 generic di useForm
  const form = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver<FormValues, unknown, FormValues>(schema),
    defaultValues: {
      date: "",
      start_time: "",
      price: 150000,
      is_partner: "true",
      capacity: 50,
      package_id: 1,
    },
    mode: "onSubmit",
  });

  const createMut = useMutation({
    mutationFn: (values: FormValues) =>
      schedulesService.create({
        date: values.date,
        start_time: values.start_time, // "HH:mm"
        price: values.price,
        is_partner: values.is_partner === "true",
        capacity: values.capacity,
        package_id: values.package_id,
      }),
    onSuccess: (res) => {
      toast.success(res.message ?? "Jadwal berhasil dibuat");
      qc.invalidateQueries({ queryKey: [API_ENDPOINTS.SCHEDULES.BASE] });
      setOpen(false);
      form.reset();
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

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
          onSubmit={handleSubmit((values) => createMut.mutate(values))}
        >
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date?.message ? (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_time">Jam Mulai</Label>
            <Input id="start_time" type="time" {...register("start_time")} />
            {errors.start_time?.message ? (
              <p className="text-sm text-destructive">
                {errors.start_time.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Harga</Label>
            <Input
              id="price"
              type="number"
              inputMode="numeric"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price?.message ? (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Partner</Label>
            <Controller
              control={control}
              name="is_partner"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Partner?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ya</SelectItem>
                    <SelectItem value="false">-</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.is_partner?.message ? (
              <p className="text-sm text-destructive">
                {errors.is_partner.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Kapasitas</Label>
            <Input
              id="capacity"
              type="number"
              inputMode="numeric"
              {...register("capacity", { valueAsNumber: true })}
            />
            {errors.capacity?.message ? (
              <p className="text-sm text-destructive">
                {errors.capacity.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="package_id">Paket Soal (package_id)</Label>
            <Input
              id="package_id"
              type="number"
              inputMode="numeric"
              {...register("package_id", { valueAsNumber: true })}
            />
            {errors.package_id?.message ? (
              <p className="text-sm text-destructive">
                {errors.package_id.message}
              </p>
            ) : null}
          </div>

          <Button className="w-full" type="submit" disabled={createMut.isPending}>
            {createMut.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
