"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui";

type ConfirmDeleteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
};

export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
}: ConfirmDeleteDialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-soft"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-title font-semibold text-foreground">Delete Task</h2>
        <p className="mt-2 text-body text-muted-foreground">
          Are you sure you want to delete &ldquo;
          <span className="font-medium text-foreground">{title}</span>
          &rdquo;? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            className="bg-danger text-white hover:bg-danger/90"
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            type="button"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
