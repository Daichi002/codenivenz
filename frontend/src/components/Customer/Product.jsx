import React, { useState, useEffect } from "react";
import Header from "./Header";
import Swal from 'sweetalert2';
import { FaSearch, FaTimes,FaCheckCircle, FaRegCheckCircle  } from "react-icons/fa"; // Import icon for search and close button

const Product = () => {
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [notification, setNotification] = useState("");
  const userDetails = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/products`);
        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/categories`);
        const data = await response.json();
        const categoriesNames = data.data.map((item) => item.category_name);
        setCategories(categoriesNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/branches`);
        const data = await response.json();
        const branchNames = data.data.map((item) => item.branch_name);
        setBranches(branchNames);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // const handleCheckoutClick = (product) => {
  //   setSelectedProduct(product);
  //   setShowModal(true);
  // };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const filteredProducts = products.filter(
    (product) =>
      (searchQuery
        ? product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
        : true) &&
      (selectedBranches.length > 0
        ? product.branch_name === selectedBranches[0]
        : true) &&
      (selectedCategories.length > 0
        ? product.category_name === selectedCategories[0]
        : true)
  );

  const handlePlaceOrder = async () => {
    // Check if Cash on Delivery is selected before proceeding
    if (!isCashOnDelivery) {
      Swal.fire({
        title: "Payment Option Required",
        text: "Please select a payment option before proceeding.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return; // Prevent order placement if payment option is not selected
    }
  
    const today = new Date();
    const phtOffset = 8 * 60; // Philippine Time is UTC +8
    const localDate = new Date(today.getTime() + (phtOffset - today.getTimezoneOffset()) * 60000); // Adjust for PHT
    const formattedDate = localDate.toISOString().split("T")[0]; // Get the local date
    
    const cartData = {
      data: {
        product_name: selectedProduct.product_name,
        quantity: quantity,
        total: selectedProduct.product_price * quantity,
        customer_name: userDetails.name,
        date: formattedDate,
        branch_name: selectedProduct.branch_name,
      },
    };
  
    const jsonString = JSON.stringify(cartData);
  
    try {
      const response = await fetch("http://localhost:1337/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      });
  
      if (response.ok) {
        Swal.fire({
          title: "Order Placed!",
          text: "Your order has been successfully placed.",
          icon: "success"
        }).then(() => {
          setShowModal(false);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to place the order. Please try again.",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while placing the order.",
        icon: "error"
      });
    }
  };
  
  const handleAddToCart = async (product) => {
    const cartData = {
      data: {
        product_name: product.product_name,
        quantity: 1,
        price: product.product_price,
        user_name: userDetails.name,
        branch_name: product.branch_name,
        image: product.image,
      },
    };
    const jsonString = JSON.stringify(cartData);
    try {
      const response = await fetch("http://localhost:1337/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      });

      if (response.ok) {
        const data = await response.json();
        setNotification("Product added to cart!");
        setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
        setShowModal(false);
        Swal.fire({
          title: "Success!",
          text: "Product added to cart.",
          icon: "success"
        });
      } else {
        const errorData = await response.text();
        setNotification("Failed to add to cart!");
        setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
        console.error(errorData);
        Swal.fire({
          title: "Error",
          text: "Failed to add the product to the cart.",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification("An error occurred while adding to cart!");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
      Swal.fire({
        title: "Error",
        text: "An error occurred while adding the product to the cart.",
        icon: "error"
      });
    }
  };

  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);

  return (
    <>
      <Header />
      {/* Search Bar (Centered with Icon) */}
      <div className="flex justify-center p-4 mt-8 mb-6">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            placeholder="Search the product here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute top-2 left-3 text-gray-600" />
        </div>
      </div>

      <div className="flex gap-6 p-2 mt-1 items-start">
      <div className="w-1/4 p-3 rounded-lg shadow sticky top-0 max-h-80 overflow-y-auto border-4 border-blue-500">
          <h3 className="text-lg font-bold mb-4 text-white"></h3>

          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-black">Branches</h4>
            <select
              className="w-full border border-gray-300 rounded-md p-2 bg-white"
              value={selectedBranches[0] || ""}
              onChange={(e) =>
                setSelectedBranches(e.target.value ? [e.target.value] : [])
              }
            >
              <option value="">All Branches</option>
              {branches.map((branch_name) => (
                <option key={branch_name} value={branch_name}>
                  {branch_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-black">Categories</h4>
            <select
              className="w-full border border-gray-300 rounded-md p-2 bg-white"
              value={selectedCategories[0] || ""}
              onChange={(e) =>
                setSelectedCategories(e.target.value ? [e.target.value] : [])
              }
            >
              <option value="">All Categories</option>
              {categories.map((category_name) => (
                <option key={category_name} value={category_name}>
                  {category_name}
                </option>
              ))}
            </select>
          </div>
        </div>
              
        <div className="w-3/4 max-h-screen overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden relative"
              >
                <div className="relative">
                  <div className="w-full h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`absolute top-2 left-2 text-xs font-semibold px-3 py-1 rounded-full text-white ${
                      product.branch_name === "Bahbah"
                        ? "bg-blue-00"
                        : product.branch_name === "Awa"
                        ? "bg-red-500"
                        : product.branch_name === "Bayugan"
                        ? "bg-pink-500"
                        : product.branch_name === "Barobo"
                        ? "bg-black"
                        : product.branch_name === "San Francisco"
                        ? "bg-purple-800"
                        : "bg-gray-500"
                    }`}
                  >
                    {product.branch_name}
                  </span>
                </div>

                <div className="p-4">
                  <h5 className="text-lg font-medium mb-1">{product.product_name}</h5>
                  <p className="text-sm text-gray-600 mb-2">{product.category_name}</p>
                  <p className="text-lg font-semibold text-gray-800 mb-4">
                    ₱{product.product_price}
                  </p>

                  <div className="flex gap-2">
                    {/* <button
                      onClick={() => handleCheckoutClick(product)}
                      className="block w-2/3 px-2 text-center text-blue-800 border border-slate-600 rounded-lg hover:bg-gray-100"
                    >
                      Checkout
                    </button> */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="block w-full px-4 py-2 text-center text-white bg-blue-800 rounded-lg hover:bg-gray-900"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-center">
              No products found!
            </p>
          )}
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {/* Modal with Close Button */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-2/3 flex relative">
            <div className="flex-shrink-0 w-1/3 pr-6">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.product_name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            <div className="w-2/3">
              <div className="mb-4 border-b border-gray-300 pt-4">
                <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
                <p className="text-sm text-gray-700">
                  <strong>Name:</strong> {userDetails.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Address:</strong> {userDetails.address}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  <strong>Phone:</strong> {userDetails.phoneNumber}
                </p>
              </div>

              <div className="mb-4 border-b border-gray-300 pt-4">
                <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                <p className="text-sm text-gray-700">
                  <strong>Name:</strong> {selectedProduct.product_name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Price:</strong> ₱{selectedProduct.product_price}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Branch:</strong> {selectedProduct.branch_name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Category:</strong> {selectedProduct.category_name}
                </p>
              </div>

              {/* payment options */}
              <div className="mb-4 border-b border-gray-300 pt-4">
  <h3 className="text-lg font-semibold mb-2">Payment Option</h3>
  
  <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="cod" // Unique id for the checkbox
        checked={isCashOnDelivery} // State variable to track if the checkbox is checked
        onChange={() => setIsCashOnDelivery(!isCashOnDelivery)} // Toggle the checkbox state
        className="form-checkbox text-blue-800"
      />
          {isCashOnDelivery ? (
            <FaCheckCircle className="text-green-500" /> // Show check icon when selected
          ) : (
            <FaRegCheckCircle className="text-gray-400" /> // Show empty check circle when not selected
          )}
          <label htmlFor="cod" className="text-sm text-gray-700">
            <strong>Cash on Delivery</strong>
          </label>
        </div>
      </div>


              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  min="1"
                />
              </div>

              <p className="text-lg font-semibold mb-4">
                Total: ₱{selectedProduct.product_price * quantity}
              </p>

              <div className="flex justify-center ">
                <button
                  onClick={handlePlaceOrder} // Make sure this triggers the order placement
                  className="bg-blue-800 text-white w-full px-6 py-2 rounded-lg"
                >
                  Place Order
                </button>
              </div>
            </div>

            {/* Close button */}
            <FaTimes
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Product;