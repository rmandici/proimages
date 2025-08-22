import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Hero from "./Hero";
import Story from "./Story";

// Focal point pe imagine (în procente). y mai mic = „urcă” cadrul.
type Focus = { x: number; y: number; md?: { x: number; y: number } };

const FOCUS: Focus[] = [
  { x: 85, y: 40, md: { x: 50, y: 10 } }, // image1.jpg
  { x: 50, y: 50, md: { x: 50, y: 50 } }, // image2.jpg
  { x: 10, y: 35, md: { x: 50, y: 20 } }, // image3.jpg
];

// helper pentru object-position
const getPos = (idx: number | null, isMd: boolean) => {
  if (idx == null) return "50% 50%";
  const f = FOCUS[idx] || { x: 50, y: 50 };
  const p = isMd && f.md ? f.md : f;
  return `${p.x}% ${p.y}%`;
};

const IMAGES = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
];

// 🔤 CAPS pentru fiecare imagine (schimbă-le după cum vrei)
const CAPTIONS: { title: string; desc?: string }[] = [
  {
    title: "Official visit at Cotroceni Palace",
    desc: "Press coverage & arrivals",
  },
  { title: "Field exercise with allied forces", desc: "Editorial selection" },
  { title: "Cristianoooo Ronaldoooooo", desc: "Siuuuuu" },
];

// —— Timings ——
const CYCLE_MS = 3000;
const SLIDE_IN_MS = 1000;
const REVEAL_MS = 1800;
const ZOOM_REVEAL_FROM = 1.04;
const ZOOM_REVEAL_TO = 1.1;

type Phase = "enter" | "reveal" | null;

