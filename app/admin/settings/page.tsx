import React from "react";
import RedirectHelper from "@/components/admin/RedirectHelper";

export default function AdminSettingsPage() {
  return <RedirectHelper to="/admin/dashboard?module=settings" />;
}
