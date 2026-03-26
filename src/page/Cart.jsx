import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Cart = () => {
  const user = useAuthStore((state) => state.user);
  const { cartItems, addToCart, removeFromCart, removeItem } = useCartStore();

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">Cart</h2>
        <p className="text-lg text-slate-600">Please login to view your cart</p>
        <Button asChild className="mt-4 bg-slate-900 hover:bg-slate-800">
          <Link to="/">Go to Login</Link>
        </Button>
      </div>
    );
  }

  let total = 0;
  cartItems.forEach((item) => {
    total = total + item.price * item.quantity;
  });

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">Cart</h2>

      {cartItems.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          <p className="text-lg font-medium">Your cart is empty</p>
          <p className="mt-2 text-sm">Add products from the product page to see them here.</p>
          <Button asChild className="mt-4 bg-slate-900 hover:bg-slate-800">
            <Link to="/product">Browse Products</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {cartItems.map((item) => (
          <Card key={item.id} className="border-slate-200 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 w-16 rounded-md border border-slate-200 bg-white object-contain p-1"
                />

                <div>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">₹{item.price} each</p>
                  <p className="text-sm text-slate-600">
                    Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => removeFromCart(item)}
                  variant="outline"
                  size="sm"
                  className="border-slate-300"
                >
                  -
                </Button>

                <span className="min-w-8 text-center text-sm font-medium text-slate-800">
                  {item.quantity}
                </span>

                <Button
                  onClick={() => addToCart(item)}
                  variant="outline"
                  size="sm"
                  className="border-slate-300"
                >
                  +
                </Button>

                <Button onClick={() => removeItem(item)} variant="destructive" size="sm">
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Total: ₹{total.toFixed(2)}</h3>
          <Button asChild className="mt-4 w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
