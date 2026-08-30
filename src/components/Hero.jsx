function Hero() {
  return (
    <section
      id="top"
      className="border-b border-stone-200 bg-white"
    >
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          HackUTD DevDay 2026
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
          Find something good to cook.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Start with a simple recipe browser. During DevDay,
          we'll turn it into an AI-powered cooking assistant.
        </p>

        <a
          href="#recipes"
          className="mt-8 inline-block rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Browse Recipes
        </a>
      </div>
    </section>
  );
}

export default Hero;