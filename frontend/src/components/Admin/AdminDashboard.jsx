import React, { useState, useEffect } from "react";

// AdminDashboard Component
const AdminDashboard = () => {
  // States to store data that is fetched from the API
  const [transactionData, setTransactionData] = useState([]); 
  const [searchBranch, setSearchBranch] = useState(""); 
  const [filteredTransactions, setFilteredTransactions] = useState([]); 
  const [sortOrderSales, setSortOrderSales] = useState("asc"); 
  const [sortOrderDate, setSortOrderDate] = useState("asc"); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [modalData, setModalData] = useState([]); 
  const [topProductData, setTopProductData] = useState(null); 

  // Fetch transaction history from Strapi
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetch transaction data from an API
        const response = await fetch(
          `http://localhost:1337/api/transactions?pagination[pageSize]=1000`
        );
        const data = await response.json();
        
        // Format the fetched data
        const formattedData = data.data.map((item) => ({
          date: new Date(item.date), // Convert date to a JavaScript Date object
          branch: item.branch_name, // Branch name
          product: item.product_name, // Product name
          quantity: parseInt(item.quantity), // Quantity sold
          total: parseFloat(item.total), // Total price
          price: parseFloat(item.price), // Price of a single unit
          bank_provider: item.bank_provider, // Payment method
          provider_number: item.provider_number, // Bank provider account number
          delivery_fee: parseFloat(item.delivery_fee), // Delivery fee
          grand_total: parseFloat(item.grand_total), // Total cost including delivery fee
          delivery_region: item.delivery_region, // Delivery region
          address: item.delivery_address, // Delivery address
        }));

        setTransactionData(formattedData); // Save the formatted transaction data to state
        setFilteredTransactions(formattedData); // Initially, no filter, so set filtered data to all transactions
      } catch (error) {
        console.error("Error fetching transactions:", error); // Handle error in data fetching
      }
    };

    fetchHistory(); // Call the function to fetch transaction data
  }, []);

  // Calculate total sales and top products for each branch
  const calculateTopSales = (transactions) => {
    const branchSalesMap = {}; // Will hold data for each branch

    // Loop through transactions to calculate total sales per branch and top product
    transactions.forEach(({ branch, product, quantity, total, price }) => {
      if (!branchSalesMap[branch]) {
        branchSalesMap[branch] = {
          branch,
          productQuantities: {}, // Initialize an object to store product quantities and total sales
          totalSales: 0, // Initialize total sales to 0
        };
      }

      branchSalesMap[branch].totalSales += total; // Accumulate total sales per branch

      if (!branchSalesMap[branch].productQuantities[product]) {
        branchSalesMap[branch].productQuantities[product] = { quantity: 0, total: 0 };
      }

      branchSalesMap[branch].productQuantities[product].quantity += quantity; // Accumulate product quantity
      branchSalesMap[branch].productQuantities[product].total += total; // Accumulate product total sales
    });

    return Object.values(branchSalesMap).map(({ branch, totalSales, productQuantities }) => {
      const topProduct = Object.entries(productQuantities).reduce(
        (top, [product, { quantity, total }]) => 
          (quantity > top.quantity ? { name: product, quantity, total } : top), 
        { name: null, quantity: 0, total: 0 }
      );

      return { branch, totalSales, topProduct }; // Return branch, total sales, and top product
    });
  };

  // Get top sales data by branch
  const branchSales = calculateTopSales(transactionData);

  // Sort the branch sales data by total sales
  // mao ni nadugang 
  const sortedBranchSales = [...branchSales].sort((a, b) => {
    return sortOrderSales === "asc"
      ? a.totalSales - b.totalSales // Ascending order (lowest to highest)
      : b.totalSales - a.totalSales; // Descending order (highest to lowest)
  });

  // Filter transactions based on branch name search input
  const handleBranchFilter = (branchName) => {
    if (branchName === "") {
      setFilteredTransactions(transactionData); // No filter, show all transactions
    } else {
      const filtered = transactionData.filter((transaction) =>
        transaction.branch.toLowerCase().includes(branchName.toLowerCase())
      );
      setFilteredTransactions(filtered); // Apply filter and show filtered transactions
    }
    setSearchBranch(branchName); // Update search input state
  };

  // Sort transaction data by date (ascending or descending)
  const handleDateSort = () => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      return sortOrderDate === "asc" ? a.date - b.date : b.date - a.date;
    });
    setFilteredTransactions(sorted); // Update the filtered transaction list with sorted data
    setSortOrderDate((prev) => (prev === "asc" ? "desc" : "asc")); // Toggle sort order for next click
  };

  // Sort branch sales by total sales (ascending or descending)
  const handleSalesSortOrder = () => {
    setSortOrderSales((prev) => (prev === "asc" ? "desc" : "asc")); // Toggle sort order for sales
  };

  // Logout function
  const handleLogout = () => {
    console.log("User logged out");
    window.location.href = "/"; // Redirect to the login page
  };


  // kani sad nadugang
  // Show the modal with product details when a branch is clicked
  const handleCardClick = (branch) => {
    const branchTransactions = transactionData.filter(
      (transaction) => transaction.branch === branch
    );

    // Calculate the top product for the selected branch
    const branchSalesData = calculateTopSales(branchTransactions);

    const topProduct = branchSalesData.length > 0 ? branchSalesData[0].topProduct : null;

    // Get all product sales data for this branch
    const productsSold = branchTransactions.map((transaction) => ({
      product: transaction.product,
      quantity: transaction.quantity,
      total: transaction.total, // Total sales of the product
    }));


    // Sort the productsSold array by quantity in ascending order (default)
    const sortedProductsSold = [...productsSold].sort((a, b) => b.quantity - a.quantity);



    // Set modal data and top product
    setModalData(sortedProductsSold); // Set the sorted data for the modal
    setTopProductData(topProduct);    // Set the top product data for the modal


    // Show the modal
    setModalVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-blue-800 text-white py-5 shadow-md">
        <div className="container mx-auto px-5 flex justify-between items-center">
          <div className="inline-flex items-center">
            <img src="dali.jpg" alt="Dali" className="h-10 w-auto mr-2" />
            <p className="font-bold text-3xl tracking-widest">Dali Admin Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-800 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium shadow"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-5 py-10">
        {/* Sales Per Branch Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Per Branch</h2>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleSalesSortOrder}
              className={`px-4 py-2 rounded shadow-md ${sortOrderSales === "asc" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Sort by Sales ({sortOrderSales === "asc" ? "Ascending" : "Descending"})
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBranchSales.map((branch, index) => (
              <div
                key={index}
                className="bg-gray-100 shadow-inner rounded-lg p-6 border border-gray-200 cursor-pointer"
                onClick={() => handleCardClick(branch.branch)}
              >
                <h3 className="text-xl font-bold text-black">{branch.branch}</h3>
                <p className="text-gray-600 mt-2">
                  <strong>Total Sales:</strong> ₱{branch.totalSales.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <strong>Top Product:</strong> {branch.topProduct.name} ({branch.topProduct.quantity} sold)
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Transaction History Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-grow">
              <label htmlFor="branch" className="block text-gray-600 font-medium">
                Search the Branch:
              </label>
              <input
                type="text"
                id="branch"
                value={searchBranch}
                onChange={(e) => handleBranchFilter(e.target.value)}
                placeholder="Search branch name"
                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
              />
            </div>
            <button
              onClick={handleDateSort}
              className={`px-4 py-2 rounded shadow-md ${sortOrderDate === "asc" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Sort by Date ({sortOrderDate === "asc" ? "Ascending" : "Descending"})
            </button>
          </div>

          {/* Table with Transaction History */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="table-auto border-collapse border border-gray-300 w-full text-left">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Branch</th>
                  <th className="border border-gray-300 px-4 py-2">Product</th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Total</th>
                  <th className="border border-gray-300 px-4 py-2">Pay Method</th>
                  <th className="border border-gray-300 px-4 py-2">Delivery Fee</th>
                  <th className="border border-gray-300 px-4 py-2">Grand Total with the Delivery Fee</th>
               
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.date.toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{transaction.branch}</td>
                    <td className="border border-gray-300 px-4 py-2">{transaction.product}</td>
                    <td className="border border-gray-300 px-4 py-2">{transaction.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2">₱{transaction.total.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.bank_provider}
                    </td>
                    {/* mao ni nadugang */}
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.delivery_fee}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.grand_total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold text-black mb-4">Products Sold</h3>
            <ul>
              {modalData.map((product, index) => (
                <li key={index} className="text-gray-700">
                  {product.product} - {product.quantity} sold - Total: ₱{product.total.toLocaleString()}
                </li>
              ))}
            </ul>
            {topProductData && (
              <div className="mt-4">
                <p className="font-bold">Top Product:</p>
                <p>{topProductData.name} - {topProductData.quantity} sold</p>
                <p>Total Sales for Product: ₱{topProductData.total.toLocaleString()}</p>
              </div>
            )}
            <button
              onClick={() => setModalVisible(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
