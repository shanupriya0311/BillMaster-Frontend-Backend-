import React, { useState } from "react";
import "./ProductManagement.css";
import AddProductModal from "./AddProductModal";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify"

const categories = ["All", "Beverages", "Snacks", "Dairy", "Grocery"];
function ProductManagement() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8086/api/products"
        );
        setProducts(response.data);

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
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, productId: null, productName: "" });

  const handleImportCSV = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("No file selected. Please choose a CSV file.");
      return;
    }

    if (!file.name.endsWith(".csv")) {
      toast.error("Invalid file type. Please upload a .csv file.");
      e.target.value = "";
      return;
    }

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
      toast.success("Products imported successfully!");
      console.log(res.data);
    } catch (err) {
      toast.error("File upload failed. Please check the file and try again.");
      console.error("CSV import error:", err);
    }

    e.target.value = "";
  };


  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8090/api/reports/manager-summary/pdf",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", "manager-summary.pdf");

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.log(error);
    }
  };


  /*const handleAddProduct = async (formData) => {
  try {
    await axios.post(
      "http://localhost:8086/api/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Product added");
    setShowAddProduct(false);

  } catch (error) {
    console.error("Error saving product:", error);
    toast.error("Failed to add product");
  }
};*/
const handleAddProduct = async (data) => {
  try {
    if (editingProduct) {
      // 🔥 UPDATE (JSON)
      await axios.put(
        `http://localhost:8086/api/products/${editingProduct.id}`,
        data
      );

      toast.success("Product updated successfully");
    } else {
      // 🔥 CREATE (MULTIPART)
      const formData = new FormData();
      formData.append("sku", data.sku);
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("stock", data.stock);

      if (data.image) {
        formData.append("image", data.image);
      }

      await axios.post(
        "http://localhost:8086/api/products",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Product added successfully");
    }

    // refresh list
    const response = await axios.get("http://localhost:8086/api/products");
    setProducts(response.data);

    setShowAddProduct(false);
    setEditingProduct(null);

  } catch (error) {
    console.error(error);
    toast.error("Operation failed");
  }
};

  const confirmDelete = (product) => {
    setDeleteConfirm({ show: true, productId: product.id, productName: product.name });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8086/api/products/${deleteConfirm.productId}`);
      setProducts((prev) => prev.filter((p) => p.id !== deleteConfirm.productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
    setDeleteConfirm({ show: false, productId: null, productName: "" });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, productId: null, productName: "" });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddProduct(true);
    
  };
 
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

      {deleteConfirm.show && (
        <div className="del-overlay">
          <div className="del-modal">
            <div className="del-icon">🗑️</div>
            <h3 className="del-title">Delete Product?</h3>
            <p className="del-message">
              Are you sure you want to delete <strong>{deleteConfirm.productName}</strong>?<br />
              This action cannot be undone.
            </p>
            <div className="del-actions">
              <button className="del-btn del-cancel" onClick={cancelDelete}>
                No, Keep It
              </button>
              <button className="del-btn del-confirm" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">

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
              <label className="btn btn-outline">
                Import
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  style={{ display: "none" }}
                />
              </label>

              <button className="btn btn-outline" onClick={handleExport}>
                Export
              </button>

              <button
                className="btn btn-primary"
                onClick={() => setShowAddProduct(true)}
              >
                + Add Product
              </button>
            </div>
          </div>

          <input
            className="search-input"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

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

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
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
                      onClick={() => confirmDelete(p)}
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

export default ProductManagement;