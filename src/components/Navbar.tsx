import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, GraduationCap, LogIn, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Courses", path: "/courses" },
    { label: "Announcements", path: "/announcements" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? "bg-white/80 backdrop-blur-xl border-b border-navy-50 py-3 shadow-xl shadow-navy-900/5" : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-navy-950 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-navy-950/20">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className={`font-display font-black text-2xl leading-tight tracking-tight transition-colors duration-500 ${scrolled ? "text-navy-950" : "text-white"}`}>
                  NUB Portal
                </span>
                <span className={`text-[10px] uppercase tracking-[0.2em] font-black transition-colors duration-500 ${scrolled ? "text-navy-500" : "text-gold-500"}`}>
                  Northern University Bangladesh
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`text-sm font-black uppercase tracking-widest transition-all duration-300 hover:text-gold-500 relative group ${
                      isActive 
                        ? (scrolled ? "text-navy-950" : "text-white") 
                        : (scrolled ? "text-navy-500" : "text-navy-400")
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full ${isActive ? "w-full" : ""}`}></span>
                  </Link>
                );
              })}
            </div>
            
            <div className="flex items-center space-x-6">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-500 w-48 focus:w-72 border-transparent focus:ring-0 ${
                    scrolled 
                      ? "bg-paper text-navy-950 focus:bg-white focus:border-navy-950 shadow-inner" 
                      : "bg-white/10 text-white focus:bg-white/20 focus:border-white/30 placeholder:text-navy-500"
                  }`}
                />
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-500 ${scrolled ? "text-navy-400" : "text-navy-500"}`} />
              </form>

              <Link 
                to="/login" 
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-xl ${
                  scrolled 
                    ? "bg-navy-950 text-white hover:bg-navy-800 shadow-navy-950/20" 
                    : "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-gold-500/20"
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                scrolled ? "bg-paper text-navy-950" : "bg-white/10 text-white"
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-navy-50 overflow-hidden shadow-2xl"
          >
            <div className="px-6 pt-6 pb-10 space-y-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-medium shadow-inner"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" />
              </form>
              
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center justify-between px-4 py-4 rounded-2xl text-base font-black uppercase tracking-widest text-navy-950 hover:bg-paper transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-5 w-5 text-navy-200" />
                  </Link>
                ))}
              </div>
              
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center justify-center space-x-3 w-full py-5 bg-navy-950 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-xl shadow-navy-950/20"
              >
                <LogIn className="h-5 w-5" />
                <span>Admin Login</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
