import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, BookOpen, Hash, FileText, Calendar, Download, Eye, X, Sparkles, ArrowUpRight } from "lucide-react";
import { api } from "../lib/api";
import { Course, Material } from "../types";
import MaterialItem from "../components/MaterialItem";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "../components/Skeleton";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        api.courses.getById(id),
        api.courses.getMaterials(id)
      ]).then(([courseRes, materialsRes]) => {
        setCourse(courseRes);
        setMaterials(materialsRes);
      }).finally(() => setLoading(false));
    }
  }, [id]);

  if (!loading && !course) return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-6">
      <div className="text-center max-w-md bg-white p-12 rounded-[3rem] shadow-xl border border-navy-50">
        <div className="bg-paper h-20 w-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <X className="h-10 w-10 text-navy-200" />
        </div>
        <h2 className="text-3xl font-display font-black text-navy-950 mb-4">Course Not Found</h2>
        <p className="text-navy-500 font-medium mb-8">The course you are looking for might have been removed or renamed.</p>
        <Link to="/courses" className="inline-flex items-center space-x-2 px-8 py-4 bg-navy-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-navy-800 transition-all">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Courses</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="bg-navy-950 pt-32 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-navy-800 via-transparent to-transparent"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Link to="/courses" className="inline-flex items-center space-x-3 text-navy-400 hover:text-white transition-all duration-300 mb-12 group font-black text-[10px] uppercase tracking-[0.2em]">
            <div className="bg-white/5 p-2 rounded-xl border border-white/10 group-hover:-translate-x-1 transition-transform">
              <ChevronLeft className="h-5 w-5" />
            </div>
            <span>Back to Courses</span>
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-4xl">
              {loading ? (
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-1 w-8 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-20 w-full rounded-2xl" />
                  <Skeleton className="h-12 w-3/4 rounded-xl" />
                </div>
              ) : course && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex items-center space-x-4 mb-8">
                    <span className="bg-gold-500 text-navy-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-gold-500/20">{course.courseCode}</span>
                    <div className="h-1 w-8 bg-white/10 rounded-full"></div>
                    <span className="text-navy-400 text-[10px] font-black uppercase tracking-[0.2em]">{course.department}</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-8 leading-tight tracking-tight">{course.courseName}</h1>
                  <p className="text-navy-400 text-xl leading-relaxed font-serif italic max-w-2xl">{course.description}</p>
                </motion.div>
              )}
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shrink-0 shadow-2xl"
            >
              <div className="flex items-center space-x-6">
                <div className="bg-gold-500 p-5 rounded-3xl shadow-xl shadow-gold-500/20">
                  <BookOpen className="h-10 w-10 text-navy-950" />
                </div>
                <div>
                  <p className="text-4xl font-display font-black text-white">{loading ? "..." : materials.length}</p>
                  <p className="text-[10px] text-navy-500 font-black uppercase tracking-[0.2em] mt-1">Total Resources</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-navy-900/5 border border-navy-50 p-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-gold-600 text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles className="h-4 w-4" />
                <span>Resource Library</span>
              </div>
              <h2 className="text-3xl font-display font-black text-navy-950">Lecture Materials</h2>
            </div>
            <div className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] bg-paper px-4 py-2 rounded-full border border-navy-50">
              Sorted by newest first
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-6 p-8 bg-paper rounded-[2rem] animate-pulse">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <div className="space-y-3 flex-grow">
                    <Skeleton className="h-6 w-1/3 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : materials.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {materials.map((material) => (
                <MaterialItem 
                  key={material.id} 
                  material={material} 
                  onPreview={setPreviewMaterial}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-paper border-2 border-dashed border-navy-50 rounded-[3rem]">
              <div className="bg-white h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FileText className="h-12 w-12 text-navy-200" />
              </div>
              <h3 className="text-2xl font-display font-black text-navy-950">No materials uploaded yet</h3>
              <p className="text-navy-500 mt-4 text-lg font-medium">Check back later for academic updates.</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewMaterial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-navy-950/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-white/20"
            >
              <div className="p-8 border-b border-navy-50 flex items-center justify-between bg-white relative z-10">
                <div className="flex items-center space-x-6">
                  <div className={`p-4 rounded-2xl ${previewMaterial.fileType === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-navy-50 text-navy-600'}`}>
                    {previewMaterial.fileType === 'pdf' ? <FileText className="h-8 w-8" /> : <Eye className="h-8 w-8" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black text-navy-950 leading-tight">{previewMaterial.title}</h3>
                    <p className="text-[10px] text-navy-400 font-black uppercase tracking-[0.2em] mt-1">Previewing {previewMaterial.fileType.toUpperCase()} Resource</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewMaterial(null)}
                  className="p-3 hover:bg-paper rounded-2xl transition-all duration-300 group"
                >
                  <X className="h-8 w-8 text-navy-400 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
              
              <div className="flex-grow bg-slate-900 overflow-auto p-12 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500 via-transparent to-transparent"></div>
                
                {previewMaterial.fileType === 'pdf' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-8 relative z-10">
                    <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-sm text-center max-w-md">
                      <FileText className="h-24 w-24 text-red-500/50 mx-auto mb-8" />
                      <h4 className="text-2xl font-display font-black text-white mb-4">PDF Preview Restricted</h4>
                      <p className="text-slate-400 font-medium mb-10 leading-relaxed">For security and performance, PDF preview is disabled in this view. Please open in a new tab or download the file.</p>
                      <div className="flex flex-col gap-4">
                        <a 
                          href={previewMaterial.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-8 py-4 bg-white text-navy-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gold-500 transition-all flex items-center justify-center space-x-3"
                        >
                          <span>Open in New Tab</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={previewMaterial.fileUrl} 
                    alt={previewMaterial.title} 
                    className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl border border-white/10 relative z-10"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              
              <div className="p-8 border-t border-navy-50 bg-paper flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-8 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gold-600" />
                    <span>Uploaded: {new Date(previewMaterial.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="h-1 w-1 bg-navy-200 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-navy-600" />
                    <span>Academic Resource</span>
                  </div>
                </div>
                <a
                  href={previewMaterial.fileUrl}
                  download
                  className="flex items-center space-x-3 px-10 py-5 bg-navy-950 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-navy-800 transition-all duration-300 shadow-2xl shadow-navy-950/20 group/btn w-full sm:w-auto justify-center"
                >
                  <Download className="h-5 w-5 group-hover/btn:translate-y-1 transition-transform" />
                  <span>Download Resource</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
