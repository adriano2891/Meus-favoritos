
import React, { useState, useRef } from 'react';
import { ArrowLeft, Plus, ExternalLink, Pencil, Trash2, FolderPlus, ChevronRight, DownloadCloud, UploadCloud, Globe, Sparkles, GripVertical } from 'lucide-react';
import { Category, SubCategory, Link } from '../types';
import { ICON_MAP } from '../constants';

interface CategoryDetailViewProps {
  category: Category;
  onBack: () => void;
  onAddSubCategory: () => void;
  onEditSubCategory: (sub: SubCategory) => void;
  onDeleteSubCategory: (id: string) => void;
  onAddLink: (subId: string) => void;
  onEditLink: (subId: string, link: Link) => void;
  onDeleteLink: (subId: string, linkId: string) => void;
  onExportCategory: () => void;
  onImportCategory: (data: any) => void;
  onReorderLinks: (subId: string, newLinks: Link[]) => void;
}

const FaviconImage: React.FC<{ url: string; alt: string; color: string }> = ({ url, alt, color }) => {
  const [error, setError] = useState(false);
  let domain = '';
  try { domain = new URL(url).hostname; } catch (e) { domain = url; }
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  if (error) return <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/5" style={{ color }}><Globe size={24} /></div>;
  return <img src={faviconUrl} alt={alt} className="w-10 h-10 md:w-12 md:h-12 object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-500 pointer-events-none" onError={() => setError(true)} />;
};

