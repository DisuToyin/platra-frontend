import { Plus, Search, Grid3x3, List } from 'lucide-react';
import type { MenuCategory } from '@/types/menu';

interface MenuHeaderProps {
  totalItems: number;
  categories: MenuCategory[];
  searchQuery: string;
  selectedCategory: string;
  viewMode: 'grid' | 'list';
  onSearchChange: (query: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onAddCategory: () => void;
  onAddItem: () => void;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({
  totalItems,
  categories,
  searchQuery,
  selectedCategory,
  viewMode,
  onSearchChange,
  onCategoryChange,
  onViewModeChange,
  onAddCategory,
  onAddItem,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">
            {totalItems} items across {categories.length} categories
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onAddCategory}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
          >
            <Plus size={20} />
            Add Category
          </button>
          <button 
            onClick={onAddItem}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Categories</option>
          {categories?.map(category => (
            <option key={category.id} value={category.id}>
              {category.name} ({category?.items?.length || 0 })
            </option>
          ))}
        </select>

        {/* <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-600'}`}
          >
            <Grid3x3 size={20} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
          >
            <List size={20} />
          </button>
        </div> */}
      </div>
    </div>
  );
};