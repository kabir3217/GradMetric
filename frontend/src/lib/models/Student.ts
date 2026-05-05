import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    // Basic Student Info
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    college: { type: String },

    // Model Input Data
    modelInputs: {
      Previous_Semester_GPA: { type: Number, default: null },
      Midterm_Score_Average: { type: Number, default: null },
      Assignment_Score_Average: { type: Number, default: null },
      Twelfth_Grade_Percentage: { type: Number, default: null },
      Study_Hours_Per_Day: { type: Number, default: null },
      Attendance_Percentage: { type: Number, default: null },
      Number_of_Backlogs: { type: Number, default: null },
      Mental_Stress_Score: { type: Number, default: null },
      Tenth_Grade_Percentage:{ type: Number, default: null },
      Distance_From_Campus_KM:{ type: Number, default: null },

    },

    // Notes Analysis

notesAnalysis: {
  text: { type: String, default: "" },                 // Extracted text
  sentiment: { type: String, default: "" },           // Sentiment if available
  score: { type: Number, default: null },             // Optional overall score
  focusClarityScore: { type: Number, default: null }, // New: OCR-based clarity/focus score
  keywords: { type: [String], default: [] },          // Extracted keywords
  analysis: { type: Object, default: {} },            // Additional analysis details from Python
  rawResponse: { type: Object, default: {} },         // Full Python response
},


    // Voice Analysis

voiceAnalysis: {
  clarity: { type: Number, default: null },
  confidence: { type: Number, default: null },          // new
  energyEngagement: { type: Number, default: null },    // new
  professionalism: { type: Number, default: null },     // new
  speed: { type: Number, default: null },
  tone: { type: String, default: "" },
  summary: { type: String, default: "" },
  rawResponse: { type: Object, default: {} },
},

    // Final Prediction
    cgpaPrediction: { type: Number, default: null },
academicStatus: { type: String, default: "" },

profileSummary: { type: String, default: "" },
recommendations: { type: [String], default: [] },
    // Workflow Status
    status: {
      type: String,
  enum: [
        "PENDING_MANDATORY", // Initial create
        "PENDING_NOTES_ANALYSIS", // After mandatory inputs saved
        "PENDING_VOICE_ANALYSIS", // After notes uploaded
        "PREDICTION_READY", // After voice uploaded AND prediction run
        "COMPLETED", // After teacher clicks save on result page
      ],
      default: "PENDING_MANDATORY",
    },
    bundleId: { type: String },

  },
  { timestamps: true }
);

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
