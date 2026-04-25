import React from "react";

const products = [
  {
    name: "Coca-Cola 500ml",
    sku: "BEV001",
    category: "Beverages",
    price: 40,
    tax: "12%",
    stock: 150,
    icon: "🥤",
  },
  {
    name: "Pepsi 500ml",
    sku: "BEV002",
    category: "Beverages",
    price: 40,
    tax: "12%",
    stock: 120,
    icon: "🥤",
  },
  {
    name: "Lays Classic 50g",
    sku: "SNK001",
    category: "Snacks",
    price: 20,
    tax: "12%",
    stock: 200,
    icon: "🍟",
  },
  {
    name: "Pringles Original",
    sku: "SNK002",
    category: "Snacks",
    price: 99,
    tax: "12%",
    stock: 80,
    icon: "🥔",
  },
  {
    name: "Amul Milk 500ml",
    sku: "DAI001",
    category: "Dairy",
    price: 28,
    tax: "5%",
    stock: 50,
    icon: "🥛",
  },
];

function Products() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">BillMaster</h1>
        <ul className="space-y-3">
          <li className="text-gray-400">Dashboard</li>
          <li className="font-semibold bg-gray-800 p-2 rounded">
            Products
          </li>
          <li className="text-gray-400">Sales History</li>
          <li className="text-gray-400">Reports</li>
          <li className="text-gray-400">Customers</li>
          <li className="text-gray-400">Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-gray-500">
              {products.length} products in inventory
            </p>
          </div>

          <div className="flex gap-3">
            <button className="border px-4 py-2 rounded">
              Import CSV
            </button>
            <button className="border px-4 py-2 rounded">
              Export
            </button>
            <button className="bg-teal-500 text-white px-4 py-2 rounded">
              + Add Product
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          className="w-full mb-4 p-3 border rounded"
        />

        {/* Table */}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Tax</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 flex items-center gap-3">
                    <span className="text-xl">{p.icon}</span>
                    {p.name}
                  </td>
                  <td>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {p.sku}
                    </span>
                  </td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>{p.tax}</td>
                  <td className="font-semibold">{p.stock}</td>
                  <td className="flex gap-3">
                    <button>🖨</button>
                    <button>✏️</button>
                    <button className="text-red-500">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Products;
