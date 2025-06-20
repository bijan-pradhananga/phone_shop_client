"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { editProductFormSchema } from "@/schemas/product";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";
import React, { useEffect, useTransition } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchSingleProduct,
  updateProduct,
  clearError,
  clearSuccess
} from "@/lib/features/product";
import { fetchBrand } from "@/lib/features/brand";
import AlertFailure from "@/components/alert-failure";
import NotFoundPage from "@/components/design/404notFound";

const EditProductPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { singleData, singleLoading, error, success } = useAppSelector(state => state.product);
  const { data: brands, isLoading: brandLoading } = useAppSelector(state => state.brand);
  const [isPending, startTransition] = useTransition();
  const params = useSearchParams();
  const id = params.get("id");

  const form = useForm({
    resolver: zodResolver(editProductFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      brand: "",
      stock: 0,
      specifications: {
        ram_capacity: 0,
        internal_memory: 0,
        screen_size: 0,
        battery_capacity: 0,
        processor: "",
        primary_camera_rear: 0,
        primary_camera_front: 0
      }
    }
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
      dispatch(fetchBrand());
    }
  }, [id]);

  useEffect(() => {
    if (singleData?._id) {
      form.reset({
        name: singleData.name,
        price: singleData.price,
        brand: singleData.brand._id,
        stock: singleData.stock,
        specifications: {
          ram_capacity: singleData.specifications.ram_capacity,
          internal_memory: singleData.specifications.internal_memory,
          screen_size: singleData.specifications.screen_size,
          battery_capacity: singleData.specifications.battery_capacity,
          processor: singleData.specifications.processor,
          primary_camera_rear: singleData.specifications.primary_camera_rear,
          primary_camera_front: singleData.specifications.primary_camera_front
        }
      });
    }
  }, [singleData]);

  if (!id) return <NotFoundPage />;
  if (singleLoading || brandLoading) return <div>Loading...</div>;
  if (error) return <NotFoundPage />;

  const handleUpdate = async (data) =>{
    const result = await dispatch(updateProduct({ id: singleData._id, formData: data }));
     if (updateProduct.fulfilled.match(result)) {
        router.push('/admin/product');
     }
  }

  const onSubmit = (data) => {
    if (!singleData?._id) return;
    startTransition(() => {
        handleUpdate(data);
    });
  };

  return (
    <div>
      <Header />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands?.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              { name: "ram_capacity", label: "RAM (GB)" },
              { name: "internal_memory", label: "Internal Memory (GB)" },
              { name: "screen_size", label: "Screen Size (inches)" },
              { name: "battery_capacity", label: "Battery (mAh)" },
              { name: "processor", label: "Processor", type: "text" },
              { name: "primary_camera_rear", label: "Rear Camera (MP)" },
              { name: "primary_camera_front", label: "Front Camera (MP)" }
            ]).map(({ name, label, type = "number" }) => (
              <FormField
                key={name}
                control={form.control}
                name={`specifications.${name}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input {...field} type={type} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              Update Product
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>

      <AlertFailure
        isOpen={!!error}
        message={error}
        onClose={() => dispatch(clearError())}
      />
    </div>
  );
};

const Header = () => {
    return (
        <header className="w-full bg-gray-100 rounded py-4 px-2 mb-4">
            <h1 className="text-2xl font-semibold">Edit Product</h1>
        </header>
    );
};

export default EditProductPage;
