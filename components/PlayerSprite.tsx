"use client";

import {
  PLAYER_SPRITE_SHEET_SRC,
  PLAYER_SPRITE_FRAME_W,
  PLAYER_SPRITE_FRAME_H,
  PLAYER_RENDER_W,
  PLAYER_RENDER_H,
  PLAYER_SPRITE_ROW_BY_DIR,
} from "@/lib/game.constants";
import { PlayerSpriteProps } from "@/lib/game.types";

export function PlayerSprite({ direction, frame, isWalking }: PlayerSpriteProps) {
  const row = PLAYER_SPRITE_ROW_BY_DIR[direction];
  const col = isWalking ? frame : 0;
  const x = -(col * PLAYER_SPRITE_FRAME_W);
  const y = -(row * PLAYER_SPRITE_FRAME_H);
  const scaleX = PLAYER_RENDER_W / PLAYER_SPRITE_FRAME_W;
  const scaleY = PLAYER_RENDER_H / PLAYER_SPRITE_FRAME_H;

  return (
    <div
      style={{
        width: PLAYER_RENDER_W,
        height: PLAYER_RENDER_H,
        overflow: "hidden",
        imageRendering: "pixelated",
        borderRadius: 9999,
        boxShadow:
          "0 0 0 3px #f5f2ff, 0 0 14px rgba(183,181,228,0.95), 0 0 28px rgba(155,115,214,0.75)",
      }}
      aria-label="Player"
    >
      <div
        style={{
          width: PLAYER_SPRITE_FRAME_W,
          height: PLAYER_SPRITE_FRAME_H,
          backgroundImage: `url(${PLAYER_SPRITE_SHEET_SRC})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${x}px ${y}px`,
          backgroundSize: `${4 * PLAYER_SPRITE_FRAME_W}px ${4 * PLAYER_SPRITE_FRAME_H}px`,
          imageRendering: "pixelated",
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
        }}
      />
    </div>
  );
}
