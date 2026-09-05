function RecipeCard({ recipe }) {
  return (
    <article>
      <div>{recipe.emoji}</div>

      <div>
        <h3>{recipe.name}</h3>

        <p>{recipe.description}</p>

        <p>
          {recipe.cookTime} min · {recipe.difficulty}
        </p>
      </div>
    </article>
  );
}

export default RecipeCard;