import Header from "./Header.jsx";
import { useState, useEffect } from "react";

const Dashboard = () => {
  return (
    <>
      <Header />
      {/* Hero Section */}
      <section className="bg-white text-gray-800">
        <div className="px-4 lg:px-8 flex justify-between items-center gap-8 lg:gap-12">
          <div className="lg:max-w-xl flex flex-col justify-center text-center lg:text-left px-10">
            <h1 className="text-4xl font-extrabold leading-snug sm:text-5xl lg:text-7xl">
              Welcome to <span className="text-pink-600">Dali</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Discover tons of amazing products at low prices. From everyday food necessities you need, 
                In <span className="text-pink-600">Dali</span> we got it all for you.
            </p>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
              <a
                href="/product"
                className="px-6 py-3 text-lg font-medium text-white bg-blue-800 rounded-lg hover:bg-gray-900"
              >
                Start Shopping
              </a>
             
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-10">
            <img
              src="dali.jpg"
              alt="E-commerce Illustration"
              className="object-contain"
            />
          </div>
        </div>
      </section>


    </>
  );
};

export default Dashboard;