import { cn } from "@/lib/utils";
import { getConfidenceInfo } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ConfidenceBadgeProps {
  confidence: number; // 0–1
  showDescription?: boolean;
  className?: string;
}

export function ConfidenceBadge({
  confidence,
  showDescription = false,
  className,
}: ConfidenceBadgeProps) {
  const { label, variant, description } = getConfidenceInfo(confidence);

  const variantStyles: Record<string, { bg: string; text: string; border: string }> = {
    success: {
      bg: "var(--color-success-bg)",
      text: "#065f46",
      border: "#a7f3d0",
    },
    warning: {
      bg: "var(--color-warning-bg)",
      text: "#92400e",
      border: "#fde68a",
    },
    error: {
      bg: "var(--color-error-bg)",
      text: "#991b1b",
      border: "#fecaca",
    },
  };

  const styles = variantStyles[variant];

  const Icon =
    variant === "success"
      ? CheckCircle
      : variant === "warning"
      ? AlertTriangle
      : AlertTriangle;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 10px",
          borderRadius: "var(--radius-full)",
          fontSize: 11,
          fontWeight: 600,
          background: styles.bg,
          color: styles.text,
          border: `1px solid ${styles.border}`,
          width: "fit-content",
        }}
      >
        <Icon size={11} />
        {label} · {Math.round(confidence * 100)}%
      </span>
      {showDescription && (
        <p
          style={{
            fontSize: 12,
            color: "var(--color-text-secondary)",
            display: "flex",
            alignItems: "flex-start",
            gap: 4,
          }}
        >
          <Info size={12} style={{ flexShrink: 0, marginTop: 1 }} />
          {description}
        </p>
      )}
    </div>
  );
}
