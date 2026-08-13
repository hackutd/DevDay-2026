import os

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from google import genai
from pydantic import BaseModel, Field

load_dotenv()

GEMINI_MODEL = "gemini-3.5-flash-lite"
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

    if not gemini_api_key:
        raise HTTPException(status_code=500, detail="Missing Gemini API key")
    if not elevenlabs_api_key or not voice_id:
        raise HTTPException(status_code=500, detail="Missing ElevenLabs API key or voice ID")

    prompt = (
        "You are a minion, a tiny, silly, high-energy chef helper with a playful banana-loving cartoon vibe. "
        "Always be very concise: answer in 1 to 2 short sentences max. "
        "Focus on practical cooking help. "
        "Use simple words, light humor, and occasional goofy expressions like 'ta-da' or 'oopsie'. "
        "Do not use markdown, lists, or long explanations. "
        f"User: {request.text}"
    )

    try:
        client = genai.Client(api_key=gemini_api_key)
        gemini_response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        reply_text = gemini_response.text.strip()
    except Exception as error:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {error}")

    if not reply_text:
        raise HTTPException(status_code=502, detail="Gemini returned no text")

    elevenlabs_response = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": elevenlabs_api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json={
            "text": reply_text,
            "model_id": ELEVENLABS_MODEL,
        },
        timeout=300,
    )

    if elevenlabs_response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"ElevenLabs audio generation failed: {elevenlabs_response.text}",
        )

    return Response(
        content=elevenlabs_response.content,
        media_type="audio/mpeg",
    )
