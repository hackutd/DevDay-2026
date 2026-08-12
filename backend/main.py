import os

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

load_dotenv()

GEMINI_MODEL = "gemini-1.5-flash"
ELEVENLABS_MODEL = "eleven_multilingual_v2"

app = FastAPI(title="Chef Voice Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VoiceRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chef/voice")
def create_chef_voice(request: VoiceRequest):
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
    voice_id = os.getenv("ELEVENLABS_VOICE_ID")

    if not gemini_api_key or not elevenlabs_api_key or not voice_id:
        raise HTTPException(status_code=500, detail="Missing API key or voice ID")

    gemini_url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={gemini_api_key}"
    )

    prompt = (
        "You are a friendly chef voice assistant. "
        "Answer conversationally, keep it short, and focus on cooking help. "
        "Do not use markdown. "
        f"User: {request.text}"
    )

    gemini_response = requests.post(
        gemini_url,
        json={
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt,
                        }
                    ]
                }
            ]
        },
        timeout=30,
    )

    if gemini_response.status_code != 200:
        raise HTTPException(status_code=502, detail="Gemini request failed")

    data = gemini_response.json()
    try:
        reply_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except (KeyError, IndexError, TypeError):
        raise HTTPException(status_code=502, detail="Gemini returned an invalid response")

    if not reply_text:
        raise HTTPException(status_code=502, detail="Gemini returned no text")

    elevenlabs_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    elevenlabs_response = requests.post(
        elevenlabs_url,
        headers={
            "xi-api-key": elevenlabs_api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json={
            "text": reply_text,
            "model_id": ELEVENLABS_MODEL,
        },
        timeout=30,
    )

    if elevenlabs_response.status_code != 200:
        raise HTTPException(status_code=502, detail="ElevenLabs audio generation failed")

    return Response(
        content=elevenlabs_response.content,
        media_type="audio/mpeg",
    )
