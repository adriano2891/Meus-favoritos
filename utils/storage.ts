
import { Category, Link, SubCategory } from '../types';
import { INITIAL_CATEGORIES } from '../constants';

const STORAGE_KEY = 'linkdash_global_state';
const CURRENT_VERSION = '3.0.0';

export interface AppState {
  version: string;
  lastModified: number;
  categories: Category[];
  notes: string;
}

export class StorageService {
  static loadState(): AppState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      
      if (!saved) {
        // Fallback para versões muito antigas
        const oldCategories = localStorage.getItem('linkdash_categories_v3') || localStorage.getItem('linkdash_categories_v2');
        const oldNotes = localStorage.getItem('linkdash_notes_v2');
        
        if (oldCategories) {
          return {
            version: CURRENT_VERSION,
            lastModified: Date.now(),
            categories: JSON.parse(oldCategories),
            notes: oldNotes || ''
          };
        }
        return this.getInitialState();
      }

      return JSON.parse(saved);
    } catch (error) {
      console.error('Falha ao carregar estado:', error);
      return this.getInitialState();
    }
  }

  static saveState(categories: Category[], notes: string) {
    try {
      const state: AppState = {
        version: CURRENT_VERSION,
        lastModified: Date.now(),
        categories,
        notes
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
  }

  static exportData() {
    const state = this.loadState();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkdash_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Normaliza dados externos para o formato compatível com o App.
   * Suporta arquivos com campos em português (nome, cor, subcategorias)
   */
  static normalizeData(data: any): Category[] {
    // Se o dado for um objeto de exportação completo ou apenas um array de categorias
    const rawCategories = data.categories || (Array.isArray(data) ? data : null);
    
    if (!rawCategories || !Array.isArray(rawCategories)) {
      // Se for apenas uma categoria única solta no arquivo
      if (data.nome || data.name) return [this.normalizeCategory(data)];
      return [];
    }

    return rawCategories.map(cat => this.normalizeCategory(cat));
  }

  private static normalizeCategory(cat: any): Category {
    const categoryId = String(cat.id || Math.random().toString(36).substr(2, 9));
    const categoryColor = cat.color || cat.cor || '#44dec5';
    
    const normalizedCat: Category = {
      id: categoryId,
      name: cat.name || cat.nome || 'Categoria sem nome',
      color: categoryColor,
      icon: cat.icon || 'LayoutGrid',
      imageUrl: cat.imageUrl || cat.imagem || null,
      subCategories: []
    };

    // 1. Processar subcategorias existentes
    const rawSubs = cat.subCategories || cat.subcategorias || [];
    if (Array.isArray(rawSubs)) {
      normalizedCat.subCategories = rawSubs.map((sub: any) => ({
        id: String(sub.id || Math.random().toString(36).substr(2, 9)),
        name: sub.name || sub.nome || 'Seção',
        color: sub.color || sub.cor || categoryColor,
        icon: sub.icon || 'Sparkles',
        links: this.normalizeLinks(sub.links)
      }));
    }

    // 2. Processar links "órfãos" (links que estão direto na categoria, comum nos seus arquivos)
    const orphanLinks = cat.links;
    if (Array.isArray(orphanLinks) && orphanLinks.length > 0) {
      normalizedCat.subCategories.push({
        id: `section-gen-${categoryId}`,
        name: 'Geral',
        color: categoryColor,
        icon: 'List',
        links: this.normalizeLinks(orphanLinks)
      });
    }

    return normalizedCat;
  }

  private static normalizeLinks(links: any): Link[] {
    if (!Array.isArray(links)) return [];
    return links.map((l: any) => ({
      id: String(l.id || Math.random().toString(36).substr(2, 9)),
      name: l.name || l.nome || 'Link',
      url: l.url || '#',
      icon: l.icon || 'Globe'
    }));
  }

  static async importData(file: File): Promise<AppState> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          const normalized = this.normalizeData(parsed);
          
          if (normalized.length === 0) throw new Error('Estrutura de arquivo inválida.');

          const newState: AppState = {
            version: CURRENT_VERSION,
            lastModified: Date.now(),
            categories: normalized,
            notes: parsed.notes || ''
          };
          
          this.saveState(newState.categories, newState.notes);
          resolve(newState);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }

  private static getInitialState(): AppState {
    return {
      version: CURRENT_VERSION,
      lastModified: Date.now(),
      categories: INITIAL_CATEGORIES,
      notes: ''
    };
  }
}