const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ 
  category, onBack, onAddSubCategory, onEditSubCategory, onDeleteSubCategory, onAddLink, onEditLink, onDeleteLink, onExportCategory, onImportCategory, onReorderLinks
}) => {
  const IconTitle = ICON_MAP[category.icon] || ICON_MAP['Star'];
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Drag and Drop State
  const [draggedItem, setDraggedItem] = useState<{ subId: string, index: number } | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverSubId, setDragOverSubId] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content === 'string') {
          const data = JSON.parse(content);
          onImportCategory(data);
        }
      } catch (err) {
        alert('Erro ao processar arquivo. Verifique o formato JSON.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleDragStart = (e: React.DragEvent, subId: string, index: number) => {
    // Configura o item sendo arrastado
    setDraggedItem({ subId, index });
    
    // Define dados de transferência para compatibilidade total entre navegadores (ex: Firefox)
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    
    // Delay sutil para feedback visual (o item some levemente após iniciar o arraste)
    setTimeout(() => {
      const target = e.target as HTMLElement;
      target.style.opacity = '0.3';
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, subId: string, index: number) => {
    // Previne comportamento padrão para permitir o drop
    e.preventDefault();
    e.stopPropagation();

    // Bloqueia arraste entre subcategorias diferentes para manter a organização
    if (!draggedItem || draggedItem.subId !== subId) return;
    
    // Evita atualizações excessivas de estado se o index for o mesmo
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
      setDragOverSubId(subId);
    }
  };

  const handleDrop = (e: React.DragEvent, subId: string, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || draggedItem.subId !== subId) {
      resetDragState();
      return;
    }

    const sub = category.subCategories.find(s => s.id === subId);
    if (!sub) return;

    // Lógica de reordenamento do array
    const newLinks = [...sub.links];
    const [movedItem] = newLinks.splice(draggedItem.index, 1);
    newLinks.splice(dropIndex, 0, movedItem);

    // Persiste a mudança no estado global (App.tsx)
    onReorderLinks(subId, newLinks);
    resetDragState();
  };

  const resetDragState = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
    setDragOverSubId(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    resetDragState();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1800px] mx-auto">
      {/* Header da Categoria */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 px-4">
        <div className="flex items-center gap-6 group">
          <button 
            onClick={onBack} 
            className="p-3.5 bg-gray-900/50 hover:bg-[#44dec5]/20 rounded-2xl border border-white/5 text-white transition-all active:scale-90 shadow-2xl backdrop-blur-xl group-hover:border-[#44dec5]/40"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <IconTitle size={24} style={{ color: category.color }} className="drop-shadow-[0_0_8px_currentColor]" />
              <h2 className="font-cursive text-4xl md:text-6xl text-white tracking-tight leading-none drop-shadow-2xl">
                {category.name}
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-2">
               <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: category.color }} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Explorar Hub de Links</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex gap-1.5 bg-gray-950/40 p-2 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" className="hidden" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                title="Importar"
              >
                <UploadCloud size={20} />
              </button>
              <button 
                onClick={onExportCategory}
                className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                title="Exportar"
              >
                <DownloadCloud size={20} />
              </button>
           </div>
           
           <button 
            onClick={onAddSubCategory} 
            className="flex items-center gap-3 px-6 py-4 bg-[#44dec5] hover:bg-[#3bc7b0] text-gray-950 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(68,222,197,0.3)] active:scale-95 group"
           >
              <FolderPlus size={18} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
              Nova Seção
           </button>
        </div>
      </div>

      {/* Grid de Subcategorias e Links */}
      <div className="space-y-20 px-4 pb-20">
        {category.subCategories.map((sub) => {
          const SubIcon = ICON_MAP[sub.icon || ''] || Sparkles;
          const subColor = sub.color || category.color;

          return (
            <section key={sub.id} className="relative">
              <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shadow-lg"
                    style={{ backgroundColor: `${subColor}15`, color: subColor }}
                  >
                    <SubIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{sub.name}</h3>
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-0.5">{sub.links.length} itens configurados • Arraste para reordenar</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
                    <button onClick={() => onEditSubCategory(sub)} className="p-2 text-gray-400 hover:text-white transition-all"><Pencil size={14} /></button>
                    <button onClick={() => onDeleteSubCategory(sub.id)} className="p-2 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                  </div>
                  <div className="w-px h-6 bg-white/10 mx-2" />
                  <button 
                    onClick={() => onAddLink(sub.id)} 
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl transition-all shadow-xl active:scale-95 text-xs font-bold uppercase tracking-tighter"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>
              </div>

              {/* Grid de Itens Circulares com Drag and Drop */}
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-6 gap-y-12">
                {sub.links.map((link, index) => {
                  const isDragging = draggedItem?.subId === sub.id && draggedItem?.index === index;
                  const isOver = dragOverSubId === sub.id && dragOverIndex === index;

                  return (
                    <div 
                      key={link.id} 
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, sub.id, index)}
                      onDragOver={(e) => handleDragOver(e, sub.id, index)}
                      onDrop={(e) => handleDrop(e, sub.id, index)}
                      onDragEnd={handleDragEnd}
                      className={`group relative flex flex-col items-center transition-all duration-300 ${isDragging ? 'scale-90 opacity-20' : 'opacity-100'} ${isOver && !isDragging ? 'scale-110' : ''}`}
                    >
                      {/* Botões de Gestão do Link */}
                      <div className="absolute -top-2 -right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-20 scale-75 group-hover:scale-100">
                        <button onClick={() => onEditLink(sub.id, link)} className="p-2 bg-amber-500 text-white rounded-full shadow-2xl hover:bg-amber-400 transition-all"><Pencil size={12} /></button>
                        <button onClick={() => onDeleteLink(sub.id, link.id)} className="p-2 bg-red-500 text-white rounded-full shadow-2xl hover:bg-red-400 transition-all"><Trash2 size={12} /></button>
                      </div>

                      {/* Ícone de Drag Visual (apenas no hover) */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity text-white pointer-events-none">
                        <GripVertical size={16} />
                      </div>

                      {/* Ícone Circular "Estilo Dock" */}
                      <div className="relative group/link-area pointer-events-auto">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 group-active:scale-90 border-2 bg-gray-900/60 mb-4 shadow-2xl overflow-hidden group-hover:-translate-y-2 cursor-pointer ${isOver && !isDragging ? 'border-[#44dec5]' : 'border-white/5'}`}
                        >
                          {/* Efeito de Brilho de Fundo */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity blur-2xl rounded-full" style={{ backgroundColor: subColor }} />
                          
                          {/* Imagem do Site (Favicon) */}
                          <FaviconImage url={link.url} alt={link.name} color={subColor} />
                          
                          {/* Overlay de Redirecionamento */}
                          <div className="absolute inset-0 flex items-center justify-center bg-[#44dec5]/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                            <ExternalLink size={20} className="text-white drop-shadow-md" />
                          </div>
                        </a>
                      </div>

                      {/* Nome do Link */}
                      <span className="text-gray-200 font-bold text-[10px] md:text-[11px] tracking-[0.15em] text-center uppercase truncate w-full px-2 group-hover:text-[#44dec5] leading-relaxed transition-colors drop-shadow-lg pointer-events-none">
                        {link.name}
                      </span>
                    </div>
                  );
                })}

                {/* Slot para adicionar quando vazio */}
                {sub.links.length === 0 && (
                  <button 
                    onClick={() => onAddLink(sub.id)} 
                    className="col-span-2 aspect-video border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-gray-500 hover:bg-white/5 hover:border-[#44dec5]/30 transition-all group"
                  >
                    <Plus size={32} className="group-hover:scale-125 group-hover:text-[#44dec5] transition-all duration-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2 group-hover:text-white">Adicionar Link</span>
                  </button>
                )}
              </div>
            </section>
          );
        })}

        {/* Estado Vazio da Categoria */}
        {category.subCategories.length === 0 && (
          <div className="py-32 flex flex-col items-center text-center animate-pulse">
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-800 flex items-center justify-center mb-8 text-gray-800">
              <FolderPlus size={64} />
            </div>
            <h4 className="text-2xl font-black text-gray-800 uppercase tracking-[0.5em] mb-4">Dashboard Vazio</h4>
            <p className="text-gray-600 max-w-sm mx-auto mb-8 font-medium">Crie sua primeira seção para começar a organizar seus links nesta categoria.</p>
            <button 
              onClick={onAddSubCategory} 
              className="text-[#44dec5] font-black uppercase tracking-widest hover:underline"
            >
              Começar Agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailView;
