try:
    import cv2
    CV2_AVAILABLE = True
except Exception:
    cv2 = None
    CV2_AVAILABLE = False

import pytesseract
from PIL import Image
import numpy as np
import platform
import os


system_os = platform.system()

if system_os == "Windows":
    win_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if os.path.exists(win_path):
        pytesseract.pytesseract.tesseract_cmd = win_path
    else:
        print("⚠ Tesseract not found at Windows path:", win_path)

elif system_os == "Linux":
    pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"

elif system_os == "Darwin":  
    pytesseract.pytesseract.tesseract_cmd = "/opt/homebrew/bin/tesseract"

try:
   
    ver = pytesseract.get_tesseract_version()
except Exception:
    print("--- TESSERACT NOT FOUND ---")
    print("Install Tesseract or check your system PATH.")


def correct_skew(image: np.ndarray):
    """
    Detects and corrects the skew of the image.
    """
    if not CV2_AVAILABLE:
        # Shouldn't be called when cv2 is missing, but guard anyway
        raise RuntimeError("OpenCV (cv2) is not available")
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bitwise_not(gray)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

    coords = np.column_stack(np.where(thresh > 0))
    angle = cv2.minAreaRect(coords)[-1]

    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle


    if abs(angle) < 0.5:
        return image

    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(
        image, M, (w, h),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE
    )
    return rotated



def analyze_student_notes(pil_image_object):
    """
    Analyzes handwritten notes with an enhanced preprocessing pipeline 
    to maximize Tesseract accuracy.
    """

    if not CV2_AVAILABLE:
        return {"error": "OpenCV (cv2) is not installed in this environment. Install `opencv-python` or `opencv-python-headless` to enable notes analysis."}

    try:
       
        pil_img = pil_image_object.convert('RGB')
        img = np.array(pil_img)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

      
        img = correct_skew(img)

       
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    
        gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

      
        gray = cv2.bilateralFilter(gray, 9, 75, 75)

       
        processed_img = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            31, 15
        )

       
        kernel = np.ones((2, 2), np.uint8) 
        processed_img = cv2.erode(processed_img, kernel, iterations=1) 

    except Exception as e:
        return {"error": f"Image preprocessing failed: {e}"}

    try:
       
        custom_config = r'--psm 6'

        ocr_data = pytesseract.image_to_data(
            processed_img,
            config=custom_config,
            output_type=pytesseract.Output.DICT
        )
    except Exception as e:
        return {"error": f"OCR failed: {e}"}


    word_confidences = []
    text_parts = []
    
    for i, text in enumerate(ocr_data['text']):
        text = text.strip()
        conf = int(ocr_data['conf'][i])
        
       
        if conf > -1 and text:
            word_confidences.append(conf)
            text_parts.append(text)

    student_text = " ".join(text_parts)

    if not word_confidences or not student_text:
        return {"error": "OCR detected no readable text. Try a clearer image."}


    avg_conf = sum(word_confidences) / len(word_confidences)
    
    
    clarity_score = (avg_conf / 100) * 10
    
    return {
        "focus_clarity_score": f"{clarity_score:.1f}",
        "ocr_extracted_text": student_text,
        "analysis": {
            "clarity_explanation": f"OCR Confidence: {avg_conf:.1f}% (Enhanced Mode)"
        }
    }