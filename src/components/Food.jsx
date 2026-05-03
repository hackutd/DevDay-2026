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

  useEffect(() => {
    fetchInitialFoods();
  }, []);

  return (
    <div className='max-w-[1640px] m-auto px-4 py-12'>
      <h1 className='text-orange-600 font-bold text-4xl text-center'>
        Top Rated Menu Items
      </h1>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4'>
        {foods.map((item, index) => {
          // Check if item is already favorited
          const isFav = favorites.some(f => f.id === item.id || f.name === item.name);

          return (
            <div key={index} className='border shadow-lg rounded-lg hover:scale-105 duration-300 relative'>

              {/* Favorite Button */}
              <div
                className='absolute top-2 right-2 bg-white/80 p-2 rounded-full cursor-pointer z-10 hover:scale-110 transition-transform'
              >
                <button onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item);
                }}>
                  {isFav
                    ? <AiFillHeart size={24} className='text-red-500' />
                    : <AiOutlineHeart size={24} className='text-gray-500' />
                  }
                </button>
              </div>

              <img
                src={item.image}
                alt={item.name}
                className='w-full h-[200px] object-cover rounded-t-lg'
              />
              <div className='flex justify-between px-2 py-4'>
                <p className='font-bold'>{item.name}</p>
                <p>
                  <span className='bg-orange-500 text-white p-1 rounded-full'>
                    {item.price}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Food;