"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addProduct, clearError, clearSuccess } from "@/lib/features/product";
import AlertSuccess from "@/components/alert-success";
import AlertFailure from "@/components/alert-failure";
import { productFormSchema } from "@/schemas/product";
import { fetchCategory } from "@/lib/features/category";
import { fetchBrand } from "@/lib/features/brand";

const AddProductPage = () => {
    const dispatch = useAppDispatch();
    const { success, error } = useAppSelector((state) => state.product);
    const { data: categories, isLoading } = useAppSelector((state) => state.category);
    const { data: brands } = useAppSelector((state) => state.brand);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        dispatch(fetchCategory());
        dispatch(fetchBrand());
    }, [])

    const form = useForm({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            stock: 1,
            category: '',
            brand: '',
            images: [],
        },
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        formData.append('category', data.category);
        formData.append('brand', data.brand);
      
        // Append images (ensure this matches the 'images' field in the backend)
        Array.from(data.images).forEach((file, index) => {
          formData.append('images', file); // 'images' should match the name in multer
        });
    
        startTransition(() => {
            dispatch(addProduct(formData));
            form.reset();
            
        })
    };
    return (
        <div>
            <Header />
            <Form {...form}>
                <form encType="multipart/form-data" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Product Name" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Product Description" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="100.00" type="number" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="10" type="number" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange} // Update the form value
                                        value={field.value} // Controlled input
                                        disabled={isPending} // Disable if needed
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((item) => (
                                                <SelectItem key={item._id} value={item._id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange} // Update the form value
                                        value={field.value} // Controlled input
                                        disabled={isPending} // Disable if needed
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((item) => (
                                                <SelectItem key={item._id} value={item._id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <Input
                                        name="images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files)}
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending}>
                        Submit
                    </Button>
                </form>
            </Form>
            <AlertSuccess
                isOpen={success}
                message={success}
                onClose={() => dispatch(clearSuccess())}
            />
            <AlertFailure
                isOpen={error}
                message={error}
                onClose={() => dispatch(clearError())}
            />
        </div>
    )
}


const Header = () => {
    return (
        <header className="w-full bg-gray-100 rounded py-4 px-2 mb-4">
            <h1 className="text-2xl font-semibold">Add Product</h1>
        </header>
    )
}
export default AddProductPage