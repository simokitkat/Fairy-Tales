import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps extends ComponentPropsWithoutRef<"article"> {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({
  children,
  className,
  hoverable,
  ...rest
}: CardProps) {
  return (
    <article
      className={cn(
        "rounded-lg border border-border bg-white shadow-sm",
        hoverable && "hover:shadow-md transition-shadow",
        className
      )}
      {...rest}
    >
      {children}
    </article>
  );
}

export function CardHeader({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("border-b border-border px-4 py-3", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("px-4 py-3", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("border-t border-border px-4 py-3", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
