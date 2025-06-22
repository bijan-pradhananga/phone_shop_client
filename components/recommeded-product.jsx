"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ProductCardLoader from "./loader/product-cardLoader";
import ProductCard from "./product-card";
import { useEffect } from "react";
import { fetchRecommendedProducts } from "@/lib/features/product";
import ServerErrorPage from "./design/serverError";
import { useSession } from "next-auth/react";

const RecommendedProducts = () => {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const { recommendedData, isLoading, error } = useAppSelector((state) => state.product);

    useEffect(() => {
        if (session && session.user.id) {
            dispatch(fetchRecommendedProducts({ userId: session.user.id, top_n: 4 }));
        }
    }, [dispatch, session]);

    if (!session) {
        return null;
    }

    // Check for insufficient data error
    const isInsufficientDataError = error && error.includes("Insufficient user activity");

    return (
        <section className="mt-16">
            {isLoading ? (
                <div>
                    <Header />
                    <main className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        <ProductCardLoader count={4} />
                    </main>
                </div>
            ) : error && !isInsufficientDataError ? (
                <ServerErrorPage />
            ) : (
                <>
                    <Header />
                    {isInsufficientDataError && (
                        <p className="text-center text-gray-600 mb-4">
                            {error}. Explore popular products while we learn more about your preferences.
                        </p>
                    )}
                    {recommendedData.length > 0 ? (
                        <main className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {recommendedData.map((item, index) => (
                                <ProductCard key={index} product={item} />
                            ))}
                        </main>
                    ) : (
                        <p className="text-center text-gray-600">
                            No products available to display.
                        </p>
                    )}
                </>
            )}
        </section>
    );
};

const Header = () => {
    return (
        <div className="w-full py-2 mb-4 border-b">
            <h2 className="text-3xl font-bold">Recommended For You</h2>
        </div>
    );
};

export default RecommendedProducts;