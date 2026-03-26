import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || `ORD-${Date.now().toString().slice(-8)}`;
  const orderTotal = location.state?.orderTotal;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-800">Order placed successfully</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-emerald-900">
            Thank you for shopping with QuickCart. Your order is confirmed.
          </p>

          <div className="rounded-md border border-emerald-200 bg-white p-4">
            <p className="text-sm text-slate-600">Order ID</p>
            <p className="text-lg font-semibold text-slate-900">{orderId}</p>
            {orderTotal ? <p className="mt-1 text-sm text-slate-700">Total Paid: ₹{orderTotal}</p> : null}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="bg-slate-900 hover:bg-slate-800">
              <Link to="/product">Continue Shopping</Link>
            </Button>

            <Button asChild variant="outline" className="border-slate-300">
              <Link to="/orders">View Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
