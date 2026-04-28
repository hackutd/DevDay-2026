// contexts/AuthContext.jsx
// ─────────────────────────────────────────────
// Runs once when the app loads.
// Asks Firebase "is there a logged-in user?" and keeps the
// answer available to every component via useAuth().
//
// Without this, every component would need to check auth separately.
// ─────────────────────────────────────────────
/*delete this section
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext(null);
*/
export function AuthProvider({ children }) {
  /*delete this section
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);
*/
  useEffect(() => {
    /*delete this section
    // Firebase calls this any time the user signs in or out
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    */

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, []);

  if (loading) return <p>Loading...</p>;
  /*delete this section
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
  */
}
  

// useAuth() is how any component gets the current user
// Example: const { currentUser } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
