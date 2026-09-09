"use client";

import { useEffect, useRef } from "react";
import type { DrawingStroke } from "@/types";

interface DrawingCanvasProps {
  active: boolean;
  color: string;
  thickness: number;
  onStrokeComplete: (stroke: DrawingStroke) => void;
}

// Base resolution — strokes are stored in base coords (matches
// renderStrip.drawStroke, which draws directly at these coords).
const BASE_W = 300;
const BASE_H = 1200;

/**
 * <DrawingCanvas /> — freehand drawing overlay (docs/05 §DrawingCanvas).
 *
 * The overlay canvas is sized at base resolution (300×1200) and stretched via
 * CSS to fill the preview box (same 1:4 aspect, so no distortion). Pointer
 * coords are mapped back to base space via getBoundingClientRect so committed
 * strokes line up exactly with how renderStroke renders them in the composite.
 *
 * Only the IN-PROGRESS stroke is drawn here; committed strokes live in the store
 * and are rendered by <StripCanvasPreview /> via renderStrip (debounced). This
 * keeps the overlay cheap and avoids double-drawing.
 */
export function DrawingCanvas({
  active,
  color,
  thickness,
  onStrokeComplete,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    // Reset buffer to base size on mount (CSS stretches it to display).
    c.width = BASE_W;
    c.height = BASE_H;
  }, []);

  const ctx = () => canvasRef.current?.getContext("2d") ?? null;

  const toBase = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * BASE_W,
      y: ((e.clientY - rect.top) / rect.height) * BASE_H,
    };
  };

  const redraw = () => {
    const c = canvasRef.current;
    const g = ctx();
    if (!c || !g) return;
    g.clearRect(0, 0, BASE_W, BASE_H);
    const pts = pointsRef.current;
    if (pts.length < 2) return;
    g.save();
    g.strokeStyle = color;
    g.lineWidth = thickness;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
    g.stroke();
    g.restore();
  };

  const down = (e: React.PointerEvent) => {
    if (!active) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drawingRef.current = true;
    pointsRef.current = [toBase(e)];
    redraw();
  };

  const move = (e: React.PointerEvent) => {
    if (!active || !drawingRef.current) return;
    pointsRef.current.push(toBase(e));
    redraw();
  };

  const up = () => {
    if (!active || !drawingRef.current) return;
    drawingRef.current = false;
    const pts = pointsRef.current;
    if (pts.length >= 2) {
      onStrokeComplete({
        id: `stroke-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        points: pts,
        color,
        thickness,
      });
    }
    pointsRef.current = [];
    const g = ctx();
    if (g) g.clearRect(0, 0, BASE_W, BASE_H);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: active ? "auto" : "none", touchAction: "none" }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    />
  );
}
