import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Users } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import NotificationCenter from "@/components/NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ProChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && (
              <Link to="/home" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
            )}
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/properties" className="text-foreground hover:text-primary transition-colors">
              Properties
            </Link>
            {user?.role === 'admin' && (
              <Link to="/users" className="text-foreground hover:text-primary transition-colors">
                Users
              </Link>
            )}
          </div>

          {/* Wallet Connect, Notifications, and User Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <NotificationCenter />
            {isAuthenticated ? (
              <>
                <ConnectButton />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user?.name}
                      <div className="text-xs text-muted-foreground font-normal capitalize">
                        {user?.role}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/buyer-login">Buyer Login</Link>
                </Button>
                <Button variant="hero" asChild>
                  <Link to="/admin-login">Admin Login</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated && (
              <Link
                to="/home"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            )}
            <Link
              to="/dashboard"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/properties"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Properties
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/users"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Users
              </Link>
            )}
            <div className="pt-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="w-full">
                    <ConnectButton />
                  </div>
                  <div className="text-sm text-muted-foreground px-2">
                    Signed in as {user?.name} ({user?.role})
                  </div>
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="default" className="w-full" asChild>
                    <Link to="/buyer-login" onClick={() => setIsMenuOpen(false)}>
                      Buyer Login
                    </Link>
                  </Button>
                  <Button variant="hero" size="default" className="w-full" asChild>
                    <Link to="/admin-login" onClick={() => setIsMenuOpen(false)}>
                      Admin Login
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
