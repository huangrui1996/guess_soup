import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MessageBubble, { type TMessage } from '../components/Message'
import StoryReveal from '../components/StoryReveal'
import { STORIES, type TStory } from '../data/stories'

type TPersistedGame = {
  storyId: string
  messages: TMessage[]
  updatedAt: number
}

const STORAGE_KEY = 'AI_HAIGUITANG_GAME_PROGRESS_V1'

export default function Result() {
  const navigate = useNavigate()
  const { storyId } = useParams()

  const story: TStory | undefined = useMemo(() => {
    if (!storyId) return undefined
    return STORIES.find((s) => s.id === storyId)
  }, [storyId])

  const [messages, setMessages] = useState<TMessage[]>([])
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!storyId) return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as TPersistedGame
      if (parsed.storyId !== storyId) return
      setMessages(Array.isArray(parsed.messages) ? parsed.messages : [])
    } catch {
      // ignore
    }
  }, [storyId])

  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY)
    navigate('/')
  }

  const canShow = expanded ? messages.length > 0 : messages.length > 0

  if (!story) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center px-3">
        <div className="rounded-lg border border-slate-700/60 bg-slate-800/20 p-6 shadow-lg text-center">
          <div className="text-amber-400 font-semibold mb-2">找不到该汤底</div>
          <button
            type="button"
            onClick={handleRestart}
            className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
          >
            返回大厅
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100svh] px-3 sm:px-6 py-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <header className="flex items-center justify-between gap-3">
          <div>
            <div className="text-amber-400 font-bold text-xl sm:text-2xl">
              {story.title}
            </div>
            <div className="text-sm text-slate-300 mt-1">
              {story.type} · 难度：{story.difficulty}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRestart}
            className="rounded-lg border border-slate-700/60 bg-slate-800/30 px-3 py-2 text-sm text-slate-200 hover:border-amber-400/50"
          >
            再来一局
          </button>
        </header>

        <StoryReveal bottom={story.bottom} />

        <section className="rounded-lg border border-slate-700/60 bg-slate-800/20 p-4 shadow-lg">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="text-amber-400 font-semibold text-sm">
              推理过程
            </div>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="rounded-lg bg-slate-900/40 border border-slate-700/60 px-3 py-1.5 text-xs text-slate-200 hover:border-amber-400/40"
            >
              {expanded ? '折叠' : '展开'}
            </button>
          </div>

          {canShow ? (
            <div
              className={[
                'space-y-2',
                expanded ? '' : 'max-h-56 overflow-y-auto pr-1',
              ].join(' ')}
            >
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-300 text-center py-6">
              暂无对话记录
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

