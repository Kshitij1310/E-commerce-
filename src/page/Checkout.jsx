import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const getOrdersFromStorage = () => {
  try {
    const data = localStorage.getItem("orders");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });
  const [error, setError] = useState("");

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();
    setError("");

    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    const hasMissingField = requiredFields.some((key) => !formData[key]?.trim());

    if (hasMissingField) {
      setError("Please fill all customer and shipping fields before placing the order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty. Add products before checkout.");
      return;
    }

    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const orderTotal = Number(total.toFixed(2));
    const createdAt = new Date().toISOString();

    const order = {
      id: orderId,
      items: cartItems,
      total: orderTotal,
      createdAt,
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      shipping: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      paymentMethod: formData.paymentMethod,
    };

    const existingOrders = getOrdersFromStorage();
    const updatedOrders = [order, ...existingOrders];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    clearCart();

    navigate("/order-success", {
      replace: true,
      state: {
        orderId,
        orderTotal: orderTotal.toFixed(2),
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Your cart is empty. Add products to continue checkout.</p>
            <Button asChild className="mt-4 bg-slate-900 hover:bg-slate-800">
              <Link to="/product">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">Checkout</CardTitle>
          </CardHeader>

          <CardContent>
            {error ? (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Unable to place order</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div>
                <h3 className="mb-3 text-base font-semibold text-slate-900">Customer Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1" />
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-base font-semibold text-slate-900">Shipping Address</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleChange} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} className="mt-1" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-base font-semibold text-slate-900">Payment Method</h3>
                <div className="grid gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                    />
                    Cash on Delivery
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === "upi"}
                      onChange={handleChange}
                    />
                    UPI
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleChange}
                    />
                    Card
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                Place Order
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Order Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="rounded-md border border-slate-200 p-3">
                <p className="line-clamp-2 text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">Qty: {item.quantity}</p>
                <p className="mt-1 text-sm text-slate-700">Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="mt-4 border-t border-slate-200 pt-3">
              <p className="text-base font-semibold text-slate-900">Total: ₹{total.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
