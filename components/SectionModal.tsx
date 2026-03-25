"use client";

import { useState } from "react";
import { SectionId } from "@/lib/game.types";
import { experiences, projects } from "@/lib/game.constants";
import { AboutContent } from "./AboutContent";

interface SectionModalProps {
  section: SectionId | null;
  onClose: () => void;
}

export function SectionModal({ section, onClose }: SectionModalProps) {
  const [openExperience, setOpenExperience] = useState<string | null>(null);

  if (!section) return null;

  const getTitle = () => {
    switch (section) {
      case "about":
        return "✦ About";
      case "experience":
        return "✦ Experience";
      case "portfolio":
        return "✦ Projects";
      case "contact":
        return "✦ Contact";
      default:
        return "";
    }
  };

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-[#1a0f35]/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-none border-4 border-[#1a0f35] bg-[#f5f2ff] shadow-[6px_6px_0_#B7B5E4]">
        {/* Title bar */}
        <div className="flex items-center justify-between bg-[#3b2d72] px-5 py-2.5">
          <h3 className="text-base font-bold tracking-wide text-[#B7B5E4]">{getTitle()}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded border-2 border-[#B7B5E4] bg-[#d4784a] px-2.5 py-0.5 text-xs font-bold text-[#f5f2ff] transition hover:bg-[#c46234] active:translate-x-[1px] active:translate-y-[1px]"
          >
            ✕ Esc
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[80vh] overflow-y-auto px-5 py-4">
          {section === "about" && <AboutContent />}

          {section === "experience" && (
            <div className="space-y-2.5">
              {experiences.map((exp) => {
                const key = `${exp.role}-${exp.company}-${exp.period}`;
                const isOpen = openExperience === key;
                return (
                  <div key={key} className="border-2 border-[#3b2d72] bg-[#eee8ff]">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenExperience((id) => (id === key ? null : key))
                      }
                      className="flex w-full items-start justify-between gap-2 px-4 py-3 text-left transition hover:bg-[#d0dff0]"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#1a0f35]">
                          {exp.role}
                        </p>
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
                            <span className="mt-0.5 shrink-0 text-[#B7B5E4]">
                              ▸
                            </span>
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

          {section === "portfolio" && (
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
                      <p className="mt-0.5 text-[10px] font-bold text-[#9b73d6]">
                        {proj.stack}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-[#3b2d72] transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </div>
                  {proj.bullets && (
                    <ul className="mt-2 space-y-1">
                      {proj.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-xs text-[#1a0f35]">
                          <span className="mt-0.5 shrink-0 text-[#B7B5E4]">
                            ▸
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </a>
              ))}
            </div>
          )}

          {section === "contact" && (
            <div>
              <p className="text-sm text-[#1a0f35]">
                Let's chat about ai, playful interfaces, or opportunities to
                build something cool together :)
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  { label: "Email", href: "mailto:v5prasad@uwaterloo.ca" },
                  {
                    label: "LinkedIn",
                    href: "https://www.linkedin.com/in/varsha-prasad/",
                    external: true,
                  },
                  {
                    label: "Github",
                    href: "https://github.com/vavaviper",
                    external: true,
                  },
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
  );
}
