import GameCard from '../components/GameCard'
import { STORIES } from '../data/stories'

export default function Home() {
  return (
    <div className="min-h-[100svh] px-3 sm:px-6 py-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-6">
          <div className="text-amber-400 text-2xl sm:text-3xl font-bold tracking-wide">
            AI 海龟汤
          </div>
          <div className="mt-2 text-sm text-slate-300">
            选择一个故事，输入“猜想问题”，AI 只回答：是 / 否 / 无关
          </div>
        </header>

        <div className="space-y-4">
          {STORIES.map((story) => (
            <GameCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  )
}

