import { ChefHat, Edit2, Eye, EyeOff, Leaf, Flame, Clock } from 'lucide-react';
import type { MenuItem } from '@/types/menu';

interface MenuItemCardProps {
  item: MenuItem;
  formatPrice: (price: number) => string;
  onEdit: (item: MenuItem) => void;
  onToggleAvailability: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  formatPrice, 
  onEdit, 
  onToggleAvailability 
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all ${
      !item.is_available ? 'opacity-60' : ''
    }`}>
      {/* Item Image */}
      <div className="relative h-48 bg-gray-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-gray-300" />
          </div>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg text-sm font-medium">
              Unavailable
            </span>
          </div>
        )}
        <button 
          onClick={() => onEdit(item)}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-lg hover:bg-white transition-all"
        >
          <Edit2 size={16} className="text-gray-700" />
        </button>
      </div>

      {/* Item Details */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{item.name}</h3>
          <span className="text-lg font-medium text-green-600 ml-2">
            {formatPrice(item.price)}
          </span>
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {item.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
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

        {/* Variations */}
        {item.variations && item.variations.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {item.variations.length} variation{item.variations.length > 1 ? 's' : ''} available
            </p>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <button 
            onClick={() => onToggleAvailability(item)}
            className={`flex items-center gap-1 text-sm ${
              item.is_available ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {item.is_available ? <Eye size={16} /> : <EyeOff size={16} />}
            {item.is_available ? 'Available' : 'Hidden'}
          </button>
          <button 
            onClick={() => onEdit(item)}
            className="text-blue-600 text-sm font-medium hover:text-blue-700"
          >
          View Item
          </button>
        </div>
      </div>
    </div>
  );
};