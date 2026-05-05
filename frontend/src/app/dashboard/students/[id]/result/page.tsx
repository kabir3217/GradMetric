'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  ArrowLeft,
  Award,
  Save,
  CheckCircle,
  AlertTriangle,
  FileText,
  Mic,
  Database,
  Volume2,
} from 'lucide-react';

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [student, setStudent] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      try {
        const res = await fetch(`/api/students/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setStudent(data);
        } else {
          setError('Failed to fetch student data.');
        }
      } catch (e) {
        console.error(e);
        setError('Network error while fetching student data.');
      }
    })();
  }, [id]);

  async function handleSaveResult() {
    if (saveSuccess) return;
    setIsSaving(true);
    setError('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    try {
      const res = await fetch(`/api/students/${id}/save-result`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => router.push('/dashboard'), 1400);
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j.message || 'Failed to save record.');
      }
    } catch (e) {
      console.error(e);
      setError('Network error while saving.');
    } finally {
      setIsSaving(false);
    }
  }

  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return 'text-gray-500 bg-gray-100';
    if (score >= 8.5) return 'text-green-700 bg-green-50';
    if (score >= 7.0) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const ScoreCard: React.FC<{ title: string; score?: number | null; icon: any }> = ({ title, score, icon: Icon }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
      <Icon className="w-6 h-6 mb-1 text-indigo-500" />
      <h4 className="font-medium text-xs text-gray-500 uppercase">{title}</h4>
      <p className={`text-2xl font-extrabold mt-2 rounded-lg px-3 py-1 ${getScoreColor(score)}`}>
        {score !== null && score !== undefined ? Number(score).toFixed(2) : 'N/A'}
      </p>
    </div>
  );

  if (!student)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg w-full max-w-sm">
          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-indigo-500" />
          <p className="text-lg text-gray-700">Loading Final Analysis...</p>
        </div>
      </div>
    );

  const cgpa = student.cgpaPrediction ?? null;
  const notes = student.notesAnalysis ?? {};
  const voice = student.voiceAnalysis ?? {};

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
            </div>

            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Student Performance Result</h2>

            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="-mt-8">
          <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
              <div className="flex-shrink-0">
                <Award className="w-14 h-14 text-yellow-500" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm text-gray-500">Student</p>
                <p className="text-2xl font-bold text-gray-800">{student.name} <span className="text-sm text-gray-500">(Roll: {student.rollNo})</span></p>
              </div>

              <div className="mt-4 md:mt-0">
                <div className="bg-indigo-600 text-white px-8 py-6 rounded-2xl shadow-lg inline-block text-center">
                  <p className="text-xs tracking-widest opacity-80">PREDICTED CGPA</p>
                  <p className="text-5xl md:text-6xl font-extrabold mt-1">{cgpa !== null ? Number(cgpa).toFixed(2) : 'N/A'}</p>
                  <p className="mt-2 inline-block bg-white text-indigo-700 font-semibold px-4 py-1 rounded-full">{student.academicStatus ?? 'Awaiting Prediction'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analyses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Notes analysis */}
            <section className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2"><FileText className="w-5 h-5" /> Notes Analysis</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <ScoreCard title="Clarity Score" score={notes.focusClarityScore ? Number(notes.focusClarityScore) : null} icon={Database} />
                <ScoreCard title="Keywords" score={Array.isArray(notes.keywords) ? notes.keywords.length : null} icon={Database} />
                <ScoreCard title="OCR Score" score={notes.score ? Number(notes.score) : null} icon={Database} />
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">OCR Excerpt</p>
                <div className="mt-2 bg-gray-50 p-3 rounded max-h-36 overflow-y-auto text-sm text-gray-600">{notes.text || 'No text available.'}</div>
                {notes.analysis?.clarity_explanation && <p className="mt-2 text-xs text-gray-500 italic">{notes.analysis.clarity_explanation}</p>}
              </div>
            </section>

            {/* Voice analysis */}
            <section className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-purple-500">
              <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2"><Volume2 className="w-5 h-5" /> Voice Analysis</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <ScoreCard title="Clarity" score={voice.clarity ? Number(voice.clarity) : null} icon={Mic} />
                <ScoreCard title="Confidence" score={voice.confidence ? Number(voice.confidence) : null} icon={Mic} />
                <ScoreCard title="Engagement" score={voice.energyEngagement ? Number(voice.energyEngagement) : null} icon={Mic} />
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Transcription</p>
                <div className="mt-2 bg-gray-50 p-3 rounded max-h-36 overflow-y-auto text-sm text-gray-600">{voice.summary || voice.Transcription || 'No transcription available.'}</div>
              </div>
            </section>
          </div>

{/* Profile Summary & Recommendations */}
<section className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-indigo-500 mt-6">
  <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
    <Award className="w-5 h-5" /> Profile Summary
  </h3>

  {/* Summary Text */}
  <div className="mt-3 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
    <p className="text-slate-700 leading-relaxed text-sm">
      {student.profileSummary || "No summary generated yet."}
    </p>
  </div>

  {/* Recommendations */}
  {student.recommendations?.length > 0 && (
    <div className="mt-5">
      <h4 className="text-md font-semibold text-indigo-600">Recommendations</h4>
      <ul className="mt-3 space-y-2">
        {student.recommendations.map((rec: string, i: number) => (
          <li
            key={i}
            className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200"
          >
            <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <span className="text-slate-700 text-sm">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</section>
{/* Summary Section */}
<section className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-green-500 mt-6">
  <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
    <Award className="w-5 h-5" /> Final Summary
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
    <ScoreCard 
      title="Overall Score"
      score={student.notesAnalysis?.score ? Number(student.notesAnalysis.score) : null}
      icon={Award}
    />

    <ScoreCard 
      title="Focus & Clarity"
      score={student.notesAnalysis?.focusClarityScore ? Number(student.notesAnalysis.focusClarityScore) : null}
      icon={Award}
    />

    <ScoreCard 
      title="Keywords Count"
      score={Array.isArray(student.notesAnalysis?.keywords) ? student.notesAnalysis.keywords.length : null}
      icon={Award}
    />
  </div>

  {/* Notes Extracted Text */}
  <div className="mt-4">
    <p className="text-sm font-medium text-gray-700">Extracted Notes Summary</p>
    <div className="mt-2 bg-gray-50 p-3 rounded max-h-36 overflow-y-auto text-sm text-gray-600">
      {student.notesAnalysis?.rawResponse?.ocr_extracted_text || "No summary extracted."}
    </div>
  </div>

  {/* Voice Summary */}
  <div className="mt-4">
    <p className="text-sm font-medium text-gray-700">Voice Summary</p>
    <div className="mt-2 bg-gray-50 p-3 rounded text-sm text-gray-600">
      {student.voiceAnalysis?.summary || "No voice summary available."}
    </div>
  </div>

  {student.notesAnalysis?.analysis?.clarity_explanation && (
    <p className="mt-2 text-xs text-gray-500 italic">
      {student.notesAnalysis.analysis.clarity_explanation}
    </p>
  )}
</section>








          {/* Save card */}
          <div className="mt-6 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> <span>{error}</span>
              </div>
            )}

            {saveSuccess ? (
              <div className="text-center py-6 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-lg font-semibold text-green-700">Record Saved Successfully!</p>
                <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-gray-700">Review and finalize this result before saving.</p>
                <div>
                  <button
                    onClick={handleSaveResult}
                    disabled={isSaving || cgpa === null}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow transition ${isSaving || cgpa === null ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 scale-100 hover:scale-105'}`}
                  >
                    {isSaving ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving...</> : <><Save className="w-4 h-4"/> Save & Complete</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
