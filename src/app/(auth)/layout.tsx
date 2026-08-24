import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Welcome",
    template: "%s | PharmaAI",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}
