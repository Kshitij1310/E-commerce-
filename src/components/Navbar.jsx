import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.cartItems);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between bg-slate-950 px-4 py-3 text-slate-200 shadow-md">

      <div className="text-xl font-bold tracking-wide text-white">
      QuickCart</div>


      <div className="flex flex-wrap items-center gap-6 ml-auto">
        <div className="flex items-center gap-6">
          <Link
            to="/product"
            className="flex items-center gap-2 transition-colors hover:text-white">
            🛍️ Products
          </Link>


          <Link
            to="/cart"
            className="relative flex items-center gap-2 transition-colors hover:text-white">
            🛒 Cart
            {cartItems.length > 0 ? (
              <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartItems.length}
              </span>
            ) : null}
          </Link>


          <Link
            to="/profile"
            className="flex items-center gap-2 transition-colors hover:text-white">
            👤 Profile
          </Link>
        </div>

        <span className="hidden h-5 w-px bg-slate-700 sm:block" />

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-200">
                Welcome, {user.name || user.email}
              </span>
              <Button onClick={handleLogout} variant="destructive" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/")} variant="outline" size="sm">
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

