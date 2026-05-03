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
    <div>
    </div>
  );
};

export default Category;