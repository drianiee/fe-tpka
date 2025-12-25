"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { User, UserRole } from "@/lib/types/auth";
import { authService } from "@/lib/services/auth.service";
import { clearToken } from "@/lib/utils/storage";
import { getApiErrorMessage } from "@/lib/api/errors";

type NavItem = { label: string; href: string };

function navByRole(role: UserRole): NavItem[] {
  if (role === "administrator") {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Schedules", href: "/dashboard/admin/schedules" },
      { label: "Packages", href: "/dashboard/packages" },
      { label: "Users", href: "/dashboard/users" },
    ];
  }
  if (role === "operator") {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Schedules", href: "/dashboard/schedules" },
      { label: "Packages", href: "/dashboard/packages" },
    ];
  }
  return [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Jadwal Tes", href: "/dashboard/my-schedules" },
    { label: "Pembayaran", href: "/dashboard/payments" },
  ];
}

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = navByRole(user.role);

  async function onLogout() {
    try {
      await authService.logout();
    } catch (e: unknown) {
      toast.error(getApiErrorMessage(e));
    } finally {
      clearToken();
      toast.success("Logout");
      router.replace("/login");
    }
  }

  return (
    <aside className="w-full md:w-64 md:min-h-screen border-b md:border-b-0 md:border-r bg-background">
      <div className="p-4">
        <div className="font-semibold">TPKA</div>
        <div className="mt-1 text-sm text-muted-foreground">
          {user.name} • {user.role}
        </div>

        <Separator className="my-4" />

        <nav className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={[
                    "rounded-md px-3 py-2 text-sm",
                    active
                      ? "bg-muted font-medium"
                      : "hover:bg-muted/60",
                  ].join(" ")}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <Separator className="my-4" />

        <Button variant="outline" className="w-full" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </aside>
  );
}
