import React, { useState, useEffect, useContext } from 'react';
import { data } from '../data/data.js';
import { AppContext } from '../context/AppContext';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

const Food = () => {
  //   console.log(data);
  const [foods, setFoods] = useState(data);
  const [foodDetails, setFoodDetails] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [showIngredientsToggle, setShowIngredientsToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [ingredientSearchQuery, setIngredientSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const { favorites, toggleFavorite, addToCart } = useContext(AppContext);

  // Search delay
  useEffect(() => {
    if (!ingredientSearchQuery) return;

    const timeoutId = setTimeout(() => {
      executeSearch(ingredientSearchQuery);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [ingredientSearchQuery]);

  //   Filter Type burgers/pizza/etc
  const filterType = (category) => {
    setFoods(
      data.filter((item) => {
        return item.category === category;
      })
    );
  };

  //   Filter by price
  const filterPrice = (price) => {
    setFoods(
      data.filter((item) => {
        return item.price === price;
      })
    );
  };

  // Ingredient Search
  const executeSearch = async (query) => {
    setIsSearching(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);
      const apiData = await response.json();

      if (apiData.meals) {
        // Map MealDB data to internal
        const mappedFoods = apiData.meals.map((meal) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          category: 'searched',
          image: meal.strMealThumb,
          price: '$$', // Fake price
        }));
        setFoods(mappedFoods);
      } else {
        setFoods([]); // No results
      }
    } catch (error) {
      console.error("Error fetching ingredient search:", error);
    }
    setIsSearching(false);
  };

  // Dietary Filter
  const searchByCategory = async (categoryStr) => {
    setIsSearching(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryStr}`);
      const apiData = await response.json();

      if (apiData.meals) {
        const mappedFoods = apiData.meals.map((meal) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          category: categoryStr,
          image: meal.strMealThumb,
          price: '$$$',
        }));
        setFoods(mappedFoods);
      } else {
        setFoods([]);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
    setIsSearching(false);
  };

  // Get data from MealDB
  const fetchFoodDetails = async (food) => {
    setIsLoading(true);
    setFoodDetails(null);

    try {
      // Uses last word of food name
      const searchTerm = food.name.split(' ').pop();
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const apiData = await response.json();

      let ingredients = [];
      if (apiData.meals && apiData.meals.length > 0) {
        const meal = apiData.meals[0]; // grab recipe
        for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== '') {
            ingredients.push({
              name: meal[`strIngredient${i}`],
              measure: meal[`strMeasure${i}`]
            });
          }
        }
      } else {
        ingredients = [];
      }

      // Common allergens
      const COMMON_ALLERGENS = ['cheese', 'milk', 'butter', 'cream', 'nut', 'peanut', 'almond', 'shrimp', 'crab', 'soy', 'wheat', 'egg'];

      ingredients = ingredients.map(ing => ({
        ...ing,
        isAllergen: COMMON_ALLERGENS.some(allergen => ing.name.toLowerCase().includes(allergen))
      }));

      // Detect allergens
      const detectedAllergens = ingredients.filter(ing => ing.isAllergen).map(ing => ing.name);

      // Fake nutrition
      const mockNutrition = {
        calories: Math.floor(Math.random() * 500) + 300,
        protein: Math.floor(Math.random() * 30) + 10,
        fat: Math.floor(Math.random() * 40) + 10,
        carbs: Math.floor(Math.random() * 60) + 20,
      };

      setFoodDetails({ ingredients, nutrition: mockNutrition, detectedAllergens });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const handleCardClick = (item) => {
    if (expandedCardId === item.id) {
      setExpandedCardId(null);
      setShowIngredientsToggle(false);
    } else {
      setExpandedCardId(item.id);
      setShowIngredientsToggle(false);
      fetchFoodDetails(item);
    }
  };

  return (
    <div className='max-w-[1640px] m-auto px-4 py-12'>
      <h1 className='text-orange-600 font-bold text-4xl text-center'>
        Top Rated Menu Items
      </h1>

      <div className='flex flex-col lg:flex-row justify-between'>
        <div>
          <p className='font-bold text-gray-700'>Filter Type</p>
          <div className='flex justfiy-between flex-wrap'>
            <button
              onClick={() => setFoods(data)}
              className='m-1 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
            >
              All
            </button>
            <button
              onClick={() => filterType('burger')}
              className='m-1 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
            >
              Burgers
            </button>
            <button
              onClick={() => filterType('pizza')}
              className='m-1 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
            >
              Pizza
            </button>
            <button
              onClick={() => filterType('salad')}
              className='m-1 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
            >
              Salads
            </button>
            <button
              onClick={() => filterType('chicken')}
              className='m-1 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
            >
              Chicken
            </button>
          </div>
        </div>

        <div>
          <p className='font-bold text-gray-700'>Filter Price</p>
          <div className='flex justify-between max-w-[390px] w-full'>
            <button
              onClick={() => filterPrice('$')}
              className='m-1 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
            >
              $
            </button>
            <button
              onClick={() => filterPrice('$$')}
              className='m-1 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
            >
              $$
            </button>
            <button
              onClick={() => filterPrice('$$$')}
              className='m-1 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
            >
              $$$
            </button>
            <button
              onClick={() => filterPrice('$$$$')}
              className='m-1 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
            >
              $$$$
            </button>
          </div>
        </div>

        {/* Dietary Filters */}
        <div className='mt-4 lg:mt-0'>
          <p className='font-bold text-gray-700'>Dietary (API)</p>
          <div className='flex justify-between flex-wrap max-w-[280px] w-full'>
            <button
              onClick={() => searchByCategory('Vegan')}
              className='m-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors'
            >
              Vegan
            </button>
            <button
              onClick={() => searchByCategory('Vegetarian')}
              className='m-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors'
            >
              Vegetarian
            </button>
            <button
              onClick={() => searchByCategory('Seafood')}
              className='m-1 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors'
            >
              Seafood
            </button>
          </div>
        </div>
      </div>

      {/* Ingredient Search Bar */}
      <div className='mt-8 mb-4 max-w-[600px] m-auto'>
        <div className='flex items-center justify-between border-2 border-orange-600 rounded-full p-1 bg-white shadow-md'>
          <input
            type='text'
            placeholder="Search by ingredient (e.g. 'chicken', 'garlic')"
            className='bg-transparent focus:outline-none w-full px-4 text-gray-700'
            value={ingredientSearchQuery}
            onChange={(e) => setIngredientSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isSearching && (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4'>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className='border shadow-lg rounded-lg h-[250px] bg-gray-200 animate-pulse'></div>
          ))}
        </div>
      )}

      {foods.length === 0 && !isSearching && (
        <p className='text-center mt-8 text-gray-500 font-bold'>No foods found matching those criteria.</p>
      )}

      {!isSearching && (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4'>
          {foods.slice(0, visibleCount).map((item, index) => {
            const isFav = favorites.some(f => f.id === item.id || f.name === item.name);
            return (
              <div
                key={index}
                className='border shadow-lg rounded-lg hover:scale-105 duration-300 overflow-hidden flex flex-col relative'
              >
                <div
                  className='absolute top-2 right-2 bg-white/80 p-2 rounded-full cursor-pointer z-10 hover:scale-110 transition-transform'
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item);
                  }}
                >
                  {isFav ? <AiFillHeart size={24} className='text-red-500' /> : <AiOutlineHeart size={24} className='text-gray-500' />}
                </div>

                <div
                  className='absolute top-2 left-2 bg-black/80 text-white px-3 py-1.5 rounded-full cursor-pointer z-10 hover:bg-orange-600 transition-colors shadow flex items-center text-xs font-bold'
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                >
                  + Cart
                </div>

                <div className='cursor-pointer' onClick={() => handleCardClick(item)}>
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

                {expandedCardId === item.id && (
                  <div className='p-4 border-t bg-gray-50 flex-grow'>
                    {isLoading ? (
                      <div className='flex flex-col space-y-2 py-4 animate-pulse'>
                        <div className='h-4 bg-gray-300 rounded w-3/4 mx-auto'></div>
                        <div className='h-20 bg-gray-200 rounded w-full mt-2'></div>
                      </div>
                    ) : foodDetails ? (
                      <div>
                        <div>
                          <h3 className='font-bold mb-2 text-orange-600 text-sm'>Est. Nutrition</h3>
                          <div className='flex gap-2 justify-between bg-white p-2 rounded border text-xs'>
                            <div className='text-center'><p className='font-bold'>{foodDetails.nutrition.calories}</p><p className='text-gray-500'>Cal</p></div>
                            <div className='text-center'><p className='font-bold'>{foodDetails.nutrition.protein}g</p><p className='text-gray-500'>Pro</p></div>
                            <div className='text-center'><p className='font-bold'>{foodDetails.nutrition.fat}g</p><p className='text-gray-500'>Fat</p></div>
                            <div className='text-center'><p className='font-bold'>{foodDetails.nutrition.carbs}g</p><p className='text-gray-500'>Carbs</p></div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowIngredientsToggle(!showIngredientsToggle);
                          }}
                          className='mt-4 w-full bg-orange-100 text-orange-600 font-bold py-2 rounded border border-orange-200 hover:bg-orange-200 transition-colors'
                        >
                          {showIngredientsToggle ? 'Hide Ingredients' : 'Show Ingredients'}
                        </button>

                        {showIngredientsToggle && (
                          <div className='mt-4'>

                            {/*Allergen Warning*/}
                            {foodDetails.detectedAllergens && foodDetails.detectedAllergens.length > 0 && (
                              <div className='p-3 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-sm'>
                                <p className='font-bold flex items-center text-sm'>
                                  <span className='mr-2 text-lg'>⚠️</span> Allergen Warning
                                </p>
                                <p className='text-xs mt-1 font-medium'>Contains: {foodDetails.detectedAllergens.join(', ')}</p>
                              </div>
                            )}

                            <h3 className='font-bold mb-2 text-orange-600 text-sm'>Ingredients List</h3>
                            {foodDetails.ingredients.length > 0 ? (
                              // Styled Ingredient Tag
                              <div className='flex flex-wrap gap-2'>
                                {foodDetails.ingredients.map((ing, idx) => (
                                  <div
                                    key={idx}
                                    className={`flex items-center p-1 pr-3 border rounded-full shadow-sm max-w-max text-xs transition-transform hover:scale-105 ${ing.isAllergen
                                      ? 'bg-red-50 border-red-300 text-red-800'
                                      : 'bg-white border-gray-200 text-gray-700'
                                      }`}
                                  >
                                    <img
                                      src={`https://www.themealdb.com/images/ingredients/${ing.name}-Small.png`}
                                      alt={ing.name}
                                      className='w-6 h-6 object-cover rounded-full mr-2 bg-gray-100'
                                      onError={(e) => { e.target.style.display = 'none' }}
                                    />
                                    <span><span className='font-bold'>{ing.name}</span> <span className='opacity-70 mx-1'>|</span> {ing.measure}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className='text-sm text-gray-500 italic'>No ingredients found.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className='text-sm text-gray-500 text-center py-4'>Failed to load data.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination*/}
      {visibleCount < foods.length && !isSearching && (
        <div className='flex justify-center mt-12'>
          <button
            onClick={() => setVisibleCount(prev => prev + 8)}
            className='bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-orange-700 hover:scale-105 duration-300'
          >
            Load More Delights...
          </button>
        </div>
      )}
    </div>
  );
};

export default Food;
