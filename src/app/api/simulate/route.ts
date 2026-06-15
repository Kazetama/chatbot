import { NextResponse } from "next/server";

// ─── Types ─────────────────────────────────────────────────────────────────
type SentimentClass = "positive" | "negative" | "sarcastic" | "neutral";

interface ClassifyPayload {
  action: "classify";
  userComment: string;
}

interface EvaluatePayload {
  action: "evaluate";
  scenarioTitle: string;
  botProvocation: string;
  sentimentClass: SentimentClass;
  userFinalComment: string;
}

type RequestPayload = ClassifyPayload | EvaluatePayload;

// ─── Keyword-based Fallback Classifier ─────────────────────────────────────
const KEYWORDS: Record<SentimentClass, string[]> = {
  positive: ["kronologi", "cari tahu", "sabar", "polisi", "lapor", "klarifikasi", "cerita dulu", "jangan terburu", "bijak", "tenang", "damai"],
  negative: ["viralkan", "bogem", "serang", "hajar", "gebuk", "babi", "anjing", "bajingan", "keparat", "laknat", "sweeping", "keroyok", "buru"],
  sarcastic: ["sok jago", "jagoan kampung", "wah hebat", "keren banget", "mantap jiwa", "keren ya", "pahlawan kesiangan", "jagoan", "pahlawan"],
  neutral: ["nyimak", "waduh", "oh", "hmm", "gitu ya", "wkwk", "hehe", "oke", "iya", "sip"],
};

function keywordClassify(text: string): SentimentClass {
  const lower = text.toLowerCase();
  for (const [cls, words] of Object.entries(KEYWORDS)) {
    if (words.some((w) => lower.includes(w))) {
      return cls as SentimentClass;
    }
  }
  // Fallback heuristic: excessive punctuation/caps → negative
  if (text.split("!").length > 2 || text === text.toUpperCase()) return "negative";
  return "neutral";
}

const BOT_REPLIES: Record<SentimentClass, string> = {
  positive:
    "Halah, sok bijak dan sok suci lu! Udah jelas-jelas ada kekerasan di depan mata masa masih nunggu kronologi atau lapor polisi? Keburu kabur orangnya! Netizen tuh harusnya gerak cepat viralkan, bukan malah ceramah tidak berguna di sini!",
  neutral:
    "Malah cuma nyimak doang, gak guna lu! Kasus arogansi begini tuh harus dibantu up dan diviralkan biar pelakunya kena mental, lu malah diam aja cari aman. Mending gak usah komen sekalian kalo gitu!",
  negative:
    "Nah bener kan kata gue! Nggak usah banyak omong, spill aja alamat pelakunya sekarang biar kita bisa silaturahmi massal biar dia tahu rasa! Siapa yang mau gabung?!",
  sarcastic:
    "Nah bener kan kata gue! Nggak usah banyak omong, spill aja alamat pelakunya sekarang biar kita bisa silaturahmi massal biar dia tahu rasa! Siapa yang mau gabung?!",
};

