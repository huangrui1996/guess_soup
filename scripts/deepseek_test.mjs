import fs from 'node:fs'

const envText = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
const env = envText
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean)
  .reduce((acc, line) => {
    const idx = line.indexOf('=')
    if (idx === -1) return acc
    const k = line.slice(0, idx).trim()
    const v = line.slice(idx + 1).trim()
    acc[k] = v
    return acc
  }, {})

const key = env.VITE_DEEPSEEK_API_KEY
const baseUrl = env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
const model = env.VITE_DEEPSEEK_MODEL || 'deepseek-chat'

if (!key) {
  console.error('Missing VITE_DEEPSEEK_API_KEY in .env')
  process.exit(1)
}

const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`

const story = { surface: '测试汤面', bottom: '测试汤底' }
const question = '有人死亡吗？ 是意外吗？'
const prompt = [
  '你是一个海龟汤游戏的主持人。',
  `当前故事的汤面是：${story.surface}`,
  `故事的汤底是：${story.bottom}`,
  '玩家只能回答以下三种之一：是 / 否 / 无关。',
  '只回答是、否、无关，不要解释。',
].join('\n')

const body = {
  model,
  temperature: 0,
  max_tokens: 8,
  stream: false,
  messages: [
    { role: 'system', content: prompt },
    { role: 'user', content: question },
  ],
}

const res = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
})

const text = await res.text()
console.log('HTTP', res.status)
console.log('Response (first 1500 chars):')
console.log(text.slice(0, 1500))

