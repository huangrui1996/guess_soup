export default function StoryReveal({ bottom }: { bottom: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-700/60 bg-slate-800/20 p-4 shadow-lg">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-400/15 via-transparent to-amber-400/15 animate-pulse" />
      <div className="relative">
        <div className="text-sm text-amber-400 font-semibold mb-2">
          汤底揭晓
        </div>
        <div className="whitespace-pre-wrap text-slate-200 leading-7 text-sm sm:text-base">
          {bottom}
        </div>
      </div>
    </div>
  )
}

