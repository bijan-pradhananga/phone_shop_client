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
import { fetchBrand } from "@/lib/features/brand";

const AddProductPage = () => {
    const dispatch = useAppDispatch();
    const { success, error } = useAppSelector((state) => state.product);
    const { data: brands } = useAppSelector((state) => state.brand);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        dispatch(fetchBrand());
    }, []);

    const form = useForm({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            stock: 1,
            brand: '',
            images: [],
            specifications: {
                ram_capacity: 0,
                internal_memory: 0,
                screen_size: 0,
                battery_capacity: 0,
                processor: '',
                primary_camera_rear: 0,
                primary_camera_front: 0,
            }
        },
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        formData.append('brand', data.brand);

        // Specifications
        formData.append('specifications[ram_capacity]', data.specifications.ram_capacity);
        formData.append('specifications[internal_memory]', data.specifications.internal_memory);
        formData.append('specifications[screen_size]', data.specifications.screen_size);
        formData.append('specifications[battery_capacity]', data.specifications.battery_capacity);
        formData.append('specifications[processor]', data.specifications.processor);
        formData.append('specifications[primary_camera_rear]', data.specifications.primary_camera_rear);
        formData.append('specifications[primary_camera_front]', data.specifications.primary_camera_front);

        // Images
        Array.from(data.images).forEach((file) => {
            formData.append('images', file);
        });

        startTransition(() => {
            dispatch(addProduct(formData));
            form.reset();
        });
    };

    return (
        <div>
            <Header />
            <Form {...form}>
                <form encType="multipart/form-data" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    <Input {...field} type="number" placeholder="100.00" disabled={isPending} />
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
                                    <Input {...field} type="number" placeholder="10" disabled={isPending} />
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
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isPending}
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

                    {/* Specifications Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="specifications.ram_capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>RAM (GB)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" placeholder="8" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="specifications.internal_memory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Storage (GB)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" placeholder="128" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="specifications.screen_size"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Screen Size (inches)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" step="0.1" placeholder="6.5" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="specifications.battery_capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Battery (mAh)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" placeholder="5000" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="specifications.processor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Processor</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Snapdragon 8 Gen 2" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="specifications.primary_camera_rear"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rear Camera (MP)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" placeholder="64" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="specifications.primary_camera_front"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Front Camera (MP)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" placeholder="32" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Image Upload */}
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
    );
};

const Header = () => {
    return (
        <header className="w-full bg-gray-100 rounded py-4 px-2 mb-4">
            <h1 className="text-2xl font-semibold">Add Product</h1>
        </header>
    );
};

export default AddProductPage;
