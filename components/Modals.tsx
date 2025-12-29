
import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, ExternalLink, Globe, Edit3, Save, Check, Upload, Image as ImageIcon, Link as LinkIcon, AlertTriangle, Star, Loader2, FolderPlus, Sparkles, Bot, DownloadCloud, UploadCloud, Database, RefreshCcw } from 'lucide-react';
import { Category, Link, SubCategory } from '../types';
import { ICON_MAP } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, variant = 'default' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a2333] border border-gray-700 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className={`flex justify-between items-center p-6 border-b border-gray-800 ${variant === 'danger' ? 'bg-red-500/5' : ''}`}>
          <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
            {variant === 'danger' && <AlertTriangle className="text-red-500" size={24} />}
            {title}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
};

export const StorageManagementModal: React.FC<{
  isOpen: boolean; onClose: () => void; onExport: () => void; onImport: (file: File) => void;
}> = ({ isOpen, onClose, onExport, onImport }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Banco de Dados">
      <div className="space-y-6">
        <div className="bg-[#0a0f1e] p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
          <Database size={48} className="text-[#44dec5] mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">Persistência Local</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Seus dados são salvos automaticamente no navegador. Use as opções abaixo para criar cópias de segurança ou transferir seu dashboard para outro computador.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={onExport}
            className="flex flex-col items-center gap-3 p-6 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-2xl transition-all group"
          >
            <DownloadCloud size={32} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <span className="block text-white font-bold">Exportar Backup</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Salvar arquivo .json</span>
            </div>
          </button>

          <button 
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-3 p-6 bg-[#44dec5]/10 hover:bg-[#44dec5]/20 border border-[#44dec5]/20 rounded-2xl transition-all group"
          >
            <UploadCloud size={32} className="text-[#44dec5] group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <span className="block text-white font-bold">Importar Backup</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Restaurar de .json</span>
            </div>
            <input 
              type="file" 
              ref={fileRef} 
              onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} 
              accept=".json" 
              className="hidden" 
            />
          </button>
        </div>

        <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 flex gap-3 items-start">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-amber-200/70">
            <strong>Importante:</strong> Ao importar um backup, todos os seus dados atuais serão substituídos pelos dados do arquivo. Esta ação não pode ser desfeita.
          </p>
        </div>

        <button 
          onClick={() => { if(confirm('Deseja realmente resetar o dashboard para as configurações de fábrica?')) { localStorage.clear(); window.location.reload(); } }}
          className="w-full flex items-center justify-center gap-2 py-3 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all"
        >
          <RefreshCcw size={14} /> Resetar Todo o Dashboard
        </button>
      </div>
    </Modal>
  );
};

