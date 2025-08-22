import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textClass = scrolled ? "text-neutral-900" : "text-white";

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000]">
      {/* top bar */}
      <div
        className={[
          "transition-all duration-300",
          scrolled
            ? "backdrop-blur-md shadow-sm border-b border-black/10"
            : "bg-gradient-to-b from-black/50 via-black/20 to-transparent",
          textClass,
        ].join(" ")}
        // light gray background when scrolled (uses your CSS var)
        style={scrolled ? { backgroundColor: "var(--bg-muted)" } : undefined}
      >
        <div className="px-4 md:px-6 h-14 md:h-16 grid grid-cols-[auto_1fr_auto] items-center">
          {/* LOGO -> Home */}
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

          {/* TITLE center */}
          <div className="justify-self-center text-center select-none">
            <div className="font-['Montserrat',sans-serif] uppercase tracking-[0.22em] md:tracking-[0.28em] text-sm md:text-base font-semibold leading-none">
              PROIMAGES
            </div>
            <div className="font-['Montserrat',sans-serif] tracking-[0.12em] text-[11px] md:text-sm leading-tight opacity-90">
              Eduard&nbsp;Vinatoru
            </div>
          </div>

          {/* MENU button right */}
          <button
            type="button"
            aria-label="Open menu"
            className={`justify-self-end text-2xl cursor-pointer ${textClass}`}
            onClick={() => setMenuOpen((s) => !s)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu – same background as scrolled bar */}
      {menuOpen && (
        <nav className="px-4 py-3 space-y-2 text-center bg-muted text-neutral-900 backdrop-blur-md ">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block uppercase tracking-wide hover:bg-white"
          >
            Home
          </Link>
          <Link
            to="/portfolio"
            onClick={() => setMenuOpen(false)}
            className="block uppercase tracking-wide hover:bg-white"
          >
            Portfolio
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block uppercase tracking-wide hover:bg-white"
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
