"use client";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

export function SnapdeskLogo({ className = "", variant = "dark", size = "md" }: LogoProps) {
  const sizes = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };
  const colors = {
    dark: "text-[#1a3a5c]",
    light: "text-white",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Placeholder logo mark - replace with actual SVG */}
      <div
        className={`flex items-center justify-center rounded-lg font-black ${
          size === "sm" ? "w-7 h-7 text-xs" : size === "md" ? "w-9 h-9 text-sm" : "w-14 h-14 text-xl"
        } ${variant === "dark" ? "bg-[#1a3a5c] text-white" : "bg-white text-[#1a3a5c]"}`}
      >
        S
      </div>
      <span className={`font-bold tracking-tight ${sizes[size]} ${colors[variant]}`}>
        snapdesk
      </span>
    </div>
  );
}
