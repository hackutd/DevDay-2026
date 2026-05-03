import React, { createContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './AuthContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();

  //Favorites (Firestore when logged in)
  const [favorites, setFavorites] = useState([]);

  // Load favorites from Firestore whenever the logged-in user changes
  useEffect(() => {
    if (!currentUser) {
      setFavorites([]); // Logged out → clear favorites from UI
      return;
    }

    async function loadFavorites() {
      const snap = await getDoc(doc(db, 'favorites', currentUser.uid));
      if (snap.exists()) {
        setFavorites(snap.data().items || []);
      } else {
        setFavorites([]); // First time this user logs in — no favorites yet
      }
    }

    loadFavorites();
  }, [currentUser]);

  // Write the updated favorites array back to Firestore
  const saveFavoritesToFirestore = useCallback(async (updatedFavorites) => {
    if (!currentUser) return;
    await setDoc(doc(db, 'favorites', currentUser.uid), {
      items: updatedFavorites,
    });
  }, [currentUser]);

  //toggleFavorite

  // Toasts

  return (
    <AppContext.Provider value={{
      favorites
    }}>
      {children}
    </AppContext.Provider>
  );
};