import { FileText, Image as ImageIcon, Download, Eye, Calendar, Clock, ArrowUpRight } from "lucide-react";
import { Material } from "../types";
import { motion } from "motion/react";

interface MaterialItemProps {
  material: Material;
  onPreview?: (material: Material) => void;
}

export default function MaterialItem({ material, onPreview }: MaterialItemProps) {
  const isPdf = material.fileType === 'pdf';
  const date = new Date(material.uploadedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-[2rem] border border-navy-50 shadow-sm hover:shadow-xl hover:shadow-navy-900/5 transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-navy-950 group-hover:bg-gold-500 transition-colors duration-500"></div>
      
      <div className="flex items-center space-x-6 relative z-10">
        <div className={`p-4 rounded-2xl ${isPdf ? 'bg-red-50 text-red-600' : 'bg-navy-50 text-navy-600'} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
          {isPdf ? <FileText className="h-7 w-7" /> : <ImageIcon className="h-7 w-7" />}
        </div>
        <div>
          <h4 className="text-lg font-display font-black text-navy-950 group-hover:text-navy-700 transition-colors leading-tight">{material.title}</h4>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isPdf ? 'bg-red-50 border-red-100 text-red-700' : 'bg-navy-50 border-navy-100 text-navy-700'}`}>
              {material.fileType}
            </span>
            {material.category && (
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-gold-50 border border-gold-100 text-gold-700">
                {material.category}
              </span>
            )}
            <div className="flex items-center space-x-2 text-navy-400 text-xs font-bold uppercase tracking-widest">
              <Calendar className="h-3.5 w-3.5" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 relative z-10">
        <button
          onClick={() => onPreview?.(material)}
          className="flex items-center space-x-2 px-6 py-3 text-navy-950 hover:bg-paper rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border border-navy-50 hover:border-navy-100"
        >
          <Eye className="h-4 w-4" />
          <span>Preview</span>
        </button>
        <a
          href={material.fileUrl}
          download
          className="flex items-center space-x-2 px-6 py-3 bg-navy-950 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-navy-800 transition-all duration-300 shadow-xl shadow-navy-900/20 group/btn"
        >
          <Download className="h-4 w-4 group-hover/btn:translate-y-0.5 transition-transform" />
          <span>Download</span>
        </a>
      </div>
    </motion.div>
  );
}
