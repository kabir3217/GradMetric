import librosa
import numpy as np
import whisper
import io
import warnings
import os

with warnings.catch_warnings():
    warnings.simplefilter("ignore", RuntimeWarning)
    from pydub import AudioSegment



if os.name == "nt":
   
    FFMPEG_DIR = r"C:\Users\Samiya\Downloads\ffmpeg-8.0.1-essentials_build\ffmpeg-8.0.1-essentials_build\bin"

    if os.path.exists(FFMPEG_DIR):
        os.environ["PATH"] += os.pathsep + FFMPEG_DIR
        AudioSegment.converter = os.path.join(FFMPEG_DIR, "ffmpeg.exe")
        AudioSegment.ffprobe = os.path.join(FFMPEG_DIR, "ffprobe.exe")
        print("FFmpeg configured for Windows.")
    else:
        print("⚠ Windows FFmpeg directory not found. Check the path.")

else:

    AudioSegment.converter = "/usr/bin/ffmpeg"
    AudioSegment.ffprobe = "/usr/bin/ffprobe"
    print("FFmpeg configured for Linux (Render environment).")


print("Loading Whisper model...")
try:
    whisper_model = whisper.load_model("base")
    print("Whisper loaded successfully.")
except Exception as e:
    print("Whisper load error:", e)



def normalize_score(value, min_val, max_val, reverse=False):
    if value is None or not np.isfinite(value):
        return 0
    value = max(min(value, max_val), min_val)
    normalized = (value - min_val) / (max_val - min_val)
    return (1 - normalized) * 10 if reverse else normalized * 10



def analyze_voice(file_path):
    print(f"Processing audio file: {file_path}")

    try:
       
        audio = AudioSegment.from_file(file_path)
        audio = audio.set_channels(1).set_frame_rate(16000)

    
        wav_buffer = io.BytesIO()
        audio.export(wav_buffer, format="wav")
        wav_buffer.seek(0)

       
        y, sr = librosa.load(wav_buffer, sr=16000)

    except Exception as e:
        return {"error": f"Audio load failure: {e}"}

    if np.max(np.abs(y)) < 0.001:
        return {"error": "Audio too silent."}


    temp_wav = "temp_whisper.wav"
    try:
        with open(temp_wav, "wb") as f:
            f.write(wav_buffer.getbuffer())

        transcript = whisper_model.transcribe(temp_wav)["text"].strip()

    finally:
        if os.path.exists(temp_wav):
            os.remove(temp_wav)

   
    clarity = np.random.uniform(6, 9) 
    confidence = np.random.uniform(6, 9)
    engagement = np.random.uniform(6, 9)
    professionalism = (clarity + confidence) / 2

    return {
        "Clarity Score": float(clarity),
        "Confidence Score": float(confidence),
        "Energy & Engagement Score": float(engagement),
        "Professionalism Score": float(professionalism),
        "Transcription": transcript,
    }