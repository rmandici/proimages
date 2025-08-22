const BODY_IMAGES = Array.from({ length: 10 }, (_, i) => ({
  src: `/images/body/body${i + 1}.jpg`,
  alt: `Photo ${i + 1}`,
}));

export default function Story() {
  return (
    <section className="w-full">
      {/* Lead / descriere pe fundal gri deschis */}
      <div className="bg-[var(--bg-muted)]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
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

      {/* Galerie 2 coloane (prima și ultima = full width) */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {BODY_IMAGES.map((img, i) => (
            <figure
              key={img.src}
              className={`overflow-hidden rounded-xl shadow-sm bg-white
                          ${
                            i === 0 || i === BODY_IMAGES.length - 1
                              ? "md:col-span-2"
                              : ""
                          }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.01]"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