export const CategoryModal: React.FC<{
  isOpen: boolean; onClose: () => void; onSave: (data: Partial<Category>) => void; initialData?: Category | null;
}> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [icon, setIcon] = useState('Bot');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setUrl(initialData.url || '');
      setColor(initialData.color);
      setIcon(initialData.icon);
      setImageUrl(initialData.imageUrl || '');
    } else {
      setName(''); setUrl(''); setColor('#3b82f6'); setIcon('Bot'); setImageUrl('');
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem é muito grande. Escolha uma imagem com menos de 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Categoria' : 'Nova Categoria'}>
      <form onSubmit={(e) => { e.preventDefault(); onSave({ name, url, color, icon, imageUrl }); onClose(); }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Nome da Categoria</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0a0f1e] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none" placeholder="Ex: AIs Geradoras" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Imagem de Fundo (Upload ou URL)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              className="flex-1 bg-[#0a0f1e] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm" 
              placeholder="Cole um link ou faça upload..." 
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 bg-[#1a2333] border border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 rounded-xl text-gray-400 hover:text-blue-400 transition-all flex items-center justify-center shrink-0"
              title="Upload de Imagem"
            >
              <Upload size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          {imageUrl && (
            <div className="mt-4 relative group h-28 rounded-xl overflow-hidden border border-white/5 shadow-inner bg-black/40">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visualização do Fundo</span>
              </div>
              <button 
                type="button" 
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-all shadow-lg active:scale-90"
                title="Remover Imagem"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Cor de Destaque</label>
            <div className="flex items-center gap-3 bg-[#0a0f1e] border border-gray-700 rounded-xl px-3 py-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden" />
              <span className="text-xs font-mono text-gray-500 uppercase">{color}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Ícone</label>
            <div className="relative">
              <select value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full bg-[#0a0f1e] border border-gray-700 rounded-xl px-4 py-3 text-white appearance-none focus:ring-2 focus:ring-blue-500 transition-all">
                {Object.keys(ICON_MAP).map(iconName => (
                  <option key={iconName} value={iconName}>{iconName}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                {React.createElement(ICON_MAP[icon] || Bot, { size: 20 })}
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-[#44dec5] hover:bg-[#3bc7b0] text-[#0a0f1e] font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#44dec5]/10 active:scale-[0.98]">
          {initialData ? 'Atualizar Categoria' : 'Criar Categoria'}
        </button>
      </form>
    </Modal>
  );
};

export const SubCategoryModal: React.FC<{
  isOpen: boolean; onClose: () => void; onSave: (data: { name: string; color: string; icon: string }) => void; initialData?: SubCategory | null;
}> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#44dec5');
  const [icon, setIcon] = useState('Sparkles');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setColor(initialData.color || '#44dec5');
      setIcon(initialData.icon || 'Sparkles');
    } else {
      setName('');
      setColor('#44dec5');
      setIcon('Sparkles');
    }
  }, [initialData, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Subcategoria' : 'Nova Subcategoria'}>
      <form onSubmit={(e) => { e.preventDefault(); onSave({ name, color, icon }); }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Nome da Subcategoria</label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full bg-[#0a0f1e] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#44dec5]/50" 
            placeholder="Ex: Imagem, Texto, Vídeo..." 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Cor de Destaque</label>
            <div className="flex items-center gap-3 bg-[#0a0f1e] border border-gray-700 rounded-xl px-3 py-2">
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
                className="w-10 h-10 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden" 
              />
              <span className="text-xs font-mono text-gray-400 uppercase">{color}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Ícone</label>
            <div className="relative">
              <select 
                value={icon} 
                onChange={(e) => setIcon(e.target.value)} 
                className="w-full bg-[#0a0f1e] border border-gray-700 rounded-xl px-4 py-3 text-white appearance-none focus:ring-2 focus:ring-[#44dec5]/50"
              >
                {Object.keys(ICON_MAP).map(iconName => (
                  <option key={iconName} value={iconName}>{iconName}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#44dec5]">
                {/* Fallback import correctly checked */}
                {React.createElement(ICON_MAP[icon] || Sparkles, { size: 20 })}
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#44dec5] hover:bg-[#3bc7b0] text-[#0a0f1e] font-bold py-4 rounded-2xl active:scale-95 transition-all shadow-[0_0_20px_rgba(68,222,197,0.2)]"
        >
          {initialData ? 'Atualizar Subcategoria' : 'Salvar Subcategoria'}
        </button>
      </form>
    </Modal>
  );
};

export const LinkModal: React.FC<{
  isOpen: boolean; onClose: () => void; onSave: (data: Partial<Link>) => void; initialData?: Link | null; categoryName: string;
}> = ({ isOpen, onClose, onSave, initialData, categoryName }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (initialData) { setName(initialData.name); setUrl(initialData.url); }
    else { setName(''); setUrl(''); }
  }, [initialData, isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Link' : `Novo Link em ${categoryName}`}>
      <form onSubmit={(e) => { e.preventDefault(); onSave({ name, url: url.startsWith('http') ? url : `https://${url}` }); }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Nome</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0a0f1e] border border-gray-700 rounded-xl px-4 py-3 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">URL</label>
          <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} className="w-full bg-[#0a0f1e] border border-gray-700 rounded-xl px-4 py-3 text-white" />
        </div>
        <button type="submit" className="w-full bg-[#44dec5] text-[#0a0f1e] font-bold py-4 rounded-2xl transition-all">Salvar Link</button>
      </form>
    </Modal>
  );
};

export const NotesModal: React.FC<{ isOpen: boolean; onClose: () => void; notes: string; onSaveNotes: (text: string) => void; }> = ({ isOpen, onClose, notes, onSaveNotes }) => {
  const [localNotes, setLocalNotes] = useState(notes);
  useEffect(() => { if (isOpen) setLocalNotes(notes); }, [notes, isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bloco de Notas">
      <textarea value={localNotes} onChange={(e) => { setLocalNotes(e.target.value); onSaveNotes(e.target.value); }} className="w-full h-80 bg-[#0a0f1e] border-2 border-yellow-500/40 rounded-2xl p-5 text-white focus:outline-none focus:border-yellow-500 font-mono text-sm leading-relaxed" />
      <p className="text-xs italic text-gray-500 mt-2">Salvo automaticamente no navegador.</p>
    </Modal>
  );
};

export const DeleteConfirmModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; itemName: string; }> = ({ isOpen, onClose, onConfirm, itemName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão" variant="danger">
      <div className="space-y-6 text-center">
        <Trash2 size={48} className="text-red-500 mx-auto" />
        <p className="text-lg text-gray-200">Deseja excluir <span className="font-bold">"{itemName}"</span>?</p>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 bg-gray-800 text-white py-3 rounded-2xl">Cancelar</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 bg-red-500 text-white py-3 rounded-2xl">Excluir</button>
        </div>
      </div>
    </Modal>
  );
};
