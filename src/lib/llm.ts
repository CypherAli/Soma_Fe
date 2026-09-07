/**
 * Một cửa duy nhất để gọi mô hình ngôn ngữ, KHÔNG khoá cứng vào nhà cung cấp nào.
 *
 * Lý do: hai chỗ dùng AI trong dự án (trợ lý giải phẫu, trợ lý bệnh lý) trước
 * đây gọi thẳng endpoint của Anthropic. Đổi sang DeepSeek hay bất kỳ dịch vụ
 * nào khác là phải sửa từng file, và dễ sửa sót một chỗ rồi tưởng đã đổi xong.
 *
 * Hai họ giao thức phủ gần hết thị trường:
 *   • anthropic — POST /v1/messages, khoá ở header x-api-key
 *   • openai    — POST /v1/chat/completions, khoá ở Authorization: Bearer
 *                 (DeepSeek, OpenAI, Groq, Together, Ollama, LM Studio…)
 *
 * Cấu hình bằng biến môi trường, xem .env.example. Không có khoá thì
 * `isConfigured()` trả false và chỗ gọi phải tự lo đường lui — mọi trợ lý
 * trong dự án đều có tầng tra cứu chạy được mà không cần AI.
 */

export type LlmProvider = "anthropic" | "openai";

export type LlmConfig = {
  provider: LlmProvider;
  baseUrl: string;
  model: string;
  apiKey: string;
};

const DEFAULTS: Record<LlmProvider, { baseUrl: string; model: string }> = {
  anthropic: { baseUrl: "https://api.anthropic.com", model: "claude-sonnet-5" },
  openai: { baseUrl: "https://api.deepseek.com", model: "deepseek-chat" },
};

/** Suy ra họ giao thức từ URL khi người dùng không khai báo AI_PROVIDER. */
function guessProvider(baseUrl: string | undefined, explicit: string | undefined): LlmProvider {
  if (explicit === "anthropic" || explicit === "openai") return explicit;
  if (baseUrl?.includes("anthropic.com")) return "anthropic";
  if (baseUrl) return "openai"; // mọi dịch vụ còn lại đều nhái giao thức OpenAI
  return "anthropic";
}

export function llmConfig(): LlmConfig | null {
  // ANTHROPIC_API_KEY vẫn đọc được để không phá cấu hình cũ của ai đang dùng.
  const apiKey = process.env.AI_API_KEY ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const baseUrl = process.env.AI_BASE_URL;
  const provider = guessProvider(baseUrl, process.env.AI_PROVIDER);
  return {
    provider,
    baseUrl: (baseUrl ?? DEFAULTS[provider].baseUrl).replace(/\/+$/, ""),
    model: process.env.AI_MODEL ?? DEFAULTS[provider].model,
    apiKey,
  };
}

export const isConfigured = () => llmConfig() !== null;

/**
 * Gọi mô hình, trả về chữ. Ném lỗi khi hỏng — chỗ gọi tự quyết định lui về đâu.
 */
export async function complete(opts: {
  system: string;
  user: string;
  maxTokens?: number;
  signal?: AbortSignal;
}): Promise<string> {
  const cfg = llmConfig();
  if (!cfg) throw new Error("chưa cấu hình AI_API_KEY");

  const maxTokens = opts.maxTokens ?? 900;
  const isAnthropic = cfg.provider === "anthropic";

  const url = isAnthropic
    ? `${cfg.baseUrl}/v1/messages`
    : `${cfg.baseUrl}/v1/chat/completions`;

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (isAnthropic) {
    headers["x-api-key"] = cfg.apiKey;
    headers["anthropic-version"] = "2023-06-01";
  } else {
    headers.authorization = `Bearer ${cfg.apiKey}`;
  }

  const body = isAnthropic
    ? {
        model: cfg.model,
        max_tokens: maxTokens,
        system: opts.system,
        messages: [{ role: "user", content: opts.user }],
      }
    : {
        model: cfg.model,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: opts.system },
          { role: "user", content: opts.user },
        ],
      };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: opts.signal,
  });
  if (!res.ok) {
    // Kèm phần đầu thân lỗi: "401" trơ trọi không cho biết là sai khoá, hết
    // hạn mức hay sai tên mô hình.
    const detail = await res.text().catch(() => "");
    throw new Error(`${cfg.provider} ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = isAnthropic
    ? ((data?.content ?? []) as { type?: string; text?: string }[])
        .filter((c) => c?.type === "text")
        .map((c) => c.text ?? "")
        .join("")
    : (data?.choices?.[0]?.message?.content ?? "");

  const out = String(text).trim();
  if (!out) throw new Error(`${cfg.provider} trả về rỗng`);
  return out;
}
