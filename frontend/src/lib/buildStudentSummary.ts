export interface NotesAnalysis {
  focusClarityScore?: number;
  error?: boolean;
}

export interface VoiceAnalysis {
  confidence?: number;
  energyEngagement?: number;
  error?: boolean;
}

export interface StudentSummaryInput {
  cgpa: number;
  notes?: NotesAnalysis;
  voice?: VoiceAnalysis;
}

export interface StudentSummaryOutput {
  summary: string;
  recommendations: string[];
}

export function buildStudentSummary({
  cgpa,
  notes,
  voice,
}: StudentSummaryInput): StudentSummaryOutput {
  let summary = "";
  const recommendations: string[] = [];

  // ================================
  // ⭐ CGPA RECOMMENDATION LOGIC
  // ================================
  if (cgpa >= 8.5) {
    summary += `Academically, the student shows excellent potential (predicted CGPA: ${cgpa.toFixed(
      2
    )}). `;
  } else if (cgpa >= 7.0 && cgpa < 8.5) {
    summary += `The student is on a solid academic path (predicted CGPA: ${cgpa.toFixed(
      2
    )}). `;
  } else {
    summary += `The student may need focused academic support (predicted CGPA: ${cgpa.toFixed(
      2
    )}). `;
    recommendations.push("Consider extra tutoring for key subjects.");
  }

  // ================================
  // 📝 NOTES ANALYSIS LOGIC
  // ================================
  if (notes && !notes.error) {
    const clarity = Number(notes.focusClarityScore ?? 0);

    if (clarity > 7) {
      summary +=
        "Their notes show high handwriting clarity, suggesting they are well-organized. ";
    } else if (clarity < 5) {
      summary +=
        "Handwriting clarity is an area for improvement, which could impact revision efficiency. ";
      recommendations.push(
        "Practice handwriting exercises to improve legibility."
      );
    }
  }

  // ================================
  // 🎙 VOICE ANALYSIS LOGIC
  // ================================
  if (voice && !voice.error) {
    const confidence = Number(voice.confidence ?? 0);
    const energy = Number(voice.energyEngagement ?? 0);

    if (confidence > 7 && energy > 6) {
      summary +=
        "In communication, they present with high confidence and engagement. ";
    } else if (confidence < 5) {
      summary +=
        "Vocal analysis suggests a lack of confidence, which could impact presentations. ";
      recommendations.push(
        "Practice presentations in low-stakes environments to build confidence."
      );
    }
  }

  // ================================
  // FINAL RETURN
  // ================================
  return {
    summary: summary.trim(),
    recommendations,
  };
}
