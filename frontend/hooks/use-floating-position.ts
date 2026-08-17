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
    zIndex: 9999,
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
        // Auto: prefer opening downward, but switch to upward if insufficient space
        const minRequiredSpace = Math.min(panelHeight, 220);
        openUpward = spaceBelow < minRequiredSpace && spaceAbove > spaceBelow;
      }

      let top: number;
      let maxHeight: number;

      if (openUpward) {
        // Opening upward: position above trigger
        top = triggerRect.top - panelHeight - gap;
        maxHeight = spaceAbove;
        
        // Ensure top doesn't go above viewport
        if (top < padding) {
          top = padding;
          maxHeight = triggerRect.top - gap - padding;
        }
      } else {
        // Opening downward: position below trigger
        top = triggerRect.bottom + gap;
        maxHeight = spaceBelow;
        
        // Ensure dropdown doesn't go below viewport
        if (top + panelHeight > viewportHeight - padding) {
          maxHeight = viewportHeight - triggerRect.bottom - gap - padding;
        }
      }

      // Ensure we always have at least minHeight
      maxHeight = Math.max(minHeight, maxHeight);

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
        zIndex: 9999,
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
