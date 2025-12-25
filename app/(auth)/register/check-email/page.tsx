"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email") ?? "";

  return (
    <AuthCard
      title="Cek Email Kamu"
      description="Kami sudah mengirim link verifikasi. Silakan cek inbox/spam dan klik link-nya."
    >
      <div className="space-y-3">
        {email ? (
          <p className="text-sm text-muted-foreground">
            Email tujuan: <span className="font-medium text-foreground">{email}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Kalau kamu tidak menerima email, cek folder spam atau coba register ulang.
          </p>
        )}

        <div className="pt-2 flex gap-2">
          <Button variant="outline" onClick={() => router.replace("/login")}>
            Ke Login
          </Button>
          <Button onClick={() => router.replace("/register")}>Register Ulang</Button>
        </div>
      </div>
    </AuthCard>
  );
}
