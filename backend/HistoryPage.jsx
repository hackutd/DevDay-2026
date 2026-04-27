// pages/HistoryPage.jsx
// ─────────────────────────────────────────────
// Shows the logged-in user's past food searches.
// Pulls from Firestore on mount.
// This proves the Firestore READ is working.
// ─────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useAuth }             from "../contexts/AuthContext";
import { getSearchHistory, clearSearchHistory } from "../utils/SearchHistoryService";

export default function HistoryPage() {
  const { currentUser }     = useAuth();
  const [history,  setHistory]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error: fetchError } = await getSearchHistory(currentUser.uid);
      setLoading(false);
      if (fetchError) { setError(fetchError); return; }
      setHistory(data);
    }
    load();
  }, [currentUser]);

  async function handleClear() {
    setClearing(true);
    const { error: clearError } = await clearSearchHistory(currentUser.uid);
    setClearing(false);
    if (clearError) { setError(clearError); return; }
    setHistory([]);
  }

  if (loading) return <p>Loading history...</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Your Search History</h2>

      {history.length === 0 ? (
        <p>No searches yet. Go search for a food!</p>
      ) : (
        <>
          <button onClick={handleClear} disabled={clearing}>
            {clearing ? "Clearing..." : "Clear History"}
          </button>

          {history.map((item, i) => (
            <div key={i} style={{ border: "1px solid #ccc", margin: "8px 0", padding: "12px" }}>
              <strong>"{item.query}"</strong>
              <span style={{ marginLeft: "12px", color: "#888", fontSize: "12px" }}>
                {new Date(item.searchedAt).toLocaleString()}
              </span>
              <p>Top result: {item.topResult.description}</p>
              {item.topResult.nutrients?.Calories && (
                <p>Calories: {item.topResult.nutrients.Calories.value} kcal</p>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
