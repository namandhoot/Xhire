import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  isLoggedIn?: boolean;
  username?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  isLoggedIn = false, 
  username = '' 
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} username={username} />
      <main className="container mx-auto px-4 py-6 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 