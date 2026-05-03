// contexts/AuthContext.jsx
// ─────────────────────────────────────────────
// Runs once when the app loads.
// Asks Firebase "is there a logged-in user?" and keeps the
// answer available to every component via useAuth().
//
// Without this, every component would need to check auth separately.
// ─────────────────────────────────────────────

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    // Firebase calls this any time the user signs in or out
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth() is how any component gets the current user
// Example: const { currentUser } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
