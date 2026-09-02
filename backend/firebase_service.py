import os
import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import HTTPException

# make sure Firebase is initialized before accessing the database
def get_firestore_db():
    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if not service_account_path:
        raise HTTPException(status_code=500, detail="Missing Firebase service account path")

    if not firebase_admin._apps:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)

    return firestore.client()


# code for toggling user favorites: 
def toggle_favorite(user_id: str, food: dict) -> list:
    #code here to grab existing favorites for the user
    db = get_firestore_db()
    favorite_ref = db.collection("favorites").document(user_id)
    favorite_doc = favorite_ref.get()

    favorites = []
    if favorite_doc.exists:
        favorites = favorite_doc.to_dict().get("items", []) if favorite_doc.to_dict() else []

    # Code here to add the food to favorites or remove it if already favorited
    food_id = food.get("id")
    already_favorited = any(item.get("id") == food_id for item in favorites)

    if already_favorited:
        favorites = [item for item in favorites if item.get("id") != food_id]
    else:
        favorites.append(food)

    favorite_ref.set({"items": favorites})
    return favorites
