import React, { useState, useEffect } from 'react';

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then((r) => r.json())
      .then((data) => {
        const mapped = (data.categories || []).slice(0, 8).map((cat) => ({
          id: cat.idCategory,
          name: cat.strCategory,
          image: cat.strCategoryThumb,
        }));
        setCategories(mapped);
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  return (
    <div className='max-w-[1640px] m-auto px-4 py-12'>
      <h1 className='text-orange-600 font-bold text-4xl text-center'>
        Top Rated Menu Items
      </h1>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 py-6'>
        {categories.map((item, index) => (
          <div
            key={index}
            className='bg-gray-100 rounded-lg p-4 flex justify-between items-center'
          >
            <h2 className='font-bold sm:text-xl'>{item.name}</h2>
            <img src={item.image} alt={item.name} className='w-20' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;