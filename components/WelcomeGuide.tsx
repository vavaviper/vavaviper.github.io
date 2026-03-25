"use client";

interface WelcomeGuideProps {
  onClose: () => void;
  onEnterSimpleMode: () => void;
}

export function WelcomeGuide({ onClose, onEnterSimpleMode }: WelcomeGuideProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#1a0f35]/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-none border-4 border-[#B7B5E4] bg-[#f5f2ff] shadow-[6px_6px_0_#B7B5E4]">
        {/* Title bar */}
        <div className="flex items-center justify-between bg-[#3b2d72] px-6 py-3">
          <span className="text-base font-bold tracking-wide text-[#B7B5E4]">
            ✦ HOW TO EXPLORE ✦
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded border-2 border-[#B7B5E4] bg-[#d4784a] px-3 py-1 text-sm font-bold text-[#f5f2ff] transition hover:bg-[#c46234]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 px-6 py-5 text-[#1a0f35]">
          <p className="text-base leading-relaxed">
            Move your tiny Varsha around the duck park and walk up to{" "}
            <span className="font-bold text-[#3b2d72]">glowing spots</span> to explore
            sections of the site!
          </p>

          <ul className="space-y-2.5 border-l-4 border-[#B7B5E4] py-2 pl-4">
            <li className="text-sm">
              <span className="rounded bg-[#B7B5E4] px-2 py-1 text-xs font-bold text-[#1a0f35]">
                WASD
              </span>{" "}
              or{" "}
              <span className="rounded bg-[#B7B5E4] px-2 py-1 text-xs font-bold text-[#1a0f35]">
                ↑↓←→
              </span>{" "}
              to move
            </li>
            <li className="text-sm">
              <span className="rounded bg-[#9b73d6] px-2 py-1 text-xs font-bold text-[#f5f2ff]">
                E
              </span>{" "}
              to open a section window
            </li>
            <li className="text-sm">
              <span className="rounded bg-[#8b7ec0] px-2 py-1 text-xs font-bold text-[#f5f2ff]">
                Esc
              </span>{" "}
              to close windows
            </li>
          </ul>

          <p className="text-sm text-[#4a3f6e]">
            Prefer reading everything at once? Try <span className="font-bold text-[#3b2d72]">Simple mode</span> below!
          </p>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded border-2 border-[#1a0f35] bg-[#3b2d72] py-2.5 text-base font-bold text-[#B7B5E4] shadow-[2px_2px_0_#B7B5E4] transition hover:bg-[#4a3a82] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              Game mode
            </button>
            <button
              type="button"
              onClick={onEnterSimpleMode}
              className="w-full rounded border-2 border-[#1a0f35] bg-[#9b73d6] py-2.5 text-base font-bold text-[#f5f2ff] shadow-[2px_2px_0_#1a0f35] transition hover:bg-[#7c5ac8] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              Simple mode 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
