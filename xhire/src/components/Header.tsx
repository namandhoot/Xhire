import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiTwitter, FiBookmark, FiUser, FiLogIn } from 'react-icons/fi';

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, username = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <FiTwitter className="text-primary text-2xl mr-2" />
            <span className="text-xl font-bold">
              <span className="text-primary">X</span>Hire
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-secondary hover:text-primary transition-colors">
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/bookmarks" className="flex items-center text-secondary hover:text-primary transition-colors">
                  <FiBookmark className="mr-1" />
                  <span>Bookmarks</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-secondary hover:text-primary transition-colors">
                    <FiUser className="mr-1" />
                    <span>{username || 'Account'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-secondary hover:bg-lighter">
                      Profile Settings
                    </Link>
                    <Link to="/notifications" className="block px-4 py-2 text-sm text-secondary hover:bg-lighter">
                      Job Alerts
                    </Link>
                    <div className="border-t border-lighter my-1"></div>
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-lighter">
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/pricing" className="text-secondary hover:text-primary transition-colors">
                  Pricing
                </Link>
                <Link to="/login" className="flex items-center btn-primary">
                  <FiLogIn className="mr-1" />
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-lighter">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-secondary hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/bookmarks" 
                    className="flex items-center text-secondary hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiBookmark className="mr-1" />
                    <span>Bookmarks</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center text-secondary hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="mr-1" />
                    <span>Profile Settings</span>
                  </Link>
                  <Link 
                    to="/notifications" 
                    className="text-secondary hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Job Alerts
                  </Link>
                  <button className="text-left text-red-500 hover:text-red-600 transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/pricing" 
                    className="text-secondary hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    to="/login" 
                    className="flex items-center w-fit btn-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiLogIn className="mr-1" />
                    <span>Sign In</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 