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

type NavItem = {
  key: string;
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
  defaultOpen?: boolean;
};

function navByRole(role: UserRole): NavItem[] {
  if (role === "administrator") {
    return [
      { key: "dashboard", label: "Dashboard", href: "/dashboard" },
      { key: "schedules", label: "Schedules", href: "/dashboard/admin/schedules" },
      { key: "mitra", label: "Mitra", href: "/dashboard/admin/mitra" },
      { key: "packages", label: "Packages", href: "/dashboard/admin/question-packages" },
      {
        key: "arsip",
        label: "Data arsip",
        defaultOpen: true,
        children: [
          { label: "Operator", href: "/dashboard/admin/operators" },
          { label: "Peserta", href: "/dashboard/admin/peserta" },
        ],
      },
    ];
  }

  if (role === "operator") {
    return [
      { key: "dashboard", label: "Dashboard", href: "/dashboard" },
      { key: "schedules", label: "Schedules", href: "/dashboard/schedules" },
      { key: "packages", label: "Packages", href: "/dashboard/packages" },
    ];
  }

  return [
    { key: "dashboard", label: "Dashboard", href: "/dashboard" },
    { key: "my-schedules", label: "Jadwal Tes", href: "/dashboard/my-schedules" },
    { key: "payments", label: "Pembayaran", href: "/dashboard/payments" },
  ];
}

function isActivePath(pathname: string, href?: string) {
  if (!href) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

function computeInitialOpen(nav: NavItem[], pathname: string) {
  const acc: Record<string, boolean> = {};
  for (const item of nav) {
    const anyChildActive =
      (item.children?.length ?? 0) > 0 &&
      item.children!.some((c) => isActivePath(pathname, c.href));

    acc[item.key] = Boolean(item.defaultOpen) || Boolean(anyChildActive);
  }
  return acc;
}

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ nav distabilkan, jadi bukan array baru tiap render
  const nav = React.useMemo(() => navByRole(user.role), [user.role]);

  // ✅ state init sekali (lazy init) biar gak ada loop
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(() =>
    computeInitialOpen(nav, pathname)
  );

  // ✅ kalau route berubah dan masuk ke child: buka section terkait
  // (hanya update state kalau memang ada perubahan)
  React.useEffect(() => {
    setOpenSections((prev) => {
      let changed = false;
      const next = { ...prev };

      for (const item of nav) {
        if (!item.children?.length) continue;

        const anyChildActive = item.children.some((c) => isActivePath(pathname, c.href));
        if (anyChildActive && next[item.key] !== true) {
          next[item.key] = true;
          changed = true;
        }
      }

      return changed ? next : prev; // ✅ penting: kalau gak berubah, jangan set
    });
  }, [pathname, nav]);

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

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
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
            const hasChildren = (item.children?.length ?? 0) > 0;
            const anyChildActive =
              hasChildren && item.children!.some((c) => isActivePath(pathname, c.href));

            const active = isActivePath(pathname, item.href) || Boolean(anyChildActive);

            if (!hasChildren) {
              return (
                <Link key={item.key} href={item.href ?? "#"}>
                  <div
                    className={[
                      "rounded-md px-3 py-2 text-sm",
                      active ? "bg-muted font-medium" : "hover:bg-muted/60",
                    ].join(" ")}
                  >
                    {item.label}
                  </div>
                </Link>
              );
            }

            const open = Boolean(openSections[item.key]);

            return (
              <div key={item.key} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSection(item.key)}
                  className={[
                    "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm text-left",
                    active ? "bg-muted font-medium" : "hover:bg-muted/60",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                  <span
                    className={[
                      "text-xs text-muted-foreground transition-transform",
                      open ? "rotate-90" : "rotate-0",
                    ].join(" ")}
                  >
                    ▶
                  </span>
                </button>

                {open && (
                  <div className="ml-3 border-l pl-3 space-y-1">
                    {item.children!.map((child) => {
                      const childActive = isActivePath(pathname, child.href);
                      return (
                        <Link key={child.href} href={child.href}>
                          <div
                            className={[
                              "rounded-md px-3 py-2 text-sm",
                              childActive ? "bg-muted font-medium" : "hover:bg-muted/60",
                            ].join(" ")}
                          >
                            {child.label}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
