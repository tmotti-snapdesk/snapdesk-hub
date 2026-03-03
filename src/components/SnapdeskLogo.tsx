"use client";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

export function SnapdeskLogo({ className = "", variant = "dark", size = "md" }: LogoProps) {
  const textSizes = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" };
  const chevronSizes = { sm: "text-base", md: "text-lg", lg: "text-3xl" };

  const textColor = variant === "dark" ? "#1C1F25" : "#ffffff";
  const chevronColor = "#A9BCB7";

  return (
    <div className={`flex items-center select-none ${className}`} style={{ gap: 0 }}>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          color: textColor,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
        className={textSizes[size]}
      >
        snapdesk
      </span>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          color: chevronColor,
          lineHeight: 1,
        }}
        className={chevronSizes[size]}
      >
        {"<"}
      </span>
    </div>
  );
}
