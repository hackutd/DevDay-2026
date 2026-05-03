import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>{
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return <p>Loading...</p>;
  
  return (
    <AuthContext.Provider value = {{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  return useContext(AuthContext);
}
