import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NotFound from './pages/not-found';
import AuthLogin from "./pages/auth/login.jsx";
import AuthRegister from "./pages/auth/register.jsx";
import UserDashboard from "./pages/shopping-view/dashboard.jsx";
import ItemDetails from "./pages/shopping-view/item-details.jsx";
import ReviewBeforeCheckout from "./pages/shopping-view/review-before-checkout.jsx";
import AdminRoutes from "./routes/admin-routes.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
          <Route path="login" element={<AuthLogin/>}/>
          <Route path="signup" element={<AuthRegister/>}/>
          <Route path="/" element={<UserDashboard/>}/>
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="review" element={<ReviewBeforeCheckout/>} />
          <Route path="/*" element={<AdminRoutes />} />
          <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
  )
}

export default App
