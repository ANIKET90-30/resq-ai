import React, { useState } from 'react';
import {
  Camera,
  Upload,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  FileText,
  CheckCircle2,
  RefreshCcw,
} from 'lucide-react';
import { ApiClient } from '../services/apiClient';
import { DBService } from '../services/db';
import { SeverityLevel } from '../types';

export const HazardPage: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    hazardType: string;
    riskLevel: SeverityLevel;
    riskScore: number;
    explanation: string;
    safetyRecommendations: string[];
    isLikelyAIGenerated: boolean;
    authenticityConfidence: number;
    authenticityNotes: string;
  } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      const b64 = result.split(',')[1];
      setBase64Data(b64);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!base64Data) return;

    setIsAnalyzing(true);
    try {
      const result = await ApiClient.analyzeImage(base64Data, mimeType);
      setAnalysisResult(result);

      // Save upload record to DB
      const user = DBService.getCurrentUser();
      if (user) {
        DBService.saveImageUpload({
          id: 'img-' + Date.now(),
          userId: user.id,
          imageUrl: imagePreview || '',
          hazardType: result.hazardType,
          riskLevel: result.riskLevel,
          riskScore: result.riskScore,
          explanation: result.explanation,
          safetyRecommendations: result.safetyRecommendations,
          isLikelyAIGenerated: result.isLikelyAIGenerated,
          authenticityConfidence: result.authenticityConfidence,
          authenticityNotes: result.authenticityNotes,
          analyzedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in text-slate-100 pb-12">
      {/* Page Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Camera className="w-3.5 h-3.5" />
          <span>Multimodal Vision Scanner</span>
        </div>

        <h1 className="text-2xl font-bold font-display text-white">AI Hazard Detection</h1>

        <p className="text-xs text-slate-400 max-w-xl">
          Upload or capture a photo of a disaster zone (flood, fire, structural damage, downed wires). Our server-side computer vision evaluates threats and calculates risk levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Image Upload Box */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Scene Photo</h2>

            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all p-6 text-center group">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40 text-slate-400 group-hover:text-cyan-400 flex items-center justify-center mb-3 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-300 mb-1">Click to upload or drag photo</p>
                <p className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP up to 10MB</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <img src={imagePreview} alt="Hazard preview" className="w-full h-64 object-cover" />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setBase64Data(null);
                    setAnalysisResult(null);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-white transition-colors"
                  title="Remove Image"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!base64Data || isAnalyzing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Scanning Computer Vision Parts...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Execute Vision Hazard Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Analysis Results Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              AI Risk Evaluation
            </h2>

            {analysisResult ? (
              <div className="space-y-4 animate-fade-in">
                {/* Authenticity Badge — flagged first since it affects whether to trust anything below */}
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    analysisResult.isLikelyAIGenerated
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-emerald-500/10 border-emerald-500/30'
                  }`}
                >
                  {analysisResult.isLikelyAIGenerated ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p
                      className={`text-xs font-bold ${
                        analysisResult.isLikelyAIGenerated ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {analysisResult.isLikelyAIGenerated
                        ? `⚠ Likely AI-Generated Image (${analysisResult.authenticityConfidence}% confidence)`
                        : `Appears to be a Real Photograph (${analysisResult.authenticityConfidence}% confidence)`}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{analysisResult.authenticityNotes}</p>
                  </div>
                </div>

                {/* Header Title & Severity Badge */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{analysisResult.hazardType}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      analysisResult.riskLevel === 'critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : analysisResult.riskLevel === 'high'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {analysisResult.riskLevel} Risk
                  </span>
                </div>

                {/* Score Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Hazard Threat Level Score</span>
                    <span className="font-mono font-bold text-cyan-400">{analysisResult.riskScore} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        analysisResult.riskScore > 70
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                          : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                      }`}
                      style={{ width: `${analysisResult.riskScore}%` }}
                    />
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {analysisResult.explanation}
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-300">Mandatory Safety Recommendations:</p>
                  <ul className="space-y-2">
                    {analysisResult.safetyRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-slate-800/80 rounded-2xl bg-slate-950/40 text-slate-500 space-y-2">
                <AlertTriangle className="w-8 h-8 text-slate-600" />
                <p className="text-xs">No image analyzed yet.</p>
                <p className="text-[11px] text-slate-600 max-w-xs">
                  Upload a photo on the left panel to trigger vision hazard detection.
                </p>
              </div>
            )}
          </div>

          {analysisResult && (
            <button
              onClick={() => {
                alert('Exporting PDF hazard diagnostic report...');
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Download Official Hazard Diagnostic Report</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
