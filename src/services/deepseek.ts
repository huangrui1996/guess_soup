import type { TStory } from '../data/stories'

export type TYesNoIrrelevant = '是' | '否' | '无关'

const DEEPSEEK_API_KEY: string | undefined = import.meta.env
  .VITE_DEEPSEEK_API_KEY
const DEEPSEEK_BASE_URL: string =
  import.meta.env.VITE_DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com'
const DEEPSEEK_MODEL: string =
  import.meta.env.VITE_DEEPSEEK_MODEL ?? 'deepseek-chat'

function normalizeAnswer(text: string): TYesNoIrrelevant {
  const normalized = text.trim()
  // 模型可能输出标点/换行，这里用包含判断兜底。
  if (/无关/.test(normalized) || /无法确定/.test(normalized)) return '无关'
  if (/是/.test(normalized)) return '是'
  if (/否/.test(normalized)) return '否'
  return '无关'
}

export async function askDeepSeekTurtleHost(params: {
  story: TStory
  question: string
  signal?: AbortSignal
}): Promise<TYesNoIrrelevant> {
  const { story, question, signal } = params

  if (!DEEPSEEK_API_KEY) {
    // 无 key 时不让游戏卡死：直接兜底“无关”
    // eslint-disable-next-line no-console
    console.warn('VITE_DEEPSEEK_API_KEY 未配置，返回：无关')
    return '无关'
  }

  const url = `${DEEPSEEK_BASE_URL.replace(/\/$/, '')}/chat/completions`
  const controllerSignal = signal

  const prompt = `你是一个海龟汤游戏的主持人。
当前故事的汤面是：${story.surface}
故事的汤底是：${story.bottom}
玩家会向你提问，你只能回答以下三种之一：
1. "是"：玩家的猜测与汤底一致
2. "否"：玩家的猜测与汤底矛盾
3. "无关"：玩家的猜测与汤底无关，无法判断

注意：
1.严格根据汤底判断，不要额外推理
2.只回答"是"、"否"、"无关"，不要解释、不要闲聊
3.如果无法判断，请回答"无关"
`

  const body = {
    model: DEEPSEEK_MODEL,
    temperature: 0,
    max_tokens: 8,
    stream: false, // 显式关闭流式，避免返回格式不匹配导致 400
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: question },
    ],
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controllerSignal,
    })

    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn('DeepSeek 请求失败', res.status, await safeReadText(res))
      return '无关'
    }

    const data = (await res.json()) as any
    const content: string =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      ''

    if (!content) {
      // eslint-disable-next-line no-console
      console.warn('DeepSeek 返回内容为空')
    }

    return normalizeAnswer(content)
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.warn('DeepSeek 请求异常', err?.message ?? String(err))
    return '无关'
  }
}

async function safeReadText(res: Response) {
  try {
    return await res.text()
  } catch {
    return ''
  }
}

