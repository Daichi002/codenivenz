import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";

const Purchased = () => {
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  const [transactionData, setTransactionData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch transactions from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/transactions?filters[customer_name][$eq]=${userDetails.name}`
        );
        const data = await response.json();
        setTransactionData(data.data);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };
    fetchData();
  }, [userDetails.name]);

  // Filter transactions by search query
  const filteredTransactions = transactionData.filter((transaction) =>
    transaction.product_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Sort transactions by date
  const handleSort = () => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setTransactionData(sorted);
  };

  return (
    <>
      <Header />
      <div className="p-5">
        {/* Search Bar */}
        <div className="flex justify-center mb-6 mt-5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name..."
            className="input input-bordered w-96 border border-gray-300 rounded-lg p-2 text-center"
          />
        </div>

        {/* Sort Button */}
        <div className="flex justify-end mb-4">
          <button
            className="btn btn-sm btn-outline px-4 py-2 border rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
            onClick={handleSort}
          >
            Sort by Date {sortOrder === "asc" ? "▲" : "▼"}
          </button>
        </div>

        {/* Transactions Table */}
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Product Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Total</th>
                  <th className="border border-gray-300 px-4 py-2">Pay Method</th>
                  <th className="border border-gray-300 px-4 py-2">Delivery Fee</th>
                  <th className="border border-gray-300 px-4 py-2">Grand Total with the Delivery Fee</th>
                  <th className="border border-gray-300 px-4 py-2">Delivery Address</th>
                  <th className="border border-gray-300 px-4 py-2">Delivery Region</th>
                  
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.product_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      ₱{transaction.total}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.bank_provider}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.delivery_fee}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.grand_total}
                    </td>
                    
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.delivery_address}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.delivery_region}
                    </td>
                 
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center mt-10">
            <p className="text-lg font-medium text-gray-600">
              No transactions found.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Purchased;