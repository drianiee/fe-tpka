"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { authService } from "@/lib/services/auth.service";
import { setToken } from "@/lib/utils/storage";
import { getApiErrorMessage } from "@/lib/api/errors";

const schema = z.object({
  id_type: z.enum(["ktp", "ktm", "sim"], { message: "Pilih jenis identitas" }),
  birth_date: z.string().min(1, "Tanggal lahir wajib diisi"),
  phone: z.string().min(8, "Nomor HP minimal 8 digit"),
  id_image: z
    .custom<File>((v) => v instanceof File, "File identitas wajib diupload")
    .refine((f) => f.size <= 5 * 1024 * 1024, "Maks 5MB")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/jpg"].includes(f.type),
      "File harus JPG/PNG"
    ),
});

type FormValues = z.infer<typeof schema>;

export default function CompleteProfilePage() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token") ?? "";
  const status = params.get("status") ?? "";
  const email = params.get("email") ?? "";

  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id_type: "ktp",
      birth_date: "",
      phone: "",
      id_image: undefined as unknown as File,
    },
  });

  React.useEffect(() => {
    if (!token) {
      toast.error("Token verifikasi tidak ditemukan. Silakan klik ulang link email verifikasi.");
      router.replace("/login");
      return;
    }

    if (status === "already-verified") {
      toast.info("Email sudah terverifikasi. Silakan lengkapi profil.");
    } else if (status === "verified") {
      toast.success("Email berhasil diverifikasi. Silakan lengkapi profil.");
    }
  }, [token, status, router]);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const res = await authService.completeProfile(token, {
        id_type: values.id_type,
        birth_date: values.birth_date,
        phone: values.phone,
        id_image: values.id_image,
      });

      // ✅ simpan token normal untuk FE
      setToken(res.token);

      toast.success(res.message || "Profil berhasil dilengkapi");
      router.replace("/dashboard");
    } catch (e: unknown) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = form;

  return (
    <AuthCard
      title="Complete Profile"
      description={email ? `Lengkapi profil untuk: ${email}` : "Lengkapi profil Anda"}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label>Jenis Identitas</Label>
          <Controller
            control={control}
            name="id_type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis identitas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ktp">KTP</SelectItem>
                  <SelectItem value="ktm">KTM</SelectItem>
                  <SelectItem value="sim">SIM</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.id_type ? (
            <p className="text-sm text-destructive">{errors.id_type.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_date">Tanggal Lahir</Label>
          <Input id="birth_date" type="date" {...register("birth_date")} />
          {errors.birth_date ? (
            <p className="text-sm text-destructive">{errors.birth_date.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">No HP</Label>
          <Input id="phone" placeholder="08xxxxxxxxxx" {...register("phone")} />
          {errors.phone ? (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="id_image">Upload Foto Identitas (JPG/PNG, max 5MB)</Label>
          <Input
            id="id_image"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("id_image", file, { shouldValidate: true });
            }}
          />
          {errors.id_image ? (
            <p className="text-sm text-destructive">{errors.id_image.message as string}</p>
          ) : null}
        </div>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Profil"}
        </Button>
      </form>
    </AuthCard>
  );
}
