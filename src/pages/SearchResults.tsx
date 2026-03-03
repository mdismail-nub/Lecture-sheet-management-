import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, BookOpen, FileText, ChevronRight, Hash, Filter, Calendar, Sparkles, ArrowUpRight } from "lucide-react";
import { api } from "../lib/api";
import { SearchResults as SearchResultsType } from "../types";
import CourseCard from "../components/CourseCard";
import MaterialItem from "../components/MaterialItem";
import { motion } from "motion/react";
import { Skeleton } from "../components/Skeleton";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResultsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.search.query(query).then(setResults).finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="bg-navy-950 pt-32 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-navy-800 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles className="h-4 w-4" />
                <span>Search Results</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight leading-[1.05]">
                Found <span className="text-gold-500">{loading ? "..." : (results ? results.courses.length + results.materials.length : 0)}</span> Results
              </h1>
              <p className="text-navy-400 text-xl font-serif italic">
                Showing results for <span className="text-white font-black not-italic">"{query}"</span>
              </p>
            </div>
            
            <div className="relative w-full lg:w-[400px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-navy-500" />
              <form onSubmit={(e) => {
                e.preventDefault();
                const q = (e.target as any).search.value;
                if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
              }}>
                <input
                  name="search"
                  type="text"
                  defaultValue={query}
                  placeholder="Search again..."
                  className="w-full pl-14 pr-6 py-5 bg-white/10 border border-white/20 text-white focus:bg-white focus:text-navy-950 focus:border-gold-500 focus:ring-0 rounded-[2rem] text-sm font-bold transition-all duration-300"
                />
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Courses Results */}
          <div className="lg:col-span-1 space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-black text-navy-950 flex items-center space-x-3">
                <div className="bg-navy-950 p-2 rounded-xl">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span>Courses ({results?.courses.length || 0})</span>
              </h2>
            </div>
            
            <div className="space-y-6">
              {loading ? (
                [1, 2].map(i => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-navy-50 shadow-sm animate-pulse space-y-4">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-8 w-full rounded-xl" />
                    <Skeleton className="h-12 w-3/4 rounded-lg" />
                  </div>
                ))
              ) : results?.courses.length ? (
                results.courses.map(course => (
                  <Link 
                    key={course.id} 
                    to={`/courses/${course.id}`}
                    className="block bg-white p-8 rounded-[2.5rem] border border-navy-50 shadow-sm hover:shadow-xl hover:shadow-navy-900/5 transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-paper rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
                    
                    <div className="flex items-center space-x-3 mb-4 relative z-10">
                      <span className="bg-navy-50 text-navy-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-navy-100/50">{course.courseCode}</span>
                    </div>
                    <h3 className="text-xl font-display font-black text-navy-950 group-hover:text-navy-700 transition-colors leading-tight relative z-10">{course.courseName}</h3>
                    <p className="text-xs text-navy-500 mt-3 line-clamp-2 font-medium relative z-10">{course.description}</p>
                    
                    <div className="mt-6 flex items-center text-navy-950 text-[10px] font-black uppercase tracking-widest group-hover:text-gold-600 transition-all relative z-10">
                      <span>View Course</span>
                      <ArrowUpRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-12 text-center bg-white rounded-[2.5rem] border border-navy-50 text-navy-400 italic text-sm font-medium">
                  No courses match your search.
                </div>
              )}
            </div>
          </div>

          {/* Materials Results */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-black text-navy-950 flex items-center space-x-3">
                <div className="bg-navy-950 p-2 rounded-xl">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span>Materials ({results?.materials.length || 0})</span>
              </h2>
            </div>
            
            <div className="space-y-8">
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center space-x-6 p-8 bg-white rounded-[2rem] border border-navy-50 animate-pulse">
                    <Skeleton className="h-16 w-16 rounded-2xl" />
                    <div className="space-y-3 flex-grow">
                      <Skeleton className="h-6 w-1/3 rounded-lg" />
                      <Skeleton className="h-4 w-1/2 rounded-lg" />
                    </div>
                  </div>
                ))
              ) : results?.materials.length ? (
                results.materials.map(material => (
                  <div key={material.id} className="relative group">
                    <div className="absolute -top-3 left-10 z-20 bg-navy-950 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-navy-950/20">
                      {material.courseName}
                    </div>
                    <MaterialItem material={material} />
                  </div>
                ))
              ) : (
                <div className="p-32 text-center bg-white rounded-[3rem] border border-navy-50 shadow-sm">
                  <div className="bg-paper h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <FileText className="h-12 w-12 text-navy-200" />
                  </div>
                  <h3 className="text-2xl font-display font-black text-navy-950">No materials found</h3>
                  <p className="text-navy-500 mt-4 text-lg font-medium italic">Try searching with different keywords.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
