import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps extends ComponentPropsWithoutRef<"span"> {
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
}

const variantClasses: Record<"text" | "rectangular" | "circular", string> = {
  text: "h-4 w-full rounded",
  rectangular: "rounded",
  circular: "rounded-full",
};

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  ...rest
}: SkeletonProps) {
  return (
    <span
      className={cn(
        "block animate-pulse bg-gray-200",
        variantClasses[variant],
        className
      )}
      style={{
        width: width ?? undefined,
        height: height ?? undefined,
      }}
      aria-hidden="true"
      {...rest}
    />
  );
}
