import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const productSchema = z.object({
  title: z.string().min(3, "title must be at least 3 characters"),
  price: z.number().positive("price must be a positive number"),
  description: z.string().min(10, "description must be at least 10 characters"),
  category: z.string().min(1, "category is required"),
  image: z.string().url("image must be a valid URL"),
});

function Addproduct() {
  const { addProduct } = useContext(ProductContext);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      price: 0,
      description: "",
      category: "",
      image: "",
    },
  });

  const onSubmit = (data) => {
    try {
      setSubmitError("");
      addProduct(data);
      reset();
      navigate("/product", {
        state: { successMessage: "Product added successfully." },
      });
    } catch {
      setSubmitError("Unable to add product. Please try again.");
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-xl px-4 pb-8">
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Add Product</CardTitle>
          <p className="text-sm text-slate-500">
            Fill the details below to publish a new product.
          </p>
        </CardHeader>

        <CardContent>
          {submitError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Unable to save product</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <Label>Title</Label>
              <Input
                {...register("title")}
                placeholder="Enter title"
                className="mt-1"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label>Price</Label>
              <Input
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="Enter price"
                className="mt-1"
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Enter description"
                className="mt-1"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label>Category</Label>
              <Input
                {...register("category")}
                placeholder="Enter category"
                className="mt-1"
              />
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label>Image URL</Label>
              <Input
                {...register("image")}
                placeholder="Enter image URL"
                className="mt-1"
              />
              {errors.image && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
              Submit Product
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Addproduct;
