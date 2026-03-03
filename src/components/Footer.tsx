import { GraduationCap, Mail, MapPin, Phone, ArrowUpRight, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white pt-24 pb-12 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1 space-y-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gold-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <GraduationCap className="h-8 w-8 text-navy-950" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tight">NUB Portal</span>
                <span className="text-[10px] text-gold-500 uppercase tracking-[0.2em] font-black">Academic Excellence</span>
              </div>
            </Link>
            <p className="text-navy-400 text-sm leading-relaxed font-medium">
              Empowering students through accessible academic resources. The official lecture materials repository for Northern University Bangladesh.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-navy-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-navy-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-navy-400 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500 mb-8">Navigation</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/" className="text-navy-400 hover:text-white transition-colors flex items-center space-x-2 group"><span>Home</span><ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link to="/courses" className="text-navy-400 hover:text-white transition-colors flex items-center space-x-2 group"><span>Courses</span><ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link to="/announcements" className="text-navy-400 hover:text-white transition-colors flex items-center space-x-2 group"><span>Announcements</span><ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link to="/login" className="text-navy-400 hover:text-white transition-colors flex items-center space-x-2 group"><span>Admin Portal</span><ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500 mb-8">Contact Info</h3>
            <ul className="space-y-6 text-sm font-medium text-navy-400">
              <li className="flex items-start space-x-4">
                <div className="bg-white/5 p-2 rounded-lg shrink-0">
                  <MapPin className="h-5 w-5 text-gold-500" />
                </div>
                <span>Sher-E-Bangla Nagar, <br />Dhaka-1207, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="bg-white/5 p-2 rounded-lg shrink-0">
                  <Phone className="h-5 w-5 text-gold-500" />
                </div>
                <span>+880 2 9110730</span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="bg-white/5 p-2 rounded-lg shrink-0">
                  <Mail className="h-5 w-5 text-gold-500" />
                </div>
                <span>info@nub.ac.bd</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 relative group">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500 mb-4">University Motto</h3>
            <p className="text-lg font-display font-bold text-white leading-tight italic">
              "Knowledge for Excellence"
            </p>
            <div className="mt-8">
              <a href="https://nub.ac.bd" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gold-500 hover:text-gold-400 transition-colors">
                <span>Visit Official Site</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-xs font-bold text-navy-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Northern University Bangladesh.
          </p>
          <div className="flex space-x-10 text-xs font-bold text-navy-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
