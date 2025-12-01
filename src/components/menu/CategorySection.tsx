import { MenuItemCard } from './MenuItemCard';
import { MenuItemList } from './ListItemCard';
import type { MenuCategory, MenuItem } from '@/types/menu';

interface CategorySectionProps {
  category: MenuCategory;
  viewMode: 'grid' | 'list';
  formatPrice: (price: number) => string;
  onEditItem: (item: MenuItem) => void;
  onToggleAvailability: (item: MenuItem) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  viewMode,
  formatPrice,
  onEditItem,
  onToggleAvailability,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-medium text-gray-900">{category.name}</h2>
          {category.description && (
            <p className="text-gray-600 text-sm mt-1">{category.description}</p>
          )}
        </div>
        <span className="text-sm text-gray-500">{category?.items?.length || 0} items</span>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category?.items?.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              formatPrice={formatPrice}
              onEdit={onEditItem}
              onToggleAvailability={onToggleAvailability}
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
              onEdit={onEditItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};