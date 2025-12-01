import {  useState } from "react";
import { Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { commaSeparatedToArray } from "@/lib/utils";
import type { MenuCategory } from "@/types/menu";

interface MenuItemVariation {
  name: string;
  type: string;
  price_modifier: number;
  is_required: boolean;
}

interface CreateMenuItemFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  categories: () => MenuCategory[]
}

export const CreateMenuItemForm: React.FC<CreateMenuItemFormProps> = ({
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


  const [variations, setVariations] = useState<MenuItemVariation[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
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

  const updateVariation = (index: number, field: string, value: any) => {
    const newVars = [...variations];
    newVars[index] = { ...newVars[index], [field]: value };
    setVariations(newVars);
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
      }

      formData.append("variations", JSON.stringify(variations));

      console.log({formData, ingredients})

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/items`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        onSuccess();
      } else {
        setError(data.message || "Failed to create menu item");
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
        />
      </div>


      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Price *</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Image 
        </label>

        <div
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition"
            onClick={() => document.getElementById("imageUpload")?.click()}
        >
            {imagePreview ? (
            <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
            />
            ) : (
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
            </div>
            )}
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
        />
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
        />
      </div>


      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isVegetarian} onChange={(e) => setIsVegetarian(e.target.checked)} />
          Vegetarian
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isVegan} onChange={(e) => setIsVegan(e.target.checked)} />
          Vegan
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isSpicy} onChange={(e) => setIsSpicy(e.target.checked)} />
          Spicy
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
          Available
        </label>
      </div>


      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Preparation Time (minutes)
        </label>
        <input
          type="number"
          value={preparationTime}
          onChange={(e) => setPreparationTime(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

 
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Display Order
        </label>
        <input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>


      <div className="pt-2">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700">Variations</p>
          <button
            type="button"
            onClick={addVariation}
            className="text-blue-600 text-xs"
          >
            + Add Variation
          </button>
        </div>

        {variations.map((v, index) => (
          <div
            key={index}
            className="border p-3 rounded-lg mb-3 relative bg-gray-50"
          >
 
            <button
              type="button"
              onClick={() => removeVariation(index)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X size={14} />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Variation Name"
                value={v.name}
                onChange={(e) =>
                  updateVariation(index, "name", e.target.value)
                }
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Type (e.g., size, flavor)"
                value={v.type}
                onChange={(e) =>
                  updateVariation(index, "type", e.target.value)
                }
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Price Modifier"
                value={v.price_modifier}
                onChange={(e) =>
                  updateVariation(index, "price_modifier", parseFloat(e.target.value))
                }
                className="px-3 py-2 border rounded-lg"
              />

              <label className="flex items-center gap-2 text-sm">
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
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating...
            </>
          ) : (
            "Create Item"
          )}
        </button>
      </div>
    </form>
  );
};
