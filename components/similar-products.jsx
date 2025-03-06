"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ProductCardLoader from "./loader/product-cardLoader";
import ProductEmpty from "./design/productEmpty";
import ProductCard from "./product-card";
import { useEffect } from "react";
import { fetchSimilarProducts } from "@/lib/features/product"; // Import the new thunk
import ServerErrorPage from "./design/serverError";

const SimilarProductSection = ({ phone_model }) => { // Accept phone_model as a prop
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.product);

    useEffect(() => {
        // Fetch similar products based on the phone_model
        dispatch(fetchSimilarProducts({ phone_model, limit: 4 }));
    }, [dispatch, phone_model]); // Add phone_model to the dependency array

    if (error) {
        return <ServerErrorPage />;
    }

    return (
        <section className="mt-16">
            <Header />
            {isLoading ? (
                <div>
                    <main className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        <ProductCardLoader count={4} /> {/* Show 4 loaders */}
                    </main>
                </div>
            ) : data.length === 0 ? (
                <ProductEmpty />
            ) : (
                <main className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {data.map((item, index) => (
                        <ProductCard key={index} product={item} />
                    ))}
                </main>
            )}
        </section>
    );
};

const Header = () => {
    return (
        <div className="w-full py-2 mb-4 border-b">
            <h2 className="text-3xl font-bold">Similar Products</h2>
        </div>
    );
};

export default SimilarProductSection;