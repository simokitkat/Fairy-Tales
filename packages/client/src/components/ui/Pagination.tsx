import { type ComponentPropsWithoutRef, useMemo } from "react";
import { cn } from "../../lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
  className?: string;
}

type ButtonProps = ComponentPropsWithoutRef<"button">;

function PageButton({ className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border bg-white px-3 text-sm font-medium transition-colors hover:bg-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle focus-visible:ring-offset-2",
        className
      )}
      {...rest}
    />
  );
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  ariaLabel,
  className,
}: PaginationProps) {
  const pages = useMemo(() => {
    const result: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        result.push(i);
      }
      return result;
    }

    result.push(1);

    if (currentPage > 3) {
      result.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        result.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      result.push("ellipsis");
    }

    if (totalPages > 1) {
      result.push(totalPages);
    }

    return result;
  }, [currentPage, totalPages]);

  return (
    <nav
      aria-label={ariaLabel ?? "Pagination"}
      className={cn("flex items-center gap-1", className)}
    >
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </PageButton>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex h-9 min-w-9 items-center justify-center px-3 text-sm text-gray-500"
          >
            ...
          </span>
        ) : (
          <PageButton
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={`Page ${page}`}
            className={
              page === currentPage
                ? "bg-atlas text-white hover:bg-atlas border-atlas"
                : undefined
            }
          >
            {page}
          </PageButton>
        )
      )}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </PageButton>
    </nav>
  );
}
