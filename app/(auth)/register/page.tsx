"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authService } from "@/lib/services/auth.service";
import { getApiErrorMessage } from "@/lib/api/errors";

const schema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    password_confirmation: z
      .string()
      .min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: "Password dan konfirmasi tidak sama",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const res = await authService.register(values);

      // ✅ Jangan simpan token dari register (biar verifikasi dulu)
      toast.success(res.message || "Registrasi berhasil. Cek email untuk verifikasi.");

      // ✅ Redirect ke halaman check email
      router.replace(`/register/check-email?email=${encodeURIComponent(values.email)}`);
    } catch (e: unknown) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <AuthCard
      title="Register"
      description="Buat akun peserta (wajib verifikasi email)"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="name">Nama</Label>
          <Input id="name" placeholder="Nama lengkap" {...register("name")} />
          {errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="you@mail.com" {...register("email")} />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimal 6 karakter"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
          <Input
            id="password_confirmation"
            type="password"
            placeholder="Ulangi password"
            {...register("password_confirmation")}
          />
          {errors.password_confirmation ? (
            <p className="text-sm text-destructive">
              {errors.password_confirmation.message}
            </p>
          ) : null}
        </div>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Register"}
        </Button>

        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link className="text-foreground underline" href="/login">
            Login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
