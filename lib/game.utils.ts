import { BLOCKED_RECTS, NAV_ZONES } from "./game.data";
import { Rect, PlayerPosition, SectionId } from "./game.types";
import { PLAYER_RENDER_W, PLAYER_RENDER_H, WORLD_W, WORLD_H } from "./game.constants";

export function rectsOverlap(a: Rect, b: Rect) {
  return a.xMin < b.xMax && a.xMax > b.xMin && a.yMin < b.yMax && a.yMax > b.yMin;
}

export function rectPct(xMinPct: number, xMaxPct: number, yMinPct: number, yMaxPct: number): Rect {
  return {
    xMin: xMinPct * WORLD_W,
    xMax: xMaxPct * WORLD_W,
    yMin: yMinPct * WORLD_H,
    yMax: yMaxPct * WORLD_H,
  };
}

export function getZoneForPosition(pos: PlayerPosition): SectionId {
  const px = pos.x;
  const py = pos.y;
  const zone = NAV_ZONES.find(
    (z) => px >= z.xMin && px <= z.xMax && py >= z.yMin && py <= z.yMax,
  );
  return zone?.id ?? "home";
}

export function getPlayerFootRect(center: PlayerPosition): Rect {
  const footW = Math.max(10, PLAYER_RENDER_W * 0.35);
  const footH = Math.max(10, PLAYER_RENDER_H * 0.25);
  return {
    xMin: center.x - footW / 2,
    xMax: center.x + footW / 2,
    yMin: center.y + PLAYER_RENDER_H * 0.15,
    yMax: center.y + PLAYER_RENDER_H * 0.15 + footH,
  };
}

export function isBlocked(nextCenter: PlayerPosition) {
  const foot = getPlayerFootRect(nextCenter);
  return BLOCKED_RECTS.some((r) => rectsOverlap(foot, r));
}
