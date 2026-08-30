import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RecipeList from "./components/RecipeList";

import { recipes } from "./data/recipes";

function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Navbar />

      <main>
        <Hero />

        <RecipeList recipes={recipes} />
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-slate-500">
          Built at HackUTD DevDay 2026
        </div>
      </footer>
    </div>
  );
}

export default App;