import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    addProduct(data);
    navigate("/product");
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <Label>Title</Label>
              <Input {...register("title")} placeholder="Enter title" />
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
              />
              {errors.image && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Submit Product
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Addproduct;
