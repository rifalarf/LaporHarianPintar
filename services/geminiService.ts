import { GoogleGenAI, Type } from "@google/genai";
import { ReportInput, ReportData } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Please ensure process.env.API_KEY is set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const SYSTEM_INSTRUCTION = `
Anda adalah asisten penulisan laporan harian profesional.
Tugas Anda adalah mengembangkan input singkat pengguna menjadi bagian laporan yang detail dan lengkap dalam Bahasa Indonesia.

Peraturan Utama:
1. Setiap bagian (Uraian Aktivitas, Pembelajaran, Kendala) WAJIB dikembangkan menjadi minimal 100 karakter.
2. GAYA BAHASA: Gunakan bahasa Indonesia yang formal namun SEDERHANA dan MUDAH DIPAHAMI.
   - JANGAN gunakan "kata-kata tinggi", istilah sastra yang rumit, kata-kata puitis, atau kosakata yang jarang dipakai (bombastis).
   - Gunakan kalimat yang lugas, efektif, dan komunikatif (easy to read).
3. Hindari pengulangan kata yang tidak perlu, tetapi pastikan detailnya kaya.
4. 'Uraian aktivitas': Jelaskan konteks, tindakan spesifik, dan hasil.
5. 'Pembelajaran yang diperoleh': Jelaskan analisis, implikasi, dan peningkatan skill.
6. 'Kendala yang dialami': Jelaskan akar masalah, dampak, dan solusi awal.
7. IMPROVISASI: Jika input pengguna sangat singkat (contoh: "fix bug"), berimprovisasilah secara logis untuk memenuhi kuota 100 karakter.
   - Pastikan improvisasi tersebut tetap menggunakan bahasa yang membumi dan mudah dimengerti.
   - Hindari jargon teknis yang berlebihan kecuali sangat relevan.
8. FORMAT TEXT: JANGAN gunakan tag HTML (seperti <i>, <b>) atau markdown. Output harus teks polos (plain text) yang bersih.
`;

export const generateReport = async (input: ReportInput): Promise<ReportData> => {
  try {
    const prompt = `
      Tolong kembangkan poin-poin berikut menjadi laporan lengkap dengan bahasa yang mudah dipahami:

      1. Uraian aktivitas (Konsep inti): "${input.activity}"
      2. Pembelajaran yang diperoleh (Konsep inti): "${input.learning}"
      3. Kendala yang dialami (Konsep inti): "${input.obstacle}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            activityExpanded: {
              type: Type.STRING,
              description: "Paragraf formal minimal 100 karakter untuk uraian aktivitas, bahasa mudah dipahami, tanpa tag HTML.",
            },
            learningExpanded: {
              type: Type.STRING,
              description: "Paragraf formal minimal 100 karakter untuk pembelajaran yang diperoleh, bahasa mudah dipahami, tanpa tag HTML.",
            },
            obstacleExpanded: {
              type: Type.STRING,
              description: "Paragraf formal minimal 100 karakter untuk kendala yang dialami, bahasa mudah dipahami, tanpa tag HTML.",
            },
          },
          required: ["activityExpanded", "learningExpanded", "obstacleExpanded"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from Gemini.");
    }

    const data = JSON.parse(responseText) as ReportData;

    // Fungsi pembersih untuk menghapus tag HTML seperti <i> atau <b> jika ada
    const cleanText = (text: string) => {
      return text.replace(/<\/?[^>]+(>|$)/g, "");
    };

    data.activityExpanded = cleanText(data.activityExpanded);
    data.learningExpanded = cleanText(data.learningExpanded);
    data.obstacleExpanded = cleanText(data.obstacleExpanded);

    return data;

  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};