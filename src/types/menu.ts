export interface MenuItemVariation {
  id: string;
  menu_item_id: string;
  name: string;
  type: string;
  price_modifier: number;
  is_required: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  organization_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  ingredients?: string[];
  allergens?: string[];
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_spicy: boolean;
  preparation_time?: number;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  variations?: MenuItemVariation[];
}

export interface MenuCategory {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  items: MenuItem[];
}
