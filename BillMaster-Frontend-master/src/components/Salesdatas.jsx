import { useEffect, useState } from "react";
import axios from "axios";

const getCategory = (productName) => {
  const name = productName.toLowerCase();

  if (name.includes("milk") || name.includes("chocolate") || name.includes("chocos")|| name.includes("Curd"))
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
  return transactions.map((t, index) => {
    const amount = Number(t.amount);
    const tax = amount * 0.12;
    const subtotal = amount - tax;

    return {
      id: `BM${index + 1}`,
      date: new Date(t.paymentDate).toLocaleString(),
      cashier: t.cashierName,
      payment: t.paymentMethod === "ONLINE" ? "Card" : t.paymentMethod,
      Catagory: getCategory(t.productName),
      ProductName: t.productName,
      item: t.productName,
      qty: 1,
      subtotal: `₹${subtotal.toFixed(2)}`,
      tax: `₹${tax.toFixed(2)}`,
      total: `₹${amount.toFixed(2)}`,
      amount: `₹${amount.toFixed(2)}`,
      meta: `${t.paymentMethod} • 1 Item`,
    };
  });
};

export const Salesdatas = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8087/api/payment/history")
      .then(res => setSalesData(convertTransactions(res.data)))
      .catch(err => console.log(err));
  }, []);

  return salesData;
};
