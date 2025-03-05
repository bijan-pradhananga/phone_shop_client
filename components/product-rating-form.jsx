"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addOrUpdateRating, clearError, clearSuccess } from "@/lib/features/rating";
import { fetchSingleProduct } from "@/lib/features/product";
import AlertSuccess from "@/components/alert-success";
import AlertFailure from "@/components/alert-failure";

const ProductRatingForm = ({ productId }) => {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const { error, success } = useAppSelector((state) => state.rating);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session || !session.user.id) {
            alert("Please Login First!");
            return;
        }

        const result = await dispatch(
            addOrUpdateRating({
                userId: session.user.id,
                productId,
                rating,
                review,
            })
        );
        console.log({userId: session.user.id,
            productId,
            rating,
            review,})
        if (addOrUpdateRating.fulfilled.match(result)) {
            dispatch(fetchSingleProduct(productId));
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Rate This Product
            </h2>
            {success && <p className="text-green-500">{success}</p>}
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setRating(index + 1)}
                            className={`text-${index + 1 <= rating ? "yellow-500" : "gray-300"} text-2xl`}
                        >
                            ★
                        </button>
                    ))}
                </div>
                <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full p-2 border rounded-md mb-4"
                    rows={4}
                />
                <Button type="submit">Submit Review</Button>
            </form>
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

export default ProductRatingForm;
