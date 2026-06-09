// Vercel Serverless Function — Claude (Anthropic) API 代理
//
// 目的：把 Anthropic API key 留在後端環境變數，前端只呼叫本端點，
// 避免 key 被打包進靜態 bundle 而遭盜用。
//
// 需在 Vercel 專案設定以下環境變數：
//   ANTHROPIC_API_KEY  (必填) 你的 Anthropic API key（sk-ant-...）
//   ANTHROPIC_MODEL    (選填) 模型 ID，預設 claude-opus-4-8；
//                      想省成本可改 claude-sonnet-4-6 或 claude-haiku-4-5
//   ALLOWED_ORIGIN     (選填) 允許呼叫的前端網域，預設 '*'
//
// 回傳格式統一為 { text: "..." }（純文字，前端再自行解析 JSON）。

import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';

const SYSTEM_PROMPT =
  '你是一位頂尖的中文行銷文案大師。請嚴格只輸出使用者要求的純 JSON 物件，' +
  '不要有任何前言、說明、思考過程或 markdown 程式碼區塊標記（例如 ```json）。';

export default async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed，請使用 POST。' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '伺服器未設定 ANTHROPIC_API_KEY 環境變數。' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const prompt = body.prompt;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: '缺少 prompt 參數。' });
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      thinking: { type: 'disabled' }, // 關閉思考以控制成本與延遲
      messages: [{ role: 'user', content: prompt }],
    });

    // 取出所有 text 區塊組成回應
    const text = (message.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('');

    return res.status(200).json({ text });
  } catch (err) {
    const status = err?.status && Number.isInteger(err.status) ? err.status : 500;
    return res.status(status).json({ error: 'Claude API 呼叫失敗', detail: String(err?.message || err) });
  }
}
