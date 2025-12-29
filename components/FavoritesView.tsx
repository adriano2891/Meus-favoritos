
import React, { useState } from 'react';
import { ArrowLeft, Plus, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { FavoriteLink } from '../types';
import { ICON_MAP } from '../constants';

interface FavoritesViewProps {
  favorites: FavoriteLink[];
  onBack: () => void;
  onAdd: () => void;
  onEdit: (fav: FavoriteLink) => void;
  onDelete: (id: string) => void;
}

const FaviconImage: React.FC<{ url: string; alt: string; color: string; icon: string }> = ({ url, alt, color, icon }) => {
  const [error, setError] = useState(false);
  const IconComponent = ICON_MAP[icon] || ICON_MAP['Globe'];

  // Extrair o domínio para o serviço de favicon do Google
  let domain = '';
  try {
    domain = new URL(url).hostname;
  } catch (e) {
    domain = url;
  }

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  if (error) {
    return <IconComponent size={48} style={{ color }} className="relative z-10 drop-shadow-md" />;
  }

  return (
    <img 
      src={faviconUrl} 
      alt={alt} 
      className="w-12 h-12 sm:w-16 sm:h-16 object-contain relative z-10 filter drop-shadow-lg"
      onError={() => setError(true)}
    />
  );
};

const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, onBack, onAdd, onEdit, onDelete }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 bg-[#1a2333] hover:bg-[#232d42] rounded-2xl border border-gray-700/50 text-white transition-all hover:-translate-x-1"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="font-cursive text-5xl text-[#44dec5]">Favoritas</h2>
        </div>
        <button 
          onClick={onAdd}
          title="Novo Favorito"
          className="w-11 h-11 flex items-center justify-center bg-[#44dec5] hover:bg-[#3bc7b0] text-[#0a0f1e] rounded-2xl transition-all shadow-lg shadow-[#44dec5]/20 active:scale-95 hover:scale-105"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {favorites.map((fav) => {
          return (
            <div key={fav.id} className="group relative flex flex-col items-center">
              {/* Botões de ação flutuantes */}
              <div className="absolute -top-1 -right-1 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button 
                  onClick={() => onEdit(fav)}
                  className="p-2 bg-amber-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform border border-amber-400"
                >
                  <Pencil size={14} />
                </button>
                <button 
                  onClick={() => onDelete(fav.id)}
                  className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform border border-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Ícone Circular Principal */}
              <a 
                href={fav.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group-active:scale-95 shadow-2xl border-4 border-transparent hover:border-[#44dec5]/30 overflow-hidden mb-4"
                style={{ backgroundColor: `${fav.color}15` }}
              >
                {/* Efeito de brilho de fundo dinâmico */}
                <div 
                  className="absolute inset-0 opacity-10 group-hover:opacity-25 transition-opacity blur-xl scale-75"
                  style={{ backgroundColor: fav.color }}
                />
                
                {/* Favicon do Site */}
                <FaviconImage url={fav.url} alt={fav.name} color={fav.color} icon={fav.icon} />
                
                {/* Overlay ao passar o mouse */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={24} className="text-white" />
                </div>
              </a>

              <span className="text-gray-200 font-bold text-sm tracking-wide text-center uppercase truncate w-full px-2 group-hover:text-[#44dec5] transition-colors">
                {fav.name}
              </span>
            </div>
          );
        })}

        {favorites.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center opacity-20">
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-500 flex items-center justify-center mb-4">
              <Plus size={48} />
            </div>
            <p className="text-xl font-medium">Nenhum favorito configurado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesView;