import React, { useState } from 'react';
import { Sparkles, PenTool, Eraser, FileText, Loader2 } from 'lucide-react';
import { generateReport } from './services/geminiService';
import { ReportInput, ReportData, GenerationStatus } from './types';
import { TextAreaField } from './components/TextAreaField';
import { ResultCard } from './components/ResultCard';

const App: React.FC = () => {
  const [input, setInput] = useState<ReportInput>({
    activity: '',
    learning: '',
    obstacle: ''
  });

  const [result, setResult] = useState<ReportData | null>(null);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (field: keyof ReportInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setInput({ activity: '', learning: '', obstacle: '' });
    setResult(null);
    setStatus(GenerationStatus.IDLE);
    setErrorMessage(null);
  };

  const isFormValid = input.activity.trim() !== '' && input.learning.trim() !== '' && input.obstacle.trim() !== '';

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setStatus(GenerationStatus.LOADING);
    setErrorMessage(null);
    setResult(null);

    try {
      const data = await generateReport(input);
      setResult(data);
      setStatus(GenerationStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
      setErrorMessage("Maaf, terjadi kesalahan saat menghubungi AI. Pastikan kunci API valid atau coba lagi nanti.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <PenTool size={20} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">LaporanHarian<span className="text-blue-600">Pintar</span></h1>
          </div>
          <div className="text-sm text-slate-500 font-medium hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 lg:p-8 grid lg:grid-cols-2 gap-8">

        {/* Left Column: Input */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText size={20} className="text-slate-400" />
                Input Ide Pokok
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Masukkan poin-poin singkat. AI akan mengembangkannya menjadi paragraf formal (min. 100 karakter).
              </p>
            </div>

            <div className="space-y-5">
              <TextAreaField
                id="activity"
                label="1. Uraian Aktivitas"
                value={input.activity}
                onChange={(val) => handleInputChange('activity', val)}
                placeholder="Contoh: Meeting dengan klien membahas fitur baru..."
                description="Apa yang Anda kerjakan hari ini? Siapa yang terlibat?"
              />

              <TextAreaField
                id="learning"
                label="2. Pembelajaran yang Diperoleh"
                value={input.learning}
                onChange={(val) => handleInputChange('learning', val)}
                placeholder="Contoh: Memahami pentingnya komunikasi asinkron..."
                description="Analisis baru atau skill yang meningkat."
              />

              <TextAreaField
                id="obstacle"
                label="3. Kendala yang Dialami"
                value={input.obstacle}
                onChange={(val) => handleInputChange('obstacle', val)}
                placeholder="Contoh: Koneksi internet lambat saat deploy..."
                description="Tantangan spesifik dan dampaknya."
              />
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors flex items-center gap-2"
                disabled={status === GenerationStatus.LOADING}
              >
                <Eraser size={18} />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid || status === GenerationStatus.LOADING}
                className={`flex-1 px-6 py-3 rounded-lg font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95
                  ${!isFormValid || status === GenerationStatus.LOADING
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'}`}
              >
                {status === GenerationStatus.LOADING ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sedang Menulis...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="text-yellow-300" />
                    Generate!
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instructions / Tips */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-800">
            <h3 className="font-bold mb-2">Tips untuk hasil terbaik:</h3>
            <ul className="list-disc list-inside space-y-1 opacity-80">
              <li>Gunakan kata kunci spesifik (nama proyek, teknologi, metodologi).</li>
              <li>Jangan khawatir tentang tata bahasa, AI akan memperbaikinya.</li>
              <li>Semakin spesifik input Anda, semakin akurat pengembangannya.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col">
             {/* Empty State */}
             {status === GenerationStatus.IDLE && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-center h-full min-h-[400px]">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">Hasil Laporan Akan Muncul Disini</h3>
                  <p className="text-slate-500 max-w-xs mt-2">
                    Isi formulir di sebelah kiri dan tekan tombol untuk melihat keajaiban AI.
                  </p>
                </div>
             )}

             {/* Loading Skeleton */}
             {status === GenerationStatus.LOADING && (
                <div className="space-y-6 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-slate-200 rounded-xl w-full"></div>
                  ))}
                </div>
             )}

             {/* Error State */}
             {status === GenerationStatus.ERROR && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-start gap-3">
                  <div className="mt-1">⚠️</div>
                  <div>
                    <h3 className="font-bold">Terjadi Kesalahan</h3>
                    <p className="text-sm mt-1">{errorMessage}</p>
                    <button
                      onClick={handleSubmit}
                      className="mt-3 text-xs font-bold bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded transition-colors"
                    >
                      Coba Lagi
                    </button>
                  </div>
                </div>
             )}

             {/* Success State */}
             {status === GenerationStatus.SUCCESS && result && (
               <div className="animate-fade-in-up">
                 <div className="mb-4 flex items-center justify-between">
                   <h2 className="text-lg font-bold text-slate-800">Draft Laporan Final</h2>
                   <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
                      Selesai
                   </span>
                 </div>

                 <ResultCard
                    title="Uraian Aktivitas"
                    content={result.activityExpanded}
                    color="blue"
                 />

                 <ResultCard
                    title="Pembelajaran yang Diperoleh"
                    content={result.learningExpanded}
                    color="green"
                 />

                 <ResultCard
                    title="Kendala yang Dialami"
                    content={result.obstacleExpanded}
                    color="amber"
                 />

                 <div className="mt-4 p-4 bg-slate-100 rounded-lg text-center text-sm text-slate-500">
                    Mohon periksa kembali konten sebelum diserahkan. AI dapat membuat kesalahan.
                 </div>
               </div>
             )}
        </div>

      </main>
    </div>
  );
};

export default App;
