import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/home'
import Themes from './pages/themes'
import { AnimatePresence } from 'framer-motion'

export default function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/themes/*" element={<Themes />} />
      </Routes>
    </AnimatePresence>
  )
}
