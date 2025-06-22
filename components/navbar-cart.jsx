"use client"

import { fetchCart } from "@/lib/features/cart";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ShoppingCart } from "lucide-react"
import Link from "next/link";
import { useEffect } from "react";

const NavbarCart = ({session}) => {
    const dispatch = useAppDispatch();
    const { total } = useAppSelector((state) => state.cart);
    const HandleFetchCart = async () => {
  
        if (session && session.user.id) {
            const userId = session.user.id;
            dispatch(fetchCart(userId));
        }
    }

    useEffect(() => {
        HandleFetchCart();
    }, [dispatch]);

    return (
        <li className="relative">
            <Link
                href="/cart"
                className="flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
                <ShoppingCart className="w-5" />
                {total > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {total}
                    </span>
                )}
            </Link>
        </li>
    )
}

export default NavbarCart