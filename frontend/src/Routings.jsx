import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import Dashboard from "./components/Customer/Dashboard.jsx";
import Product from "./components/Customer/Product.jsx";
import Cart from "./components/Customer/Cart.jsx";
import Purchased from "./components/Customer/Purchased.jsx";
import Profile from "./components/Customer/Profile.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";

const pageTransitionVariants = {
  initial: { x: "100vw", opacity: 0 }, // Page starts off-screen to the right
  animate: { x: 0, opacity: 1 }, // Slide to the center
  exit: { x: "-100vw", opacity: 0 }, // Slide off-screen to the left
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* Pass the location and a unique key to Routes */}
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }} // Smooth sliding
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.5 }} // Smooth sliding
            >
              <Register />
            </motion.div>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/purchased" element={<Purchased />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

const Routings = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default Routings;
