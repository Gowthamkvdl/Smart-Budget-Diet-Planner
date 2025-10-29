import { useState } from 'react'
import './App.css'
import DietPlanner from './components/DietPlanner'
import ParticalBG from './components/ParticalBG'

function App() {

  return (
    <div className=''>
      <ParticalBG />
      <DietPlanner />
    </div>
  )
}

export default App
