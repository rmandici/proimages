import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const IMAGES = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
];

// —— Timings (păstrate exact cum ai cerut) ——
const CYCLE_MS = 3000;
const SLIDE_IN_MS = 1000;
const REVEAL_MS = 1800;
const ZOOM_REVEAL_FROM = 1.02;
const ZOOM_REVEAL_TO = 1.05;

type Phase = "enter" | "reveal" | null;

export default function Home() {
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

  const darkScale = !prefersReducedMotion
    ? phase === "reveal"
      ? ZOOM_REVEAL_TO
      : ZOOM_REVEAL_FROM
    : 1;

  return (
    // fără `relative` pe section; mobil = 1/2 înălțime, desktop = full
    <section className="w-full h-[50dvh] md:h-dvh overflow-hidden isolate">
      {/* wrapper INTERN poziționat corect */}
      <div className=" h-full w-full overflow-hidden">
        {/* BAZA: iese prin stânga; face zoom-out la 1 pe durata tranziției */}
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
            className="absolute inset-0 h-2/3 md:h-full w-full object-cover select-none transform-gpu origin-center will-change-transform"
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

        {/* OVERLAY: poza nouă cu umbră (același scale ca la reveal, pentru aliniere perfectă) */}
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
            {/* strat ÎNTUNECAT sincronizat la scale */}
            <motion.img
              src={IMAGES[nextIdx]}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 h-2/3 md:h-full w-full object-cover select-none transform-gpu origin-center"
              style={{
                filter: prefersReducedMotion ? "none" : "brightness(0.65)",
              }}
              initial={{ scale: darkScale }}
              animate={{ scale: darkScale }}
              transition={{
                scale: {
                  duration: phase === "reveal" ? REVEAL_MS / 1000 : 0.001,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            />

            {/* REVEAL: aceeași poză fără umbră, wipe + zoom (dreapta → stânga) */}
            {!prefersReducedMotion && phase === "reveal" && (
              <motion.img
                key={`wipe-${nextIdx}`}
                src={IMAGES[nextIdx]}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute inset-0 h-2/3 md:h-full w-full object-cover select-none transform-gpu origin-center"
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
                  setBaseScale(ZOOM_REVEAL_TO); // rămâne la același zoom
                  setNextIdx(null);
                  setPhase(null);
                }}
                style={{ willChange: "clip-path, transform" }}
              />
            )}

            {/* fallback prefers-reduced-motion */}
            {prefersReducedMotion && phase === "reveal" && (
              <motion.img
                key={`fade-${nextIdx}`}
                src={IMAGES[nextIdx]}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute inset-0 h-2/3 md:h-full w-full object-cover select-none transform-gpu origin-center"
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
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
  );
}
