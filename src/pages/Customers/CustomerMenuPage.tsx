import React, { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';

import ErrorMessage from '@/components/Error';
import LoadingSpinner from '@/components/Loading';
import { Modal } from '@/components/ui/modal';
import { formatPrice } from '@/lib/utils';
import type { MenuItem } from '@/types/menu';
import { Button } from '@/components/ui/button';


export default function DigitalMenu() {
  const [menu, setMenu] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [name, setName] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [special, setSpecial] = useState<string>()
  const [processingPayment, setProcessingPayment] = useState(false)


  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sessions/get-menu`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch menu');
      
      const result = await response.json();
      
      if (result.success) {
        setMenu(result.data.menu);
        setOrganization(result.data.organization);
      } else {
        setError(result.message || 'Failed to load menu');
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };



  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedVariations({});
    setIsModalOpen(true);
  };

  const calculateItemTotal = () => {
    if (!selectedItem) return 0;
    let total = selectedItem.price;
    Object.values(selectedVariations).forEach((variation: MenuItemVariation) => {
      total += variation.price_modifier;
    });
    return total;
  };

  const addToCart = () => {
    if (!selectedItem) return;
    
    const cartItem = {
      ...selectedItem,
      selectedVariations: { ...selectedVariations },
      totalPrice: calculateItemTotal(),
      cartId: Date.now()
    };
    
    setCart([...cart, cartItem]);
    setIsModalOpen(false);
    setSelectedItem(null);
    setSelectedVariations({});
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const toggleVariation = (variation) => {
    setSelectedVariations(prev => {
      const key = variation.id;
      if (prev[key]) {
        const { [key]: removed, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [key]: variation };
      }
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  console.log({cart})

  const handleCheckout = async () => {
    const payload = {
      items: cart,
      customer_name: name, 
      customer_email: email,
      special_instructions: special,
    }

    console.log(payload)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {organization?.logo_url && (
                <img 
                  src={organization?.logo_url} 
                  alt={organization.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{organization?.name}</h1>
                <p className="text-sm text-gray-500 tracking-tight">{organization?.description}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {menu.map((category) => (
          <div key={category.id} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
            <p className="text-sm text-gray-500 mb-4 tracking-tight">{category.description}</p>
            
            <div className="space-y-3">
              {category.items?.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => openItemModal(item)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={item.image_url || 'https://via.placeholder.com/100x100?text=No+Image'}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <span className="text-blue-600 font-semibold shrink-0">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 tracking-tight line-clamp-2 mb-2">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {!item.is_available && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            Unavailable
                          </span>
                        )}
                        {item.is_vegetarian && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            Vegetarian
                          </span>
                        )}
                        {item.is_vegan && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            Vegan
                          </span>
                        )}
                        {item.is_spicy && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                            Spicy
                          </span>
                        )}
                        {item.preparation_time && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {item.preparation_time} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Item Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem?.name}
        description={selectedItem?.description}
        size="lg"
      >
        {selectedItem && (
          <div>
            <img
              src={selectedItem.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={selectedItem.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />

            {selectedItem.ingredients?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Ingredients</h4>
                <p className="text-sm text-gray-600 tracking-tight">
                  {selectedItem.ingredients.join(', ')}
                </p>
              </div>
            )}

            {selectedItem.variations?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Customize Your Order</h4>
                <div className="space-y-2">
                  {selectedItem.variations.map((variation) => (
                    <label
                      key={variation.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!selectedVariations[variation.id]}
                          onChange={() => toggleVariation(variation)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {variation.name}
                          </span>
                          <span className="text-xs text-gray-400 ml-2 tracking-tight">
                            ({variation.type})
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        +{formatPrice(variation.price_modifier)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t sticky bottom-0 bg-white">
              <div>
                <p className="text-sm text-gray-500 tracking-tight">Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(calculateItemTotal())}
                </p>
              </div>
              <button
                onClick={addToCart}
                disabled={!selectedItem.is_available}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {selectedItem.is_available ? 'Add to Cart' : 'Unavailable'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cart Modal */}

      <Modal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        title="Your Order"
        description={`${cart.length} item${cart.length !== 1 ? 's' : ''} in cart`}
        size="lg"
      >
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.cartId} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/60x60?text=No+Image'}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">{item.name} ({formatPrice(item.price)})</h4>
                    {Object.keys(item.selectedVariations).length > 0 && (
                      <p className="text-xs text-gray-500 tracking-tight mt-1">
                        {Object.values(item.selectedVariations)
                          .map(v => `${v.name} (+${formatPrice(v.price_modifier)})`)
                          .join(', ')}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-blue-600 mt-1">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t py-4 mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  value={special}
                  onChange={(e) => setSpecial(e.target.value)}
                  placeholder="Any special requests or dietary requirements..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="border-t pt-4 sticky bottom-0 bg-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
              <Button 
                disabled={!name?.trim() || !email?.trim() || processingPayment} 
                onClick={handleCheckout} 
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingPayment ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}