const useIsMd = () => {
  const [isMd, setIsMd] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsMd(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return isMd;
};

export default function Home() {
  const isMd = useIsMd();
  const [index, setIndex] = useState(0);
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>(null);
  const [baseScale, setBaseScale] = useState(1);
  const curRef = useRef(index);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    curRef.current = index;
  }, [index]);

  // autoplay
  useEffect(() => {
    const id = setInterval(() => {
      const nxt = (curRef.current + 1) % IMAGES.length;
      setNextIdx(nxt);
      setPhase("enter");
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  // preload
  useEffect(() => {
    IMAGES.forEach((src) => {
      const i = new Image();
      i.src = src;
    });
  }, []);

  return (
    <>
      {/* full-bleed, fără alb sus/lateral; 66dvh mobile / 90dvh desktop */}
      <section
        className="relative w-screen h-[66dvh] md:h-[90dvh] overflow-hidden isolate
                   left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
                   [margin-block-start:-35px] bg-black"
      >
        {/* ancoră pentru absolute + înălțime fixă */}
        <div className="relative h-full w-full overflow-hidden">
          {/* Baza */}
          <motion.div
            key={`base-wrap-${index}-${phase ?? "idle"}`}
            className="absolute inset-0 transform-gpu will-change-transform overflow-hidden"
            initial={{ x: "0%" }}
            animate={{
              x: phase === "enter" && !prefersReducedMotion ? "-100%" : "0%",
            }}
            transition={{
              duration:
                phase === "enter" && !prefersReducedMotion
                  ? SLIDE_IN_MS / 1000
                  : 0.001,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.img
              key={`base-img-${index}`}
              src={IMAGES[index]}
              alt=""
              aria-hidden
              draggable={false}
              style={{ objectPosition: getPos(index, isMd) }}
              className="absolute inset-0 h-full w-full object-cover select-none transform-gpu will-change-transform"
              initial={{ scale: baseScale }}
              animate={{ scale: phase ? 1 : baseScale }}
              transition={{
                scale: {
                  duration: phase === "enter" ? SLIDE_IN_MS / 1000 : 0.001,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            />
          </motion.div>

          {/* Overlay */}
          {nextIdx !== null && (
            <motion.div
              key={`stage-${nextIdx}`}
              className="absolute inset-0 z-10 transform-gpu will-change-transform pointer-events-none overflow-hidden"
              initial={{ x: prefersReducedMotion ? "0%" : "100%" }}
              animate={{ x: "0%" }}
              transition={{
                duration: prefersReducedMotion ? 0.3 : SLIDE_IN_MS / 1000,
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={() => {
                if (!prefersReducedMotion && phase === "enter")
                  setPhase("reveal");
              }}
            >
              {/* strat întunecat */}
              <img
                src={IMAGES[nextIdx]}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover select-none transform-gpu"
                style={{
                  filter: prefersReducedMotion ? "none" : "brightness(0.65)",
                  objectPosition: getPos(nextIdx, isMd),
                }}
              />

              {/* Reveal */}
              {!prefersReducedMotion && phase === "reveal" && (
                <motion.img
                  key={`wipe-${nextIdx}`}
                  src={IMAGES[nextIdx]}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover select-none transform-gpu"
                  initial={{
                    clipPath: "inset(0% 0% 0% 100%)",
                    scale: ZOOM_REVEAL_FROM,
                  }}
                  animate={{
                    clipPath: "inset(0% 0% 0% 0%)",
                    scale: ZOOM_REVEAL_TO,
                  }}
                  transition={{
                    clipPath: {
                      duration: REVEAL_MS / 1000,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    scale: {
                      duration: REVEAL_MS / 1000,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  onAnimationComplete={() => {
                    setIndex(nextIdx);
                    setBaseScale(ZOOM_REVEAL_TO);
                    setNextIdx(null);
                    setPhase(null);
                  }}
                  style={{
                    willChange: "clip-path, transform",
                    objectPosition: getPos(nextIdx, isMd),
                  }}
                />
              )}

              {/* prefers-reduced-motion */}
              {prefersReducedMotion && phase === "reveal" && (
                <motion.img
                  key={`fade-${nextIdx}`}
                  src={IMAGES[nextIdx]}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover select-none transform-gpu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  onAnimationComplete={() => {
                    setIndex(nextIdx);
                    setBaseScale(1);
                    setNextIdx(null);
                    setPhase(null);
                  }}
                />
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* 🔽 Bară descriere – full-bleed, sincronizată cu poza */}
      <section
        className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
                   bg-muted text-neutral-900 overflow-hidden"
        aria-live="polite"
      >
        {/* ca să nu sară înălțimea când se schimbă textul */}
        <div className="relative min-h-[56px] md:min-h-[68px]">
          {/* caption pentru imaginea curentă (baza) */}
          {!prefersReducedMotion ? (
            <>
              <motion.div
                key={`cap-base-${index}`}
                className="absolute inset-0 flex items-center"
                initial={{ x: "0%" }}
                animate={{ x: nextIdx !== null ? "-100%" : "0%" }} // iese la stânga cât timp overlay-ul e activ
                transition={{
                  duration: SLIDE_IN_MS / 1000,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="w-full px-4 md:px-6 py-3 md:py-4">
                  <h3 className="text-base md:text-lg font-semibold leading-tight">
                    {CAPTIONS[index]?.title}
                  </h3>
                  {CAPTIONS[index]?.desc && (
                    <p className="text-sm md:text-[15px] text-neutral-600 mt-0.5">
                      {CAPTIONS[index]?.desc}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* caption pentru poza care intră */}
              {nextIdx !== null && (
                <motion.div
                  key={`cap-next-${nextIdx}`}
                  className="absolute inset-0 flex items-center"
                  initial={{ x: "100%" }}
                  animate={{ x: "0%" }}
                  transition={{
                    duration: SLIDE_IN_MS / 1000,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="w-full px-4 md:px-6 py-3 md:py-4">
                    <h3 className="text-base md:text-lg font-semibold leading-tight">
                      {CAPTIONS[nextIdx]?.title}
                    </h3>
                    {CAPTIONS[nextIdx]?.desc && (
                      <p className="text-sm md:text-[15px] text-neutral-600 mt-0.5">
                        {CAPTIONS[nextIdx]?.desc}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            // prefers-reduced-motion: fade simplu
            <motion.div
              key={`cap-rm-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full px-4 md:px-6 py-3 md:py-4">
                <h3 className="text-base md:text-lg font-semibold leading-tight">
                  {CAPTIONS[index]?.title}
                </h3>
                {CAPTIONS[index]?.desc && (
                  <p className="text-sm md:text-[15px] text-neutral-600 mt-0.5">
                    {CAPTIONS[index]?.desc}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Collab + Carduri */}
      <Hero />

      {/* Rest work */}
      <Story />
    </>
  );
}
