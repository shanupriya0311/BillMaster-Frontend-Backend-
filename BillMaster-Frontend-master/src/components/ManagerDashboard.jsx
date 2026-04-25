import { useEffect, useRef, useState } from "react";
import {
    Store, LayoutGrid, ShoppingCart, Package, Receipt,
    BarChart3, Users, Settings, LogOut, Clock, Bell,
    TrendingDown, TrendingUp, CheckCircle, PackageCheck
} from "lucide-react";
import Chart from "chart.js/auto";
import "./Dashboard.css";
import axios from "axios";
import { Navigate } from "react-router-dom";
export default function ManagerDashboard({onNavigate}) {
    const salesTrendRef = useRef(null);
    const categoryRef = useRef(null);
    const chartInstances = useRef({});
    const [salesData, setSalesData] = useState([]);
    const [stats, setStats] = useState({
        todaySales: 0,
        transactions: 0,
        tax: 0,
        lowStock: 0
    });
    const[lowstock,setlowstock]=useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const getCategory = (name) => {
  name = name.toLowerCase();

  if (name.includes("milk") || name.includes("chocolate") || name.includes("chocos") || name.includes("curd"))
    return "Dairy";

  if (name.includes("rice") || name.includes("bread"))
    return "Grocery";

  if (name.includes("kurkurey"))
    return "Snacks";

  if (name.includes("book"))
    return "Stationery";

  return "General";
};

const convertTransactions = (transactions) => {
  let counter = 1;

  return transactions.flatMap((t) => {
    const products = t.productName
      .split(",")
      .map(p => p.trim())
      .filter(p => p !== "");

    const amountPerItem = Number(t.amount) / products.length;

    return products.map(product => {
      const tax = amountPerItem * 0.12;
      const subtotal = amountPerItem - tax;

      return {
        id: `BM${counter++}`,
        date: new Date(t.paymentDate).toLocaleString(),
        cashier: t.cashierName,
        payment: t.paymentMethod === "ONLINE" ? "Card" : t.paymentMethod,
        Catagory: getCategory(product),
        ProductName: product,
        item: product,
        qty: 1,
        subtotal: `₹${subtotal.toFixed(2)}`,
        tax: `₹${tax.toFixed(2)}`,
        total: `₹${amountPerItem.toFixed(2)}`,
        amount: `₹${amountPerItem.toFixed(2)}`,
        meta: `${t.paymentMethod} • 1 Item`,
      };
    });
  });
};
    useEffect(() => {
  const fetchdata = async () => {
    try {
      const response = await axios.get("http://localhost:8087/api/payment/history");
      const changedata = convertTransactions(response.data);

      setSalesData(changedata);
         const responses=await axios.get("http://localhost:8086/api/products/lowstock");
    setlowstock(responses.data);
    setStats(prev => ({
  ...prev,
  lowStock: responses.data.length
}));
      // SORT
      const sortedData = [...changedata].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // TODAY STATS
      const latestDateStr = sortedData[0]?.date.split(",")[0];

      const todayData = sortedData.filter(item =>
        item.date.startsWith(latestDateStr)
      );

      const totalSalesToday = todayData.reduce(
        (acc, curr) => acc + parseFloat(curr.amount.replace("₹", "")),
        0
      );

      const totalTaxToday = todayData.reduce(
        (acc, curr) => acc + parseFloat(curr.tax.replace("₹", "")),
        0
      );

      setStats({
        todaySales: totalSalesToday.toLocaleString("en-IN"),
        transactions: response.data.length,
        tax: totalTaxToday.toLocaleString("en-IN"),
        lowStock: 0
      });

      // RECENT TRANSACTIONS
      setRecentTransactions(sortedData.slice(0, 4));

      // WEEKLY SALES
      
      const weeklyMap = {};
      const daysOrder = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

      changedata.forEach(item => {
        const d = new Date(item.date);
        const day = daysOrder[d.getDay()];
        const amt = parseFloat(item.amount.replace("₹",""));
        weeklyMap[day] = (weeklyMap[day] || 0) + amt;
      });

      const chartLabels = daysOrder;
      const chartDataPoints = chartLabels.map(d => weeklyMap[d] || 0);

      // CATEGORY SALES
      const catMap = {};
      changedata.forEach(item => {
        catMap[item.Catagory] = (catMap[item.Catagory] || 0) + 1;
      });

      const catLabels = Object.keys(catMap);
      const catDataPoints = Object.values(catMap);

      // DESTROY OLD CHARTS
      if (chartInstances.current.trend) chartInstances.current.trend.destroy();
      if (chartInstances.current.category) chartInstances.current.category.destroy();

      // TREND CHART
      chartInstances.current.trend = new Chart(salesTrendRef.current, {
        type: "line",
        data: {
          labels: chartLabels,
          datasets: [{
            data: chartDataPoints,
            borderColor: "#0D9488",
            backgroundColor: "rgba(13,148,136,0.1)",
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins:{legend:{display:false}},
          scales:{y:{beginAtZero:false}}
        }
      });

      // CATEGORY CHART
      chartInstances.current.category = new Chart(categoryRef.current, {
        type: "doughnut",
        data: {
          labels: catLabels,
          datasets: [{
            data: catDataPoints,
            backgroundColor:["#0D9488","#2DD4BF","#5EEAD4","#99F6E4"]
          }]
        },
        options:{
          responsive:true,
          cutout:"70%"
        }
      });

    } catch (err) {
      console.log(err);
    }
  };
  fetchdata();
  return () => {
    if (chartInstances.current.trend) chartInstances.current.trend.destroy();
    if (chartInstances.current.category) chartInstances.current.category.destroy();
  };
}, []);

    return (
        <div className="dashboard">

            {/* Sidebar REMOVED */}

            {/* Main */}
            <main className="content">
                <header className="header">
                    <h2 style={{ fontSize: '18px', margin: 0 }}>Dashboard</h2>
                </header>

                {/* Cards */}
                <section className="stats">
                    <Stat title="Today's Sales" value={`₹${stats.todaySales}`} icon={<TrendingDown />} />
                    <Stat title="Transactions" value={stats.transactions} icon={<Receipt />} />
                    <Stat title="Tax Collected" value={`₹${stats.tax}`} icon={<TrendingUp />} />
                    <Stat title="Low Stock Items" value={stats.lowStock} icon={<CheckCircle />} />
                </section>


                {/* Charts */}
               {/* Charts Section */}
<section className="charts">
    <div className="card large">
        <h3>Weekly Sales Trend</h3>
        <div className="chart-container">
            <canvas ref={salesTrendRef}></canvas>
        </div>
    </div>

    <div className="card small-chart">
        <h3>Sales by Category</h3>
        <div className="chart-container">
            <canvas ref={categoryRef}></canvas>
        </div>
    </div>
</section>

                {/* Bottom Section */}
                <section className="bottom-section">
                    <div className="card">
                        <div className="section-header">
                            <h3>Recent Transactions</h3>
                            <a onClick={()=>onNavigate("Sales History")} style={{ fontSize: '12px', color: '#0d9488', textDecoration: 'none' ,cursor: 'pointer'}}>View all →</a>
                        </div>
                        <div className="transactions-list">
                            {recentTransactions.map((tx) => (
                                <Transaction key={tx.id} id={tx.id} amount={tx.amount} />
                            ))}
                        </div>
                    </div>

                   {/* <div className="card">
                        <div className="section-header">
                            <h3>Low Stock Alerts</h3>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>0 items</span>
                        </div>
                        <div className="empty-state">
                            <PackageCheck size={32} color="#0d9488" />
                            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#94a3b8' }}>All items are in stock</p>
                        </div>
                    </div>*/}
                    <div className="card">
       <div className="section-header">
      <h3>Low Stock Alerts</h3>
  </div>

  {lowstock.length === 0 ? (
    <p style={{ fontSize: "13px", color: "#94a3b8" }}>
      All items are in stock
    </p>
  ) : (
    <table style={{ width: "100%", fontSize: "13px" }}>
      <thead>
        <tr>
          <th align="left">Product</th>
          <th align="left">SKU</th>
          <th align="left">Stock</th>
        </tr>
      </thead>
      <tbody>
        {lowstock.map((p, index) => (
          <tr key={index}>
            <td>{p.name}</td>
            <td>{p.sku}</td>
            <td style={{ color: "red", fontWeight: "600" }}>
              {p.stock}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
                </section>
            </main>
        </div>
    );
}

function Stat({ title, value, icon }) {
    return (
        <div className="card stat">
            <div>
                <p>{title}</p>
                <h3>{value}</h3>
            </div>
            <div className="icon">{icon}</div>
        </div>
    );
}

function Transaction({ id, amount }) {
    return (
        <div className="transaction-item">
            <span style={{ fontSize: '13px', color: '#64748b' }}>{id}</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{amount}</span>
        </div>
    );
}
