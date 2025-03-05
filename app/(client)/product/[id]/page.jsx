"use client"
import NotFoundPage from '@/components/design/404notFound';
import ProductActionBtns from '@/components/product-action-btns';
import { Button } from '@/components/ui/button';
import ProductImages from '@/components/image-container';
import { fetchSingleProduct } from '@/lib/features/product';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import SingleProductLoader from '@/components/loader/single-product-loader';

const Page = () => {
  const dispatch = useAppDispatch();
  const { singleData, error, singleLoading } = useAppSelector((state) => state.product);
 
  const params = useParams()
  const id = params.id;
  
  if (!id) {
    return <NotFoundPage />
  }
  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch,id]);

  if (error) {
    return <NotFoundPage />
  }
  return (
    <main className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16 md:mt-10 mb-20">
      {singleLoading ? (
        <SingleProductLoader />
      ) : (
        <>
          <ProductImages name={singleData.name} images={singleData.images} />
          <ProductDescription product={singleData}  />
        </>
      )}

    </main>

  )
}


const ProductDescription = ({ product }) => {
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

      {/* Action Buttons */}
      <ProductActionBtns product={product} />

      {/* Processor and Brand */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-md text-gray-700 dark:text-gray-400">
            Brand:
          </span>
          <Button variant="secondary" className="font-semibold">
            {product.brand.name}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-md text-gray-700 dark:text-gray-400">
            Processor:
          </span>
          <Button variant="secondary" className="font-semibold">
            {product.specifications.processor}
          </Button>
        </div>
      </div>

      {/* Separator */}
      <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

      {/* Product Description */}
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        {product.description}
      </p>

      {/* Specifications Section */}
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
              {product.specifications.ram_capacity} GB
            </span>
          </div>

          {/* Internal Memory */}
          <div className="flex items-center gap-2">
            <span className="text-md text-gray-700 dark:text-gray-400">
              Internal Memory:
            </span>
            <span className="font-semibold">
              {product.specifications.internal_memory} GB
            </span>
          </div>

          {/* Screen Size */}
          <div className="flex items-center gap-2">
            <span className="text-md text-gray-700 dark:text-gray-400">
              Screen Size:
            </span>
            <span className="font-semibold">
              {product.specifications.screen_size} inches
            </span>
          </div>

          {/* Battery Capacity */}
          <div className="flex items-center gap-2">
            <span className="text-md text-gray-700 dark:text-gray-400">
              Battery Capacity:
            </span>
            <span className="font-semibold">
              {product.specifications.battery_capacity} mAh
            </span>
          </div>

          {/* Primary Camera (Rear) */}
          <div className="flex items-center gap-2">
            <span className="text-md text-gray-700 dark:text-gray-400">
              Primary Camera (Rear):
            </span>
            <span className="font-semibold">
              {product.specifications.primary_camera_rear} MP
            </span>
          </div>

          {/* Primary Camera (Front) */}
          <div className="flex items-center gap-2">
            <span className="text-md text-gray-700 dark:text-gray-400">
              Primary Camera (Front):
            </span>
            <span className="font-semibold">
              {product.specifications.primary_camera_front} MP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Page