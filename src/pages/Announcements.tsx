import { useState, useEffect } from "react";
import { Bell, Search, Filter, Calendar, ChevronRight, Sparkles, ArrowUpRight } from "lucide-react";
import { api } from "../lib/api";
import { Announcement } from "../types";
import AnnouncementItem from "../components/AnnouncementItem";
import { motion } from "motion/react";
import { Skeleton } from "../components/Skeleton";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.announcements.getAll().then(setAnnouncements).finally(() => setLoading(false));
  }, []);

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="bg-navy-950 pt-32 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-navy-800 via-transparent to-transparent"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles className="h-4 w-4" />
              <span>Academic Updates</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-8 tracking-tight leading-tight">
              Notice <span className="text-gold-500">Board</span>
            </h1>
            <p className="text-navy-400 max-w-2xl mx-auto text-xl md:text-2xl font-serif italic leading-relaxed">
              Stay informed with the latest academic announcements, exam schedules, and university updates.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-navy-900/5 border border-navy-50 p-10 flex flex-col sm:flex-row gap-8 items-center">
          <div className="relative flex-grow w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-navy-400 group-focus-within:text-navy-950 transition-colors" />
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[2rem] text-sm font-bold transition-all duration-300 shadow-inner"
            />
          </div>
          
          <div className="flex items-center space-x-4 shrink-0">
            <div className="bg-navy-50 p-4 rounded-2xl border border-navy-100/50">
              <Bell className="h-6 w-6 text-navy-700" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Total Notices</span>
              <span className="text-xl font-display font-black text-navy-950">{filteredAnnouncements.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 mt-24 space-y-12">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white p-12 rounded-[3rem] border border-navy-50 shadow-sm animate-pulse space-y-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-6 w-1/3 rounded-lg" />
                  <Skeleton className="h-4 w-1/4 rounded-lg" />
                </div>
              </div>
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ))
        ) : filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <AnnouncementItem key={announcement.id} announcement={announcement} />
          ))
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-navy-50 shadow-sm">
            <div className="bg-paper h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Bell className="h-12 w-12 text-navy-200" />
            </div>
            <h3 className="text-3xl font-display font-black text-navy-950">No notices found</h3>
            <p className="text-navy-500 mt-4 text-lg font-medium italic">Try searching with different keywords.</p>
            <button 
              onClick={() => setSearch("")}
              className="mt-10 text-navy-950 font-black uppercase tracking-widest text-xs hover:text-gold-600 transition-colors flex items-center justify-center space-x-2 mx-auto"
            >
              <span>View all notices</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
