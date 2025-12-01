import { ChefHat, Leaf, Flame, Clock } from 'lucide-react';
import type { MenuItem } from '@/types/menu';

interface MenuItemListProps {
  item: MenuItem;
  formatPrice: (price: number) => string;
  onEdit: (item: MenuItem) => void;
}

export const MenuItemList: React.FC<MenuItemListProps> = ({ item, formatPrice, onEdit }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all ${
      !item.is_available ? 'opacity-60' : ''
    }`}>
      <div className="flex gap-6">
        <div className="w-32 h-32 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-medium text-gray-900">{item.name}</h3>
              {item.description && (
                <p className="text-gray-600">{item.description}</p>
              )}
            </div>
            <span className="text-xl font-medium text-gray-900 ml-4">
              {formatPrice(item.price)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {item.is_vegan && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                <Leaf size={12} />
                Vegan
              </span>
            )}
            {item.is_vegetarian && !item.is_vegan && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                <Leaf size={12} />
                Vegetarian
              </span>
            )}
            {item.is_spicy && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                <Flame size={12} />
                Spicy
              </span>
            )}
            {item.preparation_time && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                <Clock size={12} />
                {item.preparation_time}m
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className={item.is_available ? 'text-green-600' : 'text-gray-400'}>
                {item.is_available ? '● Available' : '● Unavailable'}
              </span>
              {item.variations && item.variations.length > 0 && (
                <span>{item.variations.length} variations</span>
              )}
            </div>
            <button 
              onClick={() => onEdit(item)}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Edit Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};