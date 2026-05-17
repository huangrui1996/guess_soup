import { Link } from 'react-router-dom'
import type { TDifficulty, TStory, TStoryType } from '../data/stories'

function difficultyLabel(difficulty: TDifficulty) {
  if (difficulty === 'easy') return '简单'
  if (difficulty === 'medium') return '中等'
  return '有难度'
}

function typeColor(type: TStoryType) {
  switch (type) {
    case '都市怪谈':
      return 'border-amber-400/30'
    case '日常悖论':
      return 'border-pink-400/30'
    case '科幻脑洞':
      return 'border-cyan-400/30'
    case '轻松搞笑':
      return 'border-lime-400/30'
  }
}

export default function GameCard({ story }: { story: TStory }) {
  const badgeClass = typeColor(story.type)

  return (
    <div className={`rounded-lg shadow-lg border border-slate-700/60 p-4 ${badgeClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-amber-400">{story.title}</div>
          <div className="mt-1 text-sm text-slate-300">
            难度：{difficultyLabel(story.difficulty)} · 类型：{story.type}
          </div>
        </div>
        <div className="shrink-0 rounded-md bg-slate-800/60 px-2 py-1 text-xs text-slate-200">
          {story.difficulty.toUpperCase()}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Link
          to={`/game/${story.id}`}
          className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-amber-300"
        >
          开始
        </Link>
      </div>
    </div>
  )
}

