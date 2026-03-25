"use client";

import { useState } from "react";
import { experiences, projects } from "@/lib/game.constants";
import { AboutContent } from "./AboutContent";

interface SimpleModeProps {
  onBackToGame: () => void;
}

export function SimpleMode({ onBackToGame }: SimpleModeProps) {
  const [openExperience, setOpenExperience] = useState<string | null>(null);

  return (
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
          <button
            type="button"
            onClick={onBackToGame}
            className="rounded-none border-2 border-[#1a0f35] bg-[#3b2d72] px-3 py-1.5 text-xs font-bold text-[#B7B5E4] shadow-[3px_3px_0_#B7B5E4] transition hover:bg-[#4a3a82] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
          >
            ◀ Back to game
          </button>
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
                const key = `${exp.role}-${exp.company}-${exp.period}`;
                const isOpen = openExperience === key;
                return (
                  <div key={key}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenExperience((id) =>
                          id === key ? null : key
                        )
                      }
                      className="flex w-full items-start justify-between gap-2 px-5 py-3.5 text-left transition hover:bg-[#eee8ff]"
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
                        <p className="text-xs text-[#4a3f6e]">
                          {exp.period}
                        </p>
                        <span className="text-xs font-bold text-[#3b2d72]">
                          {isOpen ? "▴" : "▾"}
                        </span>
                      </div>
                    </button>
                    {isOpen && exp.bullets && (
                      <ul className="border-t-2 border-[#3b2d72]/20 bg-[#eee8ff] px-5 py-3 text-xs text-[#1a0f35]">
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
              <h2 className="text-base font-bold text-[#B7B5E4]">
                ✦ Projects
              </h2>
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
                        <li
                          key={b}
                          className="flex gap-2 text-xs text-[#4a3f6e]"
                        >
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
          </section>

          {/* Contact */}
          <section className="border-4 border-[#1a0f35] bg-white shadow-[4px_4px_0_#B7B5E4]">
            <div className="border-b-4 border-[#1a0f35] bg-[#3b2d72] px-5 py-2.5">
              <h2 className="text-base font-bold text-[#B7B5E4]">
                ✦ Contact
              </h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-[#4a3f6e]">
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
          © {new Date().getFullYear()} Varsha Prasad · Built with Next.js & a
          tiny pixel self
        </footer>
      </div>
    </div>
  );
}
