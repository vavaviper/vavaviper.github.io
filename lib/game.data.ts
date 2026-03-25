import { Rect, NavZone } from "./game.types";
import { WORLD_W, WORLD_H, NAV_ZONE_RADIUS_PX, EDGE_MARGIN_PX } from "./game.constants";

function rectPct(xMinPct: number, xMaxPct: number, yMinPct: number, yMaxPct: number): Rect {
  return {
    xMin: xMinPct * WORLD_W,
    xMax: xMaxPct * WORLD_W,
    yMin: yMinPct * WORLD_H,
    yMax: yMaxPct * WORLD_H,
  };
}

export const BLOCKED_RECTS: Rect[] = [
  { xMin: 0, xMax: WORLD_W, yMin: 0, yMax: EDGE_MARGIN_PX },
  { xMin: 0, xMax: WORLD_W, yMin: WORLD_H - EDGE_MARGIN_PX, yMax: WORLD_H },
  { xMin: 0, xMax: EDGE_MARGIN_PX, yMin: 0, yMax: WORLD_H },
  { xMin: WORLD_W - EDGE_MARGIN_PX, xMax: WORLD_W, yMin: 0, yMax: WORLD_H },
  rectPct(0.36, 0.65, 0.38, 0.75),
  rectPct(0.10, 0.20, 0.20, 0.28),
  rectPct(0.78, 0.86, 0.35, 0.42),
  rectPct(0.49, 0.61, 0.15, 0.25),
  rectPct(0.83, 0.96, 0.78, 0.92),
];

function makeZone(
  id: NavZone["id"],
  label: string,
  xPct: number,
  yPct: number,
  radiusPx = NAV_ZONE_RADIUS_PX,
): NavZone {
  const cx = xPct * WORLD_W;
  const cy = yPct * WORLD_H;
  return {
    id,
    label,
    xMin: cx - radiusPx,
    xMax: cx + radiusPx,
    yMin: cy - radiusPx,
    yMax: cy + radiusPx,
  };
}

export const NAV_ZONES: NavZone[] = [
  makeZone("about", "About", 0.15, 0.25),
  makeZone("portfolio", "Portfolio", 0.15, 0.75),
  makeZone("experience", "Experience", 0.75, 0.43),
  makeZone("contact", "Contact", 0.85, 0.65),
];
