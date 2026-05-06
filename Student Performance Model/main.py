from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import uvicorn
import shutil
import os
from PIL import Image
import pytesseract
import io
import traceback
import tempfile


from cgpa_predictor import predict_cgpa
from notes_analyzer import analyze_student_notes
from voice_analyzer import analyze_voice


tess_path = shutil.which("tesseract")
if not tess_path and os.name == "nt":
    default_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if os.path.exists(default_path):
        tess_path = default_path

if tess_path:
    pytesseract.pytesseract.tesseract_cmd = tess_path
    try:
        print("Tesseract detected at:", tess_path, "version:", pytesseract.get_tesseract_version())
    except Exception as e:
        print("Tesseract detected but version check failed:", e)
else:
    print("ERROR: Tesseract not found! Please install or set PATH.")

app = FastAPI(
    title="Holistic Student Profiler API",
    description="API for predicting CGPA, analyzing notes, and voice sentiment.",
    version="1.0.0"
)


class StudentCGPAInput(BaseModel):
    Previous_Semester_GPA: float
    Midterm_Score_Average: float
    Assignment_Score_Average: float
    Twelfth_Grade_Percentage: float
    Study_Hours_Per_Day: float
    Tenth_Grade_Percentage: float
    Attendance_Percentage: float
    Number_of_Backlogs: int
    Mental_Stress_Score: int
    Distance_From_Campus_KM: float

@app.get("/")
def root():
    return {"message": "Student Profiler API is running. Go to /docs for the interface."}

@app.post("/predict-cgpa")
def api_predict_cgpa(data: StudentCGPAInput):
    try:
        prediction = predict_cgpa(data.dict())
        if prediction >= 8.5:
            status = "Excellent Potential"
        elif prediction >= 7.0:
            status = "Solid Academic Path"
        else:
            status = "Needs Support"

        return {"predicted_cgpa": round(prediction, 2), "academic_status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-notes")
async def api_analyze_notes(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        result = analyze_student_notes(image)

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/analyze-voice")
async def api_analyze_voice(file: UploadFile = File(...)):
    temp_filename = ""
    try:
        safe_name = file.filename.replace(" ", "_").replace("-", "_")
        with tempfile.NamedTemporaryFile(delete=False, prefix="voice_", suffix=f"_{safe_name}") as tmp:
            temp_filename = tmp.name
            shutil.copyfileobj(file.file, tmp)

        print("Saved temp audio file as:", temp_filename)
        result = analyze_voice(temp_filename)

        if os.path.exists(temp_filename):
            os.remove(temp_filename)

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return result
    except HTTPException:
        raise
    except Exception as e:
        if temp_filename and os.path.exists(temp_filename):
            os.remove(temp_filename)
        print("\n\n🔥 PYTHON BACKEND ERROR 🔥")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
@app.post("/analyze-student-full")
async def analyze_full_student(
    cgpa_data: StudentCGPAInput,
    notes_file: UploadFile = File(...),
    voice_file: UploadFile = File(...)
):
    try:
        predicted_cgpa = predict_cgpa(cgpa_data.dict())

        profile_summary = ""
        recommendations = []

        if predicted_cgpa >= 8.5:
            profile_summary += (
                f"Academically, the student shows **excellent potential** "
                f"(predicted CGPA: {predicted_cgpa:.2f}). "
            )
        elif 7.0 <= predicted_cgpa < 8.5:
            profile_summary += (
                f"The student is on a **solid academic path** "
                f"(predicted CGPA: {predicted_cgpa:.2f}). "
            )
        else:
            profile_summary += (
                f"The student may need **focused academic support** "
                f"(predicted CGPA: {predicted_cgpa:.2f}). "
            )
            recommendations.append("Consider extra tutoring for key subjects.")


        notes_bytes = await notes_file.read()
        notes_image = Image.open(io.BytesIO(notes_bytes)).convert("RGB")

        notes_analysis = analyze_student_notes(notes_image)

        if "error" not in notes_analysis:
            clarity = float(notes_analysis.get("focus_clarity_score", 0))
            if clarity > 7:
                profile_summary += (
                    "Their notes show **high handwriting clarity**, indicating good organization. "
                )
            elif clarity < 5:
                profile_summary += (
                    "Handwriting clarity is low, which can affect revision efficiency. "
                )
                recommendations.append("Practice handwriting exercises to improve legibility.")


        safe_name = voice_file.filename.replace(" ", "_")
        with tempfile.NamedTemporaryFile(delete=False, prefix="voice_", suffix=safe_name) as tmp:
            temp_voice = tmp.name
            shutil.copyfileobj(voice_file.file, tmp)

        voice_analysis = analyze_voice(temp_voice)

        if os.path.exists(temp_voice):
            os.remove(temp_voice)

        if "error" not in voice_analysis:
            confidence = voice_analysis.get("Confidence Score", 0)
            energy = voice_analysis.get("Energy & Engagement Score", 0)

            if confidence > 7 and energy > 6:
                profile_summary += (
                    "Their vocal tone indicates **high confidence and engagement**. "
                )
            elif confidence < 5:
                profile_summary += (
                    "Vocal cues show signs of low confidence. "
                )
                recommendations.append(
                    "Practice small presentations to build confidence."
                )

        return {
            "predicted_cgpa": round(predicted_cgpa, 2),
            "notes_analysis": notes_analysis,
            "voice_analysis": voice_analysis,
            "profile_summary": profile_summary.strip(),
            "recommendations": recommendations
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/health')
def health_check():
    # Basic health check: model presence and tesseract availability
    model_exists = False
    try:
        from cgpa_predictor import MODEL_PATH
        model_exists = os.path.exists(MODEL_PATH)
    except Exception:
        model_exists = False

    tess = shutil.which("tesseract") is not None

    status = {
        "model_present": model_exists,
        "tesseract_present": tess,
        "ok": model_exists
    }
    return status

if __name__ == "__main__":
    import os
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on http://0.0.0.0:{port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)