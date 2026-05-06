Render deployment notes
-----------------------

This folder contains the backend (FastAPI) and the files needed to deploy to Render using Docker.

Files added for Render:
- Dockerfile: builds Python image, installs system deps (tesseract, ffmpeg) and Python requirements.
- requirements.txt: Python dependencies used by the app.
- .dockerignore: keep image small.
- render.yaml: top-level Render config referencing this folder as the docker context (placed at repo root).

Environment variables to set in Render (Service > Environment > Environment Variables):
- PORT=8000
- MONGODB_URI (if the API needs DB access)
- any other secrets used by your application (JWT_SECRET, etc.)

Model artifact:
- Ensure `cgpa_model2.pkl` is committed to this folder or uploaded to a storage service the service can access (S3, Render File or startup script to download the model). If you prefer not to commit the binary to git, add a startup step to pull the model from a secure location.

Notes on Tesseract and audio libraries:
- The Dockerfile installs `tesseract-ocr` system package and `opencv-python-headless` for image processing.
- `ffmpeg` is included for audio processing (librosa/soundfile).

After pushing to your repo, Deploy the `render.yaml` via Render dashboard or `render` CLI. The service will build the Docker image using this folder as context.
