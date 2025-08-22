import { Link } from "react-router-dom";

function CopyrightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      {/* contur + litera C, stil outline */}
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M15.5 9a4 4 0 1 0 0 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-200 bg-[var(--bg-muted)]">
      <div className="container-tight py-5 md:py-8">
        <div className="flex flex-col items-center gap-2.5">
          {/* logo (Home) */}
          <Link
            to="/"
            aria-label="Go to Home"
            className="inline-flex items-center"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-7 md:h-9 w-auto opacity-90"
              draggable={false}
            />
          </Link>

          {/* text + © svg */}
          <p className="text-xs md:text-sm text-neutral-600 flex items-center gap-2">
            <CopyrightIcon className="h-[14px] w-[14px] md:h-4 md:w-4 opacity-70" />
            <span>{year} — All rights reserved</span>
            <span className="font-medium text-neutral-700">
              Eduard Vinatoru
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
