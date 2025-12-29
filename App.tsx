
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, StickyNote, Star, LayoutGrid, Download, Upload, ExternalLink, ChevronRight, Search, Database, X as CloseIcon } from 'lucide-react';
import CategoryCard from './components/CategoryCard';
import CategoryDetailView from './components/CategoryDetailView';
import DigitalClock from './components/DigitalClock';
import { CategoryModal, LinkModal, SubCategoryModal, NotesModal, DeleteConfirmModal, StorageManagementModal } from './components/Modals';
import { Category, Link, SubCategory, ModalType, ViewType } from './types';
import { ICON_MAP, QUICK_ACCESS_LINKS } from './constants';
import { StorageService } from './utils/storage';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>({ name: 'dashboard' });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [categories, setCategories] = useState<Category[]>(() => StorageService.loadState().categories);
  const [notes, setNotes] = useState<string>(() => StorageService.loadState().notes);

  const [activeModal, setActiveModal] = useState<ModalType | 'STORAGE'>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

  // Sincronização da Rota via Hash (Stable Routing)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/category/')) {
        const id = hash.replace('#/category/', '');
        // Verifica se a categoria existe antes de navegar
        const exists = categories.some(c => c.id === id);
        if (exists) {
          setView({ name: 'category-detail', categoryId: id });
        } else {
          window.location.hash = '/';
        }
      } else {
        setView({ name: 'dashboard' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Checagem inicial ao carregar a página

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categories]);

  // Atualiza a URL quando o estado da view muda (programaticamente)
  useEffect(() => {
    if (view.name === 'category-detail' && view.categoryId) {
      const currentHash = `#/category/${view.categoryId}`;
      if (window.location.hash !== currentHash) {
        window.location.hash = currentHash;
      }
    } else if (view.name === 'dashboard') {
      if (window.location.hash !== '' && window.location.hash !== '#/') {
        window.location.hash = '/';
      }
    }
  }, [view]);

  useEffect(() => {
    StorageService.saveState(categories, notes);
  }, [categories, notes]);

  const selectedCategory = useMemo(() => 
    categories.find(c => c.id === (selectedCategoryId || (view.name === 'category-detail' ? view.categoryId : null))) || null,
    [categories, selectedCategoryId, view]
  );

  const selectedSubCategory = useMemo(() => {
    if (!selectedCategory || !selectedSubCategoryId) return null;
    return selectedCategory.subCategories.find(s => s.id === selectedSubCategoryId) || null;
  }, [selectedCategory, selectedSubCategoryId]);

  const selectedLink = useMemo(() => {
    if (!selectedSubCategory || !selectedLinkId) return null;
    return selectedSubCategory.links.find(l => l.id === selectedLinkId) || null;
  }, [selectedSubCategory, selectedLinkId]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    
    const results = {
      subCategories: [] as Array<{ catId: string, catName: string, sub: SubCategory }>,
      links: [] as Array<{ catId: string, catName: string, searchSubName: string, subColor: string, link: Link }>
    };

    categories.forEach(cat => {
      cat.subCategories.forEach(sub => {
        if (sub.name.toLowerCase().includes(query)) {
          results.subCategories.push({ catId: cat.id, catName: cat.name, sub });
        }
        sub.links.forEach(link => {
          if (link.name.toLowerCase().includes(query)) {
            results.links.push({ 
              catId: cat.id, 
              catName: cat.name, 
              searchSubName: sub.name, 
              subColor: sub.color || cat.color,
              link 
            });
          }
        });
      });
    });

    return results;
  }, [categories, searchQuery]);

  const handleGlobalRestore = async (file: File) => {
    try {
      const newState = await StorageService.importData(file);
      setCategories(newState.categories);
      setNotes(newState.notes);
      setActiveModal(null);
      alert('Configurações restauradas com sucesso!');
    } catch (err) {
      alert('Erro ao importar backup: ' + (err instanceof Error ? err.message : 'Arquivo inválido'));
    }
  };

  const handleAddCategory = (data: Partial<Category>) => {
    const newCategory: Category = {
      id: `cat-${Math.random().toString(36).substr(2, 5)}-${Date.now()}`,
      name: data.name || 'Nova Categoria',
      url: data.url,
      icon: data.icon || 'Bot',
      color: data.color || '#3b82f6',
      imageUrl: data.imageUrl,
      subCategories: [],
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleEditCategory = (data: Partial<Category>) => {
    if (!selectedCategoryId) return;
    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategoryId ? { ...cat, ...data } : cat
    ));
    setSelectedCategoryId(null);
    setActiveModal(null);
  };

  const handleAddSubCategory = (data: { name: string; color: string; icon: string }) => {
    if (!selectedCategory) return;
    const newSub: SubCategory = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      color: data.color,
      icon: data.icon,
      links: []
    };
    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategory.id 
        ? { ...cat, subCategories: [...cat.subCategories, newSub] } 
        : cat
    ));
    setActiveModal(null);
  };

  const handleEditSubCategory = (data: { name: string; color: string; icon: string }) => {
    if (!selectedCategory || !selectedSubCategoryId) return;
    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategory.id 
        ? { 
            ...cat, 
            subCategories: cat.subCategories.map(s => 
              s.id === selectedSubCategoryId ? { ...s, name: data.name, color: data.color, icon: data.icon } : s
            ) 
          } 
        : cat
    ));
    setSelectedSubCategoryId(null);
    setActiveModal(null);
  };

  const handleDeleteSubCategory = () => {
    if (!selectedCategory || !selectedSubCategoryId) return;
    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategory.id 
        ? { ...cat, subCategories: cat.subCategories.filter(s => s.id !== selectedSubCategoryId) } 
        : cat
    ));
    setSelectedSubCategoryId(null);
    setActiveModal(null);
  };

  const handleSaveLink = (data: Partial<Link>) => {
    if (!selectedCategory || !selectedSubCategoryId) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id !== selectedCategory.id) return cat;
      return {
        ...cat,
        subCategories: cat.subCategories.map(sub => {
          if (sub.id !== selectedSubCategoryId) return sub;
          if (activeModal === 'EDIT_LINK' && selectedLinkId) {
            return {
              ...sub,
              links: sub.links.map(l => l.id === selectedLinkId ? { ...l, ...data } : l)
            };
          } else {
            const newLink: Link = {
              id: Math.random().toString(36).substr(2, 9),
              name: data.name || 'Link',
              url: data.url || '#',
              icon: data.icon || 'Globe',
            };
            return { ...sub, links: [...sub.links, newLink] };
          }
        })
      };
    }));
    setSelectedLinkId(null);
    setActiveModal(null);
  };

  const confirmDeleteLink = () => {
    if (!selectedCategory || !selectedSubCategoryId || !selectedLinkId) return;
    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategory.id 
        ? {
            ...cat,
            subCategories: cat.subCategories.map(sub => 
              sub.id === selectedSubCategoryId 
                ? { ...sub, links: sub.links.filter(l => l.id !== selectedLinkId) }
                : sub
            )
          } 
        : cat
    ));
    setSelectedLinkId(null);
    setActiveModal(null);
  };

  const handleReorderLinks = (subId: string, newLinks: Link[]) => {
    if (!selectedCategory) return;
    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategory.id 
        ? {
            ...cat,
            subCategories: cat.subCategories.map(sub => 
              sub.id === subId ? { ...sub, links: newLinks } : sub
            )
          } 
        : cat
    ));
  };

  return (
    <div className="min-h-screen flex flex-col font-inter relative overflow-x-hidden">
      {/* Cabeçalho Fixo (Fixed Header) */}
      <header className="fixed top-0 left-0 right-0 z-[60] w-full p-2 md:p-3 pointer-events-none">
        <div className="pointer-events-auto header-glass mx-auto max-w-[1800px] px-3 md:px-6 py-2 flex items-center gap-3 md:gap-4 shadow-2xl rounded-2xl md:rounded-3xl border border-white/10 relative overflow-hidden bg-gray-900/90 backdrop-blur-3xl">
          <div 
            className="flex items-center gap-2 cursor-pointer group shrink-0 active:scale-95 transition-transform z-10" 
            onClick={() => { window.location.hash = '/'; setSearchQuery(''); window.scrollTo({top: 0, behavior: 'smooth'}); }}
          >
            <div 
              className="p-1.5 rounded-xl group-hover:rotate-12 transition-all duration-500 shadow-[0_0_15px_rgba(68,222,197,0.3)] relative icon-3d-interactive"
              style={{ backgroundColor: selectedCategory && view.name === 'category-detail' ? selectedCategory.color : '#44dec5' }}
            >
               <div className="absolute inset-0 bg-white/40 blur-lg animate-pulse" />
               {selectedCategory && view.name === 'category-detail' ? 
                 React.createElement(ICON_MAP[selectedCategory.icon] || Star, { size: 18, className: "text-gray-950 relative z-10" }) : 
                 <LayoutGrid size={18} className="text-gray-950 relative z-10" />}
            </div>
            <h1 
              className="hidden sm:block font-cursive text-lg md:text-xl text-glow-cyan transition-all duration-500"
              style={{ color: selectedCategory && view.name === 'category-detail' ? selectedCategory.color : '#44dec5' }}
            >
              LinkDash
            </h1>
          </div>

          <div className="flex-1 overflow-hidden z-10">
             <div className="flex items-center gap-1 md:gap-2.5 overflow-x-auto no-scrollbar py-1">
               {QUICK_ACCESS_LINKS.map((link) => (
                 <a 
                   key={link.name} 
                   href={link.url} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className={`${link.color} flex items-center justify-center rounded-lg shadow-lg transition-all shrink-0 border border-white/20 icon-3d-interactive hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] w-7 h-7 md:w-8 md:h-8`}
                   title={link.name}
                 >
                   <div className="scale-[0.7]">{link.icon}</div>
                 </a>
               ))}
             </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 z-10">
            <DigitalClock size="small" />
            <button onClick={() => setActiveModal('STORAGE')} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-[#44dec5] transition-all border border-white/10 icon-3d-interactive shadow-lg">
              <Database size={16} />
            </button>
            <div className="relative group flex items-center bg-gray-950/50 border border-white/10 rounded-lg px-2 py-1 focus-within:border-[#44dec5]/60 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <Search size={14} className="text-gray-500 group-focus-within:text-[#44dec5] transition-colors" />
              <input type="text" placeholder="Buscar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-[11px] transition-all ml-1.5 placeholder:text-gray-600 focus:ring-0 text-white w-14 xs:w-16 sm:w-20 md:w-24" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="p-0.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"><CloseIcon size={10} /></button>}
            </div>
          </div>
        </div>
      </header>

      <div className="h-[68px] md:h-[76px]"></div>

      <main className="flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-8 lg:p-10 relative z-10">
        {searchQuery.trim() ? (
          <div className="animate-in fade-in duration-500">
             <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-400">Encontrado para: <span className="text-[#44dec5] text-glow-cyan">"{searchQuery}"</span></h2>
                <button onClick={() => setSearchQuery('')} className="text-sm font-bold text-[#44dec5] hover:underline uppercase tracking-tighter">Limpar</button>
             </div>
             {searchResults && (searchResults.subCategories.length > 0 || searchResults.links.length > 0) ? (
               <div className="space-y-16">
                  {searchResults.subCategories.length > 0 && (
                    <section>
                      <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.3em] mb-8">Subcategorias</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {searchResults.subCategories.map(({ catId, catName, sub }) => (
                          <div key={sub.id} onClick={() => { window.location.hash = `/category/${catId}`; setSearchQuery(''); }} className="group glass-card hover:bg-gray-800/80 rounded-3xl p-5 cursor-pointer transition-all flex items-center justify-between shadow-2xl hover:shadow-[0_0_30px_rgba(68,222,197,0.15)] relative overflow-hidden">
                            <div className="border-beam" />
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-2xl bg-white/5 icon-3d-interactive" style={{ color: sub.color }}>
                                {React.createElement(ICON_MAP[sub.icon || 'LayoutGrid'] || LayoutGrid, { size: 24 })}
                              </div>
                              <div>
                                <p className="font-bold text-white text-lg group-hover:text-[#44dec5] transition-colors">{sub.name}</p>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{catName}</p>
                              </div>
                            </div>
                            <ChevronRight size={20} className="text-gray-700 group-hover:text-white transition-all group-hover:translate-x-1" />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  {searchResults.links.length > 0 && (
                    <section>
                      <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.3em] mb-10">Links Diretos</h3>
                      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-12">
                        {searchResults.links.map(({ catId, catName, searchSubName, subColor, link }) => (
                          <div key={link.id} className="group relative flex flex-col items-center">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="relative w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center transition-all duration-500 group-active:scale-90 border border-white/10 hover:border-[#44dec5]/50 bg-gray-900/60 mb-4 shadow-2xl icon-3d-interactive overflow-hidden">
                               <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity blur-2xl rounded-full" style={{ backgroundColor: subColor }} />
                               <img src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=128`} alt="" className="w-10 h-10 md:w-12 md:h-12 object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" onError={(e) => (e.currentTarget.src = "https://www.google.com/s2/favicons?domain=google.com&sz=128")} />
                               <div className="absolute inset-0 flex items-center justify-center bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                 <ExternalLink size={20} className="text-white drop-shadow-md" />
                               </div>
                            </a>
                            <span className="text-gray-200 font-bold text-[11px] md:text-xs tracking-widest text-center uppercase truncate w-full px-2 group-hover:text-[#44dec5] leading-relaxed transition-colors">{link.name}</span>
                            <span className="text-[9px] text-gray-600 font-bold uppercase mt-1 truncate w-full px-2 text-center tracking-tighter">{searchSubName}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
               </div>
             ) : (
               <div className="py-32 flex flex-col items-center opacity-20">
                 <Search size={64} className="mb-6 text-gray-500" />
                 <p className="text-2xl font-black tracking-[0.5em] uppercase">Vazio</p>
               </div>
             )}
          </div>
        ) : view.name === 'dashboard' ? (
          <div className="animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-12 gap-6">
              <div className="flex flex-col items-center sm:items-start">
                <h2 className="font-cursive text-4xl md:text-6xl text-[#44dec5] text-glow-cyan drop-shadow-2xl">Dashboard</h2>
                <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mt-1">Personal Hub & Control</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveModal('NOTES')} className="p-2.5 md:p-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-2xl transition-all border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)] active:scale-90 icon-3d-interactive">
                  <StickyNote size={22} />
                </button>
                <button onClick={() => { setSelectedCategoryId(null); setActiveModal('ADD_CATEGORY'); }} className="w-11 h-11 md:w-13 md:h-13 flex items-center justify-center bg-[#44dec5] hover:bg-[#3bc7b0] text-gray-950 rounded-2xl transition-all shadow-[0_10px_30px_rgba(68,222,197,0.4)] active:scale-95 icon-3d-interactive">
                  <Plus size={26} strokeWidth={3} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} onClick={() => cat.url ? window.open(cat.url, '_blank') : window.location.hash = `/category/${cat.id}`} onOpenLinks={() => window.location.hash = `/category/${cat.id}`} onEdit={() => { setSelectedCategoryId(cat.id); setActiveModal('EDIT_CATEGORY'); }} onDelete={() => { setSelectedCategoryId(cat.id); setActiveModal('DELETE_CONFIRM'); }} />
              ))}
            </div>
          </div>
        ) : selectedCategory ? (
          <CategoryDetailView 
            category={selectedCategory} 
            onBack={() => window.location.hash = '/'} 
            onAddSubCategory={() => { setSelectedSubCategoryId(null); setActiveModal('ADD_SUBCATEGORY'); }}
            onEditSubCategory={(sub) => { setSelectedSubCategoryId(sub.id); setActiveModal('EDIT_SUBCATEGORY'); }}
            onDeleteSubCategory={(subId) => { setSelectedSubCategoryId(subId); setActiveModal('DELETE_SUBCATEGORY_CONFIRM'); }}
            onAddLink={(subId) => { setSelectedSubCategoryId(subId); setSelectedLinkId(null); setActiveModal('ADD_LINK'); }} 
            onEditLink={(subId, link) => { setSelectedSubCategoryId(subId); setSelectedLinkId(link.id); setActiveModal('EDIT_LINK'); }} 
            onDeleteLink={(subId, linkId) => { setSelectedSubCategoryId(subId); setSelectedLinkId(linkId); setActiveModal('DELETE_LINK_CONFIRM'); }} 
            onExportCategory={() => StorageService.exportData()}
            onImportCategory={(data) => handleGlobalRestore(data)}
            onReorderLinks={handleReorderLinks}
          />
        ) : null}
      </main>

      <CategoryModal isOpen={activeModal === 'ADD_CATEGORY' || activeModal === 'EDIT_CATEGORY'} onClose={() => setActiveModal(null)} onSave={activeModal === 'ADD_CATEGORY' ? handleAddCategory : handleEditCategory} initialData={selectedCategory} />
      <SubCategoryModal isOpen={activeModal === 'ADD_SUBCATEGORY' || activeModal === 'EDIT_SUBCATEGORY'} onClose={() => setActiveModal(null)} onSave={activeModal === 'ADD_SUBCATEGORY' ? handleAddSubCategory : handleEditSubCategory} initialData={selectedSubCategory} />
      <LinkModal isOpen={activeModal === 'ADD_LINK' || activeModal === 'EDIT_LINK'} onClose={() => setActiveModal(null)} onSave={handleSaveLink} initialData={selectedLink} categoryName={selectedSubCategory?.name || ''} />
      <NotesModal isOpen={activeModal === 'NOTES'} onClose={() => setActiveModal(null)} notes={notes} onSaveNotes={setNotes} />
      <StorageManagementModal isOpen={activeModal === 'STORAGE'} onClose={() => setActiveModal(null)} onExport={StorageService.exportData.bind(StorageService)} onImport={handleGlobalRestore} />
      
      <DeleteConfirmModal isOpen={activeModal === 'DELETE_CONFIRM'} onClose={() => setActiveModal(null)} onConfirm={() => setCategories(prev => prev.filter(c => c.id !== selectedCategoryId))} itemName={selectedCategory?.name || ''} />
      <DeleteConfirmModal isOpen={activeModal === 'DELETE_SUBCATEGORY_CONFIRM'} onClose={() => setActiveModal(null)} onConfirm={handleDeleteSubCategory} itemName={selectedSubCategory?.name || ''} />
      <DeleteConfirmModal isOpen={activeModal === 'DELETE_LINK_CONFIRM'} onClose={() => setActiveModal(null)} onConfirm={confirmDeleteLink} itemName={selectedLink?.name || ''} />
    </div>
  );
};

export default App;
