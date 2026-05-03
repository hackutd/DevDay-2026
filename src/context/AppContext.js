import React, { createContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './AuthContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // ─── Favorites (Firestore when logged in) ────────────────────────────────
  const [favorites, setFavorites] = useState([]);

  // Load favorites from Firestore whenever the logged-in user changes
  useEffect(() => {
    // write your code here!
    }

    // create your function here!

    loadFavorites();
  }, [currentUser]);

  
  // create your function here as well! (Reference slides for help)

  const toggleFavorite = (food) => {
    // Must be logged in to save favorites
    if (!currentUser) {
      addToast('🔒 Log in to save favorites!');
      return;
    }

    
    setFavorites((prev) => {
      // Write your code here!
      if (exists) {
      // here as well!
      } else {
        // and here too
        addToast(`❤️ Added ${food.name} to Favorites!`);
      }
      // write your code here as well!
    }); 
  };

  // ─── Cart (local state only) ──────────────────────────────────────────────
  const [cart, setCart] = useState([]);

  const addToCart = (food) => {
    setCart((prev) => [...prev, food]);
    addToast(`🛒 Added ${food.name} to Cart`);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Toasts ───────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <AppContext.Provider value={{
      favorites, toggleFavorite,
      cart, addToCart, removeFromCart,
      toasts,
    }}>
      {children}
    </AppContext.Provider>
  );
};
