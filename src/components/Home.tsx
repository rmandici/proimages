import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const IMAGES = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
];

// timpi & zoom
const CYCLE_MS = 3000;
const SLIDE_IN_MS = 1000;
const REVEAL_MS = 2000;
const ZOOM_REVEAL_FROM = 1.02;
const ZOOM_REVEAL_TO = 1.05;

type Phase = "enter" | "reveal" | null;

export default function Home() {
  const [index, setIndex] = useState(0);
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>(null);
  const [baseScale, setBaseScale] = useState(1); // <<< zoom-ul curent al “bazei”
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

  // preîncărcare
  useEffect(() => {
    IMAGES.forEach((src) => {
      const i = new Image();
      i.src = src;
    });
  }, []);

  return (
    // fără "relative" aici, cum ai cerut
    <section className="w-full h-dvh overflow-hidden isolate">
      {/* BAZA: iese la stânga în faza ENTER; rămâne la baseScale până la următoarea tranziție */}
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
          className="absolute inset-0 h-full w-full object-cover select-none transform-gpu will-change-transform"
          initial={{ scale: baseScale }}
          animate={{ scale: baseScale }} // <<< nu mai scade după reveal
          transition={{ duration: 0.001 }} // fără animație vizibilă aici
        />
      </motion.div>

      {/* OVERLAY întunecat: intră din dreapta și rămâne pe loc */}
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
            if (!prefersReducedMotion && phase === "enter") setPhase("reveal");
          }}
        >
          {/* strat întunecat (rămâne plin ecran) */}
          <img
            src={IMAGES[nextIdx]}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover select-none transform-gpu"
            style={{
              filter: prefersReducedMotion ? "none" : "brightness(0.65)",
            }}
          />

          {/* REVEAL: aceeași poză FĂRĂ umbră, wipe + zoom pe durata reveal-ului */}
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
                scale: { duration: REVEAL_MS / 1000, ease: [0.22, 1, 0.36, 1] },
              }}
              onAnimationComplete={() => {
                // Fix: păstrăm exact același zoom pe baza nouă
                setIndex(nextIdx);
                setBaseScale(ZOOM_REVEAL_TO); // <<< reține zoom-ul atins la finalul reveal-ului
                setNextIdx(null);
                setPhase(null);
              }}
              style={{ willChange: "clip-path, transform" }}
            />
          )}

          {/* fallback pentru prefers-reduced-motion: crossfade scurt */}
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
                setBaseScale(1); // fără zoom extra pe varianta reduced-motion
                setNextIdx(null);
                setPhase(null);
              }}
            />
          )}
        </motion.div>
      )}
    </section>
  );
}
