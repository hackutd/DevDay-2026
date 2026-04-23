// utils/NutritionAPI.js
// ─────────────────────────────────────────────
// All calls to the USDA FoodData Central API.
// Docs: https://fdc.nal.usda.gov/api-guide.html
//
// Always returns { data, error } — never throws.
// The frontend just checks: if (error) show error, else show data.
// ─────────────────────────────────────────────

const BASE    = "https://api.nal.usda.gov/fdc/v1";
const API_KEY = import.meta.env.VITE_USDA_API_KEY;

// ─────────────────────────────────────────────
// SEARCH — find foods by name
// query: string e.g. "apple", "chicken breast"
// returns list of food items with basic info
// ─────────────────────────────────────────────
export async function searchFoods(query) {
  try {
    const params = new URLSearchParams({
      query,
      api_key:  API_KEY,
      dataType: "Foundation,SR Legacy",
      pageSize: 10,
    });
    const res = await fetch(`${BASE}/foods/search?${params}`);
    if (!res.ok) throw Object.assign(new Error(), { status: res.status });
    const json = await res.json();

    const foods = json.foods || [];

    // Clean up the response — only return what the frontend needs
    const cleaned = foods.map((food) => ({
      fdcId:       food.fdcId,
      description: food.description,
      brandOwner:  food.brandOwner || null,
      dataType:    food.dataType,
      nutrients:   extractNutrients(food.foodNutrients),
    }));

    return { data: cleaned, error: null };
  } catch (err) {
    const msg = err.response?.status === 403
      ? "Invalid API key. Check your VITE_USDA_API_KEY in .env"
      : err.response?.status === 429
      ? "Too many requests. Slow down and try again."
      : "Failed to fetch foods. Check your internet connection.";
    return { data: [], error: msg };
  }
}

// ─────────────────────────────────────────────
// GET DETAIL — full nutrient breakdown for one food
// fdcId: number, e.g. 173944
// ─────────────────────────────────────────────
export async function getFoodDetail(fdcId) {
  try {
    const res = await fetch(`${BASE}/food/${fdcId}?api_key=${API_KEY}`);
    if (!res.ok) throw new Error();
    const food = await res.json();

    return {
      data: {
        fdcId:       food.fdcId,
        description: food.description,
        dataType:    food.dataType,
        nutrients:   extractNutrients(food.foodNutrients),
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: "Could not load food details." };
  }
}

// ─────────────────────────────────────────────
// HELPER — pull the nutrients we care about
// from the raw USDA foodNutrients array.
// Each nutrient has a nutrientId — these IDs
// are stable across all USDA foods.
// ─────────────────────────────────────────────
function extractNutrients(rawNutrients = []) {
  // USDA nutrient ID → human-readable label
  // Full list: https://fdc.nal.usda.gov/food-details/747447/nutrients
  const NUTRIENT_MAP = {
    1008: { label: "Calories",          unit: "kcal" },
    1003: { label: "Protein",           unit: "g"    },
    1004: { label: "Total Fat",         unit: "g"    },
    1005: { label: "Carbohydrates",     unit: "g"    },
    1079: { label: "Fiber",             unit: "g"    },
    2000: { label: "Total Sugars",      unit: "g"    },
    1258: { label: "Saturated Fat",     unit: "g"    },
    1253: { label: "Cholesterol",       unit: "mg"   },
    1093: { label: "Sodium",            unit: "mg"   },
    1087: { label: "Calcium",           unit: "mg"   },
    1089: { label: "Iron",              unit: "mg"   },
    1092: { label: "Potassium",         unit: "mg"   },
    1106: { label: "Vitamin A",         unit: "µg"   },
    1162: { label: "Vitamin C",         unit: "mg"   },
    1114: { label: "Vitamin D",         unit: "µg"   },
  };

  const result = {};

  for (const n of rawNutrients) {
    const id = n.nutrientId ?? n.nutrient?.id;
    if (NUTRIENT_MAP[id]) {
      result[NUTRIENT_MAP[id].label] = {
        value: Math.round((n.value ?? n.amount ?? 0) * 10) / 10, // 1 decimal
        unit:  NUTRIENT_MAP[id].unit,
      };
    }
  }

  return result;
}
