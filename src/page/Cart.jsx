import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Cart = () => {
  const user = useAuthStore((state) => state.user);
  const { cartItems, addToCart, removeFromCart, removeItem } = useCartStore();

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <p className="text-gray-600 text-lg">
          Please login to view your cart
        </p>
      </div>
    );
  }

  let total = 0;
  cartItems.forEach((item) => {
    total = total + item.price * item.quantity;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>

      {cartItems.length === 0 && (
        <p className="text-gray-500">Cart is empty</p>
      )}

      {cartItems.map((item) => (
        <Card key={item.id} className="mb-3">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">Price: ₹{item.price}</p>
              <p className="text-sm text-gray-600">
                Qty: {item.quantity}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => addToCart(item)}
                variant="outline"
                size="sm"
              >
                +
              </Button>

              <Button
                onClick={() => removeFromCart(item)}
                variant="outline"
                size="sm"
              >
                -
              </Button>

              <Button
                onClick={() => removeItem(item)}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {cartItems.length > 0 && (
        <h3 className="text-lg font-semibold mt-4">
          Total: ₹{total}
        </h3>
      )}
    </div>
  );
};

export default Cart;

