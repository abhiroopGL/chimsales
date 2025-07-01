"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { ShoppingCart, Menu, X, UserCircle, LogOut, Settings, FileText, Shield, ChevronDown } from "lucide-react"
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

  // Close profile dropdown when clicking outside
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
    dispatch(showNotification({
      type: "success",
      message: "Logged out successfully"
    }))
    navigate("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
  <nav className="bg-black shadow-lg sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-white">MetalcoSteel</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="ml-4 flex items-baseline space-x-2 lg:space-x-8">
            <Link
              to="/"
              className="text-gray-200 hover:text-white px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-200 hover:text-white px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-gray-200 hover:text-white px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-200 hover:text-white px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Shopping Cart */}
          {isAuthenticated && (
            <Link
              to="/cart"
              className="relative p-2 text-gray-200 hover:text-white transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse border border-gray-400">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </Link>
          )}

          {/* User Profile or Login */}
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-200 hover:text-white transition-colors duration-200 p-2 rounded-md"
              >
                <UserCircle className="h-6 w-6" />
                <span className="hidden sm:block text-sm font-medium truncate max-w-[80px]">{user?.fullName || "User"}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-gray-900 rounded-md shadow-lg py-2 z-50 border border-gray-700">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    <p className="text-sm text-gray-400 truncate">{user?.phone}</p>
                  </div>

                  {/* Menu Items */}
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Profile Settings
                  </Link>

                  <Link
                    to="/invoices"
                    className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    My Invoices
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Shield className="h-4 w-4 mr-3" />
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gray-800 text-white px-4 sm:px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Login
            </Link>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-200 hover:text-white p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <>
          {/* Optional: Add a semi-transparent backdrop for focus */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
            onClick={closeMenu}
          />
          <div className="md:hidden z-50 relative">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 rounded-lg mt-2 border border-gray-800">
              <Link
                to="/"
                className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                Contact
              </Link>

              {/* Mobile User Menu */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <div className="flex items-center px-3 py-2">
                      <UserCircle className="h-8 w-8 text-gray-400" />
                      <div className="ml-3">
                        <div className="text-base font-medium text-white truncate">{user?.name}</div>
                        <div className="text-sm text-gray-400 truncate">{user?.phone}</div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/cart"
                    className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                    onClick={closeMenu}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart ({cartItemsCount})
                  </Link>

                  <Link
                    to="/profile"
                    className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    Profile Settings
                  </Link>

                  <Link
                    to="/invoices"
                    className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    My Invoices
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      onClick={closeMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  </nav>
)
}

export default Navbar
