export type SectionId = "home" | "about" | "experience" | "portfolio" | "contact";

export type PlayerDirection = "up" | "down" | "left" | "right";

export type PlayerPosition = {
  x: number;
  y: number;
};

export type Rect = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type NavZone = {
  id: Exclude<SectionId, "home">;
  label: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type PlayerSpriteProps = {
  direction: PlayerDirection;
  frame: number;
  isWalking: boolean;
};
