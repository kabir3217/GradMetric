import streamlit as st
from PIL import Image
from cgpa_predictor import predict_cgpa
from notes_analyzer import analyze_student_notes
from voice_analyzer import analyze_voice

st.set_page_config(
    layout="wide",
    page_title="Holistic Student Profiler",
    page_icon="🧠"
)

if 'page' not in st.session_state:
    st.session_state.page = 'cgpa'
if 'student_data' not in st.session_state:
    st.session_state.student_data = {}
if 'student_name' not in st.session_state:
    st.session_state.student_name = ""
if 'student_roll' not in st.session_state:
    st.session_state.student_roll = ""

def navigate_to(page_name):
    st.session_state.page = page_name

if st.session_state.page == 'cgpa':
    st.title("Step 1: Academic Performance Prediction ")
    st.info("Enter the student's details to predict their final CGPA.")
    with st.form("cgpa_form"):
        st.subheader("Student Identification")
        col_id1, col_id2 = st.columns(2)
        with col_id1:
            name_input = st.text_input("Student Name", value=st.session_state.get('student_name', ""))
        with col_id2:
            roll_input = st.text_input("Roll Number", value=st.session_state.get('student_roll', ""))
        st.subheader("Student Academic History")
        col1, col2, col3 = st.columns(3)
        with col1:
            prev_gpa = st.number_input("Previous Semester GPA", 0.0, 10.0, 8.0, 0.1)
            midterm_score = st.number_input("Midterm Score Average", 0.0, 100.0, 85.0, 1.0)
            assignment_score = st.number_input("Assignment Score Average", 0.0, 100.0, 90.0, 1.0)
            twelfth_grade = st.number_input("Twelfth Grade Percentage", 0.0, 100.0, 90.0, 1.0)
        with col2:
            study_hours = st.slider("Study Hours Per Day", 1.0, 10.0, 6.0, 0.5)
            tenth_grade = st.number_input("Tenth Grade Percentage", 0.0, 100.0, 92.0, 1.0)
            attendance = st.slider("Attendance Percentage", 0, 100, 95)
        with col3:
            backlogs = st.number_input("Number of Backlogs", 0, 10, 0, 1)
            stress_score = st.slider("Mental Stress Score (1-10)", 1, 10, 3)
            distance = st.number_input("Distance From Campus (KM)", 0.0, 50.0, 5.0, 0.5)
        submitted = st.form_submit_button("Next: Analyze Notes ", type="primary")
        if submitted:
            st.session_state.student_name = name_input.strip()
            st.session_state.student_roll = roll_input.strip()
            st.session_state.student_data['cgpa_inputs'] = {
                'Previous_Semester_GPA': prev_gpa,
                'Midterm_Score_Average': midterm_score,
                'Assignment_Score_Average': assignment_score,
                'Twelfth_Grade_Percentage': twelfth_grade,
                'Study_Hours_Per_Day': study_hours,
                'Tenth_Grade_Percentage': tenth_grade,
                'Attendance_Percentage': attendance,
                'Number_of_Backlogs': backlogs,
                'Mental_Stress_Score': stress_score,
                'Distance_From_Campus_KM': distance
            }
            navigate_to('notes')
            st.rerun()

elif st.session_state.page == 'notes':
    header_text = f"Student: {st.session_state.student_name or '—'}  |  Roll No: {st.session_state.student_roll or '—'}"
    st.title("Step 2: Cognitive Clarity Analysis ")
    st.markdown(header_text)
    st.info("Upload a clear image of the student's handwritten notes.")
    uploaded_image = st.file_uploader("Choose an image...", type=['png', 'jpg', 'jpeg'])
    if uploaded_image:
        st.image(uploaded_image, caption="Uploaded Notes", width=400)
        st.session_state.student_data['notes_image'] = uploaded_image
    col1, col2 = st.columns([1, 1])
    with col1:
        if st.button("⬅ Go Back to CGPA"):
            navigate_to('cgpa')
            st.rerun()
    with col2:
        if st.button("Next: Analyze Voice ", type="primary", disabled=(not uploaded_image)):
            navigate_to('voice')
            st.rerun()

elif st.session_state.page == 'voice':
    header_text = f"Student: {st.session_state.student_name or '—'}  |  Roll No: {st.session_state.student_roll or '—'}"
    st.title("Step 3: Communication & Emotional State Analysis 🎤")
    st.markdown(header_text)
    st.info("Upload a short voice recording (e.g., reading a paragraph).")
    uploaded_audio = st.file_uploader("Choose an audio file...", type=['wav', 'mp3', 'ogg'])
    if uploaded_audio:
        st.audio(uploaded_audio)
        st.session_state.student_data['voice_file'] = uploaded_audio
    col1, col2 = st.columns([1, 1])
    with col1:
        if st.button(" Go Back to Notes"):
            navigate_to('notes')
            st.rerun()
    with col2:
        if st.button("✨ Generate Final Report ✨", type="primary", disabled=(not uploaded_audio)):
            navigate_to('report')
            st.rerun()

