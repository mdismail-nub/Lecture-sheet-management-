import { Bell, Calendar, ChevronRight, ArrowUpRight } from "lucide-react";
import { Announcement } from "../types";
import { motion } from "motion/react";

interface AnnouncementItemProps {
  announcement: Announcement;
  compact?: boolean;
}

export default function AnnouncementItem({ announcement, compact = false }: AnnouncementItemProps) {
  const date = new Date(announcement.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  if (compact) {
    return (
      <motion.div 
        whileHover={{ x: 8 }}
        className="flex items-start space-x-6 p-6 rounded-[2rem] hover:bg-paper transition-all duration-300 cursor-pointer group border border-transparent hover:border-navy-50"
      >
        <div className="bg-gold-100 p-3 rounded-2xl shrink-0 group-hover:bg-gold-500 group-hover:rotate-12 transition-all duration-500">
          <Bell className="h-5 w-5 text-gold-700 group-hover:text-navy-950 transition-colors" />
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="text-base font-display font-black text-navy-950 truncate group-hover:text-navy-700 transition-colors leading-tight">{announcement.title}</h4>
          <p className="text-[10px] text-navy-400 font-black uppercase tracking-[0.2em] mt-1.5">{date}</p>
        </div>
        <div className="bg-navy-50 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500">
          <ChevronRight className="h-4 w-4 text-navy-950" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-10 rounded-[3rem] border border-navy-50 shadow-sm hover:shadow-2xl hover:shadow-navy-900/5 transition-all duration-500 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-paper rounded-full -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-700"></div>
      
      <div className="flex items-center space-x-4 mb-8 relative z-10">
        <div className="bg-gold-100 p-4 rounded-2xl group-hover:rotate-12 transition-transform duration-500">
          <Bell className="h-6 w-6 text-gold-700" />
        </div>
        <div className="flex items-center space-x-3 text-navy-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
      </div>
      
      <h3 className="text-3xl font-display font-black text-navy-950 mb-6 group-hover:text-navy-700 transition-colors leading-tight relative z-10">{announcement.title}</h3>
      <p className="text-navy-600 text-lg leading-relaxed whitespace-pre-wrap font-serif italic relative z-10">
        {announcement.description}
      </p>
      
      <div className="mt-10 pt-10 border-t border-navy-50 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="h-2 w-2 bg-gold-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
          <span className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Official Announcement</span>
        </div>
        <div className="flex items-center space-x-2 text-navy-950 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500">
          <span>Read More</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
}
