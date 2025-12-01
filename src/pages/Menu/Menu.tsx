import { useState, useEffect } from 'react';
import { Loader2, ChefHat, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { MenuHeader } from '@/components/menu/MenuHeader';
import { CategorySection } from '@/components/menu/CategorySection';
import type { MenuCategory, MenuItem } from '@/types/menu';
import { CreateMenuItemForm } from '@/components/forms/MenuItemForm';
import { Modal } from '@/components/ui/modal';
import { CreateMenuCategoryForm } from '@/components/forms/MenuCategoryForm';

const MenuPage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddCategory = () => {
    setIsCategoryModalOpen(true);
  };

  const handleAddItem = () => {
    setIsMenuItemModalOpen(true);
  };

  const handleCategorySuccess = () => {
    setIsCategoryModalOpen(false);
    fetchMenu(); // Refresh the menu data
  };

  const handleMenuItemSuccess = () => {
    setIsMenuItemModalOpen(false);
    fetchMenu(); // Refresh the menu data
  };


  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const orgId = user?.org_id;
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/menu/${orgId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch menu: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data.data || []);
      
      if (data.data && data.data.length > 0) {
        setSelectedCategory(data.data[0].id);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleEditItem = (item: MenuItem) => {
    console.log('Edit item:', item);
  };

  const handleToggleAvailability = (item: MenuItem) => {
    console.log('Toggle availability:', item);
  };

  const filteredCategories = categories.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) {
      return false;
    }
    
    if (searchQuery) {
      const hasMatchingItems = category.items.some(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return hasMatchingItems;
    }
    
    return true;
  });

  const getFilteredItems = (items: MenuItem[]) => {
    if (!searchQuery) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const totalItems = categories?.reduce((sum, cat) => sum + cat?.items?.length, 0);

  // Loading, Error, and Empty states remain the same...
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchMenu} />;
  if (categories?.length === 0) return <EmptyState />;

  return (
    <div className="max-w-7xl mx-auto text-sm tracking-tighter">
      <MenuHeader
        totalItems={totalItems}
        categories={categories}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        viewMode={viewMode}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onViewModeChange={setViewMode}
        onAddCategory={handleAddCategory}
        onAddItem={handleAddItem}
      />

      {/* Menu Content */}
      <div className="space-y-12">
        {filteredCategories.map(category => {
          const filteredItems = getFilteredItems(category?.items);
          if (filteredItems?.length === 0) return null;

          return (
            <CategorySection
              key={category.id}
              category={{ ...category, items: filteredItems }}
              viewMode={viewMode}
              formatPrice={formatPrice}
              onEditItem={handleEditItem}
              onToggleAvailability={handleToggleAvailability}
            />
          );
        })}
      </div>

      {filteredCategories?.length === 0 && <NoResultsState />}

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Create Category"
        description="Add a new category to organize your menu items"
        size="md"
      >
        <CreateMenuCategoryForm
          onSuccess={handleCategorySuccess}
          onCancel={() => setIsCategoryModalOpen(false)}
        />
      </Modal>


      <Modal
        isOpen={isMenuItemModalOpen}
        onClose={() => setIsMenuItemModalOpen(false)}
        title="Create Menu Item"
        description="Add a new dish or drink to your menu"
        size="lg"
      >
        <CreateMenuItemForm
          onSuccess={handleMenuItemSuccess}
          onCancel={() => setIsMenuItemModalOpen(false)}
          categories={categories}
        />
      </Modal>
    </div>
  );
};

// You can also extract these state components
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 className="text-red-600 font-semibold mb-2">Error Loading Menu</h3>
      <p className="text-red-700 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
      >
        Try Again
      </button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 text-sm tracking-tighter">
    <div className="text-center py-20">
      <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Menu Items Yet</h3>
      <p className="text-gray-600 mb-8">Start building your menu by adding categories and items</p>
      <div className="flex gap-3 justify-center">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all">
          <Plus size={20} />
          Add Category
        </button>
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all">
          <Plus size={20} />
          Add Menu Item
        </button>
      </div>
    </div>
  </div>
);

const NoResultsState = () => (
  <div className="text-center py-20">
    <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
    <p className="text-gray-600">Try adjusting your search or filters</p>
  </div>
);

export default MenuPage;