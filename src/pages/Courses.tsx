import { useState, useEffect } from "react";
import { Search, Filter, BookOpen, Hash, ChevronRight, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import { Course } from "../types";
import CourseCard from "../components/CourseCard";
import { motion } from "motion/react";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.courses.getAll().then(setCourses).finally(() => setLoading(false));
  }, []);

  const departments = ["All", ...new Set(courses.map(c => c.department))];

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === "All" || course.department === filter;
    const matchesSearch = course.courseName.toLowerCase().includes(search.toLowerCase()) || 
                          course.courseCode.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              <span>Academic Modules</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-8 tracking-tight leading-tight">
              Academic <span className="text-gold-500">Courses</span>
            </h1>
            <p className="text-navy-400 max-w-2xl mx-auto text-xl md:text-2xl font-serif italic leading-relaxed">
              Browse through our comprehensive list of courses and access lecture materials, slides, and reference documents.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-navy-900/5 border border-navy-50 p-10 flex flex-col lg:flex-row gap-10 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-navy-400" />
            <input
              type="text"
              placeholder="Search by course name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[2rem] text-sm font-bold transition-all duration-300 shadow-inner"
            />
          </div>
          
          <div className="flex items-center space-x-4 w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            <div className="flex items-center space-x-3 text-navy-400 mr-4 shrink-0">
              <Filter className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filter By:</span>
            </div>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-8 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-300 shrink-0 ${
                  filter === dept 
                    ? "bg-navy-950 text-white shadow-xl shadow-navy-950/20" 
                    : "bg-navy-50 text-navy-500 hover:bg-navy-100"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-navy-50 animate-pulse rounded-[3rem]"></div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-navy-50 shadow-sm">
            <div className="bg-paper h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <BookOpen className="h-12 w-12 text-navy-200" />
            </div>
            <h3 className="text-3xl font-display font-black text-navy-950">No courses found</h3>
            <p className="text-navy-500 mt-4 text-lg font-medium">Try adjusting your search or filter criteria.</p>
            <button 
              onClick={() => {setFilter("All"); setSearch("");}}
              className="mt-10 text-navy-950 font-black uppercase tracking-widest text-xs hover:text-gold-600 transition-colors flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Clear all filters</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
