import { useEffect, useMemo, useRef, useState } from 'react'
import MessageBubble, { type TMessage } from './Message'

export default function ChatBox({
  messages,
  onSend,
  canReveal,
  isSending,
}: {
  messages: TMessage[]
  onSend: (question: string) => void
  canReveal: boolean
  isSending: boolean
}) {
  const [question, setQuestion] = useState('')
  const [cooldownUntil, setCooldownUntil] = useState<number>(0)
  const listRef = useRef<HTMLDivElement | null>(null)

  const userTurns = useMemo(
    () => messages.filter((m) => m.role === 'user').length,
    [messages],
  )

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages])

  const handleSubmit = () => {
    const now = Date.now()
    if (isSending) return
    if (now < cooldownUntil) return

    const trimmed = question.trim()
    if (!trimmed) return

    setQuestion('')
    setCooldownUntil(now + 900) // 防止疯狂点击导致无效请求
    onSend(trimmed)
  }

  return (
    <div className="rounded-lg border border-slate-700/60 bg-slate-800/20 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-700/60 px-3 py-2">
        <div className="text-sm text-slate-200">
          你已经提问：<span className="text-amber-400">{userTurns}</span> 轮
        </div>
        <div className="text-xs text-slate-300">
          {canReveal ? '已满足查看汤底条件' : '继续提问以查看汤底'}
        </div>
      </div>

      <div
        ref={listRef}
        className="max-h-[44vh] overflow-y-auto px-2 py-3 bg-slate-900/30"
      >
        {messages.length === 0 ? (
          <div className="text-sm text-slate-300 px-2 py-6 text-center">
            输入你的猜想问题，AI 只会回答：是 / 否 / 无关
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-700/60">
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="请输入你的猜想问题，或答案，比如有人死亡吗？ 是意外吗？ 和食物有关吗？"
            className="flex-1 rounded-lg bg-slate-900/50 border border-slate-700/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-400/60"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={Date.now() < cooldownUntil || isSending}
            className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-900 shadow-lg hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            提交
          </button>
        </div>
      </div>
    </div>
  )
}

