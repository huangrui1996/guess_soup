import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ChatBox from '../components/ChatBox'
import { type TMessage } from '../components/Message'
import { STORIES, type TStory } from '../data/stories'
import { askDeepSeekTurtleHost, type TYesNoIrrelevant } from '../services/deepseek'

type TPersistedGame = {
  storyId: string
  messages: TMessage[]
  updatedAt: number
}

const STORAGE_KEY = 'AI_HAIGUITANG_GAME_PROGRESS_V1'

export default function Game() {
  const navigate = useNavigate()
  const { storyId } = useParams()

  const story: TStory | undefined = useMemo(() => {
    if (!storyId) return undefined
    return STORIES.find((s) => s.id === storyId)
  }, [storyId])

  const [messages, setMessages] = useState<TMessage[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (!storyId) return
    setHydrated(false)
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      setMessages([])
      setHydrated(true)
      return
    }

    try {
      const parsed = JSON.parse(raw) as TPersistedGame
      if (parsed.storyId !== storyId) {
        setMessages([])
        setHydrated(true)
        return
      }
      setMessages(Array.isArray(parsed.messages) ? parsed.messages : [])
    } catch {
      // ignore parse errors
    } finally {
      setHydrated(true)
    }
  }, [storyId])

  useEffect(() => {
    if (!storyId) return
    // 防止“刚切换 storyId 时保存空数组”覆盖本地进度
    if (!hydrated) return

    if (messages.length === 0) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    const payload: TPersistedGame = {
      storyId,
      messages,
      updatedAt: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [messages, storyId, hydrated])

  const userTurns = useMemo(
    () => messages.filter((m) => m.role === 'user').length,
    [messages],
  )
  const canReveal = userTurns > 2

  const handleSend = async (question: string) => {
    if (!storyId || !story) return
    if (isSending) return

    const now = Date.now()
    const id1 = crypto.randomUUID ? crypto.randomUUID() : String(now)
    const id2 = crypto.randomUUID ? crypto.randomUUID() : String(now + 1)

    setIsSending(true)
    setMessages((prev) => [
      ...prev,
      { id: id1, role: 'user', content: question, timestamp: now },
    ])

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 15000)

    try {
      const answer: TYesNoIrrelevant = await askDeepSeekTurtleHost({
        story,
        question,
        signal: controller.signal,
      })

      setMessages((prev) => [
        ...prev,
        { id: id2, role: 'assistant', content: answer, timestamp: Date.now() },
      ])
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.warn('发送失败，兜底无关', err?.message ?? String(err))
      setMessages((prev) => [
        ...prev,
        { id: id2, role: 'assistant', content: '无关', timestamp: Date.now() },
      ])
    } finally {
      window.clearTimeout(timeoutId)
      setIsSending(false)
    }
  }

  const handleReveal = () => {
    if (!storyId || !canReveal) return
    navigate(`/result/${storyId}`)
  }

  const handleEndGame = () => {
    const ok = window.confirm('确定结束游戏并返回大厅吗？')
    if (!ok) return
    localStorage.removeItem(STORAGE_KEY)
    navigate('/')
  }

  if (!story) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center px-3">
        <div className="rounded-lg border border-slate-700/60 bg-slate-800/20 p-6 shadow-lg text-center">
          <div className="text-amber-400 font-semibold mb-2">找不到该局</div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
          >
            返回大厅
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100svh] px-3 sm:px-6 py-5">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <header className="flex items-start justify-between gap-3">
          <div>
            <div className="text-amber-400 font-bold text-xl sm:text-2xl">
              {story.title}
            </div>
            <div className="text-sm text-slate-300 mt-1">
              类型：{story.type} · 难度：{story.difficulty}
            </div>
          </div>
          <button
            type="button"
            onClick={handleEndGame}
            className="rounded-lg border border-slate-700/60 bg-slate-800/30 px-3 py-2 text-sm text-slate-200 hover:border-amber-400/50"
          >
            结束游戏
          </button>
        </header>

        <section className="rounded-lg border border-slate-700/60 bg-slate-800/20 p-4 shadow-lg">
          <div className="text-amber-400 font-semibold text-sm mb-2">
            汤面故事（固定展示）
          </div>
          <div className="whitespace-pre-wrap text-slate-200 leading-7 text-sm sm:text-base">
            {story.surface}
          </div>
        </section>

        <ChatBox
          messages={messages}
          onSend={handleSend}
          canReveal={canReveal}
          isSending={isSending}
        />

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReveal}
            disabled={!canReveal}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            查看汤底
          </button>
        </div>
      </div>
    </div>
  )
}

