"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/lib/utils/storage";
import { authService } from "@/lib/services/auth.service";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/errors";

export function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        await authService.me();
        setReady(true);
      } catch (e) {
        clearToken();
        toast.error(getApiErrorMessage(e));
        router.replace("/login");
      }
    })();
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
