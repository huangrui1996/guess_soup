export type TMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export default function MessageBubble({ message }: { message: TMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div
        className={[
          'max-w-[90%] rounded-lg px-3 py-2 shadow-lg',
          isUser
            ? 'bg-amber-400 text-slate-900 rounded-br-none'
            : 'bg-slate-800/70 text-slate-200 border border-slate-700 rounded-bl-none',
        ].join(' ')}
      >
        <div className="break-words text-sm leading-6">{message.content}</div>
      </div>
    </div>
  )
}

