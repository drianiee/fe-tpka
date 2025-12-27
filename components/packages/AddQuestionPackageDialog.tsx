"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getApiErrorMessage } from "@/lib/api/errors";
import { questionPackagesService } from "@/lib/services/questionPackages.service";
import type { CreateQuestionPackageRequest } from "@/lib/types/question-packages";

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

// angka optional: boleh "", kalau diisi harus integer >= 1
const optionalIntString = z
  .union([z.string().regex(/^\d+$/, "Harus angka"), z.literal("")])
  .optional()
  .refine((v) => v === undefined || v === "" || Number(v) >= 1, {
    message: "Minimal 1",
  });

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),

  // ✅ wajib boolean (biar resolver cocok dengan useForm)
  is_active: z.boolean(),

  verbal_num_questions: optionalIntString,
  verbal_duration_minutes: optionalIntString,

  quantitative_num_questions: optionalIntString,
  quantitative_duration_minutes: optionalIntString,

  logic_num_questions: optionalIntString,
  logic_duration_minutes: optionalIntString,

  spatial_num_questions: optionalIntString,
  spatial_duration_minutes: optionalIntString,

  file: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof schema>;

/* ================= HELPERS ================= */

function toOptionalInt(v?: string): number | undefined {
  if (!v || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/* ================= COMPONENT ================= */

export function AddQuestionPackageDialog() {
  const [open, setOpen] = React.useState(false);
  const qc = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      is_active: true,

      verbal_num_questions: "",
      verbal_duration_minutes: "",
      quantitative_num_questions: "",
      quantitative_duration_minutes: "",
      logic_num_questions: "",
      logic_duration_minutes: "",
      spatial_num_questions: "",
      spatial_duration_minutes: "",

      file: undefined,
    },
  });

  const createMut = useMutation({
    mutationFn: (v: FormValues) => {
      const payload: CreateQuestionPackageRequest = {
        name: v.name,
        is_active: v.is_active,

        verbal_num_questions: toOptionalInt(v.verbal_num_questions),
        verbal_duration_minutes: toOptionalInt(v.verbal_duration_minutes),

        quantitative_num_questions: toOptionalInt(v.quantitative_num_questions),
        quantitative_duration_minutes: toOptionalInt(
          v.quantitative_duration_minutes
        ),

        logic_num_questions: toOptionalInt(v.logic_num_questions),
        logic_duration_minutes: toOptionalInt(v.logic_duration_minutes),

        spatial_num_questions: toOptionalInt(v.spatial_num_questions),
        spatial_duration_minutes: toOptionalInt(v.spatial_duration_minutes),

        file: v.file ?? null,
      };

      return questionPackagesService.create(payload);
    },
    onSuccess: (res) => {
      toast.success(res.message ?? "Question package dibuat");
      qc.invalidateQueries({ queryKey: [API_ENDPOINTS.QUESTION_PACKAGES.BASE] });
      setOpen(false);
      form.reset();
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Package</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tambah Paket Soal</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) => createMut.mutate(v))}
        >
          <div className="space-y-1">
            <Label>Nama Paket</Label>
            <Input
              placeholder="Contoh: Paket TPA Bahasa Indo"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Status</Label>
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
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Verbal - Jumlah Soal</Label>
              <Input type="number" {...form.register("verbal_num_questions")} />
              {form.formState.errors.verbal_num_questions && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.verbal_num_questions.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Verbal - Durasi (menit)</Label>
              <Input
                type="number"
                {...form.register("verbal_duration_minutes")}
              />
              {form.formState.errors.verbal_duration_minutes && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.verbal_duration_minutes.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Quantitative - Jumlah Soal</Label>
              <Input
                type="number"
                {...form.register("quantitative_num_questions")}
              />
              {form.formState.errors.quantitative_num_questions && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.quantitative_num_questions.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Quantitative - Durasi (menit)</Label>
              <Input
                type="number"
                {...form.register("quantitative_duration_minutes")}
              />
              {form.formState.errors.quantitative_duration_minutes && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.quantitative_duration_minutes.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Logic - Jumlah Soal</Label>
              <Input type="number" {...form.register("logic_num_questions")} />
              {form.formState.errors.logic_num_questions && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.logic_num_questions.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Logic - Durasi (menit)</Label>
              <Input
                type="number"
                {...form.register("logic_duration_minutes")}
              />
              {form.formState.errors.logic_duration_minutes && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.logic_duration_minutes.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Spatial - Jumlah Soal</Label>
              <Input type="number" {...form.register("spatial_num_questions")} />
              {form.formState.errors.spatial_num_questions && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.spatial_num_questions.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Spatial - Durasi (menit)</Label>
              <Input
                type="number"
                {...form.register("spatial_duration_minutes")}
              />
              {form.formState.errors.spatial_duration_minutes && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.spatial_duration_minutes.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label>File (optional)</Label>
            <Controller
              control={form.control}
              name="file"
              render={({ field }) => (
                <Input
                  type="file"
                  onChange={(e) =>
                    field.onChange(e.target.files?.[0] ?? undefined)
                  }
                />
              )}
            />
            <p className="text-xs text-muted-foreground">Max 100MB (backend).</p>
          </div>

          <Button className="w-full" disabled={createMut.isPending}>
            {createMut.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
