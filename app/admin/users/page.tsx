import React from "react";
import RedirectHelper from "@/components/admin/RedirectHelper";

export default function AdminUsersPage() {
  return <RedirectHelper to="/admin/dashboard?module=customer" />;
}
