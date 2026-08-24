import { Shield, AlertCircle } from "lucide-react";

interface MedDisclaimerProps {
  variant?: "compact" | "full";
  className?: string;
  style?: React.CSSProperties;
}

export function MedDisclaimer({ variant = "compact", className, style }: MedDisclaimerProps) {
  if (variant === "full") {
    return (
      <div
        className={className}
        style={{
          background: "var(--color-warning-bg)",
          border: "1px solid #fde68a",
          borderRadius: "var(--radius-md)",
          padding: "14px 16px",
          display: "flex",
          gap: 12,
          ...style,
        }}
        role="note"
        aria-label="Medical disclaimer"
      >
        <Shield
          size={20}
          style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: 1 }}
        />
        <div>
          <p
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: "#92400e",
              marginBottom: 4,
            }}
          >
            Medical Disclaimer
          </p>
          <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.6 }}>
            PharmaAI provides general pharmaceutical information for educational
            purposes only. This information does not replace professional medical
            advice, diagnosis, or treatment. Always consult your doctor,
            pharmacist, or qualified healthcare professional before making any
            decisions about your medications.
          </p>
          <p style={{ fontSize: 12, color: "#78350f", marginTop: 6, lineHeight: 1.6 }}>
            <strong>Do not</strong> start, stop, or change your medication based
            solely on information from this app without consulting a healthcare
            professional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        background: "var(--color-info-bg)",
        borderRadius: "var(--radius-sm)",
        padding: "8px 12px",
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        ...style,
      }}
      role="note"
      aria-label="Medical disclaimer"
    >
      <AlertCircle
        size={14}
        style={{ color: "var(--color-info)", flexShrink: 0, marginTop: 1 }}
      />
      <p style={{ fontSize: 11, color: "#1e40af", lineHeight: 1.5 }}>
        For informational purposes only. Consult your pharmacist or doctor for
        personalised medical advice.
      </p>
    </div>
  );
}
