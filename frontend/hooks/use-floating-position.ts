"use client";

import type { CSSProperties, RefObject } from "react";
import { useEffect, useState } from "react";

type Alignment = "left" | "right";
type Placement = "auto" | "top" | "bottom";

export type UseFloatingPositionOptions = {
  align?: Alignment;
  gap?: number;
  isOpen: boolean;
  minHeight?: number;
  padding?: number;
  placement?: Placement;
  panelRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
};

export function useFloatingPosition({
  align = "right",
  gap = 6,
  isOpen,
  minHeight = 120,
  padding = 8,
  placement = "auto",
  panelRef,
  triggerRef,
}: UseFloatingPositionOptions) {
  const [style, setStyle] = useState<CSSProperties>({
    left: 0,
    position: "fixed",
    top: 0,
    visibility: "hidden",
    zIndex: 50,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function updatePosition() {
      if (!triggerRef.current) {
        return;
      }

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const panel = panelRef.current;
      const panelWidth = panel ? panel.offsetWidth : 288;
      const panelHeight = panel ? panel.offsetHeight : 240;

      const spaceBelow = viewportHeight - triggerRect.bottom - gap - padding;
      const spaceAbove = triggerRect.top - gap - padding;

      let openUpward = false;
      if (placement === "top") {
        openUpward = true;
      } else if (placement === "bottom") {
        openUpward = false;
      } else {
        // Auto: if space below is less than required panel height (or threshold 220px) AND space above is greater
        openUpward = spaceBelow < Math.min(panelHeight, 220) && spaceAbove > spaceBelow;
      }

      let top: number;
      let maxHeight: number;

      if (openUpward) {
        top = triggerRect.top - panelHeight - gap;
        maxHeight = Math.max(minHeight, spaceAbove);
        if (top < padding) {
          top = padding;
        }
      } else {
        top = triggerRect.bottom + gap;
        maxHeight = Math.max(minHeight, spaceBelow);
      }

      let left: number;
      if (align === "left") {
        left = triggerRect.left;
      } else {
        left = triggerRect.right - panelWidth;
      }

      // Clamp horizontally to remain within the viewport
      if (left + panelWidth > viewportWidth - padding) {
        left = Math.max(padding, viewportWidth - panelWidth - padding);
      }
      if (left < padding) {
        left = padding;
      }

      setStyle({
        left: `${Math.round(left)}px`,
        maxHeight: `${Math.round(maxHeight)}px`,
        position: "fixed",
        top: `${Math.round(top)}px`,
        visibility: "visible",
        zIndex: 50,
      });
    }

    updatePosition();
    const animationFrameId = requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    const currentPanel = panelRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && currentPanel) {
      resizeObserver = new ResizeObserver(() => {
        updatePosition();
      });
      resizeObserver.observe(currentPanel);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      resizeObserver?.disconnect();
    };
  }, [align, gap, isOpen, minHeight, padding, placement, panelRef, triggerRef]);

  return { style };
}
