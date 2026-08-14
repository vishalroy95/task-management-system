"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { useFloatingPosition } from "@/hooks/use-floating-position";
import { cn } from "@/lib/cn";
import { formatDisplayDate, isSameCalendarDate } from "@/lib/date";

const emptySubscribe = () => () => {};

type DateRange = {
  end?: Date;
  start?: Date;
};

type DatePickerProps =
  | {
      mode?: "single";
      onChange: (date: Date) => void;
      value?: Date;
    }
  | {
      mode: "range";
      onChange: (range: DateRange) => void;
      value: DateRange;
    };

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getMonthDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  return [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, monthIndex, index + 1)),
  ];
}

function getRangeLabel(range: DateRange) {
  if (range.start && range.end) {
    return `${formatDisplayDate(range.start)} - ${formatDisplayDate(range.end)}`;
  }

  if (range.start) {
    return `${formatDisplayDate(range.start)} - End date`;
  }

  return "Select dates";
}

export function DatePicker(props: DatePickerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const initialMonth =
    props.mode === "range"
      ? props.value.start ?? props.value.end ?? new Date()
      : props.value ?? new Date();
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1),
  );
  const [isOpen, setIsOpen] = useState(false);

  const days = useMemo(() => getMonthDays(visibleMonth), [visibleMonth]);
  const monthLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  const { style: floatingStyle } = useFloatingPosition({
    align: "right",
    gap: 6,
    isOpen,
    panelRef,
    triggerRef,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(date: Date) {
    if (props.mode === "range") {
      const { end, start } = props.value;

      if (!start || end || date < start) {
        props.onChange({ start: date });
        return;
      }

      props.onChange({ start, end: date });
      setIsOpen(false);
      return;
    }

    props.onChange(date);
    setIsOpen(false);
  }

  function isSelected(date: Date) {
    if (props.mode === "range") {
      return Boolean(
        (props.value.start && isSameCalendarDate(date, props.value.start)) ||
          (props.value.end && isSameCalendarDate(date, props.value.end)),
      );
    }

    return Boolean(props.value && isSameCalendarDate(date, props.value));
  }

  function isInRange(date: Date) {
    if (props.mode !== "range" || !props.value.start || !props.value.end) {
      return false;
    }

    return date > props.value.start && date < props.value.end;
  }

  return (
    <div className="relative inline-flex max-w-full">
      <button
        aria-expanded={isOpen}
        className="inline-flex h-8 min-w-36 items-center justify-start rounded-md border border-border bg-surface px-3 text-caption font-medium text-foreground shadow-xs transition-colors hover:bg-surface-muted"
        onClick={() => setIsOpen((current) => !current)}
        ref={triggerRef}
        type="button"
      >
        {props.mode === "range"
          ? getRangeLabel(props.value)
          : props.value
            ? formatDisplayDate(props.value)
            : "Select date"}
      </button>

      {isOpen && mounted
        ? createPortal(
            <div
              className="w-72 overflow-y-auto rounded-lg border border-border bg-surface p-3 shadow-soft"
              ref={panelRef}
              style={floatingStyle}
            >
              <div className="flex items-center justify-between gap-2">
                <Button
                  aria-label="Previous month"
                  onClick={() =>
                    setVisibleMonth(
                      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
                    )
                  }
                  size="sm"
                  variant="ghost"
                >
                  Prev
                </Button>
                <p className="text-body font-semibold text-foreground">{monthLabel}</p>
                <Button
                  aria-label="Next month"
                  onClick={() =>
                    setVisibleMonth(
                      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
                    )
                  }
                  size="sm"
                  variant="ghost"
                >
                  Next
                </Button>
              </div>

              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-caption text-muted-foreground">
                {weekdays.map((weekday) => (
                  <span key={weekday}>{weekday}</span>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {days.map((date, index) =>
                  date ? (
                    <button
                      className={cn(
                        "size-8 rounded-md text-caption text-foreground transition-colors hover:bg-surface-muted",
                        isInRange(date) && "bg-surface-muted",
                        isSelected(date) && "bg-primary text-primary-foreground hover:bg-primary",
                      )}
                      key={date.toISOString()}
                      onClick={() => handleSelect(date)}
                      type="button"
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <span aria-hidden="true" key={`empty-${index}`} />
                  ),
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
