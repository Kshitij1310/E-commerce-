import { useContext, useEffect, useMemo, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Product = () => {
  const { products: localProducts, deleteProduct } = useContext(ProductContext);
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();

  const [remoteProducts, setRemoteProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 8000);

    try {
      setError("");
      setIsLoading(true);
      const response = await fetch("https://fakestoreapi.com/products", {
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();
      setRemoteProducts(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to load products from API. Showing available local products.");
      setRemoteProducts([]);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const incomingMessage = location.state?.successMessage;
    if (incomingMessage) {
      setMessage(incomingMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const handleAddToCart = (item) => {
    if (!user) {
      setMessage("Please login to add items to cart.");
      return;
    }
    addToCart(item);
    setMessage("Product added to cart.");
  };

  const safeLocalProducts = Array.isArray(localProducts) ? localProducts : [];
  const safeRemoteProducts = Array.isArray(remoteProducts) ? remoteProducts : [];
  const mergedProducts = useMemo(() => {
    return [...safeLocalProducts, ...safeRemoteProducts];
  }, [safeLocalProducts, safeRemoteProducts]);

  const isEmpty = !isLoading && mergedProducts.length === 0;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {user && (
          <Button
            onClick={() => navigate("/addproduct")}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            + Add Product
          </Button>
        )}

        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Products</h2>

        <span className="text-sm text-slate-500">
          {mergedProducts.length} items
        </span>
      </div>

      {message ? (
        <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-900">
          <AlertTitle>QuickCart</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert className="mb-4 border-amber-300 bg-amber-50 text-amber-900">
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadProducts}
              className="border-amber-500 bg-transparent hover:bg-amber-100"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-slate-200">
              <CardContent className="p-4">
                <div className="h-40 animate-pulse rounded-md bg-slate-200" />
                <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-slate-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isEmpty ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          No products available yet. Add your first product to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mergedProducts.slice(0, 12).map((item) => (
            <Card key={item.id} className="group overflow-hidden border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <CardContent className="p-4">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  width="200"
                  height="200"
                  className="h-40 w-auto mx-auto object-contain"
                />

                <h3 className="mt-3 min-h-12 overflow-hidden text-ellipsis font-semibold text-slate-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-lg font-bold text-emerald-700">₹{item.price}</p>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
                <Button
                  onClick={() => handleAddToCart(item)}
                  disabled={!user}
                  className={`${
                    user
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  title={!user ? "Please login to add to cart" : ""}
                >
                  {user ? "Add to Cart" : "Login to Add"}
                </Button>

                {user && safeLocalProducts.some((localItem) => localItem.id === item.id) && (
                  <Button
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        "Are you sure you want to delete this product?"
                      );
                      if (confirmDelete) {
                        deleteProduct(item.id);
                      }
                    }}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                )}

                <Button
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-slate-100 text-slate-900 hover:bg-slate-200"
                >
                  View Detail
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;
