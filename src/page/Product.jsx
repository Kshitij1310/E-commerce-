import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";

const Product = () => {
  const { products: localProducts, deleteProduct } = useContext(ProductContext);
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
      setIsLoading(false);
    } catch {
      setError("Failed to load products");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = (item) => {
    if (!user) {
      alert("Please login to add items");
      return;
    }
    addToCart(item);
    alert("Product added to cart successfully!");
  };

  const safeLocalProducts = Array.isArray(localProducts) ? localProducts : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const mergedProducts = [...safeLocalProducts, ...safeProducts];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        {user && (
          <button
            onClick={() => navigate("/addproduct")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Add Product
          </button>
        )}

        <h2 className="text-2xl font-bold">Products</h2>

        <span className="text-sm text-gray-500">
          {mergedProducts.length} items
        </span>
      </div>

      {isLoading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mergedProducts.slice(0, 12).map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  width="200"
                  height="200"
                  className="h-40 w-auto mx-auto object-contain"
                />

                <h3 className="font-semibold mt-2">{item.title}</h3>
                <p>₹{item.price}</p>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
                {/* add to cart */}
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

                {/* delete product */}
                {user && (
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

                {/* view detail button */}
                <Button
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-blue-500 hover:bg-blue-600"
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
