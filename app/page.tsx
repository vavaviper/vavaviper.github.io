"use client";

import { useEffect, useState, useMemo } from "react";
import { useGameLogic } from "@/hooks/useGameLogic";
import { GRID_COLS, GRID_ROWS, TILE_SIZE } from "@/lib/game.constants";
import { WelcomeGuide } from "@/components/WelcomeGuide";
import { GameWorld } from "@/components/GameWorld";
import { SectionModal } from "@/components/SectionModal";
import { SimpleMode } from "@/components/SimpleMode";

export default function Home() {
  const [simpleMode, setSimpleMode] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const isLaptopView = viewport.w >= 1024;
  const forceSimpleMode = viewport.w > 0 && !isLaptopView;
  const allowGameMode = isLaptopView;

  const {
    playerPos,
    direction,
    isWalking,
    activeSection,
    openSection,
    animFrame,
    setOpenSection,
  } = useGameLogic();

  const worldScale = useMemo(() => {
    const baseW = GRID_COLS * TILE_SIZE;
    const baseH = GRID_ROWS * TILE_SIZE;
    if (!viewport.w || !viewport.h) return 1;

    const availableW = Math.max(1, viewport.w);
    const availableH = Math.max(1, viewport.h - 96);
    const scale = Math.min(availableW / baseW, availableH / baseH);
    return Math.max(0.5, Math.min(scale, 3));
  }, [viewport]);

  // Handle window resize
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!forceSimpleMode) return;
    setSimpleMode(true);
    setShowGuide(false);
  }, [forceSimpleMode]);

  // Handle document overflow
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

  return (
    <div className="bg-[#1a0f35] text-[#e8edf8]" style={{ fontFamily: "'Pixelify Sans', monospace" }}>
      {!simpleMode && allowGameMode && (
        <div className="fixed inset-0 overflow-hidden">
          {/* Welcome guide */}
          {showGuide && (
            <WelcomeGuide
              onClose={() => setShowGuide(false)}
              onEnterSimpleMode={() => {
                setSimpleMode(true);
                setShowGuide(false);
              }}
              showGameModeOption={allowGameMode}
            />
          )}

          {/* Game world */}
          <GameWorld
            playerPos={playerPos}
            direction={direction}
            animFrame={animFrame}
            isWalking={isWalking}
            activeSection={activeSection}
            openSection={openSection}
            worldScale={worldScale}
          />

          {/* Top HUD */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 p-3">
            <div className="pointer-events-auto inline-flex items-stretch rounded-none border-2 border-[#B7B5E4] bg-[#1a0f35] shadow-[3px_3px_0_#B7B5E4]">
              <div className="px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#B7B5E4]">
                  portfolio
                </p>
                <p className="text-sm font-bold text-[#e8edf8]">Varsha Prasad</p>
              </div>
              <div className="w-px bg-[#B7B5E4]/30" />
              <div className="flex flex-col justify-center gap-0.5 px-3 py-2 text-[11px] text-[#e8edf8]">
                <p>
                  <span className="rounded bg-[#B7B5E4] px-1 py-0.5 text-[10px] font-bold text-[#1a0f35]">
                    WASD
                  </span>{" "}
                  move
                </p>
                <p>
                  <span className="rounded bg-[#9b73d6] px-1 py-0.5 text-[10px] font-bold text-[#f5f2ff]">
                    E
                  </span>{" "}
                  open {" · "}
                  <span className="rounded bg-[#8b7ec0] px-1 py-0.5 text-[10px] font-bold text-[#f5f2ff]">
                    Esc
                  </span>{" "}
                  close
                </p>
              </div>
              <div className="w-px bg-[#B7B5E4]/30" />
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

          {/* Bottom quick-nav */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 p-3">
            <div className="pointer-events-auto mx-auto flex max-w-lg flex-wrap justify-center gap-2">
              {(["about", "experience", "portfolio", "contact"] as const).map(
                (id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setOpenSection(id)}
                    className="rounded-none border-2 border-[#B7B5E4] bg-[#1a0f35]/90 px-3 py-1.5 text-xs font-bold capitalize text-[#B7B5E4] shadow-[2px_2px_0_#B7B5E4] backdrop-blur transition hover:bg-[#3b2d72] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    {id === "portfolio"
                      ? "Projects"
                      : id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Section modal */}
          <SectionModal section={openSection} onClose={() => setOpenSection(null)} />
        </div>
      )}

      {/* Simple mode */}
      {(simpleMode || forceSimpleMode) && (
        <SimpleMode
          showBackToGame={allowGameMode}
          onBackToGame={() => {
            setSimpleMode(false);
            setShowGuide(true);
          }}
        />
      )}
    </div>
  );
}

