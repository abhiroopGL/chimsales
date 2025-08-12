"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { ShoppingCart, Menu, X, UserCircle, ChevronDown } from "lucide-react"
import { logoutUser } from "../../redux/slices/authSlice"
import { showNotification } from "../../redux/slices/notificationSlice"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.authorization)
  const { items } = useSelector((state) => state.cart)
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
    setIsProfileOpen(false)
    setIsMenuOpen(false)
    dispatch(showNotification({ type: "success", message: "Logged out successfully" }))
    navigate("/")
  }

  return (
    <nav className="bg-white backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 font-[Poppins] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/your-logo.png" alt="Logo" className="h-10 w-10 rounded-lg shadow-md" />
            <span className="text-2xl font-semibold text-black tracking-wide">MetalcoSteel</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {["Home", "Products", "About", "Contact"].map((item, idx) => (
              <Link
                key={idx}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-gray-800 hover:text-black transition-all duration-300 relative group font-medium"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
              <Link to="/cart" className="relative text-gray-800 hover:text-black transition-all duration-300">
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-black text-white text-xs rounded-full px-1.5 py-0.5 shadow-md">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </Link>

            {isAuthenticated && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-gray-800 hover:text-black transition-all duration-300"
                >
                  <UserCircle className="h-7 w-7" />
                  <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-300">
                      <p className="text-black font-medium truncate">{user?.name}</p>
                      <p className="text-sm text-gray-600 truncate">{user?.phone}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile Settings</Link>
                    {/* <Link to="/invoices" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Invoices</Link> */}
                    {user?.role === "admin" && (
                      <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Admin Dashboard</Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) 
            // : (
            //   <Link
            //     to="/login"
            //     className="bg-black text-white px-5 py-2 rounded-md font-medium hover:bg-gray-900 transition shadow-md"
            //   >
            //     Login
            //   </Link>
            // )
            }

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-800 hover:text-black focus:outline-none focus:ring-2 focus:ring-black rounded"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Links */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 pt-4 pb-6 flex flex-col space-y-3 mt-2">
            {["Home", "Products", "About", "Contact"].map((item, idx) => (
              <Link
                key={idx}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-gray-800 hover:text-black px-4 py-2 transition-all duration-200 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            {/* Mobile Auth Links */}
            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-300 mt-3 pt-3 px-4">
                  <p className="text-black font-semibold truncate">{user?.name}</p>
                  <p className="text-sm text-gray-600 truncate">{user?.phone}</p>
                </div>

                <Link
                  to="/profile"
                  className="text-gray-800 hover:text-black px-4 py-2 transition-all duration-200 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile Settings
                </Link>

                {/* <Link
                  to="/invoices"
                  className="text-gray-800 hover:text-black px-4 py-2 transition-all duration-200 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Invoices
                </Link> */}

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-800 hover:text-black px-4 py-2 transition-all duration-200 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-red-600 hover:bg-gray-100 px-4 py-2 rounded-md transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-black text-white px-5 py-2 rounded-md font-medium hover:bg-gray-900 transition shadow-md mx-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
