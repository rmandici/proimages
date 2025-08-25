import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CATS = [
  { label: "Sports", slug: "sports" },
  { label: "Press", slug: "press" },
  { label: "Corporate", slug: "corporate" },
  { label: "Concert", slug: "concert" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // pentru highlight activ (din query ?cat=...)
  const activeCat = useMemo(
    () => new URLSearchParams(location.search).get("cat") ?? "",
    [location.search]
  );

  const onLight = menuOpen || scrolled;
  const textClass = onLight ? "text-neutral-900" : "text-white";

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000]">
      <div
        className={[
          "transition-all duration-300",
          scrolled
            ? "backdrop-blur-md shadow-sm border-black/10 opacity-80"
            : "bg-gradient-to-b from-black/50 via-black/20 to-transparent",
          textClass,
          menuOpen
            ? "shadow-sm bg-[var(--bg-muted)]/80 text-neutral-900"
            : "bg-gradient-to-b from-black/50 via-black/20 to-transparent",
        ].join(" ")}
        style={scrolled ? { backgroundColor: "var(--bg-muted)" } : undefined}
      >
        <div className="px-4 md:px-6 h-14 md:h-16 grid grid-cols-[auto_1fr_auto] items-center">
          <div className="flex items-center gap-2 md:gap-3">
            {/* LOGO stânga (Home) */}
            <Link
              to="/"
              aria-label="Go to Home"
              className="shrink-0 inline-flex items-center"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 md:h-10 w-auto"
                draggable={false}
              />
            </Link>

            {/* Titlu centrat */}
            <div className="leading-[1.05] relative top-[4px]">
              <div className="font-['Montserrat',sans-serif] uppercase tracking-[0.22em] md:tracking-[0.28em] text-sm md:text-base font-semibold leading-none">
                PROIMAGES
              </div>
              <div className="font-['Montserrat',sans-serif] tracking-[0.12em] text-[11px] md:text-sm leading-tight opacity-90">
                Eduard&nbsp;Vinatoru
              </div>
            </div>
          </div>
          {/* Desktop NAV (dreapta) */}
          <nav className="hidden md:flex items-center gap-6 font-medium md:col-start-3 md:justify-self-end opacity-90">
            {CATS.map(({ label, slug }) => {
              const active = activeCat === slug;
              return (
                <Link
                  key={slug}
                  to={`/?cat=${slug}`}
                  className={[
                    "font-bold tracking-wide transition-colors",
                    active
                      ? "text-neutral-900 underline underline-offset-4 decoration-2"
                      : `${textClass} hover:opacity-80`,
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Hamburger (mobil) */}
          <button
            type="button"
            aria-label="Open menu"
            className={`md:hidden justify-self-end text-2xl cursor-pointer ${textClass}`}
            onClick={() => setMenuOpen((s) => !s)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu — aceleași categorii */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 py-3 space-y-2 text-center backdrop-blur-md"
            // același fundal ca overlay-ul din navbar, la ~80% opacitate
            style={{
              backgroundColor: "rgba(var(--bg-muted-rgb,245,245,245),0.8)",
              color: "#111827", // text-neutral-900
            }}
          >
            {CATS.map(({ label, slug }) => (
              <Link
                key={slug}
                to={`/?cat=${slug}`}
                onClick={() => setMenuOpen(false)}
                className="block font-bold tracking-wide hover:bg-white/60"
              >
                {label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
