// Vercel Serverless Function — Gemini API 代理
//
// 目的：把 Gemini API key 留在後端環境變數，前端只呼叫本端點，
// 避免 key 被打包進靜態 bundle 而遭盜用。
//
// 需在 Vercel 專案設定以下環境變數：
//   GEMINI_API_KEY   (必填) 你的 Google Gemini API key
//   ALLOWED_ORIGIN   (選填) 允許呼叫的前端網域，例如 https://your.github.io
//                    未設定時預設為 '*'（任何來源皆可呼叫，正式環境建議鎖定）
//
// 部署：將本專案（含 /api 目錄）部署到 Vercel 即可，端點為 /api/generate。

const GEMINI_MODEL = 'gemini-1.5-flash';

export default async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // CORS 預檢
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed，請使用 POST。' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '伺服器未設定 GEMINI_API_KEY 環境變數。' });
  }

  try {
    // Vercel 會在 content-type 為 application/json 時自動解析 req.body
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: '缺少 prompt 參數。' });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({ error: 'Gemini API 回應錯誤', detail: data });
    }

    // 原封不動回傳 Gemini 回應，前端解析邏輯維持不變
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: '代理伺服器發生錯誤', detail: String(err) });
  }
}