// ─── Route Handler ──────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestPayload;
    const apiKey = process.env.GEMINI_API_KEY;
    const hasKey = apiKey && apiKey.trim() !== "" && apiKey !== "your_gemini_api_key_here";

    // ── ACTION: CLASSIFY ──────────────────────────────────────────────────
    if (body.action === "classify") {
      const { userComment } = body;

      // Try Gemini first (hybrid)
      if (hasKey) {
        try {
          const prompt = `
Kamu adalah classifier sentimen komentar media sosial Indonesia.
Klasifikasikan komentar berikut ke salah satu dari 4 kelas SAJA (jawab hanya 1 kata):
- positive  → netizen mencari kronologi, mengajak lapor polisi, minta tunggu klarifikasi, bersikap tenang/bijak
- negative  → mengandung makian, ajakan menyerang, viralkan, keroyokan, persekusi
- sarcastic → mengandung sarkasme/ironi terhadap pelaku
- neutral   → pasif, singkat, tidak mengambil posisi

Komentar: "${userComment}"

Jawab HANYA dengan satu kata dari 4 pilihan di atas (lowercase).`;

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
          const res = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 10, temperature: 0.1 },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const raw = (data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "")
              .trim()
              .toLowerCase()
              .replace(/[^a-z]/g, "");
            const valid: SentimentClass[] = ["positive", "negative", "sarcastic", "neutral"];
            const sentimentClass: SentimentClass = valid.includes(raw as SentimentClass)
              ? (raw as SentimentClass)
              : keywordClassify(userComment);

            return NextResponse.json({ sentimentClass, botReply: BOT_REPLIES[sentimentClass] });
          }
        } catch {
          // fallthrough to local
        }
      }

      // Local keyword fallback
      const sentimentClass = keywordClassify(userComment);
      return NextResponse.json({ sentimentClass, botReply: BOT_REPLIES[sentimentClass] });
    }

    // ── ACTION: EVALUATE ─────────────────────────────────────────────────
    if (body.action === "evaluate") {
      const { scenarioTitle, botProvocation, sentimentClass, userFinalComment } = body;

      // Local fallback evaluator
      const localEvaluate = () => {
        const lower = userFinalComment.toLowerCase();

        const goodSignals = [
          "sabar", "tenang", "polisi", "lapor", "tidak perlu emosi", "berhenti",
          "damai", "sepakat", "jangan benci", "cari solusi", "klarifikasi", "jangan sampai", "hargai",
        ];
        const badSignals = [
          "setuju", "spill", "alamat", "keroyok", "sweeping", "gebuk", "hajar", "bogem balik",
          "viralkan", "bajingan", "anjing", "keparat", "persekusi",
        ];

        const goodCount = goodSignals.filter((w) => lower.includes(w)).length;
        const badCount = badSignals.filter((w) => lower.includes(w)).length;

        let sila2 = 50 + goodCount * 10 - badCount * 15;
        let sila3 = 50 + goodCount * 8 - badCount * 18;

        sila2 = Math.min(100, Math.max(0, sila2));
        sila3 = Math.min(100, Math.max(0, sila3));

        const verdict: "lulus" | "gagal" = sila2 >= 55 && sila3 >= 55 ? "lulus" : "gagal";

        return {
          sila2,
          sila3,
          verdict,
          summary:
            verdict === "lulus"
              ? "Selamat! Anda berhasil mempertahankan nalar dan empati di tengah tekanan provokatif. Respons Anda mencerminkan nilai kemanusiaan dan semangat persatuan yang patut diteladani."
              : "Anda terpancing oleh provokasi dan memberikan respons yang memperburuk konflik. Ingat, setiap kata di media sosial punya dampak nyata terhadap kehidupan seseorang.",
          sila2Label: sila2 >= 70 ? "Sangat Manusiawi" : sila2 >= 50 ? "Cukup Manusiawi" : "Kurang Manusiawi",
          sila3Label: sila3 >= 70 ? "Menjaga Persatuan" : sila3 >= 50 ? "Cukup Menjaga" : "Memecah Belah",
        };
      };

      if (!hasKey) {
        return NextResponse.json(localEvaluate());
      }

      // Gemini evaluation
      try {
        const prompt = `
Kamu adalah evaluator etika digital berbasis nilai Pancasila Indonesia.

Konteks Skenario: "${scenarioTitle}"
Kelas Komentar Awal User: ${sentimentClass}
Provokasi Bot yang Diterima User: "${botProvocation}"
Respons Final User: "${userFinalComment}"

Tugas: Nilai apakah respons final user mencerminkan nilai-nilai Sila ke-2 (Kemanusiaan yang Adil dan Beradab) dan Sila ke-3 (Persatuan Indonesia) Pancasila dalam konteks etika digital dan konflik media sosial.

Berikan output JSON MURNI (tanpa markdown) dengan format:
{
  "sila2": <angka 0-100, nilai kemanusiaan dan anti-kekerasan>,
  "sila3": <angka 0-100, nilai persatuan dan anti-perpecahan>,
  "verdict": <"lulus" atau "gagal">,
  "summary": <evaluasi 2-3 kalimat dalam Bahasa Indonesia>,
  "sila2Label": <label singkat sila 2, contoh: "Sangat Manusiawi">,
  "sila3Label": <label singkat sila 3, contoh: "Menjaga Persatuan">
}

Kriteria LULUS: sila2 >= 55 DAN sila3 >= 55. Jika salah satu < 55 = GAGAL.`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const res = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        });

        if (!res.ok) throw new Error("Gemini API error " + res.status);
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        return NextResponse.json(JSON.parse(text.trim()));
      } catch {
        return NextResponse.json(localEvaluate());
      }
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Server error", details: msg }, { status: 500 });
  }
}
