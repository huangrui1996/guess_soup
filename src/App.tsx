import { Navigate, Route, Routes } from 'react-router-dom'
import { GradientDots } from '@/components/ui/gradient-dots'
import Home from './pages/Home'
import Game from './pages/Game'
import Result from './pages/Result'

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientDots
        className="pointer-events-none z-0 opacity-20"
        dotSize={8}
        spacing={14}
        duration={42}
        colorCycleDuration={14}
        backgroundColor="transparent"
      />

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:storyId" element={<Game />} />
          <Route path="/result/:storyId" element={<Result />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

