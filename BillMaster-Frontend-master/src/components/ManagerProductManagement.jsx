import React, { useState } from "react";
import "./ProductManagement.css";
import AddProductModal from "./AddProductModal";
import axios from "axios";
import { useEffect } from "react";
/* 🔹 INITIAL PRODUCT DATA */

const categories = ["All", "Beverages", "Snacks", "Dairy", "Grocery"];
function ManagerProductManagement() {
  const [products, setProducts] = useState([]);
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8086/api/products"
      );

      console.log("API RESPONSE:", response.data);  

      setProducts(response.data);

      console.log("STATE AFTER SET:", response.data); 
    } catch (error) {
      console.log("Error fetching products", error);
    }
  };

  fetchProducts();
}, []);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  // 🔹 IMPORT CSV HANDLER
/*  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      alert(`Imported file: ${file.name}`);
      // later: parse CSV & add products
    };
    reader.readAsText(file);
  };*/
const handleImportCSV = async (e) => {
  const file = e.target.files[0];

  const formData = new FormData();
  formData.append("file", file);  

  try {
    const res = await axios.post(
      "http://localhost:8086/api/products/import/csv",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(res.data);
    alert(res.data);

  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
};

  // 🔹 EXPORT HANDLER
  const handleExport = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "products.json";
    link.click();

    URL.revokeObjectURL(url);
  };

const handleAddProduct = async (form) => {
  try {
    const productData = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      price: form.price,
      tax: form.tax,
      stock: Number(form.stock),
    };

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
              ...p,
              name: form.name,
              sku: form.sku,
              category: form.category,
              price: `₹${form.price}`,
              tax: `${form.tax}%`,
              stock: Number(form.stock),
            }
            : p
        )
      );
      setEditingProduct(null);
    } else {
      // ADD PRODUCT
      await axios.post(
        "http://localhost:8086/api/products",
        productData
      );
    }

    // Refresh product list after save
    fetchProducts();

  } catch (error) {
    console.error("Error saving product:", error);
  }
};

  /* 🔹 DELETE */
  const handleDelete = async(id) => {
    await axios.delete(`http://localhost:8086/api/products/${id}`);
    if (!window.confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  /* 🔹 EDIT */
  const handleEdit = (product) => {
    axios.put(`http://localhost:8086/api/products/${product.id}`, product)
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  // 🔹 Filter logic (FINAL)
  const filteredProducts = products.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const sku = (p.sku || "").toLowerCase();
    const category = p.category || "";
    const text = search.toLowerCase();

    return (
      (sku.startsWith(text) || name.includes(text)) &&
      (activeCategory === "All" || category === activeCategory)
    );
  });


  return (
    <>
      {showAddProduct && (
        <AddProductModal
          onClose={() => {
            setShowAddProduct(false);
            setEditingProduct(null);
          }}
          onAdd={handleAddProduct}
          initialData={editingProduct}
        />
      )}

      <div className="container">
        {/* Sidebar */}
        {/* Sidebar REMOVED */}

        {/* Main */}
        <main className="main-content">
          <h1>Product Management</h1>
          <div className="section-header">
            <div>
              <h2>Products</h2>
              <p className="subtitle">
                {filteredProducts.length} products in inventory
              </p>
            </div>

            <div className="action-buttons">
              {/* Import */}
              <label className="btn btn-outline">
                Import
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  style={{ display: "none" }}
                />
              </label>

              {/* Export */}
              <button className="btn btn-outline" onClick={handleExport}>
                Export
              </button>

              {/* Add Product */}
              <button
                className="btn btn-primary"
                onClick={() => setShowAddProduct(true)}
              >
                + Add Product
              </button>
            </div>
          </div>

          {/* Search */}
          <input
            className="search-input"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            
          />
 
          {/* Categories */}
          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table */}
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Tax</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.category}</td>
                  <td>{p.price}</td>
                  <td>{p.tax}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      onClick={() => handleEdit(p)}
                    >
                      ✏️
                    </span>
                    <span
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleDelete(p.id)}
                    >
                      🗑️
                    </span>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
}

export default ManagerProductManagement;  