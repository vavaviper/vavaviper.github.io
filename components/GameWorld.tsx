"use client";

import { PlayerSprite } from "./PlayerSprite";
import { NAV_ZONES } from "@/lib/game.data";
import { MAP_IMAGE_SRC, WORLD_W, WORLD_H } from "@/lib/game.constants";
import { SectionId, PlayerDirection } from "@/lib/game.types";
import { useMemo } from "react";

interface GameWorldProps {
  playerPos: { x: number; y: number };
  direction: PlayerDirection;
  animFrame: number;
  isWalking: boolean;
  activeSection: SectionId;
  openSection: SectionId | null;
  worldScale: number;
}

export function GameWorld({
  playerPos,
  direction,
  animFrame,
  isWalking,
  activeSection,
  openSection,
  worldScale,
}: GameWorldProps) {
  const worldStyle = useMemo(
    () => ({
      width: WORLD_W,
      height: WORLD_H,
    }),
    [],
  );

  const activeZoneLabel = useMemo(() => {
    if (activeSection === "home") return null;
    return NAV_ZONES.find((z) => z.id === activeSection)?.label ?? null;
  }, [activeSection]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="relative overflow-hidden border-4 border-[#1a0f35] shadow-[0_0_0_2px_#B7B5E4]"
        style={{
          ...worldStyle,
          transform: `scale(${worldScale})`,
          transformOrigin: "center",
          backgroundImage: `url(${MAP_IMAGE_SRC})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      >
        {/* Player */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: playerPos.x, top: playerPos.y }}
        >
          {activeZoneLabel && !openSection && (
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce-slow whitespace-nowrap rounded-none border-2 border-[#1a0f35] bg-[#B7B5E4] px-2 py-0.5 text-[10px] font-bold text-[#1a0f35] shadow-[2px_2px_0_#1a0f35]">
              Press E › {activeZoneLabel}
            </div>
          )}
          <PlayerSprite
            direction={direction}
            frame={animFrame}
            isWalking={isWalking}
          />
        </div>
      </div>
    </div>
  );
}
