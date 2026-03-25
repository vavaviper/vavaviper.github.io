"use client";

import { useEffect, useState, useCallback } from "react";
import {
  SectionId,
  PlayerDirection,
  PlayerPosition,
} from "@/lib/game.types";
import {
  TILE_SIZE,
  WORLD_W,
  WORLD_H,
  PLAYER_SPRITE_FRAMES_PER_ROW,
  PLAYER_SPRITE_FPS,
} from "@/lib/game.constants";
import { getZoneForPosition, isBlocked } from "@/lib/game.utils";

export function useGameLogic() {
  const [playerPos, setPlayerPos] = useState<PlayerPosition>({
    x: 0.15 * WORLD_W,
    y: 0.75 * WORLD_H,
  });
  const [direction, setDirection] = useState<PlayerDirection>("down");
  const [isWalking, setIsWalking] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const [animFrame, setAnimFrame] = useState(0);

  // Animation effect
  useEffect(() => {
    if (!isWalking || openSection) return;
    const msPerFrame = 1000 / PLAYER_SPRITE_FPS;
    const id = window.setInterval(() => {
      setAnimFrame((f) => (f + 1) % PLAYER_SPRITE_FRAMES_PER_ROW);
    }, msPerFrame);
    return () => window.clearInterval(id);
  }, [isWalking, openSection]);

  // Reset animation frame when stopped walking
  useEffect(() => {
    if (!isWalking) setAnimFrame(0);
  }, [isWalking]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        event.preventDefault();
      }

      if (key === "escape") {
        setOpenSection(null);
        return;
      }

      if ((key === "enter" || key === "e")) {
        if (activeSection !== "home") setOpenSection(activeSection);
        return;
      }

      if (openSection) return;

      let next: PlayerPosition | null = null;
      let nextDirection: PlayerDirection = direction;

      if (key === "w" || key === "arrowup") {
        nextDirection = "up";
        next = { x: playerPos.x, y: Math.max(1 * TILE_SIZE, playerPos.y - TILE_SIZE) };
      } else if (key === "s" || key === "arrowdown") {
        nextDirection = "down";
        next = {
          x: playerPos.x,
          y: Math.min(WORLD_H - 2 * TILE_SIZE, playerPos.y + TILE_SIZE),
        };
      } else if (key === "a" || key === "arrowleft") {
        nextDirection = "left";
        next = { x: Math.max(1 * TILE_SIZE, playerPos.x - TILE_SIZE), y: playerPos.y };
      } else if (key === "d" || key === "arrowright") {
        nextDirection = "right";
        next = {
          x: Math.min(WORLD_W - 2 * TILE_SIZE, playerPos.x + TILE_SIZE),
          y: playerPos.y,
        };
      }

      if (!next) return;
      if (isBlocked(next)) return;

      setDirection(nextDirection);
      setIsWalking(true);
      setPlayerPos(next);
      setActiveSection(getZoneForPosition(next));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (
        ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(
          event.key.toLowerCase(),
        )
      ) {
        setIsWalking(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playerPos, direction, activeSection, openSection]);

  return {
    playerPos,
    direction,
    isWalking,
    activeSection,
    openSection,
    animFrame,
    setOpenSection,
  };
}
