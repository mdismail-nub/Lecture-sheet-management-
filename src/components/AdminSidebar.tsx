import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Upload, 
  Bell, 
  LogOut, 
  GraduationCap,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { api } from "../lib/api";
import { motion, AnimatePresence } from "motion/react";

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: BookOpen, label: "Manage Courses", path: "/admin/courses" },
    { icon: Upload, label: "Upload Materials", path: "/admin/materials" },
    { icon: Bell, label: "Announcements", path: "/admin/announcements" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-navy-950 text-white">
      <div className="p-8 border-b border-white/5">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-gold-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <GraduationCap className="h-7 w-7 text-navy-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight">Admin Portal</span>
            <span className="text-[10px] text-gold-500 uppercase tracking-[0.2em] font-black">NUB Academic</span>
          </div>
        </Link>
      </div>

      <nav className="flex-grow p-6 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? "bg-gold-500 text-navy-950 font-bold shadow-xl shadow-gold-500/20" 
                  : "text-navy-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`h-5 w-5 ${isActive ? "text-navy-950" : "text-navy-400 group-hover:text-white"}`} />
                <span className="text-sm tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        <div className="px-4 py-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-[10px] text-navy-500 uppercase tracking-widest font-black mb-1">Authenticated as</p>
          <p className="text-xs font-semibold text-navy-100 truncate">admin@nub.ac.bd</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-navy-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-navy-950 text-white flex items-center justify-between px-6 z-[60] border-b border-white/5">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-gold-500" />
          <span className="font-display font-bold text-lg">Admin Portal</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 flex-col shadow-2xl z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-[70] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-[80] lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
