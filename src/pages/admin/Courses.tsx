import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X, BookOpen, Hash, Tag, FileText, ChevronRight, AlertCircle, Sparkles } from "lucide-react";
import { api } from "../../lib/api";
import { Course } from "../../types";
import { motion, AnimatePresence } from "motion/react";
import { TableRowSkeleton } from "../../components/Skeleton";

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    department: "CSE",
    description: ""
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await api.courses.getAll();
      setCourses(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await api.courses.update(editingCourse.id, formData);
      } else {
        await api.courses.create(formData);
      }
      setIsModalOpen(false);
      setEditingCourse(null);
      setFormData({ courseName: "", courseCode: "", department: "CSE", description: "" });
      fetchCourses();
    } catch (error) {
      alert("Error saving course");
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      courseName: course.courseName,
      courseCode: course.courseCode,
      department: course.department,
      description: course.description
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this course? All associated materials will also be deleted.")) {
      try {
        await api.courses.delete(id);
        fetchCourses();
      } catch (error) {
        alert("Error deleting course");
      }
    }
  };

  const filteredCourses = courses.filter(c => 
    c.courseName.toLowerCase().includes(search.toLowerCase()) || 
    c.courseCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pt-16 lg:pt-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-gold-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="h-4 w-4" />
            <span>Academic Modules</span>
          </div>
          <h1 className="text-4xl font-display font-black text-navy-950 tracking-tight">Manage Courses</h1>
          <p className="text-navy-500 font-medium text-lg">Create and organize academic modules</p>
        </div>
        
        <button 
          onClick={() => {
            setEditingCourse(null);
            setFormData({ courseName: "", courseCode: "", department: "CSE", description: "" });
            setIsModalOpen(true);
          }}
          className="px-8 py-4 bg-navy-950 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 flex items-center space-x-3 group"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Add New Course</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-navy-50 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-navy-50 bg-paper">
          <div className="relative max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within:text-navy-950 transition-colors" />
            <input
              type="text"
              placeholder="Search courses by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border-navy-50 focus:border-navy-950 focus:ring-0 rounded-2xl text-sm font-bold transition-all shadow-inner"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-navy-400 font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Course Details</th>
                <th className="px-10 py-6">Code</th>
                <th className="px-10 py-6">Dept</th>
                <th className="px-10 py-6">Materials</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <TableRowSkeleton key={i} columns={5} />
                ))
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-paper transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-4">
                        <div className="bg-navy-50 p-3 rounded-2xl group-hover:rotate-6 transition-transform duration-300">
                          <BookOpen className="h-6 w-6 text-navy-700" />
                        </div>
                        <div className="max-w-xs">
                          <p className="font-display font-black text-navy-950 text-lg leading-tight">{course.courseName}</p>
                          <p className="text-xs text-navy-400 font-medium truncate mt-1">{course.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="bg-paper text-navy-700 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-navy-50">{course.courseCode}</span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-sm text-navy-500 font-black uppercase tracking-widest">{course.department}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-3 text-navy-400">
                        <div className="bg-paper p-2 rounded-lg">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-black text-navy-950">{course.materialCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => handleEdit(course)}
                          className="p-3 text-navy-700 hover:bg-navy-50 rounded-2xl transition-all duration-300 hover:scale-110"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 hover:scale-110"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="bg-paper h-20 w-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <BookOpen className="h-10 w-10 text-navy-200" />
                    </div>
                    <h3 className="text-2xl font-display font-black text-navy-950">No courses found</h3>
                    <p className="text-navy-400 font-medium mt-2">Start by creating your first academic module.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy-950/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-navy-50"
            >
              <div className="p-10 border-b border-navy-50 flex items-center justify-between bg-paper">
                <div className="flex items-center space-x-4">
                  <div className="bg-navy-950 p-3 rounded-2xl shadow-xl shadow-navy-950/20">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-navy-950">{editingCourse ? "Edit Course" : "Add New Course"}</h2>
                    <p className="text-sm text-navy-500 font-medium">Configure academic module details</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-paper rounded-2xl transition-all duration-300 group"
                >
                  <X className="h-7 w-7 text-navy-400 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] ml-2">Course Code</label>
                    <div className="relative group/input">
                      <Hash className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within/input:text-navy-950 transition-colors" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. CSE 301"
                        value={formData.courseCode}
                        onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-bold transition-all shadow-inner"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] ml-2">Department</label>
                    <div className="relative group/input">
                      <Tag className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within/input:text-navy-950 transition-colors" />
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-bold transition-all shadow-inner appearance-none"
                      >
                        <option value="CSE">CSE</option>
                        <option value="EEE">EEE</option>
                        <option value="BBA">BBA</option>
                        <option value="ENG">ENG</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] ml-2">Course Name</label>
                  <div className="relative group/input">
                    <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within/input:text-navy-950 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Database Management Systems"
                      value={formData.courseName}
                      onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-bold transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] ml-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Brief overview of the course module..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-6 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-bold transition-all shadow-inner resize-none"
                  />
                </div>

                <div className="flex items-center space-x-6 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-grow py-5 bg-paper text-navy-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-navy-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-grow py-5 bg-navy-950 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-navy-800 transition-all shadow-2xl shadow-navy-950/20 flex items-center justify-center space-x-3 group/btn"
                  >
                    <span>{editingCourse ? "Update Course" : "Create Course"}</span>
                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
