// utils/SearchHistoryService.js
// ─────────────────────────────────────────────
// Saves and retrieves a user's food search history in Firestore.
//
// Firestore structure:
//   searchHistory/          ← collection
//     {uid}/                ← one document per user (keyed by their UID)
//       searches: [         ← array of search records
//         {
//           query:      "banana",
//           searchedAt: Timestamp,
//           topResult:  { fdcId, description, nutrients }
//         },
//         ...
//       ]
// ─────────────────────────────────────────────

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const histRef = (uid) => doc(db, "searchHistory", uid);

// ─────────────────────────────────────────────
// READ — get all past searches for a user
// ─────────────────────────────────────────────
export async function getSearchHistory(uid) {
  try {
    const snap = await getDoc(histRef(uid));
    if (!snap.exists()) return { data: [], error: null };

    // Return newest first
    const searches = snap.data().searches || [];
    return { data: [...searches].reverse(), error: null };
  } catch (err) {
    return { data: [], error: "Could not load search history." };
  }
}

// ─────────────────────────────────────────────
// WRITE — save a search result to history
// query:     the string the user searched
// topResult: the first food item returned (fdcId, description, nutrients)
// ─────────────────────────────────────────────
export async function saveSearchToHistory(uid, query, topResult) {
  const record = {
    query,
    searchedAt: new Date().toISOString(), // ISO string — easier to display than Firestore Timestamp
    topResult: {
      fdcId:       topResult.fdcId,
      description: topResult.description,
      nutrients:   topResult.nutrients,
    },
  };

  try {
    const snap = await getDoc(histRef(uid));

    if (!snap.exists()) {
      // First search — create the document
      await setDoc(histRef(uid), { searches: [record] });
    } else {
      // Append to existing array
      // Note: arrayUnion won't work here because objects with timestamps
      // won't match — we use updateDoc + arrayUnion with the full record
      await updateDoc(histRef(uid), {
        searches: arrayUnion(record),
      });
    }

    return { error: null };
  } catch (err) {
    return { error: "Could not save search." };
  }
}

// ─────────────────────────────────────────────
// DELETE — clear all search history for a user
// ─────────────────────────────────────────────
export async function clearSearchHistory(uid) {
  try {
    await setDoc(histRef(uid), { searches: [] });
    return { error: null };
  } catch (err) {
    return { error: "Could not clear history." };
  }
}
