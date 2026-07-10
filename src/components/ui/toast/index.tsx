// components/ui/toast/index.tsx
import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#ffffff",
          color: "#111827",
          borderRadius: "12px",
          padding: "14px 16px",
          fontSize: "14px",
          fontWeight: 600,
          lineHeight: 1.4,
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
          border: "1px solid rgba(15, 23, 42, 0.08)",
        },
        success: {
          style: {
            background: "#ecfdf3",
            color: "#065f46",
            border: "1px solid #a7f3d0",
          },
        },
        error: {
          style: {
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
        },
        loading: {
          style: {
            background: "#f8fafc",
            color: "#334155",
            border: "1px solid #e2e8f0",
          },
        },
      }}
    />
  );
}