# Connecting a Backend (Firebase)

## What is a Backend?

The backend is the part of the app users don't see — but it's what makes everything real.

### Key Responsibilities

* **Data Storage** — Saves user data so it persists between sessions
* **Authentication** — Knows who you are
* **APIs** — Lets your app talk to external data sources
* **Security** — Controls who can access what

### Analogy

Think of a restaurant:

* Frontend = dining area (what you see)
* Backend = kitchen (where everything actually happens)

---

## What is Firebase?

Firebase is a Backend-as-a-Service (BaaS) — a backend you don't have to build yourself.

### What it gives you

* **Firestore** — a real-time cloud database
* **Authentication** — handles login/register securely
* **Hosting** — deploy your app in one command
* No servers to manage

---

## Setting Up Firebase

### Step 1: Create a Project

* Go to [Firebase Console](https://console.firebase.google.com)
* Click **"Add Project"** → give it a name → disable Analytics

### Step 2: Register Your Web App

* Click the **`</>`** icon
* Copy the config object it gives you

### Step 3: Set Up Firestore

* Click **Firestore Database → Create Database**
* Choose **Test Mode** (for dev day)
* Click through the location prompt

### Step 4: Enable Authentication

* Click **Authentication → Get Started**
* Enable **Email/Password**

---

## Firebase Configuration

```javascript
// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth }       from "firebase/auth";
import { getFirestore }  from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ... rest of the keys from your .env
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
```

### Why environment variables?

* API keys are secrets — never put them directly in code
* `.env` file stays off GitHub (it's in `.gitignore`)
* `REACT_APP_` prefix is required by Create React App

---

---

# User Authentication

## What is Authentication?

Authentication answers one question: **who is this person?**

### What it lets users do

* Register an account
* Log in
* Stay logged in (Firebase remembers them)
* Log out

---

## The Core Functions

Three lines. Firebase does everything else.

```javascript
// src/firebase/auth.js
createUserWithEmailAndPassword(auth, email, password) // Register
signInWithEmailAndPassword(auth, email, password)     // Login
signOut(auth)                                         // Logout
```

Firebase handles: password hashing, tokens, session management, security.

---

## Auth Context (The Big Idea)

Without Auth Context, every component would need to ask Firebase "is anyone logged in?" separately.

Instead, we ask **once** at the top of the app and share the answer everywhere.

```javascript
// src/contexts/AuthContext.jsx
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Firebase calls this any time the user signs in or out
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### How any component reads the user

```javascript
const { currentUser } = useAuth();
// currentUser.uid   ← unique ID for this user
// currentUser.email ← their email
// currentUser       ← null if not logged in
```

---

## Auth Flow

1. User enters email + password on `/login`
2. `loginUser()` calls Firebase
3. Firebase verifies credentials and returns a user object
4. `onAuthStateChanged` fires → `currentUser` updates everywhere
5. Navbar shows email + "Logout" button

---

## Key Takeaways

* Firebase handles auth securely — don't try to build this yourself
* Auth Context shares user state across the whole app
* `currentUser` is `null` when no one is logged in — always check for this

---

---

# Connecting an API

## What is an API?

An API is how two applications talk to each other.

### Analogy

* You = your app
* Restaurant Kitchen = external data server
* Waiter = API

You tell the waiter what you want → the kitchen makes it → the waiter brings it back.

---

## This App: MealDB API

MealDB gives us:

* Food details and ingredients by name
* Dietary category filters (Vegan, Vegetarian, Seafood)
* Ingredient images

No API key needed for the free tier.

---

## Fetching Data

```javascript
const response = await fetch(
  `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`
);
const apiData = await response.json();
```

---

## Key Concepts

### async / await

Code that "waits" for data before continuing.
Without it, you'd try to display data before it arrives.

```javascript
// Wrong — data isn't there yet
const data = fetch(url);         // returns a Promise, not data

// Right — wait for it
const response = await fetch(url);
const data = await response.json();
```

### try / catch

Handles errors safely — network issues, bad responses, typos.

```javascript
try {
  const response = await fetch(url);
  const data = await response.json();
  // use data here
} catch (error) {
  console.error("Something went wrong:", error);
}
```

---

## Example Flow (Food.jsx)

1. User clicks a food card
2. `fetchFoodDetails()` runs
3. Fetch request sent to MealDB with the food name
4. Response comes back with ingredients + nutrition
5. `setFoodDetails(...)` updates React state
6. UI re-renders with real data

---

## Key Takeaways

* `async/await` lets you write async code that reads like normal code
* Always wrap API calls in `try/catch`
* Never expose API keys in code — use `.env`

---

---

# CRUD Using Firestore

## What is CRUD?

Every real app needs to do four things to data:

* **Create** → Save something new
* **Read** → Fetch it back
* **Update** → Change it
* **Delete** → Remove it

---

## This App: Saving Favorites to Firestore

Old approach: `localStorage` — data lives in the browser only. Refresh on another device? Gone.

New approach: **Firestore** — data lives in the cloud. Works everywhere, forever.

---

## Firestore Data Structure

```
favorites/                  ← collection
  {userId}/                 ← one document per user (keyed by their UID)
    items: [                ← array of favorited foods
      { id, name, image, price, category },
      ...
    ]
```

One document per user. UID is the document ID.

---

## Read — Load Favorites

```javascript
// Runs when the user logs in
const snap = await getDoc(doc(db, "favorites", currentUser.uid));
if (snap.exists()) {
  setFavorites(snap.data().items || []);
}
```

---

## Create / Update — Save Favorites

```javascript
// When the user clicks ❤️ — overwrite the whole items array
await setDoc(doc(db, "favorites", currentUser.uid), {
  items: updatedFavorites,
});
```

We read the current list, add or remove the item, then write the whole thing back.

---

## The "It's Alive" Moment

1. Log in → click ❤️ on a food card
2. Open **Firebase Console → Firestore → Data**
3. Find `favorites → your UID → items`
4. **It's there.** In the cloud. In real time.
5. Refresh the page → still there
6. Open another browser → still there

That's the difference between localStorage and a real backend.

---

## What Happens If You're Not Logged In?

```javascript
if (!currentUser) {
  addToast("🔒 Log in to save favorites!");
  return;
}
```

No user → no UID → can't write to Firestore.
The app gracefully tells the user instead of crashing.

---

## Firestore Security Rules

Controls who can read/write what. Without rules, anyone can access any document.

```
match /favorites/{userId} {
  allow read, write: if request.auth != null
                     && request.auth.uid == userId;
}
```

Translation: **"You can only touch your own document."**

---

## Key Takeaways

* CRUD is the backbone of every real app
* Firestore replaces localStorage with cloud persistence
* Auth + Firestore together = data that belongs to a specific person
* Security rules are what make this safe

---

## What Students Should Be Able to Answer

* Why do we use environment variables instead of pasting keys directly?
* What does Firebase Auth give you that you couldn't build in an afternoon?
* Why do we wrap API calls in `try/catch`?
* What does Firestore actually look like — what's stored and where?
* How does every component know who's logged in without asking Firebase each time?
