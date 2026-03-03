import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, Bell, ArrowRight, GraduationCap, Users, FileText, Award, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../lib/api";
import { Course, Announcement } from "../types";
import CourseCard from "../components/CourseCard";
import AnnouncementItem from "../components/AnnouncementItem";
import { Skeleton } from "../components/Skeleton";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, announcementsRes] = await Promise.all([
          api.courses.getAll(),
          api.announcements.getAll()
        ]);
        setCourses(coursesRes.slice(0, 3));
        setAnnouncements(announcementsRes.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative bg-navy-950 pt-32 pb-48 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-navy-800 via-transparent to-transparent"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
                <Sparkles className="h-4 w-4" />
                <span>Department of CSE</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-[1.05] mb-8 tracking-tight">
                Academic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-600">Resource</span> Portal
              </h1>
              
              <p className="text-navy-400 text-xl md:text-2xl mb-12 max-w-lg leading-relaxed font-serif italic">
                The official repository for academic excellence. Access lecture materials, slides, and resources for the Department of CSE at Northern University Bangladesh.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  to="/courses" 
                  className="px-10 py-5 bg-gold-500 text-navy-950 rounded-[2rem] font-black text-lg hover:bg-gold-400 transition-all duration-300 shadow-2xl shadow-gold-500/20 flex items-center justify-center space-x-3 group"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/announcements" 
                  className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <span>Notice Board</span>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] shadow-2xl">
                <div className="flex items-center space-x-6 mb-12">
                  <div className="h-20 w-20 rounded-3xl bg-gold-500 flex items-center justify-center shadow-xl shadow-gold-500/30">
                    <GraduationCap className="h-12 w-12 text-navy-950" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black text-white">Dr. Ismail Tonmoy</h3>
                    <p className="text-gold-500 font-black uppercase tracking-widest text-xs mt-1">Lecturer, Dept. of CSE</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:bg-white/10 transition-colors duration-300">
                    <p className="text-navy-500 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Academic Modules</p>
                    <p className="text-3xl font-display font-black text-white">12+</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:bg-white/10 transition-colors duration-300">
                    <p className="text-navy-500 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Active Students</p>
                    <p className="text-3xl font-display font-black text-white">500+</p>
                  </div>
                </div>
                
                <div className="mt-12 pt-12 border-t border-white/5 flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-navy-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://picsum.photos/seed/student${i}/100/100`} alt="Student" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    <div className="h-10 w-10 rounded-full border-2 border-navy-950 bg-gold-500 flex items-center justify-center text-[10px] font-black text-navy-950">
                      +496
                    </div>
                  </div>
                  <p className="text-navy-400 text-xs font-bold">Joined this semester</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl z-20"
              >
                <Award className="h-8 w-8 text-gold-500" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl z-20"
              >
                <FileText className="h-8 w-8 text-blue-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-navy-900/5 border border-navy-50 p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex items-center space-x-6 p-4 group">
            <div className="bg-navy-50 p-5 rounded-3xl group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-10 w-10 text-navy-700" />
            </div>
            <div>
              <p className="text-2xl font-display font-black text-navy-950">Structured</p>
              <p className="text-sm text-navy-500 font-bold uppercase tracking-widest mt-1">Course-wise materials</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 p-4 border-y md:border-y-0 md:border-x border-navy-50 group">
            <div className="bg-gold-50 p-5 rounded-3xl group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-10 w-10 text-gold-600" />
            </div>
            <div>
              <p className="text-2xl font-display font-black text-navy-950">Accessible</p>
              <p className="text-sm text-navy-500 font-bold uppercase tracking-widest mt-1">PDFs & Slide decks</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 p-4 group">
            <div className="bg-emerald-50 p-5 rounded-3xl group-hover:scale-110 transition-transform duration-300">
              <Users className="h-10 w-10 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-display font-black text-navy-950">Public</p>
              <p className="text-sm text-navy-500 font-bold uppercase tracking-widest mt-1">Open for all students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          
          {/* Courses Overview */}
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 text-gold-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  <div className="h-1 w-8 bg-gold-500 rounded-full"></div>
                  <span>Academic Modules</span>
                </div>
                <h2 className="text-4xl font-display font-black text-navy-950">Featured Courses</h2>
                <p className="text-navy-500 font-serif text-lg italic">Explore our most popular academic modules and resources</p>
              </div>
              <Link to="/courses" className="hidden sm:flex items-center space-x-2 text-navy-700 font-black text-sm hover:text-navy-950 transition-colors group">
                <span>View All Courses</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading ? (
                [1, 2].map(i => (
                  <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-pulse space-y-6">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-8 w-24 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <Skeleton className="h-20 w-3/4 rounded-xl" />
                  </div>
                ))
              ) : (
                courses.map(course => <CourseCard key={course.id} course={course} />)
              )}
            </div>
            
            <Link to="/courses" className="sm:hidden flex items-center justify-center space-x-2 w-full py-4 bg-slate-100 text-navy-700 font-black text-sm rounded-2xl">
              <span>View All Courses</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Notice Board */}
          <div className="space-y-12">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 text-gold-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  <div className="h-1 w-8 bg-gold-500 rounded-full"></div>
                  <span>Updates</span>
                </div>
                <h2 className="text-3xl font-display font-black text-navy-950">Notice Board</h2>
              </div>
              <Link to="/announcements" className="text-gold-600 font-black text-sm hover:text-gold-700 transition-colors">History</Link>
            </div>
            
            <div className="bg-white rounded-[2.5rem] border border-navy-50 shadow-xl shadow-navy-900/5 overflow-hidden">
              <div className="p-4 space-y-2">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-paper rounded-2xl m-2 animate-pulse">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="space-y-2 flex-grow">
                        <Skeleton className="h-4 w-1/2 rounded-lg" />
                        <Skeleton className="h-3 w-1/3 rounded-lg" />
                      </div>
                    </div>
                  ))
                ) : announcements.length > 0 ? (
                  announcements.map(announcement => (
                    <AnnouncementItem key={announcement.id} announcement={announcement} compact />
                  ))
                ) : (
                  <div className="p-12 text-center text-navy-400 italic text-sm font-medium">No recent notices available.</div>
                )}
              </div>
              <div className="bg-paper p-6 text-center border-t border-navy-50">
                <Link to="/announcements" className="text-navy-950 text-xs font-black uppercase tracking-[0.2em] hover:text-gold-600 transition-colors">
                  View Full Notice Board
                </Link>
              </div>
            </div>
            
            {/* Quick Search Card */}
            <div className="bg-navy-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-navy-950/20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 group-hover:scale-125 transition-transform duration-700"></div>
              
              <h3 className="text-2xl font-display font-black mb-4 relative z-10">Quick Search</h3>
              <p className="text-navy-400 text-sm mb-8 relative z-10 leading-relaxed font-medium">Looking for a specific lecture sheet or slide deck? Use our global search tool.</p>
              <Link 
                to="/search" 
                className="w-full py-4 bg-white text-navy-950 rounded-2xl font-black text-sm flex items-center justify-center space-x-3 hover:bg-gold-500 hover:text-navy-950 transition-all duration-300 relative z-10 shadow-xl"
              >
                <Search className="h-4 w-4" />
                <span>Start Searching</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
