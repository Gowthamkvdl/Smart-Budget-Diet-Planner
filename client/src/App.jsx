import { useState } from 'react'
import './App.css'
import DietPlanner from './components/DietPlanner'
import ParticalBG from './components/ParticalBG'

function App() {
  // Disable hover effects on touch devices to avoid sticky :hover
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add('no-hover');
  }
  return (
    <div className=''>
      <ParticalBG />
      <DietPlanner />
    </div>
  )
}

export default App
