import { useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const getOrdersFromStorage = () => {
  try {
    const data = localStorage.getItem("orders");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }
  return date.toLocaleString();
};

const Orders = () => {
  const user = useAuthStore((state) => state.user);
  const orders = getOrdersFromStorage();

  const userOrders = useMemo(() => {
    if (!user?.email) {
      return [];
    }
    return orders.filter((order) => order?.customer?.email === user.email);
  }, [orders, user?.email]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Orders</h2>
        <Button asChild variant="outline" className="border-slate-300">
          <Link to="/product">Continue Shopping</Link>
        </Button>
      </div>

      {userOrders.length === 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">No orders yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">You have not placed any order yet.</p>
            <Button asChild className="mt-4 bg-slate-900 hover:bg-slate-800">
              <Link to="/product">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <Card key={order.id} className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="text-lg text-slate-900">Order {order.id}</CardTitle>
                  <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                <p className="text-base font-semibold text-slate-900">
                  Total: ₹{Number(order.total || 0).toFixed(2)}
                </p>

                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div
                      key={`${order.id}-${item.id}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 p-3"
                    >
                      <p className="text-sm font-medium text-slate-800">{item.title}</p>
                      <p className="text-sm text-slate-600">
                        Qty: {item.quantity} | Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
