"use client";

import type { CSSProperties, RefObject } from "react";
import { useEffect, useState } from "react";

type Alignment = "left" | "right";
type Placement = "auto" | "top" | "bottom";

export type UseFloatingPositionOptions = {
  align?: Alignment;
  gap?: number;
  isOpen: boolean;
  padding?: number;
  placement?: Placement;
  panelRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  useFixedPosition?: boolean;
};

export function useFloatingPosition({
  align = "right",
  gap = 6,
  isOpen,
  padding = 8,
  placement = "auto",
  panelRef,
  triggerRef,
  useFixedPosition = false,
}: UseFloatingPositionOptions) {
  const [style, setStyle] = useState<CSSProperties>({
    left: 0,
    position: useFixedPosition ? "fixed" : "absolute",
    top: 0,
    visibility: "hidden",
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

      if (useFixedPosition) {
        // Fixed positioning for portaled elements
        const spaceBelow = viewportHeight - triggerRect.bottom - gap - padding;
        const spaceAbove = triggerRect.top - gap - padding;

        let openUpward = false;
        if (placement === "top") {
          openUpward = true;
        } else if (placement === "bottom") {
          openUpward = false;
        } else {
          openUpward = spaceBelow < 240 && spaceAbove > spaceBelow;
        }

        let top: number;

        if (openUpward) {
          top = triggerRect.top - panelHeight - gap;
          if (top < padding) {
            top = padding;
          }
        } else {
          top = triggerRect.bottom + gap;
        }

        let left: number;
        if (align === "left") {
          left = triggerRect.left;
        } else {
          left = triggerRect.right - panelWidth;
        }

        if (left + panelWidth > viewportWidth - padding) {
          left = Math.max(padding, viewportWidth - panelWidth - padding);
        }
        if (left < padding) {
          left = padding;
        }

        setStyle({
          left: `${Math.round(left)}px`,
          position: "fixed",
          top: `${Math.round(top)}px`,
          visibility: "visible",
        });
      } else {
        // Absolute positioning for non-portaled elements
        const spaceBelow = viewportHeight - triggerRect.bottom - gap - padding;
        const spaceAbove = triggerRect.top - gap - padding;

        let openUpward = false;
        if (placement === "top") {
          openUpward = true;
        } else if (placement === "bottom") {
          openUpward = false;
        } else {
          openUpward = spaceBelow < 240 && spaceAbove > spaceBelow;
        }

        let top: number;

        if (openUpward) {
          top = -panelHeight - gap;
        } else {
          top = triggerRect.height + gap;
        }

        let left: number;
        if (align === "left") {
          left = 0;
        } else {
          left = triggerRect.width - panelWidth;
        }

        setStyle({
          left: `${Math.round(left)}px`,
          position: "absolute",
          top: `${Math.round(top)}px`,
          visibility: "visible",
        });
      }
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
  }, [align, gap, isOpen, padding, placement, panelRef, triggerRef, useFixedPosition]);

  return { style };
}
