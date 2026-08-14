"use client";

import { cn } from "@/lib/cn";

type PaginationProps = {
  className?: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSize: number;
  pageSizeOptions?: number[];
  totalItems: number;
  totalPages: number;
};

export function Pagination({
  className,
  currentPage,
  onPageChange,
  onPageSizeChange,
  pageSize,
  pageSizeOptions = [5, 10, 20, 50],
  totalItems,
  totalPages,
}: PaginationProps) {
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  const canPrevious = safeCurrentPage > 1;
  const canNext = safeCurrentPage < totalPages;

  function getPageNumbers(): (number | "ellipsis")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 3) {
      return [1, 2, 3, 4, "ellipsis", totalPages];
    }

    if (safeCurrentPage >= totalPages - 2) {
      return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      "ellipsis",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "ellipsis",
      totalPages,
    ];
  }

  return (
    <nav
      aria-label="Pagination Navigation"
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between shadow-xs",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-3 text-caption text-muted-foreground">
        <span>
          Showing{" "}
          <span className="font-semibold text-foreground">{startItem}</span>
          {" "}-{" "}
          <span className="font-semibold text-foreground">{endItem}</span>
          {" "}of{" "}
          <span className="font-semibold text-foreground">{totalItems}</span>
          {" "}task{totalItems === 1 ? "" : "s"}
        </span>

        {onPageSizeChange ? (
          <div className="flex items-center gap-1.5 pl-2 border-l border-border">
            <span>Per page:</span>
            <select
              aria-label="Rows per page"
              className="h-7 rounded-md border border-border bg-surface px-2 py-0.5 text-caption font-medium text-foreground transition-colors hover:bg-surface-muted focus:border-primary focus:outline-none"
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              value={pageSize}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <button
          aria-disabled={!canPrevious}
          aria-label="Go to previous page"
          className={cn(
            "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-caption font-medium text-foreground transition-colors",
            canPrevious
              ? "hover:bg-surface-muted hover:text-foreground cursor-pointer"
              : "opacity-40 cursor-not-allowed text-muted-foreground",
          )}
          disabled={!canPrevious}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          type="button"
        >
          <svg aria-hidden="true" className="size-3.5" fill="none" viewBox="0 0 24 24">
            <path
              d="M15 19l-7-7 7-7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageItem, index) => {
            if (pageItem === "ellipsis") {
              return (
                <span
                  className="px-1.5 text-caption text-muted-foreground select-none"
                  key={`ellipsis-${index}`}
                >
                  ...
                </span>
              );
            }

            const isCurrent = pageItem === safeCurrentPage;
            return (
              <button
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Page ${pageItem}`}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-lg text-caption font-medium transition-colors cursor-pointer",
                  isCurrent
                    ? "border border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "border border-border bg-surface text-foreground hover:bg-surface-muted",
                )}
                key={pageItem}
                onClick={() => onPageChange(pageItem)}
                type="button"
              >
                {pageItem}
              </button>
            );
          })}
        </div>

        <button
          aria-disabled={!canNext}
          aria-label="Go to next page"
          className={cn(
            "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-caption font-medium text-foreground transition-colors",
            canNext
              ? "hover:bg-surface-muted hover:text-foreground cursor-pointer"
              : "opacity-40 cursor-not-allowed text-muted-foreground",
          )}
          disabled={!canNext}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          type="button"
        >
          <span className="hidden sm:inline">Next</span>
          <svg aria-hidden="true" className="size-3.5" fill="none" viewBox="0 0 24 24">
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
