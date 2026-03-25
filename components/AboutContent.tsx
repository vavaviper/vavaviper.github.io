"use client";

import { TAGS } from "@/lib/game.constants";

export function AboutContent() {
  return (
    <div className="space-y-5 text-[#1a0f35]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
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

        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9b73d6]">
            ★ PLAYER ONE ★
          </p>
          <h3 className="mt-0.5 text-2xl font-bold leading-tight text-[#1a0f35]">
            Varsha Prasad
          </h3>
          <p className="mt-0.5 text-xs text-[#4a3f6e]">
            SWE / ML Engineer · Management Engineering @ Waterloo
          </p>

          <p className="mt-3 text-sm leading-relaxed text-[#1a0f35]">
            I'm a Machine Learning Engineer based in Toronto, studying Management Engineering
            (AI) at the University of Waterloo. I build scalable systems that combine backend
            engineering and machine learning, with experience in ML pipelines, APIs, and
            projects in VR, neural networks, and full-stack apps.
          </p>

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
