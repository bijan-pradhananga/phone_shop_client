import { useAppDispatch } from '@/lib/hooks';
import { checkUserRating, deleteRating, fetchRatings } from '@/lib/features/rating';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Import shadcn/ui dropdown components


const YourReview = ({ userRating, userId, productId }) => {
    const dispatch = useAppDispatch();

    if (!userRating) {
        return null; // Don't render if userRating is not available
    }

    const handleRemoveReview = async () => {
        if (window.confirm('Are you sure you want to delete your review?')) {
            const result = await
                dispatch(deleteRating({
                    userId,
                    productId
                }));
            if (deleteRating.fulfilled.match(result)) {
                dispatch(fetchRatings(productId));
                dispatch(checkUserRating({
                    userId,
                    productId
                }))
            }
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Your Review
            </h2>
            <div className="space-y-6">
                <div className="border-b pb-4">
                    <div className="flex justify-between">
                        <div className='flex items-center space-x-2'>
                            <p className="text-yellow-500 text-xl">{'★'.repeat(userRating.rating)}</p>
                            <p className="text-sm text-gray-500">({userRating.rating}/5)</p>
                        </div>
                        {/* Dropdown Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="text-2xl font-bold hover:text-gray-700 focus:outline-none">
                                ...
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-auto p-0" // Adjust width to match content
                                align="end" // Align dropdown to the end of the trigger
                                sideOffset={8} // Move dropdown slightly down
                            >
                                <DropdownMenuItem
                                    onClick={handleRemoveReview}
                                    className="flex items-center space-x-2 text-red-500 hover:bg-gray-100 cursor-pointer px-4 py-2"
                                >
                                    <span>Delete Review</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <p className="text-gray-700 mt-2">{userRating.review}</p>
                </div>
            </div>
        </div>
    );
};

export default YourReview;