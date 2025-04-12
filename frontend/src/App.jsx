import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NotFound from './pages/not-found';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <div className="p-4 bg-blue-500 text-white">
      <h1 className="text-2xl font-bold">Hello, Tailwind CSS!</h1>
    </div>
      <Routes>
        <Route path="*" element={<NotFound/>}/>
        <Route path="login" element={<NotFound/>}/>
        <Route path="signup" element={<NotFound/>}/>
      </Routes>
    </div>
  )
}

export default App
