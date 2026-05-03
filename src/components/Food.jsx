import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

// Backend pricing constants
const CATEGORY_PRICES = { Chicken: '$$', Beef: '$$$', Pasta: '$$', Seafood: '$$$$' };
const INITIAL_CATEGORIES = Object.keys(CATEGORY_PRICES);

const Food = () => {
  const [foods, setFoods] = useState([]);
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { favorites, toggleFavorite } = useContext(AppContext);

  // Fetch initial menu from TheMealDB
  const fetchInitialFoods = async () => {
    setIsSearching(true);
    try {
      const results = await Promise.all(
        INITIAL_CATEGORIES.map((cat) =>
          fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
            .then((r) => r.json())
            .then((d) =>
              (d.meals || []).slice(0, 4).map((meal) => ({
                id: meal.idMeal,
                name: meal.strMeal,
                image: meal.strMealThumb,
                price: CATEGORY_PRICES[cat],
              }))
            )
        )
      );
      setFoods(results.flat());
    } catch (error) {
      console.error('Error fetching initial foods:', error);
    }
    setIsSearching(false);
  };

  return (
    <div>

    </div>
  );
};

export default Food;