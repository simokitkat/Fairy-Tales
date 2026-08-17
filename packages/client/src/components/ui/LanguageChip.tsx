import { type ComponentPropsWithoutRef, useMemo } from "react";
import { cn } from "../../lib/utils";

interface LanguageChipProps extends ComponentPropsWithoutRef<"button"> {
  language: string;
  isActive?: boolean;
  onClick?: () => void;
  label?: string;
  size?: "sm" | "md";
}

const sizeClasses: Record<"sm" | "md", string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export function LanguageChip({
  language,
  isActive = false,
  onClick,
  label,
  size = "md",
  className,
  ...rest
}: LanguageChipProps) {
  const displayName = useMemo(() => {
    try {
      return new Intl.DisplayNames(["en"], { type: "language" }).of(
        language
      );
    } catch {
      return language;
    }
  }, [language]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={label ?? displayName ?? language}
      className={cn(
        "inline-flex items-center rounded-md font-medium transition-colors",
        sizeClasses[size],
        isActive
          ? "bg-periwinkle text-white"
          : "bg-cloud border border-border text-ink hover:border-periwinkle",
        onClick && "cursor-pointer",
        !onClick && "cursor-default",
        className
      )}
      {...rest}
    >
      {displayName ?? language}
    </button>
  );
}
