
import React, { useMemo } from 'react';
import { Pencil, Trash2, List } from 'lucide-react';
import { Category } from '../types';
import { ICON_MAP } from '../constants';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenLinks: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, onEdit, onDelete, onOpenLinks }) => {
  const IconComponent = ICON_MAP[category.icon] || ICON_MAP['Bot'];

  const totalLinks = useMemo(() => {
    if (!category.subCategories) return 0;
    return category.subCategories.reduce((acc, sub) => acc + (sub.links?.length || 0), 0);
  }, [category.subCategories]);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <div 
      onClick={() => category.url ? window.open(category.url, '_blank') : onClick()}
      className="group relative glass-card rounded-[2rem] p-4 md:p-5 h-36 md:h-44 flex flex-col justify-between cursor-pointer transition-all duration-500 overflow-hidden shadow-2xl hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] active:scale-95"
    >
      {/* Animated Border Beam */}
      <div className="border-beam" style={{ filter: `drop-shadow(0 0 5px ${category.color})` }} />

      {/* Internal Background Glow */}
      <div 
        className="absolute -top-10 -right-10 w-24 h-24 blur-[50px] opacity-15 group-hover:opacity-35 transition-opacity"
        style={{ backgroundColor: category.color }}
      />

      {/* Background Image with advanced masking */}
      {category.imageUrl && (
        <div 
          className="absolute inset-0 opacity-10 group-hover:opacity-25 transition-all duration-700 scale-105 group-hover:scale-100 pointer-events-none"
          style={{ 
            backgroundImage: `url(${category.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: 'linear-gradient(to top, transparent, black)'
          }}
        />
      )}

      <div className="flex justify-between items-start relative z-10">
        <div 
          className="p-2.5 md:p-3 rounded-xl flex items-center justify-center transition-all shadow-xl icon-3d-interactive border border-white/10"
          style={{ backgroundColor: `${category.color}20`, color: category.color }}
        >
          <IconComponent size={20} className="md:w-6 md:h-6 drop-shadow-[0_0_6px_currentColor]" />
        </div>
        
        <div className="flex gap-1.5 items-center bg-gray-950/40 backdrop-blur-md p-1 rounded-xl border border-white/5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
          <button 
            type="button"
            onClick={(e) => handleAction(e, onOpenLinks)}
            className="p-1.5 text-gray-400 hover:text-white transition-all hover:bg-white/10 rounded-lg icon-3d-interactive"
            title="Ver Links"
          >
            <List size={16} />
          </button>
          <button 
            type="button"
            onClick={(e) => handleAction(e, onEdit)}
            className="p-1.5 text-gray-400 hover:text-white transition-all hover:bg-white/10 rounded-lg icon-3d-interactive"
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          <button 
            type="button"
            onClick={(e) => handleAction(e, onDelete)}
            className="p-1.5 bg-red-500/10 hover:bg-red-500/40 text-red-400 rounded-lg transition-all border border-red-500/20 icon-3d-interactive"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-lg md:text-xl font-bold text-white tracking-tight truncate leading-tight group-hover:text-glow-cyan transition-all">{category.name}</h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="h-0.5 w-6 rounded-full transition-all duration-500 group-hover:w-12" style={{ backgroundColor: category.color }} />
          <p className="text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-wider">
            {totalLinks} {totalLinks === 1 ? 'Entry' : 'Entries'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
