function Navbar() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a
          href="#top"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          DevDay Recipes
        </a>

        <a
          href="#recipes"
          className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          Recipes
        </a>
      </nav>
    </header>
  );
}

export default Navbar;