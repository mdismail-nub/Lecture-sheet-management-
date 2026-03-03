import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Hash, ArrowUpRight } from "lucide-react";
import { Course } from "../types";
import { motion } from "motion/react";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2.5rem] border border-navy-50 shadow-sm hover:shadow-2xl hover:shadow-navy-900/5 transition-all duration-500 overflow-hidden flex flex-col h-full group"
    >
      <div className="p-10 flex-grow relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-paper rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="bg-navy-50 text-navy-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center space-x-2 border border-navy-100/50">
            <Hash className="h-3 w-3" />
            <span>{course.courseCode}</span>
          </div>
          <span className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">{course.department}</span>
        </div>
        
        <h3 className="text-2xl font-display font-black text-navy-950 mb-4 line-clamp-2 group-hover:text-navy-700 transition-colors leading-tight relative z-10">
          {course.courseName}
        </h3>
        <p className="text-navy-500 text-sm line-clamp-3 mb-8 leading-relaxed font-serif italic relative z-10">
          {course.description || "No description available for this course module."}
        </p>
      </div>
      
      <div className="px-10 py-6 bg-paper border-t border-navy-50 flex items-center justify-between group-hover:bg-navy-950 transition-colors duration-500">
        <div className="flex items-center space-x-3 text-navy-500 group-hover:text-navy-400 transition-colors duration-500">
          <div className="bg-white p-2 rounded-xl shadow-sm group-hover:bg-white/10 group-hover:shadow-none transition-colors duration-500">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">{course.materialCount || 0} Materials</span>
        </div>
        
        <Link 
          to={`/courses/${course.id}`}
          className="text-navy-950 group-hover:text-gold-500 text-sm font-black flex items-center space-x-2 transition-all duration-500 uppercase tracking-widest"
        >
          <span>Explore</span>
          <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
