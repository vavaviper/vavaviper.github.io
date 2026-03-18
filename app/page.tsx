"use client";

import { useEffect, useMemo, useState } from "react";

type SectionId = "home" | "about" | "experience" | "portfolio" | "contact";

type PlayerDirection = "up" | "down" | "left" | "right";

type PlayerPosition = {
  x: number;
  y: number;
};

const TILE_SIZE = 32;
// World size (in pixels) is GRID_* * TILE_SIZE. Chosen to match `map.png` aspect closely.
const GRID_COLS = 44; // 44 * 32 = 1408px (close to map.png width 1401px)
const GRID_ROWS = 24; // 24 * 32 = 768px (close to map.png height 752px)

// Put your map image in `public/map.png` (or change this path).
const MAP_IMAGE_SRC = "/map.png";

// Put your sprite sheet in `public/player.png` (or change this path).
// Assumes a sheet laid out as: rows = directions, cols = animation frames.
// Default row order: down, left, right, up (common in many RPG sheets).
const PLAYER_SPRITE_SHEET_SRC = "/player.png";
// Your current `public/player.png` is 1024x1024 with a 4x4 grid, so each frame is 256x256.
// If you later export a tightly packed 128x128 (4*32) sheet, change these back to 32.
const PLAYER_SPRITE_FRAME_W = 256;
const PLAYER_SPRITE_FRAME_H = 256;
const PLAYER_SPRITE_FRAMES_PER_ROW = 4;
const PLAYER_SPRITE_ROW_BY_DIR: Record<PlayerDirection, number> = {
  down: 0,
  left: 2,
  right: 1,
  up: 3,
};
const PLAYER_SPRITE_FPS = 8;

// How big the character should appear in-game (render size).
const PLAYER_RENDER_W = 84;
const PLAYER_RENDER_H = 84;

// Bigger interaction zones = easier to trigger.
const NAV_ZONE_RADIUS_PX = 72;

const WORLD_W = GRID_COLS * TILE_SIZE;
const WORLD_H = GRID_ROWS * TILE_SIZE;

type Rect = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

function rectsOverlap(a: Rect, b: Rect) {
  return a.xMin < b.xMax && a.xMax > b.xMin && a.yMin < b.yMax && a.yMax > b.yMin;
}

function rectPct(xMinPct: number, xMaxPct: number, yMinPct: number, yMaxPct: number): Rect {
  return {
    xMin: xMinPct * WORLD_W,
    xMax: xMaxPct * WORLD_W,
    yMin: yMinPct * WORLD_H,
    yMax: yMaxPct * WORLD_H,
  };
}

// Collision: blocked regions (water + margins). Tune these numbers until it feels perfect.
// Collision: blocked regions (water + structures + margins).
const EDGE_MARGIN_PX = 12; // Reduced from 28 to give more room

const BLOCKED_RECTS: Rect[] = [
  // --- Thinner Outer Margins ---
  { xMin: 0, xMax: WORLD_W, yMin: 0, yMax: EDGE_MARGIN_PX },
  { xMin: 0, xMax: WORLD_W, yMin: WORLD_H - EDGE_MARGIN_PX, yMax: WORLD_H },
  { xMin: 0, xMax: EDGE_MARGIN_PX, yMin: 0, yMax: WORLD_H }, // Thinner Left Wall
  { xMin: WORLD_W - EDGE_MARGIN_PX, xMax: WORLD_W, yMin: 0, yMax: WORLD_H },

  // --- Center Pond (Tightened) ---
  rectPct(0.36, 0.65, 0.38, 0.75),


  // --- Structures (Base-only collisions) ---
  // Only block the "feet" area of the buildings so you can walk "behind" them slightly.
  rectPct(0.10, 0.20, 0.20, 0.28), // Gazebo base
  rectPct(0.78, 0.86, 0.35, 0.42), // Lighthouse base
  
  // --- Small Ponds & Boat ---
  rectPct(0.49, 0.61, 0.15, 0.25), // Top pond
  rectPct(0.83, 0.96, 0.78, 0.92), // Bottom-right water
];

