import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./utils/ProtectedRoute";

const Auth = lazy(() => import("./page/Auth"));
const Product = lazy(() => import("./page/Product"));
const Cart = lazy(() => import("./page/Cart"));
const Profile = lazy(() => import("./page/Profile"));
const Addproduct = lazy(() => import("./page/Addproduct"));
const Viewproduct = lazy(() => import("./page/Viewproduct"));

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense fallback={<p>Loading page...</p>}>
        <Routes>
          <Route path="/" element={<Auth />} />

          <Route path="/product" element={<Product />} />

          <Route path="/product/:id" element={<Viewproduct />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/profile" element={<Profile />} />

          <Route
            path="/addproduct"
            element={
              <ProtectedRoute>
                <Addproduct />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
