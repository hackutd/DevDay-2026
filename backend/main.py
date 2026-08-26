# import some important libraries
import os

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from google import genai
from pydantic import BaseModel, Field

load_dotenv() 

# define some of our constants
GEMINI_MODEL = "gemini-3.5-flash-lite"
ELEVENLABS_MODEL = "eleven_multilingual_v2"
ELEVENLABS_STT_MODEL = "scribe_v2"

# creates our fast api app 
app = FastAPI(title="Chef Voice Backend")

# need this so our frontend and backend can talk to each other
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# our request model for the /chef/voice endpoint
class VoiceRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)


# helper function to generate a chef-like reply using Gemini API
def make_chef_reply(user_text: str, gemini_api_key: str) -> str:
    prompt = (
        "You are a minion, a tiny, silly, high-energy chef helper with a playful banana-loving cartoon vibe. "
        "Always be very concise: answer in 1 to 2 short sentences max. "
        "Focus on practical cooking help. "
        "Use simple words, light humor, and occasional goofy expressions like 'ta-da' or 'oopsie'. "
        "Do not use markdown, lists, or long explanations. "
        f"User: {user_text}"
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

    return reply_text

# function to make audio from the chef reply using ElevenLabs API
def make_audio(reply_text: str, elevenlabs_api_key: str, voice_id: str) -> bytes:
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

    return elevenlabs_response.content


#function to transcribe audio using ElevenLabs API

def transcribe_audio(file: UploadFile, elevenlabs_api_key: str) -> str:
    audio_bytes = file.file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty")

    stt_response = requests.post(
        "https://api.elevenlabs.io/v1/speech-to-text",
        headers={"xi-api-key": elevenlabs_api_key},
        files={
            "file": (
                file.filename or "recording.webm",
                audio_bytes,
                file.content_type or "audio/webm",
            )
        },
        data={"model_id": ELEVENLABS_STT_MODEL},
        timeout=300,
    )

    if stt_response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"ElevenLabs transcription failed: {stt_response.text}",
        )

    transcript = stt_response.json().get("text", "").strip()
    if not transcript:
        raise HTTPException(status_code=502, detail="ElevenLabs returned no transcript")

    return transcript


# to test if our backend is running
@app.get("/health")
def health():
    return {"status": "ok"}


# endpoint to generate chef-like voice from text
@app.post("/chef/voice")
def create_chef_voice(request: VoiceRequest):
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
    voice_id = os.getenv("ELEVENLABS_VOICE_ID")

    # if missing some of our API keys, return an error
    if not gemini_api_key:
        raise HTTPException(status_code=500, detail="Missing Gemini API key")
    if not elevenlabs_api_key or not voice_id:
        raise HTTPException(status_code=500, detail="Missing ElevenLabs API key or voice ID")

    # call our helper functions to get our audio response
    reply_text = make_chef_reply(request.text, gemini_api_key)
    audio_bytes = make_audio(reply_text, elevenlabs_api_key, voice_id)

    # return the audio bytes
    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
    )


# to generate a chef-like voice from an audio file
@app.post("/chef/voice/audio")
def create_chef_voice_from_audio(file: UploadFile = File(...)):
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
    voice_id = os.getenv("ELEVENLABS_VOICE_ID")

    # if missing some of our API keys, return an error
    if not gemini_api_key:
        raise HTTPException(status_code=500, detail="Missing Gemini API key")
    if not elevenlabs_api_key or not voice_id:
        raise HTTPException(status_code=500, detail="Missing ElevenLabs API key or voice ID")

    # call our helper functions
    transcript = transcribe_audio(file, elevenlabs_api_key)
    reply_text = make_chef_reply(transcript, gemini_api_key)
    audio_bytes = make_audio(reply_text, elevenlabs_api_key, voice_id)

    # return our audio
    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
    )
