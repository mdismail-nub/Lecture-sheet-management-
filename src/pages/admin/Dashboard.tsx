import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  FileText, 
  Bell, 
  Plus, 
  Upload, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Activity,
  Clock,
  ExternalLink
} from "lucide-react";
import { api } from "../../lib/api";
import { Course, Material, Announcement } from "../../types";
import { motion } from "motion/react";
import { CardSkeleton, Skeleton } from "../../components/Skeleton";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    courses: 0,
    materials: 0,
    announcements: 0
  });
  const [recentMaterials, setRecentMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courses, materials, announcements] = await Promise.all([
          api.courses.getAll(),
          api.materials.getAll(),
          api.announcements.getAll()
        ]);
        setStats({
          courses: courses.length,
          materials: materials.length,
          announcements: announcements.length
        });
        setRecentMaterials(materials.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: "Total Courses", value: stats.courses, icon: BookOpen, color: "bg-blue-50 text-blue-600", border: "border-blue-100", trend: "+2 this month" },
    { label: "Materials Uploaded", value: stats.materials, icon: FileText, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100", trend: "+15 this week" },
    { label: "Announcements", value: stats.announcements, icon: Bell, color: "bg-amber-50 text-amber-600", border: "border-amber-100", trend: "Active" },
  ];

  return (
    <div className="space-y-10 pt-16 lg:pt-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-black text-navy-950 tracking-tight">Dashboard</h1>
          <p className="text-navy-500 font-serif text-xl italic">Welcome back, Dr. Ismail Tonmoy</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link 
            to="/admin/materials" 
            className="px-6 py-3.5 bg-navy-950 text-white rounded-2xl font-bold text-sm hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 flex items-center space-x-2 group"
          >
            <Upload className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
            <span>Upload Material</span>
          </Link>
          <Link 
            to="/admin/courses" 
            className="px-6 py-3.5 bg-white text-navy-950 border border-navy-50 rounded-2xl font-bold text-sm hover:bg-paper transition-all flex items-center space-x-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Course</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => <CardSkeleton key={i} />)
        ) : cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white p-8 rounded-[2rem] border border-navy-50 shadow-sm hover:shadow-xl hover:shadow-navy-900/5 transition-all duration-500 group relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-paper rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={`${card.color} p-4 rounded-2xl group-hover:rotate-6 transition-transform duration-300`}>
                <card.icon className="h-8 w-8" />
              </div>
              <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                <TrendingUp className="h-3 w-3" />
                <span>{card.trend}</span>
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-navy-400 text-xs font-black uppercase tracking-[0.2em] mb-1">{card.label}</p>
              <h3 className="text-5xl font-display font-black text-navy-950">{loading ? "..." : card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-navy-50 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-navy-50 flex items-center justify-between bg-paper">
            <div className="flex items-center space-x-3">
              <div className="bg-navy-950 p-2 rounded-xl">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-display font-black text-navy-950">Recent Uploads</h2>
            </div>
            <Link to="/admin/materials" className="text-navy-700 text-sm font-bold hover:text-navy-950 flex items-center space-x-1 group">
              <span>View All</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-navy-400 font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-6">Material Title</th>
                  <th className="px-8 py-6">Course</th>
                  <th className="px-8 py-6">Date</th>
                  <th className="px-8 py-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-10 w-10 rounded-xl" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-2 w-24" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-3 w-20" />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Skeleton className="h-5 w-12 rounded-full ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : recentMaterials.length > 0 ? (
                  recentMaterials.map((material) => (
                    <tr key={material.id} className="hover:bg-paper transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2.5 rounded-xl ${material.fileType === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-navy-50 text-navy-600'}`}>
                            {material.fileType === 'pdf' ? <FileText className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                          </div>
                          <span className="font-bold text-navy-950 group-hover:text-navy-700 transition-colors">{material.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm text-navy-700 font-bold">{material.courseCode}</span>
                          <span className="text-[10px] text-navy-400 font-black uppercase tracking-widest">{material.courseName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2 text-navy-400 text-xs font-bold">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{new Date(material.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          Live
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-navy-400 font-medium italic">No recent activity.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Info */}
        <div className="space-y-8">
          <div className="bg-navy-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-navy-950/20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full -mr-24 -mt-24 group-hover:scale-125 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 group-hover:scale-125 transition-transform duration-700"></div>
            
            <h3 className="text-2xl font-display font-black mb-8 relative z-10">Quick Actions</h3>
            <div className="space-y-4 relative z-10">
              <Link to="/admin/announcements" className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/5 group/item">
                <div className="flex items-center space-x-4">
                  <div className="bg-gold-500 p-2 rounded-lg">
                    <Bell className="h-5 w-5 text-navy-950" />
                  </div>
                  <span className="text-sm font-bold">Post Notice</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover/item:text-white group-hover/item:translate-x-1 group-hover/item:-translate-y-1 transition-all" />
              </Link>
              <Link to="/admin/courses" className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/5 group/item">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-bold">Add Course</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover/item:text-white group-hover/item:translate-x-1 group-hover/item:-translate-y-1 transition-all" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-navy-50 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-paper p-2 rounded-xl">
                <Activity className="h-5 w-5 text-navy-950" />
              </div>
              <h3 className="text-xl font-display font-black text-navy-950">System Status</h3>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                  <span className="text-sm font-bold text-navy-700">Database</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                  <span className="text-sm font-bold text-navy-700">File Storage</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Synced</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                  <span className="text-sm font-bold text-navy-700">Security</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">SSL Active</span>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-navy-50">
              <a href="#" className="flex items-center justify-center space-x-2 text-xs font-black uppercase tracking-widest text-navy-400 hover:text-navy-950 transition-colors">
                <span>View System Logs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
