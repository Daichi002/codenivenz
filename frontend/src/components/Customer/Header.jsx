import { FaHome } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FiLogOut, FiMenu } from "react-icons/fi";

const Header = () => {
  return (
    <>
      <header className="bg-blue-800 text-white font-bold px-2">
        <div className="flex justify-between h-20 items-center">
          <a
            rel="noopener noreferrer"
            href="#"
            aria-label="Back to homepage"
            className="flex items-center p-2 space-x-2"
          >
            <img src="dali.jpg" alt="Dali" className="h-10 w-auto mr-2" />
            <p className="font-bold text-3xl tracking-widest ml-2">Dali</p>
          </a>
          <ul className="items-stretch hidden space-x-2 md:flex">
            <li className="flex hover:underline">
              <a
                rel="noopener noreferrer"
                href="/dashboard"
                className="flex items-center px-4 -mb-1 border-b-2 border-transparent"
              >
                <FaHome className="mr-1 w-5 h-5" />
                Dashboard
              </a>
            </li>
            <li className="flex hover:underline">
              <a
                rel="noopener noreferrer"
                href="/product"
                className="flex items-center px-4 -mb-1 border-b-2 border-transparent"
              >
                <FaBox className="mr-1 w-5 h-5" />
                Products
              </a>
            </li>
            <li className="flex hover:underline">
              <a
                rel="noopener noreferrer"
                href="/cart"
                className="flex items-center px-4 -mb-1 border-b-2 border-transparent"
              >
                <FaShoppingCart className="mr-1 w-5 h-5" />
                Cart
              </a>
            </li>
            <li className="relative group flex">
              <button className="flex items-center px-4 py-2 hover:underline -mb-1 border-b-2 border-transparent focus:outline-none">
                <FaUserAlt className="mr-1 w-5 h-4" />
                User
              </button>
              <ul className="absolute z-10 left-0 mt-14 w-24 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-200 group-focus-within:opacity-100 group-focus-within:visible">
                <li>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-500 hover:bg-gray-50"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="/purchased"
                    className="block px-4 py-2 text-gray-500 hover:bg-gray-50"
                  >
                    History
                  </a>
                </li>
                <hr />
                <li>
                  <a
                    href="/"
                    className="block px-4 py-2 text-gray-500 hover:bg-gray-50"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <button className="flex justify-end p-4 md:hidden">
            <FiMenu className="w-6 h-6" />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;