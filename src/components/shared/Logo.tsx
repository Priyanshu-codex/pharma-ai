"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export function PharmaAILogoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="pharmaai-pill-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Outer Capsule / Pill geometry with curved ends */}
      <rect
        x="6"
        y="12"
        width="36"
        height="24"
        rx="12"
        fill="url(#pharmaai-pill-grad)"
      />
      {/* Right side lighter pill half cut */}
      <path
        d="M24 12H30C36.6274 12 42 17.3726 42 24C42 30.6274 36.6274 36 30 36H24V12Z"
        fill="#0284c7"
      />
      {/* Central AI Neural Node & Medical Cross Spark (White Negative Space) */}
      <circle cx="18" cy="24" r="3.5" fill="#FFFFFF" />
      <circle cx="30" cy="24" r="3.5" fill="#FFFFFF" />
      <circle cx="24" cy="18" r="2.5" fill="#FFFFFF" />
      <circle cx="24" cy="30" r="2.5" fill="#FFFFFF" />
      
      {/* Connection Lines (Neural Network + Medical Cross Grid) */}
      <line x1="18" y1="24" x2="30" y2="24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="18" x2="24" y2="30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="24" x2="24" y2="18" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="30" y1="24" x2="24" y2="18" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="18" y1="24" x2="24" y2="30" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="30" y1="24" x2="24" y2="30" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />

      {/* Center Intelligence Node Highlight */}
      <circle cx="24" cy="24" r="2" fill="#0d9488" />
    </svg>
  );
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const iconDimensions = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
  }[size];

  const fontSizes = {
    sm: "text-base font-bold",
    md: "text-xl font-extrabold",
    lg: "text-2xl font-black",
    xl: "text-3xl font-black",
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <PharmaAILogoIcon size={iconDimensions} />
      {showText && (
        <span className={`${fontSizes} tracking-tight font-sans`}>
          <span style={{ color: "#0d9488" }}>Pharma</span>
          <span style={{ color: "#0284c7" }}>AI</span>
        </span>
      )}
    </div>
  );
}
