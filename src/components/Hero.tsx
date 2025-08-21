import { motion } from "framer-motion";

type Collab = { name: string; href: string; logo: string; big?: boolean };
type WorkItem = {
  src: string;
  alt: string;
  title: string;
  desc: string;
  href?: string;
};

const COLLABS: Collab[] = [
  {
    name: "Ziarul Financiar",
    href: "https://www.zf.ro/",
    logo: "/logos/zf.png",
  },
  {
    name: "Mediafax",
    href: "https://www.mediafax.ro/",
    logo: "/logos/mff.png",
  },
  {
    name: "Business Magazin",
    href: "https://www.businessmagazin.ro/",
    logo: "/logos/bm.png",
  },
  {
    name: "INQUAM",
    href: "https://inquamphotos.com/",
    logo: "/logos/inq.png",
    big: true,
  },
  {
    name: "Mediafax Foto",
    href: "https://www.mediafaxfoto.ro/",
    logo: "/logos/smff.png",
  },
  {
    name: "Business Mark",
    href: "https://business-mark.ro/",
    logo: "/logos/bmk.png",
    big: true,
  },
];

// pune aici imaginile tale (3:2 arată cel mai bine)
const WORK: WorkItem[] = [
  {
    src: "/work/work1.jpg",
    alt: "Prince Charles and Klaus Iohannis handshake",
    title: "Prince Charles of Wales in official visit in Bucharest, Romania",
    desc: "Coverage from Cotroceni Palace during the official visit.",
    href: "https://example.com/story-1",
  },
  {
    src: "/work/work2.jpg",
    alt: "Emmanuel Macron during military visit",
    title: "Visit of the president of French Republic, Emanuel Macron",
    desc: "Editorial selection from the joint exercise and ceremony.",
    href: "https://example.com/story-2",
  },
  {
    src: "/work/work3.jpg",
    alt: "Volodimir Zelenski and Klaus Iohannis",
    title: "Visit of the president of Ukraine, Volodimir Zelenski",
    desc: "Photoreport at Cotroceni—press statements and arrival.",
    href: "https://example.com/story-3",
  },
  {
    src: "/work/work4.jpg",
    alt: "F-16 airplane close-up",
    title: "Air police exercise at the 86th Borcea Air Base, Romania",
    desc: "Operational training images with F-16 aircraft.",
    href: "https://example.com/story-4",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};

export default function Hero() {
  return (
    <section className="w-full bg-white">
      {/* Collaborations */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16">
        <motion.h2
          {...fadeUp}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center text-2xl md:text-3xl font-semibold"
        >
          Collaborations
        </motion.h2>

        <motion.div
          {...fadeUp}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 md:mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 md:gap-10 items-center justify-items-center"
        >
          {COLLABS.map((c) => (
            <a
              key={c.name}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${c.name} (external)`}
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <img
                src={c.logo}
                alt={`${c.name} logo`}
                loading="lazy"
                className={[
                  // pe mobil: mereu color; pe desktop: grayscale la hover
                  "object-contain transition duration-300",
                  "md:grayscale md:hover:grayscale-0 md:opacity-80 md:hover:opacity-100",
                  // mărime diferită pt cele marcate `big`
                  c.big ? "h-14 md:h-16" : "h-8 md:h-10",
                ].join(" ")}
              />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Work */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-10 md:pb-16">
        <motion.h2
          {...fadeUp}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center text-2xl md:text-3xl font-semibold"
        >
          Work
        </motion.h2>

        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {WORK.map((w, i) => {
            const Card = (
              <article className="group rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                {/* imaginea (3:2) */}
                <div className="relative w-full pt-[66.666%] overflow-hidden">
                  <img
                    src={w.src}
                    alt={w.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transform-gpu transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                {/* descrierea dedesubt */}
                <div className="p-4 md:p-5">
                  <h3 className="text-base md:text-lg font-semibold leading-snug">
                    {w.title}
                  </h3>
                  <p className="mt-2 text-sm md:text-[15px] text-neutral-600">
                    {w.desc}
                  </p>
                </div>
              </article>
            );

            return w.href ? (
              <a
                key={i}
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus:outline-none focus:ring-2 focus:ring-neutral-900/20 rounded-xl"
              >
                {Card}
              </a>
            ) : (
              <div key={i}>{Card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
