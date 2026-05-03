import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
// import {data} from '../data/data.js';

// Backend pricing constants
const CATEGORY_PRICES = { Chicken: '$$', Beef: '$$$', Pasta: '$$', Seafood: '$$$$' };
const INITIAL_CATEGORIES = Object.keys(CATEGORY_PRICES);

const Food = () => {
  const [foods, setFoods] = useState([]);
  const { favorites, toggleFavorite } = useContext(AppContext);

  // Fetch initial menu from TheMealDB
  useEffect(() => {
  const fetchInitialFoods = async () => {
    try {
      const results = await Promise.all(
        INITIAL_CATEGORIES.map((cat) =>
          fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
            .then((r) => r.json())
            .then((d) =>
              (d.meals || []).slice(0, 4).map((meal) => ({
                id: meal.idMeal,
                namefet: meal.strMeal,
                image: meal.strMealThumb,
                price: CATEGORY_PRICES[cat],
              }))
            )
        )
      );
      setFoods(results.flat());
      console.log('Initial foods fetched:', results.flat());
    } catch (error) {
      console.error('Error fetching initial foods:', error);
    }
  };
  fetchInitialFoods();
}, []);

  return (
    <div className='max-w-[1640px] m-auto px-4 py-12'>
      <h1 className='text-red-600 font-bold text-4xl text-center'>
        Top Rated Menu Items
      </h1>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4'>
        {foods.map((item, index) => {
          const isFav = favorites.some(f => f.id === item.id || f.name === item.namefet);
          return (
          <div key ={index} className='relative border shadow-lg rounded-lg hover:scale-105 duration-300'>
            <div className='absolute top-2 right-2 bg-white/80 p-2 rounded-full cursor-pointer z-10 hover:scale-110 transition-transform'>
              <button onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item);
                }
                }>
                {isFav ? (
                  <AiFillHeart className='text-red-500' size={24} />
                ) : (
                  <AiOutlineHeart className='text-gray-500' size={24} />
                )}
              </button>
            </div>
            < img src = {item.image} alt = {item.name} className='w-full h-[200px] object-cover rounded-t-lg'/>
            <div className='flex justify-between px-2 py-4'>
              <p className='font-bold'>{item.namefet}</p>
              <p>
                <span className='bg-orange-500 text-white p-1 rounded-full'>{item.price}</span>
              </p>
            </div>
          </div>
        );})}
      </div>
    </div>

  );
};

export default Food;