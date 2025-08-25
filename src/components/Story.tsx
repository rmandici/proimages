const BODY_IMAGES = Array.from({ length: 10 }, (_, i) => ({
  src: `/images/body/body${i + 1}.jpg`,
  alt: `Photo ${i + 1}`,
}));

export default function Story() {
  return (
    <section className="w-full">
      {/* Lead / descriere pe fundal gri deschis */}
      <div className="bg-[var(--bg-muted)]">
        <div className="container-tight max-w-5xl py-8 md:py-12">
          <p className="text-[17px] md:text-xl leading-7 md:leading-8 text-neutral-800 text-center">
            <strong>Eduard Vinatoru</strong> is an independent photojournalist,
            corporate and event photographer based in Bucharest, collaborating
            with the largest photo and press agencies in Romania such as{" "}
            <em>Mediafax</em> and <em>Inquam Photo</em>, and financial
            newspapers like <em>Business Magazin</em> and{" "}
            <em>Ziarul Financiar</em>.
          </p>
        </div>
      </div>

      {/* Galerie full-bleed: margini ~2px, 2 coloane peste tot,
          prima & ultima = col-span-2 (mari) */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-[2px] md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-[2px] md:gap-6">
          {BODY_IMAGES.map((img, i, arr) => (
            <figure
              key={img.src}
              className={`overflow-hidden  bg-white ${
                i === 0 || i === arr.length - 1 ? "col-span-2" : ""
              }`}
            >
              {/* Raport 3:2 — schimbă la pt-[75%] pentru 4:3 sau pt-[56.25%] pentru 16:9 */}
              <div className="relative w-full pt-[66.666%]">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
