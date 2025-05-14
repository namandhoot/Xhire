import { FiTwitter, FiGithub, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-lighter mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <FiTwitter className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold">
                <span className="text-primary">X</span>Hire
              </span>
            </Link>
            <p className="text-dark text-sm">
              Job Hunt, Reimagined via X (Twitter). Find your next opportunity from tweets!
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-dark hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-dark hover:text-primary transition-colors">
                  Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-dark hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-dark hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-dark hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-dark hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://twitter.com/xhire" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark hover:text-primary transition-colors"
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="https://github.com/xhire" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark hover:text-primary transition-colors"
              >
                <FiGithub size={20} />
              </a>
              <a 
                href="mailto:info@xhire.com" 
                className="text-dark hover:text-primary transition-colors"
              >
                <FiMail size={20} />
              </a>
            </div>
            <p className="text-dark text-sm">
              Questions or feedback? <br />
              <a href="mailto:info@xhire.com" className="text-primary hover:underline">
                info@xhire.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-lighter mt-8 pt-6 text-center text-dark text-sm">
          <p>&copy; {new Date().getFullYear()} XHire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 