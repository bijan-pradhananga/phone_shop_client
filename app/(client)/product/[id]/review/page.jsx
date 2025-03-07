"use client";
import NotFoundPage from '@/components/design/404notFound';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { checkUserRating, fetchRatings } from '@/lib/features/rating';
import ProductRatingForm from '@/components/product-rating-form';
import ServerErrorPage from '@/components/design/serverError';
import { useSession } from 'next-auth/react';

const Page = () => {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    //   const { singleData, error, singleLoading } = useAppSelector((state) => state.product);
    const { ratings, error, hasRated, userRating } = useAppSelector((state) => state.rating)
    const params = useParams();
    const id = params.id;

    if (!id) {
        return <NotFoundPage />;
    }

    useEffect(() => {

        dispatch(checkUserRating({
            userId: session.user.id,
            productId: id
        }))
        dispatch(fetchRatings(id));
    }, [dispatch, id]);

    if (error) {
        return <ServerErrorPage />;
    }

    return (
        <>
            {hasRated && userRating ? (
                <YourReview userRating={userRating} />
            ) : (
                <ProductRatingForm productId={id} />
            )}

            <ProductReviews ratings={ratings} />
        </>
    );
};


const YourReview = ({ userRating }) => {
    return (

        <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Your Review
            </h2>
            <div className="space-y-6">
                <div className="border-b pb-4">
                    <div className="flex items-center space-x-2">
                        <p className="text-yellow-500 text-xl">{'★'.repeat(userRating.rating)}</p>
                        <p className="text-sm text-gray-500">({userRating.rating}/5)</p>
                    </div>
                    <p className="text-gray-700 mt-2">{userRating.review}</p>

                </div>
            </div>
        </div>
    );
};

const ProductReviews = ({ ratings }) => {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Customer Reviews
            </h2>
            {ratings?.length > 0 ? (
                <>
                    <div className="space-y-6">
                        {ratings.map((review, index) => (
                            <div key={index} className="border-b pb-4">
                                <div className="flex items-center space-x-2">
                                    <p className="text-yellow-500 text-xl">{'★'.repeat(review.rating)}</p>
                                    <p className="text-sm text-gray-500">({review.rating}/5)</p>
                                </div>
                                <p className="text-gray-700 mt-2">{review.review}</p>
                                <p className="text-sm text-gray-500 mt-2">- {review.user.name}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-gray-500">No reviews found</p>
            )}
        </div>
    );
};


export default Page;