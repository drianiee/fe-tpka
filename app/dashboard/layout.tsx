import * as React from "react";
import { DashboardLayoutClient } from "./layoutClient";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
