import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { Card, CardContent } from "@/components/ui/card";

const Viewproduct = () => {
  const { id } = useParams();
  const { products: localProducts } = useContext(ProductContext);



  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const numericId = Number(id);
    console.log(id);

    // Checking the local product first 

    const foundLocal = localProducts.find(
      (item) => item.id === numericId
    );


    if (foundLocal) {
      setProduct(foundLocal);
      setLoading(false);
      return;
    }

    // Fetch from API if not found locally

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${numericId}`
        );
        const data = await res.json();
        setProduct(data);
       }
       catch {
        console.log("Error fetching product");
      }
    finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!product) return <p className="p-6">Product not found</p>;

  return (
    <div className="p-8">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-6">
          <img
            src={product.image}
            alt={product.title}
            className="h-80 mx-auto"
          />

          <h2 className="text-2xl font-bold mt-4">
            {product.title}
          </h2>

          <p className="text-xl text-green-600">
            ₹{product.price}
          </p>

          <p className="mt-4">
            {product.description}
          </p>

          <p className="text-gray-500 mt-2">
            Category: {product.category}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Viewproduct;
