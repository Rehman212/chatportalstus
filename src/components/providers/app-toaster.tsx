"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className: "font-[family-name:var(--font-poppins)]",
        style: {
          borderRadius: "12px",
        },
      }}
    />
  );
}
