
import { Category } from '../types';
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
  /**
   * Carrega o estado global com lógica de migração e tratamento de erros.
   */
  static loadState(): AppState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      
      if (!saved) {
        // Tentar recuperar de versões antigas se existirem
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

      const parsed: AppState = JSON.parse(saved);

      // Lógica de Migração de Versão (futura)
      if (parsed.version !== CURRENT_VERSION) {
        console.warn(`Versão detectada (${parsed.version}) difere da atual (${CURRENT_VERSION}). Aplicando migrações...`);
        // Aqui seriam aplicadas funções transformadoras caso o esquema mudasse drasticamente
      }

      return parsed;
    } catch (error) {
      console.error('Falha crítica ao carregar estado do localStorage:', error);
      return this.getInitialState();
    }
  }

  /**
   * Salva o estado global de forma atômica.
   */
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
      // Fallback: tentar salvar apenas categorias se o objeto for muito grande
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Espaço de armazenamento esgotado! Tente remover imagens de fundo pesadas.');
      }
    }
  }

  /**
   * Gera um arquivo JSON para backup.
   */
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
   * Valida e restaura dados de um arquivo JSON.
   */
  static async importData(file: File): Promise<AppState> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          
          // Validação básica de estrutura
          if (!parsed.categories || !Array.isArray(parsed.categories)) {
            throw new Error('Formato de arquivo inválido: Lista de categorias não encontrada.');
          }

          // Garantir que a versão seja marcada como a atual após importação bem sucedida
          const newState = {
            ...parsed,
            version: CURRENT_VERSION,
            lastModified: Date.now()
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
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
