import React, { useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Download, FileText, Mail, FileSpreadsheet } from "lucide-react";
import "./Reports.css";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import axios from "axios";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
const Reports = () => {
    const teal = "#14b8a6";
    const parseCurrency = (value) => {
        if (typeof value === "number") return value;
        return parseFloat(String(value).replace(/[₹,]/g, "")) || 0;
    };
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
                    invoiceNumber: t.invoiceNumber,
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
    const calculateMetrics = () => {
        const totalSales = salesData.reduce((sum, sale) => sum + parseCurrency(sale.amount), 0);

        const totalTransactions = new Set(
            salesData.map(s => s.invoiceNumber)
        ).size;
        const totalTax = salesData.reduce((sum, sale) => sum + parseCurrency(sale.tax), 0);
        const netRevenue = salesData.reduce((sum, sale) => sum + parseCurrency(sale.subtotal), 0);

        return {
            grossSales: totalSales.toFixed(2),
            transactions: totalTransactions,
            taxCollected: totalTax.toFixed(2),
            netRevenue: netRevenue.toFixed(2)
        };
    };

    const [salesData, setSalesData] = React.useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8087/api/payment/history");
                console.log("Fetched sales data:", response.data);
                const fetchdata = convertTransactions(response.data);
                setSalesData(fetchdata);
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        };

        fetchData();
    }, []);



    const calculatePaymentBreakdown = () => {
        const paymentTotals = { Cash: 0, Card: 0, UPI: 0 };

        salesData.forEach(sale => {
            const amount = parseCurrency(sale.amount);
            if (paymentTotals.hasOwnProperty(sale.payment)) {
                paymentTotals[sale.payment] += amount;
            }
        });

        const total = Object.values(paymentTotals).reduce((sum, val) => sum + val, 0);

        return Object.entries(paymentTotals).map(([method, amount]) => ({
            method,
            amount: amount.toFixed(2),
            percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : "0.0"
        }));
    };


    const calculateWeeklySales = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weeklySales = {};

        salesData.forEach(sale => {
            const date = new Date(sale.date);
            const dayName = days[date.getDay()];
            const amount = parseCurrency(sale.amount);

            if (!weeklySales[dayName]) {
                weeklySales[dayName] = 0;
            }
            weeklySales[dayName] += amount;
        });

        return weeklySales;
    };


    const calculateCategorySales = () => {
        const categorySales = {};

        salesData.forEach(sale => {
            const category = sale.Catagory;
            const amount = parseCurrency(sale.amount);

            if (!categorySales[category]) {
                categorySales[category] = 0;
            }
            categorySales[category] += amount;
        });

        return Object.entries(categorySales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    };


    const calculateTaxByDate = () => {
        const dateGroups = {};

        salesData.forEach(sale => {
            const dateStr = new Date(sale.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });

            if (!dateGroups[dateStr]) {
                dateGroups[dateStr] = {
                    taxableSales: 0,
                    tax: 0,
                    transactions: 0
                };
            }

            dateGroups[dateStr].taxableSales += parseCurrency(sale.subtotal);
            dateGroups[dateStr].tax += parseCurrency(sale.tax);
            dateGroups[dateStr].transactions =
                new Set(
                    salesData
                        .filter(s => new Date(s.date).toLocaleDateString() === dateStr)
                        .map(s => s.invoiceNumber)
                ).size;
        });

        return Object.entries(dateGroups).map(([date, data]) => ({
            date,
            ...data
        }));
    };

    const metrics = calculateMetrics();
    const paymentBreakdown = calculatePaymentBreakdown();
    const weeklySalesData = calculateWeeklySales();
    const categorySalesData = calculateCategorySales();
    const taxByDate = calculateTaxByDate();

    const handleExportExcel = () => {
        const wb = XLSX.utils.book_new();

        const summaryData = [
            ["BillMaster - Reports & Analytics"],
            ["End of Day Settlement"],
            [""],
            ["Metric", "Value"],
            ["Gross Sales", `₹${metrics.grossSales}`],
            ["Transactions", metrics.transactions],
            ["Tax Collected", `₹${metrics.taxCollected}`],
            ["Net Revenue", `₹${metrics.netRevenue}`],
            [""],
            ["Payment Breakdown"],
            ["Method", "Amount", "Percentage"],
            ...paymentBreakdown.map(p => [p.method, `₹${p.amount}`, `${p.percentage}%`])
        ];
        const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, ws1, "Summary");

        const salesHeaders = [["Transaction ID", "Date", "Cashier", "Payment", "Category", "Item", "Qty", "Subtotal", "Tax", "Total", "Amount"]];
        const salesRows = salesData.map(sale => [
            sale.id,
            sale.date,
            sale.cashier,
            sale.payment,
            sale.Catagory,
            sale.item,
            sale.qty,
            sale.subtotal,
            sale.tax,
            sale.total,
            sale.amount
        ]);
        const ws2 = XLSX.utils.aoa_to_sheet([...salesHeaders, ...salesRows]);
        XLSX.utils.book_append_sheet(wb, ws2, "Sales Data");

        const taxHeaders = [["Date", "Taxable Sales", "Tax"]];
        const taxRows = taxByDate.map(row => [
            row.date,
            `₹${row.taxableSales.toFixed(2)}`,
            `₹${row.tax.toFixed(2)}`
        ]);
        const ws3 = XLSX.utils.aoa_to_sheet([...taxHeaders, ...taxRows]);
        XLSX.utils.book_append_sheet(wb, ws3, "Tax Report");

        XLSX.writeFile(wb, `BillMaster_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
    };


    const handlePDF = async () => {
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

    const handleEmailReport = () => {
        const subject = encodeURIComponent("BillMaster - Sales Report");
        const body = encodeURIComponent(
            `Hi,\n\nPlease find the sales report summary:\n\n` +
            `Gross Sales: ₹${metrics.grossSales}\n` +
            `Transactions: ${metrics.transactions}\n` +
            `Tax Collected: ₹${metrics.taxCollected}\n` +
            `Net Revenue: ₹${metrics.netRevenue}\n\n` +
            `Payment Breakdown:\n` +
            paymentBreakdown.map(p => `${p.method}: ₹${p.amount} (${p.percentage}%)`).join('\n') +
            `\n\nGenerated on ${new Date().toLocaleString()}\n\n` +
            `Best regards,\nBillMaster POS`
        );

        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };


    const daysOrder = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
    const weeklySales = {
        labels: daysOrder,
        datasets: [
            {
                data: daysOrder.map(day => weeklySalesData[day] || 0),
                backgroundColor: teal,
                borderRadius: 8,
                barThickness: 32,
            },
        ],
    };

    const weeklyOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { callback: v => `₹${v}`, color: "#64748b" },
                grid: { color: "#f1f5f9" },
            },
            x: { grid: { display: false }, ticks: { color: "#64748b" } },
        },
    };

    const categoryData = {
        labels: categorySalesData.map(([category]) => category),
        datasets: [
            {
                data: categorySalesData.map(([, amount]) => amount),
                backgroundColor: teal,
                borderRadius: 8,
                barThickness: 20,
            },
        ],
    };

    const categoryOptions = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                ticks: { callback: v => `₹${v}`, color: "#64748b" },
                grid: { color: "#f1f5f9" },
            },
            y: { grid: { display: false }, ticks: { color: "#64748b" } },
        },
    };

    return (
        <main className="content">
            < header className="page-header" >
                <div>
                    <h1>Reports & Analytics</h1>
                    <p>Business insights and data exports</p>
                </div>

                <div className="actions">
                    <button className="btn outline" onClick={handleExportExcel}>
                        <Download size={16} /> Export Excel
                    </button>
                    <button className="btn outline" onClick={handlePDF}>
                        <FileText size={16} /> Export PDF
                    </button>
                    <button className="btn primary" onClick={handleEmailReport}>
                        <Mail size={16} /> Email Report
                    </button>
                </div>
            </header >


            < section className="card" >
                <div className="card-head">
                    <h3>End of Day Settlement</h3>
                    <span>
                        {new Date().toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })}
                    </span>
                </div>

                <div className="metrics">
                    {[
                        ["Gross Sales", `₹${metrics.grossSales}`],
                        ["Transactions", metrics.transactions],
                        ["Tax Collected", `₹${metrics.taxCollected}`],
                        ["Net Revenue", `₹${metrics.netRevenue}`, "green"],
                    ].map(([label, value, color]) => (
                        <div className="metric" key={label}>
                            <span>{label}</span>
                            <strong className={color}>{value}</strong>
                        </div>
                    ))}
                </div>

                <h4 className="sub-title">Payment Breakdown</h4>

                <div className="payments">
                    {paymentBreakdown.map(({ method, amount, percentage }) => (
                        <div className="payment-card" key={method}>
                            <h5>{method}</h5>
                            <strong>₹{amount}</strong>
                            <span>{percentage}% of total</span>
                        </div>
                    ))}
                </div>
            </section >


            < section className="charts" >
                <div className="chart-card">
                    <h3>Weekly Sales Comparison</h3>
                    <div className="chart-box">
                        <Bar data={weeklySales} options={weeklyOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Sales by Category</h3>
                    <div className="chart-box">
                        <Bar data={categoryData} options={categoryOptions} />
                    </div>
                </div>
            </section >


            < section className="card" >
                <div className="card-head">
                    <h3>Tax Collection Report</h3>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Taxable Sales</th>
                            <th>Tax</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxByDate.map((row) => (
                            <tr key={row.date}>
                                <td>{row.date}</td>
                                <td>₹{row.taxableSales.toFixed(2)}</td>
                                <td className="green">₹{row.tax.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section >
        </main >
    );
};

export default Reports;
