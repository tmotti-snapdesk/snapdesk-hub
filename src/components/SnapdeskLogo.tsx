"use client";

import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { width: 120, height: 30 },
  md: { width: 160, height: 40 },
  lg: { width: 240, height: 60 },
};

export function SnapdeskLogo({ className = "", variant = "dark", size = "md" }: LogoProps) {
  const { width, height } = SIZES[size];

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Snapdesk"
        width={width}
        height={height}
        priority
        style={{
          // Sur fond sombre : logo noir inversé en blanc
          filter: variant === "light" ? "brightness(0) invert(1)" : "none",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
