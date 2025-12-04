import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { commaSeparatedToArray } from "@/lib/utils";
import type { MenuCategory } from "@/types/menu";

interface MenuItemVariation {
  id?: string;
  name: string;
  type: string;
  price_modifier: number;
  is_required: boolean;
}

interface MenuItem {
  id?: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  ingredients: string[];
  allergens: string[];
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_spicy: boolean;
  is_available: boolean;
  preparation_time?: number | null;
  display_order: number;
  variations?: MenuItemVariation[];
  image_url?: string;
}

interface MenuItemFormProps {
  mode?: "create" | "edit";
  menuItem?: MenuItem | null;
  onSuccess: () => void;
  onCancel: () => void;
  categories: MenuCategory[];
}

export const CreateMenuItemForm: React.FC<MenuItemFormProps> = ({
  mode = "create",
  menuItem = null,
  onSuccess,
  onCancel,
  categories,
}) => {
  const { user } = useAuth();

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [ingredients, setIngredients] = useState<string>("");
  const [allergens, setAllergens] = useState<string>("");
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [preparationTime, setPreparationTime] = useState<number | "">("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [variations, setVariations] = useState<MenuItemVariation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && menuItem) {
      setCategoryId(menuItem.category_id || "");
      setName(menuItem.name || "");
      setDescription(menuItem.description || "");
      setPrice(menuItem.price || 0);
      setIngredients(menuItem.ingredients?.join(", ") || "");
      setAllergens(menuItem.allergens?.join(", ") || "");
      setIsVegetarian(menuItem.is_vegetarian || false);
      setIsVegan(menuItem.is_vegan || false);
      setIsSpicy(menuItem.is_spicy || false);
      setIsAvailable(menuItem.is_available ?? true);
      setPreparationTime(menuItem.preparation_time || "");
      setDisplayOrder(menuItem.display_order || 0);
      setVariations(menuItem.variations || []);
      setExistingImageUrl(menuItem.image_url || null);
      setImagePreview(menuItem.image_url || null);
    } else {
      setCategoryId("");
      setName("");
      setDescription("");
      setPrice(0);
      setIngredients("");
      setAllergens("");
      setIsVegetarian(false);
      setIsVegan(false);
      setIsSpicy(false);
      setIsAvailable(true);
      setPreparationTime("");
      setDisplayOrder(0);
      setVariations([]);
      setImageFile(null);
      setImagePreview(null);
      setExistingImageUrl(null);
    }
  }, [mode, menuItem]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setExistingImageUrl(null); 
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const addVariation = () => {
    setVariations([
      ...variations,
      { name: "", type: "", price_modifier: 0, is_required: false },
    ]);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariation = (index: number, field: keyof MenuItemVariation, value: any) => {
    const newVars = [...variations];
    newVars[index] = { ...newVars[index], [field]: value };
    setVariations(newVars);
  };

  const isFormDirty = () => {
    if (mode === "create") {
      return !name.trim() || !categoryId;
    }

    if (!menuItem) return true;

    const currentIngredients = ingredients.split(",").map(i => i.trim()).filter(i => i);
    const originalIngredients = menuItem.ingredients || [];
    
    const currentAllergens = allergens.split(",").map(a => a.trim()).filter(a => a);
    const originalAllergens = menuItem.allergens || [];

    return (
      name.trim() !== menuItem.name ||
      categoryId !== menuItem.category_id ||
      description.trim() !== (menuItem.description || "") ||
      price !== menuItem.price ||
      JSON.stringify(currentIngredients) !== JSON.stringify(originalIngredients) ||
      JSON.stringify(currentAllergens) !== JSON.stringify(originalAllergens) ||
      isVegetarian !== menuItem.is_vegetarian ||
      isVegan !== menuItem.is_vegan ||
      isSpicy !== menuItem.is_spicy ||
      isAvailable !== (menuItem.is_available ?? true) ||
      preparationTime !== (menuItem.preparation_time || "") ||
      displayOrder !== menuItem.display_order ||
      JSON.stringify(variations) !== JSON.stringify(menuItem.variations || []) ||
      imageFile !== null ||
      (existingImageUrl === null && menuItem.image_url)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Item name is required");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("category_id", categoryId);
      formData.append("name", name);
      formData.append("description", description || "");
      formData.append("price", String(price));
      formData.append("is_vegetarian", String(isVegetarian));
      formData.append("is_vegan", String(isVegan));
      formData.append("is_spicy", String(isSpicy));
      formData.append("is_available", String(isAvailable));
      formData.append("display_order", String(displayOrder));

      if (preparationTime !== "") {
        formData.append("preparation_time", String(preparationTime));
      }

      formData.append("ingredients", JSON.stringify(commaSeparatedToArray(ingredients)));
      formData.append("allergens", JSON.stringify(commaSeparatedToArray(allergens)));
      
      if (imageFile) {
        formData.append("image_url", imageFile);
      } else if (existingImageUrl === null && mode === "edit") {
        // If image is removed in edit mode
        formData.append("remove_image", "true");
      }

      formData.append("variations", JSON.stringify(variations));

      const url = mode === "edit" && menuItem?.id
        ? `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/items/${menuItem.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/items`;

      const method = mode === "edit" ? "PUT" : "POST";

      console.log(formData)

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
      } else {
        setError(data.message || `Failed to ${mode === "edit" ? "update" : "create"} menu item`);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm tracking-tighter">
     

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Category *
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Category</option>
          {categories?.map((c: MenuCategory) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Item Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="E.g., Grilled Chicken, Pasta Alfredo"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Description (Optional)
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
          placeholder="Describe the dish, cooking method, special ingredients..."
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Price *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Image
        </label>
        
        {(imagePreview || existingImageUrl) && (
          <div className="relative mb-2">
            <img
              src={imagePreview || existingImageUrl || ""}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div
          className={`w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition ${imagePreview || existingImageUrl ? 'hidden' : ''}`}
          onClick={() => document.getElementById("imageUpload")?.click()}
        >
          <div className="text-gray-400 flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-5 10l-4-4-4 4m8-10l-4-4-4 4"
              />
            </svg>
            <p>Click to upload image</p>
            <p className="text-xs text-gray-400 mt-1">Recommended: 800x600px</p>
          </div>
        </div>

        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Ingredients (comma separated)
        </label>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="chicken, garlic, olive oil, herbs, lemon"
        />
        <p className="text-xs text-gray-500 mt-1">Example: chicken, garlic, olive oil, herbs, lemon</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Allergens (comma separated)
        </label>
        <input
          type="text"
          value={allergens}
          onChange={(e) => setAllergens(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="gluten, dairy, nuts, shellfish"
        />
        <p className="text-xs text-gray-500 mt-1">Leave empty if no allergens</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={isVegetarian} 
            onChange={(e) => setIsVegetarian(e.target.checked)} 
          />
          Vegetarian
        </label>

        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={isVegan} 
            onChange={(e) => setIsVegan(e.target.checked)} 
          />
          Vegan
        </label>

        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={isSpicy} 
            onChange={(e) => setIsSpicy(e.target.checked)} 
          />
          Spicy
        </label>

        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={isAvailable} 
            onChange={(e) => setIsAvailable(e.target.checked)} 
          />
          Available
        </label>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Preparation Time (minutes)
        </label>
        <input
          type="number"
          min="0"
          value={preparationTime}
          onChange={(e) => setPreparationTime(e.target.value ? parseInt(e.target.value) : "")}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Estimated preparation time"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Display Order
        </label>
        <input
          type="number"
          min="0"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
      </div>

      <div className="pt-2">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700">Variations</p>
          <button
            type="button"
            onClick={addVariation}
            className="text-blue-600 text-xs hover:text-blue-700"
          >
            + Add Variation
          </button>
        </div>

        {variations.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No variations added</p>
        ) : (
          variations.map((v, index) => (
            <div
              key={index}
              className="border p-3 rounded-lg mb-3 relative"
            >
              <button
                type="button"
                onClick={() => removeVariation(index)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                <X size={14} />
              </button>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Variation Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Large, Spicy, Extra Cheese"
                    value={v.name}
                    onChange={(e) =>
                      updateVariation(index, "name", e.target.value)
                    }
                    className="px-3 py-2 border rounded-lg w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Variation Type
                  </label>
                  <select
                    value={v.type}
                    onChange={(e) =>
                      updateVariation(index, "type", e.target.value)
                    }
                    className="px-3 py-2.5 border rounded-lg w-full"
                  >
                    <option value="">Select Type</option>
                    <option value="size">Size</option>
                    <option value="flavor">Flavor</option>
                    <option value="topping">Topping</option>
                    <option value="sauce">Sauce</option>
                    <option value="spice_level">Spice Level</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Price Modifier
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 2.50"
                    value={v.price_modifier}
                    onChange={(e) =>
                      updateVariation(index, "price_modifier", parseFloat(e.target.value) || 0)
                    }
                    className="px-3 py-2 border rounded-lg w-full"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={v.is_required}
                      onChange={(e) =>
                        updateVariation(index, "is_required", e.target.checked)
                      }
                    />
                    Required
                  </label>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading || (mode === "edit" && !isFormDirty())}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {mode === "edit" ? "Updating..." : "Creating..."}
            </>
          ) : (
            `${mode === "edit" ? "Update" : "Create"} Item`
          )}
        </button>
      </div>
    </form>
  );
};