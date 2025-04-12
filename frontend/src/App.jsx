import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NotFound from './pages/not-found';
import AuthLogin from "./pages/auth/login.jsx";
import AuthRegister from "./pages/auth/register.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route path="*" element={<NotFound/>}/>
        <Route path="login" element={<AuthLogin/>}/>
        <Route path="signup" element={<AuthRegister/>}/>
      </Routes>
    </div>
  )
}

export default App