elif st.session_state.page == 'report':
    header_text = f"Student: {st.session_state.student_name or '—'}  |  Roll No: {st.session_state.student_roll or '—'}"
    st.title("✅ Comprehensive Student Profile")
    st.markdown(header_text)
    st.balloons()
    with st.spinner("Analyzing... Synthesizing insights..."):
        cgpa_input_data = st.session_state.student_data.get('cgpa_inputs', {})
        predicted_cgpa = predict_cgpa(cgpa_input_data) if cgpa_input_data else 0.0
        notes_image_file = st.session_state.student_data.get('notes_image', None)
        notes_analysis = analyze_student_notes(notes_image_file) if notes_image_file else {'error': 'No notes image provided.'}
        voice_audio_file = st.session_state.student_data.get('voice_file', None)
        voice_analysis = analyze_voice(voice_audio_file) if voice_audio_file else {'error': 'No voice file provided.'}
    st.header("Individual Analysis Results")
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("🎓 Academic Prediction")
        st.metric("Predicted Final CGPA", f"{predicted_cgpa:.2f}")
        st.subheader(" Notes Analysis")
        if 'error' in notes_analysis:
            st.error(notes_analysis['error'])
        else:
            st.metric("Handwriting Clarity Score", f"{notes_analysis.get('focus_clarity_score', '0.0')}/10")
    with col2:
        st.subheader(" Vocalysis Report")
        if 'error' in voice_analysis:
            st.error(voice_analysis['error'])
        else:
            st.metric("Vocal Clarity Score", f"{voice_analysis.get('Clarity Score', 0.0):.1f}/10")
            st.metric("Vocal Confidence Score", f"{voice_analysis.get('Confidence Score', 0.0):.1f}/10")
            st.metric("Energy & Engagement Score", f"{voice_analysis.get('Energy & Engagement Score', 0.0):.1f}/10")
    st.divider()
    st.header("Final Output: The Complete Picture")
    st.markdown("This profile combines all tests for a holistic understanding of the student.")
    profile_summary = ""
    recommendations = []
    if predicted_cgpa >= 8.5:
        profile_summary += f"Academically, the student shows **excellent potential** (predicted CGPA: {predicted_cgpa:.2f}). "
    elif 7.0 <= predicted_cgpa < 8.5:
        profile_summary += f"The student is on a **solid academic path** (predicted CGPA: {predicted_cgpa:.2f}). "
    else:
        profile_summary += f"The student may need **focused academic support** (predicted CGPA: {predicted_cgpa:.2f}). "
        recommendations.append("Consider extra tutoring for key subjects.")
    if 'error' not in notes_analysis:
        clarity = float(notes_analysis.get('focus_clarity_score', 0))
        if clarity > 7:
            profile_summary += "Their notes show **high handwriting clarity**, suggesting they are well-organized. "
        elif clarity < 5:
            profile_summary += "Handwriting clarity is an area for improvement, which could impact revision efficiency. "
            recommendations.append("Practice handwriting exercises to improve legibility.")
    if 'error' not in voice_analysis:
        confidence = voice_analysis.get('Confidence Score', 0)
        energy = voice_analysis.get('Energy & Engagement Score', 0)
        if confidence > 7 and energy > 6:
            profile_summary += "In communication, they present with **high confidence and engagement**. "
        elif confidence < 5:
            profile_summary += "Vocal analysis suggests a lack of confidence, which could impact presentations. "
            recommendations.append("Practice presentations in low-stakes environments to build confidence.")
    st.info(profile_summary)
    if recommendations:
        st.subheader(" Recommendations")
        for rec in recommendations:
            st.markdown(f"- {rec}")
    with st.expander("Show Detailed Analysis Data"):
        st.subheader("Notes Analysis Details")
        if 'error' in notes_analysis:
            st.error(notes_analysis['error'])
        else:
            st.write(notes_analysis.get('analysis', {}))
            st.subheader("Extracted Text from Note")
            st.write(f"\"{notes_analysis.get('ocr_extracted_text', '')}\"")
        st.subheader("Vocalysis Details")
        if 'error' in voice_analysis:
            st.error(voice_analysis['error'])
        else:
            st.json({k: f"{v:.2f}/10" if isinstance(v, float) else v for k, v in voice_analysis.items()})
    if st.button("Start New Analysis"):
        st.session_state.clear()
        st.rerun()



