import { ChefHat, Edit2, Eye, EyeOff, Leaf, Flame, Clock, ChevronRight } from 'lucide-react';
import type { MenuCategory, MenuItem } from '@/types/menu';
import { Modal } from '../ui/modal';
import { CreateMenuItemForm } from '../forms/MenuItemForm';
import { useState } from 'react';

interface MenuItemCardProps {
  item: MenuItem;
  formatPrice: (price: number) => string;
  onToggleAvailability: (item: MenuItem) => void;
  handleMenuItemSuccess: () => void;
  categories: MenuCategory[]
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  formatPrice, 
  onToggleAvailability, 
  handleMenuItemSuccess,
  categories
}) => {
  const [isEditMenuItemModalOpen, setIsEditMenuItemModalOpen] = useState(false);
  const [isViewVariationsModalOpen, setIsViewVariationsModalOpen] = useState(false);

  return (
    <>
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
            onClick={() => setIsEditMenuItemModalOpen(true)}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-lg hover:bg-white transition-all"
          >
            <Edit2 size={16} className="text-gray-700" />
          </button>
        </div>

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

          <div className="flex flex-wrap gap-2 mb-2">
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

          {item.variations && item.variations.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">
                {item.variations.length} variation{item.variations.length > 1 ? 's' : ''} available
              </p>
              <button
                onClick={() => setIsViewVariationsModalOpen(true)}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors"
              >
                View Variations
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Status */}
          <div className="sticky bottom-0 flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
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
              onClick={() => setIsEditMenuItemModalOpen(true)}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              
            </button>
          </div>
        </div>
      </div>

      {/* Edit Menu Item Modal */}
      <Modal
        isOpen={isEditMenuItemModalOpen}
        onClose={() => setIsEditMenuItemModalOpen(false)}
        title="Edit Menu Item"
        description="Edit an existing dish or drink on your menu"
        size="lg"
      >
        <CreateMenuItemForm
          onSuccess={handleMenuItemSuccess}
          onCancel={() => setIsEditMenuItemModalOpen(false)}
          categories={categories}
          mode="edit"
          menuItem={item}
        />
      </Modal>

      {/* View Variations Modal */}
      {item.variations && item.variations.length > 0 && (
        <Modal
          isOpen={isViewVariationsModalOpen}
          onClose={() => setIsViewVariationsModalOpen(false)}
          title={`Variations for ${item.name}`}
          description="Customization options available for this menu item"
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">Base price: {formatPrice(item.price)}</p>
                </div>
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium text-gray-900 text-sm">Available Variations</h5>
              {item.variations.map((variation, index) => (
                <div
                  key={variation.id || index}
                  className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h6 className="font-medium text-gray-900">{variation.name}</h6>
                      <p className="text-xs text-gray-500 mt-1">Type: {variation.type}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${
                        variation.price_modifier > 0 
                          ? 'text-green-600' 
                          : variation.price_modifier < 0 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                      }`}>
                        {variation.price_modifier > 0 ? '+' : ''}
                        {formatPrice(variation.price_modifier)}
                      </span>
                      <div className="mt-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          variation.is_required 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {variation.is_required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Final Price:</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(item.price + variation.price_modifier)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Variations:</span>
                <span className="font-medium text-gray-900">{item.variations.length}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Required Variations:</span>
                <span className="font-medium text-gray-900">
                  {item.variations.filter(v => v.is_required).length}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setIsViewVariationsModalOpen(false);
                  setIsEditMenuItemModalOpen(true);
                }}
                className="w-full py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Edit Variations
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};