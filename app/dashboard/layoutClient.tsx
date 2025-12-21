"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DashboardSidebar } from "@/components/common/DashboardSidebar";

import type { User } from "@/lib/types/auth";
import { authService } from "@/lib/services/auth.service";
import { getToken, clearToken } from "@/lib/utils/storage";
import { getApiErrorMessage } from "@/lib/api/errors";

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        const me = await authService.me();
        setUser(me);
      } catch (e: unknown) {
        clearToken();
        toast.error(getApiErrorMessage(e));
        router.replace("/login");
      }
    })();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background md:flex">
      <DashboardSidebar user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
