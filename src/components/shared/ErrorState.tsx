import { AlertTriangle, RefreshCw, Wifi } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  type?: "generic" | "network" | "not-found";
}

export function ErrorState({
  title,
  description,
  onRetry,
  type = "generic",
}: ErrorStateProps) {
  const defaults = {
    generic: {
      icon: <AlertTriangle size={32} />,
      title: "Something Went Wrong",
      description:
        "An unexpected error occurred. Please try again.",
    },
    network: {
      icon: <Wifi size={32} />,
      title: "Connection Error",
      description:
        "Unable to connect to the server. Please check your internet connection and try again.",
    },
    "not-found": {
      icon: <AlertTriangle size={32} />,
      title: "Not Found",
      description: "The requested resource could not be found.",
    },
  };

  const config = defaults[type];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          background: "var(--color-error-bg)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
          color: "var(--color-error)",
        }}
      >
        {config.icon}
      </div>
      <h3
        style={{
          fontWeight: 700,
          fontSize: 17,
          color: "var(--color-text-primary)",
        }}
      >
        {title ?? config.title}
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
          maxWidth: 280,
        }}
      >
        {description ?? config.description}
      </p>
      {onRetry && (
        <button
          className="btn-secondary"
          style={{ marginTop: 8, gap: 8 }}
          onClick={onRetry}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}
