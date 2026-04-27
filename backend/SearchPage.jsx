// pages/SearchPage.jsx
// ─────────────────────────────────────────────
// This is the page that proves the backend works.
// It wires together:
//   1. USDA API call (NutritionAPI.js)
//   2. Firestore save (SearchHistoryService.js)
//   3. Auth state (useAuth)
//
// The frontend team can style this however they want —
// the logic here is what matters.
// ─────────────────────────────────────────────

import { useState } from "react";
import { searchFoods }         from "../utils/NutritionAPI";
import { saveSearchToHistory } from "../utils/SearchHistoryService";
import { useAuth }             from "../contexts/AuthContext";

export default function SearchPage() {
  const { currentUser }    = useAuth();
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [saved,   setSaved]   = useState(false); // did we save to Firestore?

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSaved(false);

    // ── Step 1: Hit USDA API ──────────────────
    const { data, error: apiError } = await searchFoods(query);

    setLoading(false);

    if (apiError) {
      setError(apiError);
      return;
    }

    if (data.length === 0) {
      setError(`No foods found for "${query}". Try a different term.`);
      return;
    }

    setResults(data);

    // ── Step 2: Save to Firestore (only if logged in) ──
    if (currentUser) {
      const { error: saveError } = await saveSearchToHistory(
        currentUser.uid,
        query,
        data[0] // save the top result
      );
      if (!saveError) setSaved(true);
    }
  }

  return (
    <div>
      <h1>Nutrition Search</h1>
      <p>Powered by USDA FoodData Central</p>

      {/* Search form */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try "banana", "chicken breast", "oats"'
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Status messages */}
      {error  && <p style={{ color: "red" }}>{error}</p>}
      {saved  && <p style={{ color: "green" }}>Search saved to your history!</p>}

      {/* Results */}
      {results.map((food) => (
        <div key={food.fdcId} style={{ border: "1px solid #ccc", margin: "8px 0", padding: "12px" }}>
          <h3>{food.description}</h3>
          {food.brandOwner && <p><small>{food.brandOwner}</small></p>}

          {/* Nutrition table — hand this structure to the frontend team */}
          <table>
            <tbody>
              {Object.entries(food.nutrients).map(([name, { value, unit }]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{value} {unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
