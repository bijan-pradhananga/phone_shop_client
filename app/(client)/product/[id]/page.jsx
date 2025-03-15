"use client";
import NotFoundPage from '@/components/design/404notFound';
import ProductActionBtns from '@/components/product-action-btns';
import { Button } from '@/components/ui/button';
import ProductImages from '@/components/image-container';
import { addViewedProducts, fetchSingleProduct } from '@/lib/features/product';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import SingleProductLoader from '@/components/loader/single-product-loader';
import { fetchRatings } from '@/lib/features/rating';
import SimilarProductSection from '@/components/similar-products';
import Link from 'next/link';
import ServerErrorPage from '@/components/design/serverError';
import { useSession } from 'next-auth/react';

const Page = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { singleData, error, singleLoading } = useAppSelector((state) => state.product);
  const { ratings } = useAppSelector((state) => state.rating)
  const params = useParams();
  const id = params.id;

  if (!id) {
    return <NotFoundPage />;
  }

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
    dispatch(fetchRatings(id));
    if (session) {
      dispatch(addViewedProducts({productId:id,userId:session.user.id}))
    }
  }, [dispatch, id]);

  if (error) {
    return <ServerErrorPage />;
  }

  return (
    <>
      <main className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16 md:mt-10 mb-20">
        {singleLoading ? (
          <SingleProductLoader />
        ) : (
          <>
            <ProductImages name={singleData.name} images={singleData.images} />
            <ProductDescription product={singleData} ratings={ratings} />

          </>
        )}
      </main>

      {!singleLoading && singleData?.name && (
        <>
          <ProductReviews ratings={ratings} productId={id} />
          <SimilarProductSection phone_model={singleData.name} />
        </>
      )}
    </>
  );
};

const ProductDescription = ({ product, ratings }) => {
  // Fallback for missing specifications
  const specifications = product.specifications || {};

  return (
    <div className="mt-6 sm:mt-8 lg:mt-0">
      {/* Product Name */}
      <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
        {product.name}
      </h1>

      {/* Product Price */}
      <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
        <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
          Rs.{product.price}
        </p>
      </div>

      {/* Rating Section */}
      <ProductRating product={product} />

      {/* Action Buttons */}
      <ProductActionBtns product={product} />

      {/* Processor and Brand */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-md text-gray-700 dark:text-gray-400">
            Brand:
          </span>
          <Button variant="secondary" className="font-semibold">
            {product.brand?.name || "N/A"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-md text-gray-700 dark:text-gray-400">
            Processor:
          </span>
          <Button variant="secondary" className="font-semibold">
            {specifications.processor || "N/A"}
          </Button>
        </div>
      </div>

      {/* Separator */}
      <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />


      {/* Specifications Section */}
      <ProductSpecs specifications={specifications} />

      {/* Separator */}
      <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

      {/* Reviews Section */}
      <Link href={`/product/${product._id}/review`}>
        <span className="mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm">
          Rate This Product
        </span>
      </Link>

    </div>
  );
};

const ProductSpecs = ({ specifications }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Specifications
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* RAM Capacity */}
        <div className="flex items-center gap-2">
          <span className="text-md text-gray-700 dark:text-gray-400">
            RAM Capacity:
          </span>
          <span className="font-semibold">
            {specifications.ram_capacity || "N/A"} GB
          </span>
        </div>

        {/* Internal Memory */}
        <div className="flex items-center gap-2">
          <span className="text-md text-gray-700 dark:text-gray-400">
            Internal Memory:
          </span>
          <span className="font-semibold">
            {specifications.internal_memory || "N/A"} GB
          </span>
        </div>

        {/* Screen Size */}
        <div className="flex items-center gap-2">
          <span className="text-md text-gray-700 dark:text-gray-400">
            Screen Size:
          </span>
          <span className="font-semibold">
            {specifications.screen_size || "N/A"} inches
          </span>
        </div>

        {/* Battery Capacity */}
        <div className="flex items-center gap-2">
          <span className="text-md text-gray-700 dark:text-gray-400">
            Battery Capacity:
          </span>
          <span className="font-semibold">
            {specifications.battery_capacity || "N/A"} mAh
          </span>
        </div>

        {/* Primary Camera (Rear) */}
        <div className="flex items-center gap-2">
          <span className="text-md text-gray-700 dark:text-gray-400">
            Primary Camera (Rear):
          </span>
          <span className="font-semibold">
            {specifications.primary_camera_rear || "N/A"} MP
          </span>
        </div>

        {/* Primary Camera (Front) */}
        <div className="flex items-center gap-2">
          <span className="text-md text-gray-700 dark:text-gray-400">
            Primary Camera (Front):
          </span>
          <span className="font-semibold">
            {specifications.primary_camera_front || "N/A"} MP
          </span>
        </div>
      </div>
    </div>
  )
}

const ProductRating = ({ product }) => {
  return (
    <div className="mt-4 flex items-center">
      {/* Star Rating */}
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(product.averageRating);
          return (
            <span
              key={index}
              className={`text-${isFilled ? 'yellow-500' : 'gray-300'} text-xl`}
            >
              ★
            </span>
          );
        })}
      </div>
      {/* Rating Text */}
      <span className="ml-2 text-gray-600">
        ({product.averageRating.toFixed(1)} out of {product.totalRatings} reviews)
      </span>
    </div>
  )
}

const ProductReviews = ({ ratings, productId }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Customer Reviews
      </h2>
      {ratings?.length > 0 ? (
        <>
          <div className="space-y-6">
            {ratings.slice(0, 3).map((review, index) => (
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
          <Link href={`/product/${productId}/review`}>
            <span className="mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm">
              Read all {ratings.length} reviews
            </span>
          </Link>
        </>
      ) : (
        <p className="text-gray-500">No reviews found</p>
      )}
    </div>
  );
};


export default Page;