import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Earn', href: '/earn' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Staking', href: '/staking' },
  ];

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-16 py-4 bg-black relative">
      <div className="flex items-center gap-4 sm:gap-12">
        <Link to="/" className="flex items-center gap-2 text-white font-semibold text-lg sm:text-xl">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 6V12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V6L12 2Z" fill="white"/>
            <path d="M12 6L8 8V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V8L12 6Z" fill="black"/>
          </svg>
          <span>Sandclock</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-base transition-colors ${
                location.pathname === link.href
                  ? 'text-white border-b-2 border-green-500 pb-1'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`text-base transition-colors ${
                location.pathname === '/admin'
                  ? 'text-white border-b-2 border-green-500 pb-1'
                  : 'text-yellow-500 hover:text-yellow-400'
              }`}
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      {/* Desktop User Actions */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">
                ${user.balance?.toFixed(2) || '0.00'}
              </span>
              <span className="text-white text-sm font-medium">
                {user.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="px-6 py-2.5 text-base text-white border border-gray-600 rounded-full hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-6 py-2.5 text-base text-white border border-gray-600 rounded-full hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 text-base text-black bg-green-500 rounded-full hover:bg-green-400 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-white p-2"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black border-t border-white/10 md:hidden z-50">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base transition-colors ${
                  location.pathname === link.href
                    ? 'text-white border-l-4 border-green-500 pl-3'
                    : 'text-gray-400 hover:text-white pl-3'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base transition-colors ${
                  location.pathname === '/admin'
                    ? 'text-white border-l-4 border-green-500 pl-3'
                    : 'text-yellow-500 hover:text-yellow-400 pl-3'
                }`}
              >
                Admin
              </Link>
            )}
            
            <div className="border-t border-white/10 pt-4 mt-4">
              {user ? (
                <>
                  <div className="px-3 py-2 mb-3">
                    <p className="text-gray-400 text-xs mb-1">Balance</p>
                    <p className="text-white font-semibold">${user.balance?.toFixed(2) || '0.00'}</p>
                    <p className="text-gray-400 text-sm mt-1">{user.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full px-6 py-2.5 text-base text-white border border-gray-600 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-6 py-2.5 text-center text-base text-white border border-gray-600 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-6 py-2.5 text-center text-base text-black bg-green-500 rounded-full hover:bg-green-400 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
