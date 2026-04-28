// firebase/firebase.js
// ─────────────────────────────────────────────
// Boots up the Firebase connection.
// This file runs once. Every other file imports auth and db from here.
//
// Keys come from .env — never paste them directly in code.
// ─────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Put keys here!
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
