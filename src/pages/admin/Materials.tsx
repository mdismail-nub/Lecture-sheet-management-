import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X, FileText, Upload, Link as LinkIcon, BookOpen, ChevronRight, AlertCircle, Sparkles, Hash, Eye } from "lucide-react";
import { api } from "../../lib/api";
import { Material, Course } from "../../types";
import { motion, AnimatePresence } from "motion/react";
import { TableRowSkeleton } from "../../components/Skeleton";

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    fileUrl: "",
    fileType: "pdf",
    category: "Lecture Note",
    courseId: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [materialsData, coursesData] = await Promise.all([
        api.materials.getAll(),
        api.courses.getAll()
      ]);
      setMaterials(materialsData);
      setCourses(coursesData);
      if (coursesData.length > 0 && !formData.courseId) {
        setFormData(prev => ({ ...prev, courseId: coursesData[0].id.toString() }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalFileUrl = formData.fileUrl;
      let finalFileType = formData.fileType;

      if (selectedFile) {
        const uploadRes = await api.materials.upload(selectedFile);
        finalFileUrl = uploadRes.fileUrl;
        finalFileType = uploadRes.fileType;
      }

      if (editingMaterial) {
        await api.materials.update(editingMaterial.id, {
          ...formData,
          fileUrl: finalFileUrl,
          fileType: finalFileType as 'pdf' | 'image',
          category: formData.category as 'Lecture Note' | 'Syllabus' | 'Assignment' | 'Other',
          courseId: parseInt(formData.courseId),
        });
      } else {
        await api.materials.create({
          ...formData,
          fileUrl: finalFileUrl,
          fileType: finalFileType as 'pdf' | 'image',
          category: formData.category as 'Lecture Note' | 'Syllabus' | 'Assignment' | 'Other',
          courseId: parseInt(formData.courseId),
        });
      }
      setIsModalOpen(false);
      setEditingMaterial(null);
      setSelectedFile(null);
      setFormData({ ...formData, title: "", fileUrl: "" });
      fetchData();
    } catch (error) {
      alert("Error saving material");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      fileUrl: material.fileUrl,
      fileType: material.fileType,
      category: material.category || "Lecture Note",
      courseId: material.courseId.toString()
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this material?")) {
      try {
        await api.materials.delete(id);
        fetchData();
      } catch (error) {
        alert("Error deleting material");
      }
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) || 
    m.courseName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pt-16 lg:pt-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-gold-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="h-4 w-4" />
            <span>Resource Repository</span>
          </div>
          <h1 className="text-4xl font-display font-black text-navy-950 tracking-tight">Lecture Materials</h1>
          <p className="text-navy-500 font-medium text-lg">Upload and manage academic resources</p>
        </div>
        
        <button 
          onClick={() => {
            setEditingMaterial(null);
            setFormData({ ...formData, title: "", fileUrl: "" });
            setIsModalOpen(true);
          }}
          className="px-8 py-4 bg-navy-950 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 flex items-center space-x-3 group"
        >
          <Upload className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
          <span>Upload Material</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-navy-50 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-navy-50 bg-paper">
          <div className="relative max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within:text-navy-950 transition-colors" />
            <input
              type="text"
              placeholder="Search materials by title or course..."
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
                <th className="px-10 py-6">Material Title</th>
                <th className="px-10 py-6">Course</th>
                <th className="px-10 py-6">Category</th>
                <th className="px-10 py-6">Type</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <TableRowSkeleton key={i} columns={5} />
                ))
              ) : filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-paper transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-2xl group-hover:rotate-6 transition-transform duration-300 ${material.fileType === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-navy-50 text-navy-600'}`}>
                          {material.fileType === 'pdf' ? <FileText className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                        </div>
                        <p className="font-display font-black text-navy-950 text-lg leading-tight">{material.title}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm text-navy-700 font-bold">{material.courseCode}</span>
                        <span className="text-[10px] text-navy-400 font-black uppercase tracking-widest">{material.courseName}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xs text-navy-700 font-bold">{material.category}</span>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${material.fileType === 'pdf' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-navy-50 border-navy-100 text-navy-700'}`}>
                        {material.fileType}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => handleEdit(material)}
                          className="p-3 text-navy-700 hover:bg-navy-50 rounded-2xl transition-all duration-300 hover:scale-110"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(material.id)}
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
                      <FileText className="h-10 w-10 text-navy-200" />
                    </div>
                    <h3 className="text-2xl font-display font-black text-navy-950">No materials found</h3>
                    <p className="text-navy-400 font-medium mt-2">Start by uploading your first lecture resource.</p>
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
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-navy-950">{editingMaterial ? "Edit Material" : "Upload Material"}</h2>
                    <p className="text-sm text-navy-500 font-medium">Configure academic resource details</p>
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
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] ml-2">Material Title</label>
                  <div className="relative group/input">
                    <FileText className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within/input:text-navy-950 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lecture 01: Introduction to DBMS"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-bold transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] ml-2">Course Module</label>
                    <div className="relative group/input">
                      <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within/input:text-navy-950 transition-colors" />
                      <select
                        required
                        value={formData.courseId}
                        onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-bold transition-all shadow-inner appearance-none"
                      >
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>{course.courseCode} - {course.courseName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] ml-2">Category</label>
                    <div className="relative group/input">
                      <Hash className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within/input:text-navy-950 transition-colors" />
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-bold transition-all shadow-inner appearance-none"
                      >
                        <option value="Lecture Note">Lecture Note</option>
                        <option value="Syllabus">Syllabus</option>
                        <option value="Assignment">Assignment</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] ml-2">Upload File</label>
                  <div className="relative group/input">
                    <Upload className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within/input:text-navy-950 transition-colors" />
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full pl-14 pr-6 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-bold transition-all shadow-inner file:hidden cursor-pointer"
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-[10px] text-gold-600 font-bold ml-2">Selected: {selectedFile.name}</p>
                  )}
                </div>

                {!selectedFile && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] ml-2">Or File URL / Reference</label>
                    <div className="relative group/input">
                      <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within/input:text-navy-950 transition-colors" />
                      <input
                        type="url"
                        placeholder="e.g. https://example.com/lecture1.pdf"
                        value={formData.fileUrl}
                        onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-bold transition-all shadow-inner"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-6 pt-6">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-grow py-5 bg-paper text-navy-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-navy-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-grow py-5 bg-navy-950 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-navy-800 transition-all shadow-2xl shadow-navy-950/20 flex items-center justify-center space-x-3 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isUploading ? "Uploading..." : (editingMaterial ? "Update Resource" : "Upload Resource")}</span>
                    {!isUploading && <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />}
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
