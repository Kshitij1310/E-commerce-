import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.cartItems);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 text-slate-700 shadow-sm backdrop-blur">

      <div className="text-xl font-bold tracking-wide text-slate-900">
        QuickCart
      </div>


      <div className="flex flex-wrap items-center gap-6 ml-auto">
        <div className="flex items-center gap-6">
          <Link
            to="/product"
            className="flex items-center gap-2 font-medium transition-colors hover:text-slate-900">
            🛍️ Products
          </Link>


          <Link
            to="/cart"
            className="relative flex items-center gap-2 font-medium transition-colors hover:text-slate-900">
            🛒 Cart
            {cartItemCount > 0 ? (
              <span className="absolute -top-2 -right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-xs text-white">
                {cartItemCount}
              </span>
            ) : null}
          </Link>


          <Link
            to="/profile"
            className="flex items-center gap-2 font-medium transition-colors hover:text-slate-900">
            👤 Profile
          </Link>

          <Link
            to="/orders"
            className="flex items-center gap-2 font-medium transition-colors hover:text-slate-900">
            📦 Orders
          </Link>
        </div>

        <span className="hidden h-5 w-px bg-slate-300 sm:block" />

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-600">
                Welcome, {user.name || user.email}
              </span>
              <Button onClick={handleLogout} variant="destructive" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/")} variant="outline" size="sm" className="border-slate-300">
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

