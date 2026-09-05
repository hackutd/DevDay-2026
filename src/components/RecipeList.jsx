import RecipeCard from "./RecipeCard";

function RecipeList({ recipes }) {
  return (
    <section id="recipes">
      <h2>Recipes</h2>

      <div>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
          />
        ))}
      </div>
    </section>
  );
}

export default RecipeList;