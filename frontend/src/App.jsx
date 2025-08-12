import { useEffect } from 'react'
import { Route, Routes } from "react-router-dom";
import './App.css'
import NotFound from './pages/not-found';
import AuthLogin from "./pages/auth/login.jsx";
import AuthRegister from "./pages/auth/register.jsx";
import UserDashboard from "./pages/shopping-view/dashboard.jsx";
import ItemDetails from "./pages/shopping-view/item-details.jsx";
import ReviewBeforeCheckout from "./pages/shopping-view/review-before-checkout.jsx";
import AdminRoutes from "./routes/admin-routes.jsx";
import ProfilePage from "./pages/user/profile.jsx";
import {useDispatch, useSelector} from "react-redux";
import { checkAuth } from "./redux/slices/authSlice.jsx";
import Notification from "./components/common/NotificationComponent.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import Cart from "./pages/shopping-view/cart.jsx";
import Navbar from './components/common/Navbar.jsx';
import Products from "./pages/shopping-view/products.jsx";
import ProductDetail from './pages/shopping-view/product-details.jsx';
import { fetchPublicProducts } from './redux/slices/productSlice.jsx';

function App() {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.authorization);

     useEffect(() => {
        dispatch(checkAuth());
        dispatch(fetchPublicProducts());
    }, []);

  return (
      <>
        <Notification/>
        <div className="flex flex-col overflow-hidden bg-white">
          <Navbar/>
          <Routes>
              <Route path="login" element={<AuthLogin/>}/>
              <Route path="signup" element={<AuthRegister/>}/>
              <Route path="/" element={<UserDashboard/>}/>
              {/* <Route path="/item/:id" element={<ItemDetails />} /> */}
              <Route path="/item/:id" element={<ProductDetail />} />
              <Route path="/review" element={<ReviewBeforeCheckout/>} />
              <Route path="/*" element={<AdminRoutes />} />
              <Route path="*" element={<NotFound/>}/>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/products" element={<Products />} />
          </Routes>
        </div>
    </>
  )
}

export default App
