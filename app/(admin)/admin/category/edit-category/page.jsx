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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Suspense, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { categoryFormSchema } from "@/schemas/category";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearError, clearSuccess, fetchSingleCategory, updateCategory } from "@/lib/features/category";
import AlertSuccess from "@/components/alert-success";
import AlertFailure from "@/components/alert-failure";
import { useSearchParams } from 'next/navigation';
import NotFound from "@/components/not-found";

const PageContent = () => {
    const dispatch = useAppDispatch();
    const { singleData, success, error, isLoading } = useAppSelector((state) => state.category);
    const [isPending, startTransition] = useTransition();
    const params = useSearchParams();
    const id = params.get('id');

    if (!id) {
        return null;
    }

    const onSubmit = async (data) => {
        if (singleData?._id) {
            const formData = {
                name: data.name,
                description: data.description,
            };

            startTransition(() => {
                dispatch(updateCategory({ id: singleData._id, formData })); // Dispatch with both id and form data
            });
        }
    };

    const form = useForm({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    useEffect(() => {
        if (id) {
            dispatch(fetchSingleCategory(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (singleData && Object.keys(singleData).length > 0) {
            form.setValue('name', singleData.name);
            form.setValue('description', singleData.description);
        }
    }, [singleData]);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <NotFound />;
    }
    return (
        <div>
            <Header />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Category Name" disabled={isPending} />
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
                                    <Textarea {...field} placeholder="Category Description" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="px-4 py-2" disabled={isPending}>
                        Submit
                    </Button>
                    <Button type="button" onClick={() => window.history.back()}   className="px-4 py-2 ml-2" disabled={isPending}>
                        Go Back
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
            <h1 className="text-2xl font-semibold">Edit Category</h1>
        </header>
    )
}

const Page = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <PageContent />
    </Suspense>
);

export default Page