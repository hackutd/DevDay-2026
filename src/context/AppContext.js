import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Favorites State
  const [favorites, setFavorites] = useState(() => {
    try {
      const localData = localStorage.getItem('foodAppFavorites');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error reading localStorage", error);
      return [];
    }
  });

  // 2. Cart State
  const [cart, setCart] = useState([]);

  // 3. Toasts State
  const [toasts, setToasts] = useState([]);

  // Effects
  useEffect(() => {
    localStorage.setItem('foodAppFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Helpers
  const addToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const toggleFavorite = (food) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === food.id || f.name === food.name);
      if (exists) {
        addToast(`Removed ${food.name} from Favorites`);
        return prev.filter(f => f.name !== food.name);
      } else {
        addToast(`❤️ Added ${food.name} to Favorites!`);
        return [...prev, food];
      }
    });
  };

  const addToCart = (food) => {
    setCart(prev => [...prev, food]);
    addToast(`🛒 Added ${food.name} to Cart`);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <AppContext.Provider value={{ 
      favorites, toggleFavorite, 
      cart, addToCart, removeFromCart,
      toasts 
    }}>
      {children}
    </AppContext.Provider>
  );
};
