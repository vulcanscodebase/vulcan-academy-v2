"use client";

interface ShimmerProps {
  type?: "text" | "image" | "button";
  width?: string;
  height?: string;
  borderRadius?: string;
}

export function Shimmer({
  type = "text",
  width,
  height,
  borderRadius,
}: ShimmerProps) {
  const defaultHeight =
    type === "text" ? "16px" : type === "image" ? "120px" : "40px";

  return (
    <div
      className="animate-pulse bg-gray-300 dark:bg-gray-700"
      style={{
        width: width || "100%",
        height: height || defaultHeight,
        borderRadius: borderRadius || "8px",
      }}
    />
  );
}
