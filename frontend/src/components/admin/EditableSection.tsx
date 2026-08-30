import React from 'react';
import { Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  onEdit: () => void;
  isHighlighted?: boolean;
  children: React.ReactNode;
}

export default function EditableSection({ title, onEdit, isHighlighted, children }: Props) {
  return (
    <div className="relative group">
      {children}
      
      {/* Edit Overlay Button */}
      <div className="absolute top-0 right-0 z-[100] pointer-events-none flex items-start justify-end p-4 md:p-8">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="pointer-events-auto opacity-70 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 bg-slate-900 dark:bg-teal-500 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-white/10 hover:bg-slate-800 dark:hover:bg-teal-400 font-medium text-sm"
        >
          <Pencil className="w-4 h-4" />
          Edit {title}
        </motion.button>
      </div>
      
      {/* Subtle border highlight on hover, or pulsing amber if highlighted */}
      <motion.div 
        animate={isHighlighted ? { 
          boxShadow: ['0px 0px 0px rgba(245, 158, 11, 0)', '0px 0px 20px rgba(245, 158, 11, 0.4)', '0px 0px 0px rgba(245, 158, 11, 0)'],
          borderColor: ['rgba(245, 158, 11, 0)', 'rgba(245, 158, 11, 0.6)', 'rgba(245, 158, 11, 0)']
        } : {}}
        transition={isHighlighted ? { duration: 2, repeat: Infinity } : {}}
        className={`absolute inset-0 pointer-events-none border-2 rounded-2xl transition-colors duration-200 z-[90] ${
          isHighlighted ? 'border-amber-500/50' : 'border-transparent group-hover:border-teal-500/30'
        }`} 
      />
      
      {isHighlighted && (
        <div className="absolute -top-3 left-4 z-[110] bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg pointer-events-none">
          Restored Change
        </div>
      )}
    </div>
  );
}
