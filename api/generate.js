// Vercel Serverless Function — Claude (Anthropic) API 代理
import Anthropic from '@anthropic-ai/sdk';

// ── 模型 ID 防呆 ──────────────────────────────────────────────────────────────
function resolveModel(raw) {
  const fallback = 'claude-haiku-4-5';
  if (!raw || typeof raw !== 'string') return fallback;
  const v = raw.trim();
  if (v.startsWith('claude-')) return v;
  const map = {
    opus: 'claude-opus-4-8', 'opus 4.8': 'claude-opus-4-8',
    sonnet: 'claude-sonnet-4-6', 'sonnet 4.6': 'claude-sonnet-4-6',
    haiku: 'claude-haiku-4-5', 'haiku 4.5': 'claude-haiku-4-5',
  };
  return map[v.toLowerCase()] || fallback;
}
const MODEL = resolveModel(process.env.ANTHROPIC_MODEL);

// ── 系統提示 ──────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT =
  '你是一位頂尖的中文行銷文案大師。' +
  '請嚴格只輸出純 JSON 物件，禁止任何 markdown（例如 ```json）、前言或說明。' +
  '所有字串值中若需換行請用 \\n，禁止直接插入換行字元；字串中的雙引號需用 \\" 轉義。';

// ── 從原始文字中擷取第一個完整 JSON 物件 ─────────────────────────────────────
function extractJson(raw) {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  return raw.slice(start, end + 1);
}

// ── 將 Anthropic / 網路錯誤轉成結構化的使用者友善訊息 ─────────────────────────
// retryable=true  → 前端可重試
// retryable=false → 重試無效，需要使用者介入
function classifyError(err) {
  const status   = err?.status;
  const msg      = (err?.message || '').toLowerCase();
  const errType  = (err?.error?.type || err?.type || '').toLowerCase();
  const errCode  = (err?.error?.code || '').toLowerCase();

  // 餘額不足 / 信用卡付款失敗
  if (
    errCode === 'credit_balance_too_low' ||
    msg.includes('credit balance') ||
    msg.includes('insufficient') ||
    msg.includes('billing') ||
    msg.includes('payment')
  ) {
    return {
      code: 'NO_CREDITS',
      httpStatus: 402,
      title: '💳 Anthropic 點數不足',
      message: '您的 Anthropic 帳戶餘額已用完，請前往官網儲值後再試。',
      action: '前往 Anthropic 儲值',
      actionUrl: 'https://console.anthropic.com/settings/billing',
      retryable: false,
    };
  }

  // API Key 無效 / 未設定
  if (status === 401 || errType === 'authentication_error') {
    return {
      code: 'BAD_KEY',
      httpStatus: 401,
      title: '🔑 API Key 無效',
      message: 'ANTHROPIC_API_KEY 設定有誤或已失效，請到 Vercel 環境變數重新確認。',
      action: '前往 Vercel 設定',
      actionUrl: 'https://vercel.com/dashboard',
      retryable: false,
    };
  }

  // 模型不存在
  if (status === 404 || errType === 'not_found_error') {
    return {
      code: 'BAD_MODEL',
      httpStatus: 404,
      title: '❓ 模型 ID 錯誤',
      message: `找不到模型「${MODEL}」，請到 Vercel 確認 ANTHROPIC_MODEL 環境變數是否正確。`,
      action: '前往 Vercel 設定',
      actionUrl: 'https://vercel.com/dashboard',
      retryable: false,
    };
  }

  // 請求頻率超限
  if (status === 429 || errType === 'rate_limit_error') {
    return {
      code: 'RATE_LIMIT',
      httpStatus: 429,
      title: '⏳ 請求頻率過高',
      message: '短時間內呼叫次數超過 Anthropic 限制，請稍候 30 秒後再試。',
      action: null,
      retryable: true,
    };
  }

  // Anthropic 服務過載
  if (status === 529 || errType === 'overloaded_error') {
    return {
      code: 'OVERLOADED',
      httpStatus: 503,
      title: '🔄 AI 服務暫時繁忙',
      message: 'Anthropic 伺服器目前負載過高，通常幾秒後即可恢復，請稍後再試。',
      action: null,
      retryable: true,
    };
  }

  // Anthropic 內部錯誤
  if (status >= 500 && status < 600) {
    return {
      code: 'SERVER_ERROR',
      httpStatus: status,
      title: '⚙️ Anthropic 伺服器錯誤',
      message: `Anthropic 服務回傳 ${status} 錯誤，屬暫時性問題，請稍後重試。`,
      action: 'Anthropic 服務狀態',
      actionUrl: 'https://status.anthropic.com',
      retryable: true,
    };
  }

  // 預設未知錯誤
  return {
    code: 'UNKNOWN',
    httpStatus: status || 500,
    title: '⚠️ AI 生成失敗',
    message: String(err?.message || err || '未知錯誤'),
    action: null,
    retryable: true,
  };
}

// ── 主 handler ────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({
      code: 'METHOD_NOT_ALLOWED',
      title: '請求方式錯誤',
      message: '請使用 POST 方式呼叫此端點。',
      retryable: false,
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      code: 'NO_KEY_ENV',
      title: '🔑 伺服器未設定 API Key',
      message: '請到 Vercel 環境變數新增 ANTHROPIC_API_KEY。',
      action: '前往 Vercel 設定',
      actionUrl: 'https://vercel.com/dashboard',
      retryable: false,
    });
  }

  let prompt;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    prompt = body.prompt;
    if (!prompt || typeof prompt !== 'string') throw new Error('missing prompt');
  } catch {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      title: '請求參數錯誤',
      message: '缺少 prompt 欄位，請重新整理頁面後再試。',
      retryable: false,
    });
  }

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: '{' }, // Prefill：強制 JSON 開頭
      ],
    });

    const rawText = (message.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('');

    if (!rawText) {
      return res.status(500).json({
        code: 'EMPTY_RESPONSE',
        title: '⚙️ AI 回應為空',
        message: 'Claude API 未回傳任何內容，請稍後重試。',
        retryable: true,
      });
    }

    const fullText = '{' + rawText;
    const jsonText = extractJson(fullText);

    if (!jsonText) {
      console.error('[generate] 無法擷取 JSON:', fullText.slice(0, 200));
      return res.status(500).json({
        code: 'BAD_JSON',
        title: '⚙️ AI 回應格式錯誤',
        message: '模型回應無法解析為 JSON，系統將自動重試。',
        retryable: true,
      });
    }

    try {
      JSON.parse(jsonText);
    } catch (parseErr) {
      console.error('[generate] JSON.parse 失敗:', parseErr.message, jsonText.slice(0, 200));
      return res.status(500).json({
        code: 'BAD_JSON',
        title: '⚙️ AI 回應格式錯誤',
        message: '模型回應格式異常，系統將自動重試。',
        retryable: true,
      });
    }

    return res.status(200).json({ text: jsonText });

  } catch (err) {
    const classified = classifyError(err);
    console.error('[generate] error:', classified.code, err?.status, err?.message);
    return res.status(classified.httpStatus).json(classified);
  }
}
