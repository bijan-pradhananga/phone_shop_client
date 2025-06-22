"use client";

import { StatCardLoader } from "@/components/loader/statsCardLoader";
import { StatCard } from "@/components/stats-card";
import { fetchBrand } from "@/lib/features/brand";
import { fetchOrders } from "@/lib/features/order";
import { fetchProducts } from "@/lib/features/product";
import { fetchPaymentStats, fetchPaymentsByDate } from "@/lib/features/payment";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { TabletSmartphone, ShoppingBag, Shapes } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const Page = () => {
  const dispatch = useAppDispatch();
  const statsChartRef = useRef(null);
  const dateChartRef = useRef(null);
  const statsCanvasRef = useRef(null);
  const dateCanvasRef = useRef(null);
  const [groupBy, setGroupBy] = useState('month');

  const { total: brandTotal, isLoading: brandLoading } = useAppSelector((state) => state.brand);
  const { total: productTotal, isLoading: productLoading } = useAppSelector((state) => state.product);
  const { total: orderTotal, isLoading: orderLoading } = useAppSelector((state) => state.order);
  const { chartData, dateChartData, isLoading: paymentLoading, error: paymentError } = useAppSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 1 }));
    dispatch(fetchOrders({ page: 1, limit: 1 }));
    dispatch(fetchBrand());
    dispatch(fetchPaymentStats());
    dispatch(fetchPaymentsByDate({ groupBy }));
  }, [dispatch, groupBy]);

  useEffect(() => {
    if (chartData && statsCanvasRef.current) {
      const chartDataCopy = JSON.parse(JSON.stringify(chartData));
      if (statsChartRef.current) {
        statsChartRef.current.destroy();
      }
      const ctx = statsCanvasRef.current.getContext("2d");
      statsChartRef.current = new Chart(ctx, {
        type: "bar",
        data: chartDataCopy,
        options: { ...chartDataCopy.options, responsive: true, maintainAspectRatio: false },
      });
    }
    return () => {
      if (statsChartRef.current) {
        statsChartRef.current.destroy();
      }
    };
  }, [chartData]);

  useEffect(() => {
    if (dateChartData && dateCanvasRef.current) {
      const chartDataCopy = JSON.parse(JSON.stringify(dateChartData));
      if (dateChartRef.current) {
        dateChartRef.current.destroy();
      }
      const ctx = dateCanvasRef.current.getContext("2d");
      dateChartRef.current = new Chart(ctx, {
        type: "bar", // Changed to bar chart
        data: chartDataCopy,
        options: { ...chartDataCopy.options, responsive: true, maintainAspectRatio: false },
      });
    }
    return () => {
      if (dateChartRef.current) {
        dateChartRef.current.destroy();
      }
    };
  }, [dateChartData]);

  const handleGroupByChange = (e) => {
    setGroupBy(e.target.value);
  };

  return (
    <div className="p-4">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Statistics</h2>
        {paymentLoading ? (
          <StatCardLoader />
        ) : paymentError ? (
          <div className="text-red-500">Error: {paymentError}</div>
        ) : (
          <div className="w-full" style={{ height: "300px" }}>
            <canvas ref={statsCanvasRef} id="paymentStatsChart"></canvas>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payments Over Time</h2>
          <select
            value={groupBy}
            onChange={handleGroupByChange}
            className="border rounded p-2"
          >
            <option value="day">By Day</option>
            <option value="month">By Month</option>
            <option value="year">By Year</option>
          </select>
        </div>
        {paymentLoading ? (
          <StatCardLoader />
        ) : paymentError ? (
          <div className="text-red-500">Error: {paymentError}</div>
        ) : (
          <div className="w-full" style={{ height: "300px" }}>
            <canvas ref={dateCanvasRef} id="paymentDateChart"></canvas>
          </div>
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