function RecipeCard({ recipe }) {
  return (
    <article className="grid gap-4 border-b border-stone-200 py-7 md:grid-cols-[64px_1fr_auto] md:items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-3xl shadow-sm ring-1 ring-stone-200">
        {recipe.emoji}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-950">
          {recipe.name}
        </h3>

        <p className="mt-1 max-w-2xl leading-6 text-slate-600">
          {recipe.description}
        </p>
      </div>

      <div className="flex gap-2 text-sm text-slate-500 md:flex-col md:text-right">
        <span>{recipe.cookTime} min</span>

        <span className="hidden md:inline">
          {recipe.difficulty}
        </span>

        <span className="md:hidden">
          · {recipe.difficulty}
        </span>
      </div>
    </article>
  );
}

export default RecipeCard;