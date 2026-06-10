// Vercel Serverless Function — Claude (Anthropic) API 代理
//
// 目的：把 Anthropic API key 留在後端環境變數，前端只呼叫本端點，
// 避免 key 被打包進靜態 bundle 而遭盜用。
//
// 需在 Vercel 專案設定以下環境變數：
//   ANTHROPIC_API_KEY  (必填) 你的 Anthropic API key（sk-ant-...）
//   ANTHROPIC_MODEL    (選填) 模型 ID，預設 claude-haiku-4-5（最快、最省）
//   ALLOWED_ORIGIN     (選填) 允許呼叫的前端網域，預設 '*'
//
// 回傳格式統一為 { text: "..." }（已驗證可解析的純 JSON 字串）。

import Anthropic from '@anthropic-ai/sdk';

// 防呆：把友善名稱（Sonnet 4.6 / opus…）對應到正確的模型 ID，避免設錯值導致 404
function resolveModel(raw) {
  const fallback = 'claude-haiku-4-5';
  if (!raw || typeof raw !== 'string') return fallback;
  const v = raw.trim();
  if (v.startsWith('claude-')) return v; // 已是正式 ID
  const map = {
    opus: 'claude-opus-4-8', 'opus 4.8': 'claude-opus-4-8',
    sonnet: 'claude-sonnet-4-6', 'sonnet 4.6': 'claude-sonnet-4-6',
    haiku: 'claude-haiku-4-5', 'haiku 4.5': 'claude-haiku-4-5',
  };
  return map[v.toLowerCase()] || fallback;
}
const MODEL = resolveModel(process.env.ANTHROPIC_MODEL);

// 系統提示：強調純 JSON、嚴格格式
const SYSTEM_PROMPT =
  '你是一位頂尖的中文行銷文案大師。' +
  '請嚴格只輸出純 JSON 物件，禁止任何 markdown（例如 ```json）、前言或說明。' +
  '所有字串值中若需換行請用 \\n，禁止直接插入換行字元；字串中的雙引號需用 \\" 轉義。';

/**
 * 從原始文字中提取第一個完整 JSON 物件（{ ... }）。
 * 用於防禦模型偶爾在 JSON 前後附加說明文字的情況。
 */
function extractJson(raw) {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  return raw.slice(start, end + 1);
}

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

    // ── 關鍵：Prefill 技術 ──────────────────────────────────────────────
    // 在 messages 末尾加入 assistant 訊息 `{`，讓模型直接從 `{` 繼續輸出，
    // 強制消除 markdown 包裝與任何前言說明。
    // 回傳後需把預填的 `{` 補回到文字開頭。
    // ───────────────────────────────────────────────────────────────────
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4096, // 精簡輸出（前端 prompt 已限制每欄 50 字）可降至 4096，減少生成時間
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: '{' }, // 預填 JSON 開頭，強制模型從 { 繼續
      ],
    });

    // 取出所有 text 區塊，並把預填的 '{' 補回
    const rawText = (message.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('');

    if (!rawText) {
      return res.status(500).json({ error: 'Claude API 回應為空，請稍後再試。', model: MODEL });
    }

    // 補回預填字元，組成完整 JSON 字串
    const fullText = '{' + rawText;

    // 擷取最外層的 { ... } 區間（防禦結尾可能殘留的 ``` 等符號）
    const jsonText = extractJson(fullText);
    if (!jsonText) {
      console.error('[generate] 無法從回應中擷取 JSON:', fullText.slice(0, 300));
      return res.status(500).json({
        error: '模型回應中找不到有效的 JSON 物件',
        detail: fullText.slice(0, 300),
        model: MODEL,
      });
    }

    // 在後端驗證 JSON 可解析，避免把損壞的字串傳給前端
    try {
      JSON.parse(jsonText);
    } catch (parseErr) {
      console.error('[generate] JSON 解析失敗:', parseErr.message, jsonText.slice(0, 300));
      return res.status(500).json({
        error: 'JSON 解析失敗，請重試',
        detail: parseErr.message,
        model: MODEL,
      });
    }

    return res.status(200).json({ text: jsonText });

  } catch (err) {
    const status = err?.status && Number.isInteger(err.status) ? err.status : 500;
    console.error('[generate] Claude API error:', status, err?.message, JSON.stringify(err?.error || {}));
    return res.status(status).json({
      error: 'Claude API 呼叫失敗',
      detail: String(err?.message || err),
      model: MODEL,
    });
  }
}
