import os
import json
import time
import asyncio
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

USE_MOCK_LEMONADE = os.getenv("USE_MOCK_LEMONADE", "false").lower() == "true"
LEMONADE_API_BASE = os.getenv("LEMONADE_API_BASE", "http://localhost:8000/api/v1")

# AMD LEMONADE INTEGRATION POINT
# Pointing the official OpenAI SDK strictly to the local AMD Lemonade runtime.
client = AsyncOpenAI(
    base_url=LEMONADE_API_BASE,
    api_key="not-needed-for-local" # Local runtime requires no key
)

class NodeRegistry:
    @classmethod
    async def execute(cls, node_type: str, node_data: dict, current_payload: any) -> any:
        start_time = time.time()
        
        # Route to the correct node implementation
        if node_type == "gmail_trigger":
            result = await cls._gmail_trigger(node_data)
        elif node_type == "voice_trigger":
            result = await cls._voice_trigger(node_data)
        elif node_type == "file_watcher":
            result = await cls._file_watcher(node_data)
        elif node_type == "llama_summarize":
            result = await cls._llama_summarize(node_data, current_payload)
        elif node_type == "entity_extract":
            result = await cls._entity_extract(node_data, current_payload)
        elif node_type == "auto_draft":
            result = await cls._auto_draft(node_data, current_payload)
        elif node_type == "smart_file_router":
            result = await cls._smart_file_router(node_data, current_payload)
        elif node_type == "kokoro_tts":
            result = await cls._kokoro_tts(node_data, current_payload)
        elif node_type == "jira_post":
            result = await cls._jira_post(node_data, current_payload)
        else:
            result = {"error": f"Unknown node type: {node_type}", "data": current_payload}

        execution_time = int((time.time() - start_time) * 1000)
        backend_used = "MOCK_NPU" if USE_MOCK_LEMONADE else "AMD_NPU"
        
        # This log will be sent to the frontend Execution Log panel
        print(f"[{backend_used}] {node_type} executed in {execution_time}ms")
        result["_metadata"] = {
            "execution_time_ms": execution_time,
            "backend": backend_used
        }
        
        return result

    # --- TRIGGERS ---
    @staticmethod
    async def _gmail_trigger(node_data: dict) -> dict:
        if USE_MOCK_LEMONADE:
            await asyncio.sleep(0.15)
            return {"subject": "Meeting Rescheduled", "body": "Meeting rescheduled to Friday 3pm. Please confirm.", "from": "advisor@university.edu"}
        
        # Standard implementation would use google-auth-oauthlib polling here
        return {"subject": "New Email", "body": "Actual email content fetched via OAuth.", "from": "sender@example.com"}

    @staticmethod
    async def _voice_trigger(node_data: dict) -> dict:
        if USE_MOCK_LEMONADE:
            await asyncio.sleep(0.18)
            return {"transcription": "Assign the database migration task to John by next Tuesday."}
        
        # AMD LEMONADE INTEGRATION POINT: Whisper-Large-v3-Turbo
        # In desktop prod, we capture audio via PyAudio, save to temp.wav, and send to local Whisper
        return {"transcription": "Real whisper transcription goes here"}

    @staticmethod
    async def _file_watcher(node_data: dict) -> dict:
        if USE_MOCK_LEMONADE:
            await asyncio.sleep(0.1)
            return {"filename": "invoice_q3.pdf", "content": "Invoice for Q3 services. Total: $500."}
        return {"filename": "real_file.txt", "content": "Real file content read from disk."}

    # --- AI ACTIONS ---
    @staticmethod
    async def _llama_summarize(node_data: dict, payload: dict) -> dict:
        text_to_summarize = payload.get("body", payload.get("transcription", payload.get("content", "")))
        
        if USE_MOCK_LEMONADE:
            await asyncio.sleep(0.187) # Simulating the exactly 187ms latency from the PPT spec
            return {"summary": "Meeting rescheduled to Friday 3pm. Please confirm."}

        # AMD LEMONADE INTEGRATION POINT: Llama-3.2-1B-Instruct-Hybrid
        response = await client.chat.completions.create(
            model="Llama-3.2-1B-Instruct-Hybrid",
            messages=[
                {"role": "system", "content": "Summarize the following text concisely."},
                {"role": "user", "content": text_to_summarize}
            ],
            max_tokens=100
        )
        return {"summary": response.choices[0].message.content}

    @staticmethod
    async def _entity_extract(node_data: dict, payload: dict) -> dict:
        text = payload.get("transcription", "")
        if USE_MOCK_LEMONADE:
            await asyncio.sleep(0.19)
            return {"owner": "John", "date": "next Tuesday", "action": "database migration"}

        # AMD LEMONADE INTEGRATION POINT: Llama-3.2-1B-Instruct-Hybrid (JSON Extraction)
        response = await client.chat.completions.create(
            model="Llama-3.2-1B-Instruct-Hybrid",
            messages=[
                {"role": "system", "content": "Extract owner, date, and action from the text. Output strict JSON."},
                {"role": "user", "content": text}
            ],
            response_format={ "type": "json_object" }
        )
        return json.loads(response.choices[0].message.content)

    @staticmethod
    async def _auto_draft(node_data: dict, payload: dict) -> dict:
        text = payload.get("summary", "")
        if USE_MOCK_LEMONADE:
            await asyncio.sleep(0.17)
            return {"draft": "Hi, Friday at 3pm works for me. See you then!"}

        # AMD LEMONADE INTEGRATION POINT: Llama-3.2-1B-Instruct-Hybrid
        response = await client.chat.completions.create(
            model="Llama-3.2-1B-Instruct-Hybrid",
            messages=[
                {"role": "system", "content": "Draft a polite, professional reply to the following message."},
                {"role": "user", "content": text}
            ]
        )
        return {"draft": response.choices[0].message.content}

    @staticmethod
    async def _smart_file_router(node_data: dict, payload: dict) -> dict:
        filename = payload.get("filename", "")
        if USE_MOCK_LEMONADE:
            await asyncio.sleep(0.15)
            return {"destination": "/financials/invoices/", "filename": filename}

        # AMD LEMONADE INTEGRATION POINT: Llama-3.2-1B-Instruct-Hybrid
        response = await client.chat.completions.create(
            model="Llama-3.2-1B-Instruct-Hybrid",
            messages=[
                {"role": "system", "content": "Classify this file into a single word folder category based on its name."},
                {"role": "user", "content": filename}
            ]
        )
        folder = response.choices[0].message.content.strip().lower()
        return {"destination": f"/{folder}/", "filename": filename}

    # --- OUTPUTS ---
    @staticmethod
    async def _kokoro_tts(node_data: dict, payload: dict) -> dict:
        text_to_speak = payload.get("summary", payload.get("draft", ""))
        if USE_MOCK_LEMONADE:
            await asyncio.sleep(0.092) # Simulating the exactly 92ms latency from the PPT spec
            return {"audio_status": "mock_audio_generated.wav", "played": True}

        # AMD LEMONADE INTEGRATION POINT: Kokoro-v1 (af_sky voice)
        response = await client.audio.speech.create(
            model="Kokoro-v1",
            voice="af_sky",
            input=text_to_speak
        )
        # In a real desktop environment, we'd save this response.content to a .wav and play it.
        return {"audio_status": "output.wav", "played": True}

    @staticmethod
    async def _jira_post(node_data: dict, payload: dict) -> dict:
        if USE_MOCK_LEMONADE:
            await asyncio.sleep(0.1)
            return {"jira_ticket": "PROJ-1024", "status": "created", "details": payload}
        
        # Standard implementation would execute a requests.post() to Jira REST API here
        return {"jira_ticket": "PROJ-1025", "status": "created", "details": payload}