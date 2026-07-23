import React from "react";
import RedirectHelper from "@/components/admin/RedirectHelper";

export default function AdminProductsPage() {
  return <RedirectHelper to="/admin/dashboard?module=inventory" />;
}
