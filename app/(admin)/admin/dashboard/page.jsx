"use client"

import { StatCardLoader } from "@/components/loader/statsCardLoader";
import { StatCard } from "@/components/stats-card";
import { fetchBrand } from "@/lib/features/brand";
import { fetchOrders } from "@/lib/features/order";
import { fetchProducts } from "@/lib/features/product";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { TabletSmartphone, ShoppingBag, Shapes } from "lucide-react";
import React, { useEffect } from "react";

const Page = () => {
  const dispatch = useAppDispatch();

  const { total: brandTotal, isLoading: brandLoading } = useAppSelector((state) => state.brand);
  const { total: productTotal, isLoading: productLoading } = useAppSelector((state) => state.product);
  const { total: orderTotal, isLoading: orderLoading } = useAppSelector((state) => state.order); // corrected to 'order'

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 1 }));
    dispatch(fetchOrders({ page: 1, limit: 1 }));
    dispatch(fetchBrand());
  }, [dispatch]);

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {productLoading ? (
          <StatCardLoader />
        ) : (
          <StatCard icon={TabletSmartphone} title="Total Products" value={productTotal} />
        )}

        {orderLoading ? (
          <StatCardLoader />
        ) : (
          <StatCard icon={ShoppingBag} title="Total Orders" value={orderTotal} />
        )}

        {brandLoading ? (
          <StatCardLoader />
        ) : (
          <StatCard icon={Shapes} title="Total Brands" value={brandTotal} />
        )}
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="w-full bg-gray-50 rounded py-2 px-2 mb-4 border-b">
      <div className="flex h-16 items-center px-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
    </div>
  );
};

export default Page;
