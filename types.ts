
export interface Link {
  id: string;
  name: string;
  url: string;
  icon?: string;
  color?: string;
}

// Fix: Added FavoriteLink interface which was being imported by FavoritesView.tsx but was missing here.
export interface FavoriteLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

export interface SubCategory {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  links: Link[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subCategories: SubCategory[];
  imageUrl?: string;
  url?: string;
}

export type ViewType = {
  name: 'dashboard' | 'category-detail';
  categoryId?: string;
};

export type ModalType = 
  | 'ADD_CATEGORY' 
  | 'EDIT_CATEGORY' 
  | 'ADD_SUBCATEGORY'
  | 'EDIT_SUBCATEGORY'
  | 'NOTES' 
  | 'DELETE_CONFIRM' 
  | 'DELETE_LINK_CONFIRM'
  | 'DELETE_SUBCATEGORY_CONFIRM'
  | 'ADD_LINK'
  | 'EDIT_LINK'
  | null;