type NavZone = {
  id: Exclude<SectionId, "home">;
  label: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

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

// Coordinate-based interactive zones (map is stretched to WORLD_W x WORLD_H).
// Percentages are based on the map’s visual layout.
const NAV_ZONES: NavZone[] = [
  makeZone("about", "About", 0.15, 0.25),
  makeZone("portfolio", "Portfolio", 0.15, 0.75),
  makeZone("experience", "Experience", 0.75, 0.43),
  makeZone("contact", "Contact", 0.85, 0.65),
];

const experiences = [
  {
    role: "ML Engineer Co-op",
    company: "Royal Bank of Canada (RBC)",
    location: "Mississauga, ON",
    period: "Sept 2025 – Dec 2025",
    bullets: [
      "Designed, implemented, and deployed a production-grade API serving a smoker-risk ML model for automated underwriting and risk assessment, projected to save $5M annually.",
      "Implemented LLM-as-a-Judge frameworks with W&B and ELK Stack to monitor model drift and hallucination rates in real-time production environments.",
      "Optimized CI/CD pipelines using GitHub Actions, Docker, and Kubernetes for ML service deployments across multi-cloud OpenShift environments.",
    ],
  },
  {
    role: "ML Engineer Co-op",
    company: "Royal Bank of Canada (RBC)",
    location: "Mississauga, ON",
    period: "Jan 2025 – Apr 2025",
    bullets: [
      "Engineered an Agentic AI platform using LangGraph and an MCP server to orchestrate natural-language-to-SQL querying over Snowflake with a React dashboard, reducing manual SQL effort by 70%.",
      "Developed an autonomous testing agent using LangGraph to dynamically generate and execute JUnit, Spock, and Cucumber test cases for production-grade LLM services.",
      "Architected a Python FastAPI/Uvicorn backend for real-time LLM inference, optimizing request throughput by 40% with monitoring for model drift and hallucination.",
      "Built batch-parallelized Apache Airflow DAGs for Next Best Action ML pipelines, enabling scalable insurance claims scoring and microservice migration.",
    ],
  },
  {
    role: "Software Development Engineer Co-op",
    company: "Pragmatica Inc.",
    location: "Remote",
    period: "May 2024 – Aug 2024",
    bullets: [
      "Developed core VR features in C# and Unity, implementing an FSM to handle complex logic for 40+ linguistic-focused therapeutic activities.",
      "Enhanced the analytics dashboard using React and Firebase, enabling real-time data synchronization and visualization for clinicians and administrators.",
      "Optimized C# scripts and environment assets, improving headset frame rates by 15%.",
    ],
  },
  {
    role: "ML Developer",
    company: "Actionable Inc.",
    location: "Remote",
    period: "Jun 2022 – Nov 2023",
    bullets: [
      "Architected a multi-stage NLP pipeline using Hugging Face Transformers and OpenAI APIs to scale sentiment analysis and text summarization across 250k+ data points, achieving an 87% success rate for executive-level insights.",
    ],
  },
  {
    role: "Research Assistant",
    company: "Behavior Analytics and Modeling Lab, University of Waterloo",
    location: "Remote",
    period: "May 2021 – Aug 2024",
    bullets: [
      "Built a case management tool using React, Node.js, and MySQL to visualize 1M+ historical data points for investigators at the Chicago PD, reducing data ingestion time by 40%.",
      "Analyzed city-scale datasets using R and Python to identify patterns and support research on urban technology and policy.",
    ],
  },
];

const projects = [
  {
    title: "Employee Management Microservice",
    stack: "Java · Spring Boot · PostgreSQL · Spring AOP",
    href: "https://github.com/vavaviper/ems",
    bullets: [
      "Built a Spring Boot + PostgreSQL CRUD service with Spring AOP for automated audit trails and JPQL aggregations for real-time org analytics.",
      "Integrated OpenAPI/Swagger and Spring Actuator to automate documentation and system health monitoring.",
    ],
  },
  {
    title: "EstateFinder",
    stack: "React · Express.js · Node.js · MongoDB · Tailwind CSS · Scikit-Learn",
    href: "https://github.com/vavaviper/real-estate",
    bullets: [
      "Full-stack marketplace with secure JWT and Google OAuth authentication, real-time CRUD, and Firebase image uploads.",
      "Scikit-Learn regression model for price estimation; advanced search filters and dynamic Tailwind UI components.",
    ],
  },
  {
    title: "Neural Network from Scratch",
    stack: "Python · NumPy · Matplotlib",
    href: "https://github.com/vavaviper/neural_network_from_scratch-main",
    bullets: [
      "Built a fully-connected neural network from scratch using only NumPy, implementing backpropagation, ReLU, Softmax, and cross-entropy loss.",
      "Achieved ~96.7% test accuracy on MNIST digit classification and visualized training loss over 20 epochs.",
    ],
  },
  {
    title: "GroceryDash Game",
    stack: "Unity · C#",
    href: "https://github.com/vavaviper/windowdash",
    bullets: [
      "Built in 48 hrs at Waterloo Game Jam - FSM-driven car/player mechanics, weight-based inventory, and timed order fulfillment loops.",
      "Engineered event-driven systems for scoring, timers, UI menus, and multi-level progression with scaling difficulty.",
    ],
  },
  {
    title: "Candid",
    stack: "Next.js 15 · Tailwind CSS · Express.js",
    href: "https://bereal-dupe.vercel.app/",
    bullets: [
      "BeReal-style event platform where organizers create access-code or geolocation-locked events and fire time-limited photo prompts.",
      "Attendees capture and submit photos that stream onto a live masonry canvas with 30s polling; full organizer dashboard for prompt management.",
    ],
  },
];

function getZoneForPosition(pos: PlayerPosition): SectionId {
  const px = pos.x;
  const py = pos.y;
  const zone = NAV_ZONES.find(
    (z) => px >= z.xMin && px <= z.xMax && py >= z.yMin && py <= z.yMax,
  );
  return zone?.id ?? "home";
}

function getPlayerFootRect(center: PlayerPosition): Rect {
  // Only collide using the player's "feet", not the whole sprite.
  const footW = Math.max(10, PLAYER_RENDER_W * 0.35);
  const footH = Math.max(10, PLAYER_RENDER_H * 0.25);
  return {
    xMin: center.x - footW / 2,
    xMax: center.x + footW / 2,
    yMin: center.y + PLAYER_RENDER_H * 0.15,
    yMax: center.y + PLAYER_RENDER_H * 0.15 + footH,
  };
}

function isBlocked(nextCenter: PlayerPosition) {
  const foot = getPlayerFootRect(nextCenter);
  return BLOCKED_RECTS.some((r) => rectsOverlap(foot, r));
}

export default function Home() {
  const [simpleMode, setSimpleMode] = useState(false);
  const [playerPos, setPlayerPos] = useState<PlayerPosition>({
    x: 0.15 * WORLD_W,
    y: 0.75 * WORLD_H,
  });
  const [direction, setDirection] = useState<PlayerDirection>("down");
  const [isWalking, setIsWalking] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [openExperience, setOpenExperience] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const activeZoneLabel = useMemo(() => {
    if (activeSection === "home") return null;
    return NAV_ZONES.find((z) => z.id === activeSection)?.label ?? null;
  }, [activeSection]);

  const worldStyle = useMemo(
    () => ({
      width: WORLD_W,
      height: WORLD_H,
    }),
    [],
  );

  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    if (!isWalking || openSection) return;
    const msPerFrame = 1000 / PLAYER_SPRITE_FPS;
    const id = window.setInterval(() => {
      setAnimFrame((f) => (f + 1) % PLAYER_SPRITE_FRAMES_PER_ROW);
    }, msPerFrame);
    return () => window.clearInterval(id);
  }, [isWalking, openSection]);

  useEffect(() => {
    if (!isWalking) setAnimFrame(0);
  }, [isWalking]);

  const worldScale = useMemo(() => {
    const baseW = GRID_COLS * TILE_SIZE;
    const baseH = GRID_ROWS * TILE_SIZE;
    if (!viewport.w || !viewport.h) return 1;

    // Leave a little room for the HUD while keeping the game dominant.
    const availableW = Math.max(1, viewport.w);
    const availableH = Math.max(1, viewport.h - 96);
    const scale = Math.min(availableW / baseW, availableH / baseH);
    return Math.max(0.5, Math.min(scale, 3));
  }, [viewport]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (simpleMode) {
      document.body.style.overflow = "";
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [simpleMode]);

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

      if ((key === "enter" || key === "e") && !simpleMode) {
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
  }, [playerPos, direction, activeSection, openSection, simpleMode]);

  return (
    <div className="bg-[#1a0f35] text-[#e8edf8]" style={{ fontFamily: "'Pixelify Sans', monospace" }}>
      {!simpleMode && (
        <div className="fixed inset-0 overflow-hidden">

          {/* ── Welcome guide ── */}
          {showGuide && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#1a0f35]/80 p-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-none border-4 border-[#B7B5E4] bg-[#f5f2ff] shadow-[6px_6px_0_#B7B5E4]">
                {/* title bar */}
                <div className="flex items-center justify-between bg-[#3b2d72] px-4 py-2">
                  <span className="text-sm font-bold tracking-wide text-[#B7B5E4]">
                    ✦ HOW TO EXPLORE ✦
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowGuide(false)}
                    className="rounded border-2 border-[#B7B5E4] bg-[#d4784a] px-2 py-0.5 text-xs font-bold text-[#f5f2ff] transition hover:bg-[#c46234]"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 px-4 py-4 text-sm text-[#1a0f35]">
                  <p>
                    Move your tiny Varsha around the duck park and walk up to{" "}
                    <span className="font-bold text-[#3b2d72]">glowing spots</span> to
                    explore sections of the site!
                  </p>
                  <ul className="space-y-1.5 border-l-4 border-[#B7B5E4] pl-3">
                    <li>
                      <span className="rounded bg-[#B7B5E4] px-1.5 py-0.5 text-xs font-bold text-[#1a0f35]">WASD</span>{" "}
                      or{" "}
                      <span className="rounded bg-[#B7B5E4] px-1.5 py-0.5 text-xs font-bold text-[#1a0f35]">↑↓←→</span>{" "}
                      to move
                    </li>
                    <li>
                      <span className="rounded bg-[#9b73d6] px-1.5 py-0.5 text-xs font-bold text-[#f5f2ff]">E</span>{" "}
                      to open a section window
                    </li>
                    <li>
                      <span className="rounded bg-[#8b7ec0] px-1.5 py-0.5 text-xs font-bold text-[#f5f2ff]">Esc</span>{" "}
                      to close windows
                    </li>
                  </ul>
                  <p className="text-xs text-[#4a3f6e]">
                    Prefer reading everything at once?{" "}
                    <button
  type="button"
  onClick={() => { setSimpleMode(true); setShowGuide(false); }}
  className="font-bold text-[#3b2d72] underline hover:text-[#9b73d6]"
>
  Simple mode
</button> is in the top-left corner.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowGuide(false)}
                    className="mt-1 w-full rounded border-2 border-[#1a0f35] bg-[#3b2d72] py-1.5 text-sm font-bold text-[#B7B5E4] shadow-[2px_2px_0_#B7B5E4] transition hover:bg-[#4a3a82] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    Let&apos;s go! ▶
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Map world ── */}
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
              {/* player */}
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

          {/* ── Top HUD ── */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 p-3">
            <div className="pointer-events-auto inline-flex items-stretch rounded-none border-2 border-[#B7B5E4] bg-[#1a0f35] shadow-[3px_3px_0_#B7B5E4]">
              {/* name block */}
              <div className="px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#B7B5E4]">
                  portfolio
                </p>
                <p className="text-sm font-bold text-[#e8edf8]">Varsha Prasad</p>
              </div>
              <div className="w-px bg-[#B7B5E4]/30" />
              {/* controls hint */}
              <div className="flex flex-col justify-center gap-0.5 px-3 py-2 text-[11px] text-[#e8edf8]">
                <p>
                  <span className="rounded bg-[#B7B5E4] px-1 py-0.5 text-[10px] font-bold text-[#1a0f35]">WASD</span>{" "}
                  move
                </p>
                <p>
                  <span className="rounded bg-[#9b73d6] px-1 py-0.5 text-[10px] font-bold text-[#f5f2ff]">E</span>{" "}
                  open
                  {" · "}
                  <span className="rounded bg-[#8b7ec0] px-1 py-0.5 text-[10px] font-bold text-[#f5f2ff]">Esc</span>{" "}
                  close
                </p>
              </div>
              <div className="w-px bg-[#B7B5E4]/30" />
              {/* simple mode */}
              <div className="flex items-center px-3">
                <button
                  type="button"
                  onClick={() => setSimpleMode(true)}
                  className="rounded-none border-2 border-[#B7B5E4] bg-[#3b2d72] px-3 py-1 text-xs font-bold text-[#B7B5E4] shadow-[2px_2px_0_#B7B5E4] transition hover:bg-[#4a3a82] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                >
                  Simple mode ↳
                </button>
              </div>
            </div>
          </div>

          {/* ── Bottom quick-nav ── */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 p-3">
            <div className="pointer-events-auto mx-auto flex max-w-lg flex-wrap justify-center gap-2">
              {(["about", "experience", "portfolio", "contact"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setOpenSection(id)}
                  className="rounded-none border-2 border-[#B7B5E4] bg-[#1a0f35]/90 px-3 py-1.5 text-xs font-bold capitalize text-[#B7B5E4] shadow-[2px_2px_0_#B7B5E4] backdrop-blur transition hover:bg-[#3b2d72] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                >
                  {id === "portfolio" ? "Projects" : id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ── Section modal ── */}
          {openSection && (
            <div
              className="absolute inset-0 z-30 flex items-center justify-center bg-[#1a0f35]/75 p-4 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) setOpenSection(null);
              }}
            >
              <div className="w-full max-w-2xl rounded-none border-4 border-[#1a0f35] bg-[#f5f2ff] shadow-[6px_6px_0_#B7B5E4]">
                {/* Title bar */}
                <div className="flex items-center justify-between bg-[#3b2d72] px-5 py-2.5">
                  <h3 className="text-base font-bold tracking-wide text-[#B7B5E4]">
                    {openSection === "about"
                      ? "✦ About"
                      : openSection === "experience"
                        ? "✦ Experience"
                        : openSection === "portfolio"
                          ? "✦ Projects"
                          : "✦ Contact"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setOpenSection(null)}
                    className="rounded border-2 border-[#B7B5E4] bg-[#d4784a] px-2.5 py-0.5 text-xs font-bold text-[#f5f2ff] transition hover:bg-[#c46234] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    ✕ Esc
                  </button>
                </div>

                {/* Body */}
                <div className="max-h-[80vh] overflow-y-auto px-5 py-4">

                  {openSection === "about" && <AboutContent />}

                  {openSection === "experience" && (
                    <div className="space-y-2.5">
                      {experiences.map((exp) => {
                        const key = `${exp.role}-${exp.company}`;
                        const isOpen = openExperience === key;
                        return (
                          <div key={key} className="border-2 border-[#3b2d72] bg-[#eee8ff]">
                            <button
                              type="button"
                              onClick={() => setOpenExperience((id) => id === key ? null : key)}
                              className="flex w-full items-start justify-between gap-2 px-4 py-3 text-left transition hover:bg-[#d0dff0]"
                            >
                              <div>
                                <p className="text-sm font-bold text-[#1a0f35]">{exp.role}</p>
                                <p className="text-xs text-[#4a3f6e]">
                                  {exp.company} · {exp.location}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <p className="text-xs text-[#4a3f6e]">{exp.period}</p>
                                <span className="text-xs font-bold text-[#3b2d72]">
                                  {isOpen ? "▴" : "▾"}
                                </span>
                              </div>
                            </button>
                            {isOpen && exp.bullets && (
                              <ul className="border-t-2 border-[#3b2d72] bg-white px-4 py-3 text-xs text-[#1a0f35]">
                                {exp.bullets.map((b) => (
                                  <li key={b} className="flex gap-2 py-0.5">
                                    <span className="mt-0.5 shrink-0 text-[#B7B5E4]">▸</span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                      <div className="mt-1 flex items-center justify-between border-2 border-[#9b73d6] bg-[#ddeaf8] px-4 py-2.5 text-xs text-[#1a0f35]">
                        <span>Want the full story and impact metrics?</span>
                        <a
                          href="/resume.pdf"
                          target="_blank"
                          rel="noreferrer"
                          className="ml-3 shrink-0 rounded border-2 border-[#1a0f35] bg-[#9b73d6] px-3 py-1 font-bold text-[#f5f2ff] shadow-[2px_2px_0_#1a0f35] transition hover:bg-[#7c5ac8] active:shadow-none"
                        >
                          Download resume ↗
                        </a>
                      </div>
                    </div>
                  )}

                  {openSection === "portfolio" && (
                    <div className="space-y-3">
                      {projects.map((proj) => (
                        <a
                          key={proj.title}
                          href={proj.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group block border-2 border-[#3b2d72] bg-[#eee8ff] p-4 transition hover:bg-[#ddd6f7]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-bold text-[#1a0f35] group-hover:text-[#3b2d72]">
                                {proj.title}
                              </p>
                              <p className="mt-0.5 text-[10px] font-bold text-[#9b73d6]">{proj.stack}</p>
                            </div>
                            <span className="shrink-0 text-xs font-bold text-[#3b2d72] transition-transform group-hover:translate-x-0.5">↗</span>
                          </div>
                          {proj.bullets && (
                            <ul className="mt-2 space-y-1">
                              {proj.bullets.map((b) => (
                                <li key={b} className="flex gap-2 text-xs text-[#1a0f35]">
                                  <span className="mt-0.5 shrink-0 text-[#B7B5E4]">▸</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </a>
                      ))}
                    </div>
                  )}

                  {openSection === "contact" && (
                    <div>
                      <p className="text-sm text-[#1a0f35]">
                      Let’s chat about ai, playful interfaces, or opportunities to build something cool together :)
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {[
                          { label: "Email", href: "mailto:v5prasad@uwaterloo.ca" },
                          { label: "LinkedIn", href: "https://www.linkedin.com/in/varsha-prasad/", external: true },
                          { label: "Github", href: "https://github.com/vavaviper", external: true },
                        ].map(({ label, href, external }) => (
                          <a
                            key={label}
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noreferrer" : undefined}
                            className="rounded-none border-2 border-[#1a0f35] bg-[#3b2d72] px-4 py-2 text-sm font-bold text-[#B7B5E4] shadow-[3px_3px_0_#B7B5E4] transition hover:bg-[#4a3a82] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                          >
                            {label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────── SIMPLE MODE ──────────────────── */}
      {simpleMode && (
        <div className="min-h-screen bg-[#eee8ff] text-[#1a0f35]" style={{ fontFamily: "'Pixelify Sans', monospace" }}>
          <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 pb-16 pt-6 md:px-8">

            {/* Header */}
            <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#9b73d6]">
                  ✦ portfolio
                </p>
                <h1 className="mt-1 text-4xl font-bold text-[#1a0f35] md:text-5xl">
                  Varsha Prasad
                </h1>
                <p className="mt-1 text-sm text-[#4a3f6e]">
                  SWE / ML Engineer · Management Engineering @ Waterloo
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSimpleMode(false)}
                  className="rounded-none border-2 border-[#1a0f35] bg-[#3b2d72] px-3 py-1.5 text-xs font-bold text-[#B7B5E4] shadow-[3px_3px_0_#B7B5E4] transition hover:bg-[#4a3a82] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                >
                  ◀ Back to game
                </button>
                <span className="border-2 border-[#1a0f35] bg-[#B7B5E4] px-3 py-1.5 text-xs font-bold text-[#1a0f35]">
                  Simple mode
                </span>
              </div>
            </header>

            {/* Sections */}
            <main className="space-y-6">

              {/* About */}
              <section className="border-4 border-[#1a0f35] bg-white shadow-[4px_4px_0_#B7B5E4]">
                <div className="border-b-4 border-[#1a0f35] bg-[#3b2d72] px-5 py-2.5">
                  <h2 className="text-base font-bold text-[#B7B5E4]">✦ About</h2>
                </div>
                <div className="p-5">
                  <AboutContent />
                </div>
              </section>

              {/* Experience */}
              <section className="border-4 border-[#1a0f35] bg-white shadow-[4px_4px_0_#B7B5E4]">
                <div className="border-b-4 border-[#1a0f35] bg-[#3b2d72] px-5 py-2.5">
                  <h2 className="text-base font-bold text-[#B7B5E4]">✦ Experience</h2>
                </div>
                <div className="divide-y-2 divide-[#3b2d72]/20">
                  {experiences.map((exp) => {
                    const key = `${exp.role}-${exp.company}`;
                    const isOpen = openExperience === key;
                    return (
                      <div key={key}>
                        <button
                          type="button"
                          onClick={() => setOpenExperience((id) => id === key ? null : key)}
                          className="flex w-full items-start justify-between gap-2 px-5 py-3.5 text-left transition hover:bg-[#eee8ff]"
                        >
                          <div>
                            <p className="text-sm font-bold text-[#1a0f35]">{exp.role}</p>
                            <p className="text-xs text-[#4a3f6e]">
                              {exp.company} · {exp.location}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <p className="text-xs text-[#4a3f6e]">{exp.period}</p>
                            <span className="text-xs font-bold text-[#3b2d72]">
                              {isOpen ? "▴" : "▾"}
                            </span>
                          </div>
                        </button>
                        {isOpen && exp.bullets && (
                          <ul className="border-t-2 border-[#3b2d72]/20 bg-[#eee8ff] px-5 py-3 text-xs text-[#1a0f35]">
                            {exp.bullets.map((b) => (
                              <li key={b} className="flex gap-2 py-0.5">
                                <span className="mt-0.5 shrink-0 text-[#B7B5E4]">▸</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between border-t-4 border-[#1a0f35] bg-[#ddeaf8] px-5 py-3 text-xs text-[#1a0f35]">
                  <span>Want the full story and impact metrics?</span>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="ml-3 shrink-0 border-2 border-[#1a0f35] bg-[#9b73d6] px-3 py-1.5 font-bold text-[#f5f2ff] shadow-[2px_2px_0_#1a0f35] transition hover:bg-[#7c5ac8] active:shadow-none"
                  >
                    Download resume ↗
                  </a>
                </div>
              </section>

              {/* Projects */}
              <section className="border-4 border-[#1a0f35] bg-white shadow-[4px_4px_0_#B7B5E4]">
                <div className="border-b-4 border-[#1a0f35] bg-[#3b2d72] px-5 py-2.5">
                  <h2 className="text-base font-bold text-[#B7B5E4]">✦ Projects</h2>
                </div>
                <div className="divide-y-2 divide-[#3b2d72]/20">
                  {projects.map((proj) => (
                    <a
                      key={proj.title}
                      href={proj.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group block p-5 transition hover:bg-[#eee8ff]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#1a0f35] group-hover:text-[#3b2d72]">
                            {proj.title}
                          </p>
                          <p className="mt-0.5 text-[10px] font-bold text-[#9b73d6]">{proj.stack}</p>
                        </div>
                        <span className="shrink-0 text-xs font-bold text-[#3b2d72] transition-transform group-hover:translate-x-0.5">↗</span>
                      </div>
                      {proj.bullets && (
                        <ul className="mt-2 space-y-1">
                          {proj.bullets.map((b) => (
                            <li key={b} className="flex gap-2 text-xs text-[#4a3f6e]">
                              <span className="mt-0.5 shrink-0 text-[#B7B5E4]">▸</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </a>
                  ))}
                </div>
              </section>

              {/* Contact */}
              <section className="border-4 border-[#1a0f35] bg-white shadow-[4px_4px_0_#B7B5E4]">
                <div className="border-b-4 border-[#1a0f35] bg-[#3b2d72] px-5 py-2.5">
                  <h2 className="text-base font-bold text-[#B7B5E4]">✦ Contact</h2>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-[#4a3f6e]">
                  Let’s chat about ai, playful interfaces, or opportunities to build something cool together :)
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {[
                      { label: "Email", href: "mailto:v5prasad@uwaterloo.ca" },
                      { label: "LinkedIn", href: "https://www.linkedin.com/in/varsha-prasad/", external: true },
                      { label: "Github", href: "https://github.com/vavaviper", external: true },
                    ].map(({ label, href, external }) => (
                      <a
                        key={label}
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                        className="border-2 border-[#1a0f35] bg-[#3b2d72] px-4 py-2 text-sm font-bold text-[#B7B5E4] shadow-[3px_3px_0_#B7B5E4] transition hover:bg-[#4a3a82] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </section>

            </main>

            <footer className="pt-2 text-center text-xs text-[#4a3f6e]">
              © {new Date().getFullYear()} Varsha Prasad · Built with Next.js & a tiny pixel self
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

type PlayerSpriteProps = {
  direction: PlayerDirection;
  frame: number;
  isWalking: boolean;
};

const TAGS = ["LLM Systems", "MLOps", "Full-Stack", "React/Next.js", "Python", "Agentic AI", "Kubernetes", "FastAPI"];

function AboutContent() {
  return (
    <div className="space-y-5 text-[#1a0f35]">

      {/* ── Profile row ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

        {/* Photo in pixel frame */}
        <div className="mx-auto shrink-0 sm:mx-0">
          <div
            className="border-4 border-[#1a0f35] shadow-[4px_4px_0_#B7B5E4]"
            style={{ width: 120, height: 120, overflow: "hidden" }}
          >
            <img
              src="/headshot.png"
              alt="Varsha Prasad"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 8%",
              }}
            />
          </div>
          {/* HP bar beneath photo */}
          <div className="mt-1.5">
            <div className="flex items-center justify-between text-[9px] font-bold">
              <span className="text-[#4a3f6e]">HP</span>
              <span className="text-[#B7B5E4]">∞ / ∞</span>
            </div>
            <div className="mt-0.5 h-2 w-full border border-[#1a0f35] bg-white">
              <div className="h-full bg-[#B7B5E4]" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        {/* Name / bio */}
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9b73d6]">★ PLAYER ONE ★</p>
          <h3 className="mt-0.5 text-2xl font-bold leading-tight text-[#1a0f35]">Varsha Prasad</h3>
          <p className="mt-0.5 text-xs text-[#4a3f6e]">SWE / ML Engineer · Management Engineering @ Waterloo</p>

          <p className="mt-3 text-sm leading-relaxed text-[#1a0f35]">
          I’m a Machine Learning Engineer based in Toronto, studying Management Engineering (AI) at the University of Waterloo. I build scalable systems that combine backend engineering and machine learning, with experience in ML pipelines, APIs, and projects in VR, neural networks, and full-stack apps.          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="border-2 border-[#3b2d72] bg-[#eee8ff] px-2 py-0.5 text-[10px] font-bold text-[#3b2d72]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

function PlayerSprite({ direction, frame, isWalking }: PlayerSpriteProps) {
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
          backgroundSize: `${PLAYER_SPRITE_FRAMES_PER_ROW * PLAYER_SPRITE_FRAME_W}px ${4 * PLAYER_SPRITE_FRAME_H}px`,
          imageRendering: "pixelated",
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
        }}
      />
    </div>
  );
}

