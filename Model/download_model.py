import os
import requests

MODEL_URL = os.environ.get("MODEL_URL")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "cgpa_model2.pkl")

def download_model():
    if os.path.exists(MODEL_PATH):
        print("Model already exists at", MODEL_PATH)
        return True
    if not MODEL_URL:
        print("No MODEL_URL provided; skipping model download. Ensure model exists in the repo or set MODEL_URL.")
        return False
    print("Downloading model from:", MODEL_URL)
    try:
        r = requests.get(MODEL_URL, stream=True, timeout=60)
        r.raise_for_status()
        with open(MODEL_PATH, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        print("Model downloaded to", MODEL_PATH)
        return True
    except Exception as e:
        print("Failed to download model:", e)
        return False

if __name__ == "__main__":
    download_model()
