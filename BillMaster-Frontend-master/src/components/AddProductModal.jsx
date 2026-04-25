import React, { useState, useEffect, useRef } from "react";
import "./AddProductModal.css";
import { toast } from "react-toastify";

function AddProductModal({ onClose, onAdd, initialData }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    price: "",
    tax: 18,
    stock: 0,
    lowStock: 10,
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        sku: initialData.sku || "",
        barcode: initialData.barcode || "",
        category: initialData.category || "",
        price: initialData.price || "",
        tax: initialData.tax ?? 18,
        stock: initialData.stock ?? 0,
        lowStock: initialData.lowStock ?? 10,
        imageUrl: initialData.imageUrl || "",
      });
      if (initialData.imageUrl) setImagePreview(initialData.imageUrl);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const imageFile = fileInputRef.current?.files[0];

  // 🔥 IMAGE VALIDATION (Add mode only)
  if (!imageFile && !imagePreview) {
    toast.error("Please upload a product image.");
    return;
  }

  // 🔥 Basic field validation
  if (!form.name.trim()) {
    toast.error("Product name is required.");
    return;
  }

  if (!form.sku.trim()) {
    toast.error("SKU is required.");
    return;
  }

  if (!form.category) {
    toast.error("Please select a category.");
    return;
  }

  if (!form.price || form.price <= 0) {
    toast.error("Price must be greater than 0.");
    return;
  }

  if (form.stock < 0) {
    toast.error("Stock cannot be negative.");
    return;
  }

  const data = {
    sku: form.sku,
    name: form.name,
    category: form.category,
    price: Number(form.price),
    stock: Number(form.stock),
  };

  if (imageFile) {
    data.image = imageFile;
  }

  await onAdd(data);
};
  const isEditing = !!initialData;

  return (
    <div className="ap-overlay">
      <div className="ap-modal">

        <div className="ap-header">
          <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
          <button className="ap-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Image Upload */}
          <div className="ap-group ap-full">
            <label>Product Image</label>
            <div
              className={`ap-image-upload ${imagePreview ? "ap-image-has-preview" : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Product preview" className="ap-image-preview" />
                  <button
                    type="button"
                    className="ap-image-remove"
                    onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                  >
                    ×
                  </button>
                </>
              ) : (
                <div className="ap-image-placeholder">
                  <i className="fas fa-cloud-upload-alt ap-upload-icon"></i>
                  <span>Click to upload image</span>
                  <span className="ap-upload-hint">PNG, JPG, WEBP up to 5MB</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          <div className="ap-row">
            <div className="ap-group">
              <label>Product Name</label>
              <input
                name="name"
                placeholder="Enter product name"
                className="ap-highlight"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ap-group">
              <label>SKU</label>
              <input
                name="sku"
                placeholder="e.g., BEV001"
                value={form.sku}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ap-row">
            <div className="ap-group">
              <label>Barcode</label>
              <input
                name="barcode"
                placeholder="Scan or enter barcode"
                value={form.barcode}
                onChange={handleChange}
              />
            </div>

            <div className="ap-group">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option>Beverages</option>
                <option>Snacks</option>
                <option>Dairy</option>
                <option>Grocery</option>
              </select>
            </div>
          </div>

          <div className="ap-row">
            <div className="ap-group">
              <label>Price (₹)</label>
              <input
                name="price"
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="ap-group">
              <label>Tax Rate (%)</label>
              <input
                name="tax"
                type="number"
                value={form.tax}
                onChange={handleChange}
              />
            </div>

            <div className="ap-group">
              <label>Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ap-group ap-full">
            <label>Low Stock Threshold</label>
            <input
              name="lowStock"
              type="number"
              value={form.lowStock}
              onChange={handleChange}
            />
          </div>

          <div className="ap-footer">
            <button type="button" className="ap-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ap-submit">
              {isEditing ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AddProductModal;
