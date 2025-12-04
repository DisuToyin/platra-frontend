import { MenuItemCard } from './MenuItemCard';
import { MenuItemList } from './ListItemCard';
import type { MenuCategory, MenuItem } from '@/types/menu';
import { CreateMenuCategoryForm } from '../forms/MenuCategoryForm';
import { useState } from 'react';
import { Modal } from '../ui/modal';
import { Edit2 } from 'lucide-react';
import { Badge } from '../ui/badge';

interface CategorySectionProps {
  category: MenuCategory;
  viewMode: 'grid' | 'list';
  formatPrice: (price: number) => string;
  onToggleAvailability: (item: MenuItem) => void;
  handleCategorySuccess: () => void;
  handleMenuItemSuccess: () => void;
  categories: MenuCategory[]
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  viewMode,
  formatPrice,
  categories,
  onToggleAvailability,
  handleCategorySuccess,
  handleMenuItemSuccess
}) => {
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <div>
          <div className='flex items-center gap-2'>
          <h2 className="text-xl font-medium text-gray-900">{category.name}</h2>
            <Badge variant={'outline'} className='rounded-sm bg-amber-100 border border-amber-200 text-amber-600' >{category?.display_order}</Badge>
          </div>
          {category.description && (
            <p className="text-gray-600 text-sm mt-1">{category.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {category?.items?.length || 0} items
          </span>

          <button
            className="text-gray-500 hover:text-gray-700 transition"
            onClick={() => {
              setIsEditCategoryModalOpen(true)
            }}
          >
            <Edit2 size={18} />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category?.items?.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              formatPrice={formatPrice}
              onToggleAvailability={onToggleAvailability}
              handleMenuItemSuccess={handleMenuItemSuccess}
              categories={categories}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {category.items.map(item => (
            <MenuItemList
              key={item.id}
              item={item}
              formatPrice={formatPrice}
              handleMenuItemSuccess={handleMenuItemSuccess}
              categories={categories}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        title="Edit Category"
        description="Edit an existing category to organize your menu items"
        size="md"
      >
        <CreateMenuCategoryForm
          onSuccess={handleCategorySuccess}
          onCancel={() => setIsEditCategoryModalOpen(false)}
          mode="edit"
          category={category}
        />
      </Modal>


     
    </div>
  );
};