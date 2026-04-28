// firebase/auth.js
// ─────────────────────────────────────────────
// Three functions. That's it.
// Firebase handles everything else — hashing, tokens, sessions.
// ─────────────────────────────────────────────
//delete this entire file
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

export const registerUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);
