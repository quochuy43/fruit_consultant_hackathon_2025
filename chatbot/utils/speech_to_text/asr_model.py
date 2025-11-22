from transformers import pipeline
import torch
import logging

logging.getLogger("transformers").setLevel(logging.ERROR)

asr_pipe = None  # global singleton

def load_asr_model():
    global asr_pipe
    if asr_pipe is None:
        print("🔄 Loading Whisper ASR model...")  # log khởi động
        asr_pipe = pipeline(
            "automatic-speech-recognition",
            model="utils/speech_to_text/whisper_base_durian",
            tokenizer="utils/speech_to_text/whisper_base_durian",
            device=0 if torch.cuda.is_available() else -1,
            model_kwargs={"torch_dtype": torch.float16}
        )
        print("✅ Whisper ASR Model loaded!")
    return asr_pipe

def speech_to_text(audio_path: str) -> str:
    pipe = load_asr_model()   # lấy model đang ở memory
    result = pipe(
        audio_path,
        return_timestamps=False,
        generate_kwargs={"language": "vi", "task": "transcribe"}
    )
    return result["text"]

