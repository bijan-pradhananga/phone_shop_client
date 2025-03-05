"use client";
import { useState } from "react";

const ProductImages = ({ name, images }) => {
    // Fallback image URL (located in the public folder)
    const noImageUrl = '/noImage.png';

    // Ensure images is an array and has at least one image, otherwise use the fallback
    const validImages = images && images.length > 0 ? images : [noImageUrl];

    // Initialize selectedImage with the first image from validImages
    const [selectedImage, setSelectedImage] = useState(validImages[0]);

    return (
        <div className="shrink-0 w-full max-w-md lg:max-w-lg mx-auto">
            {/* Main Image */}
            <div className="flex justify-center items-center w-full max-w-md lg:min-w-[500px] aspect-square border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                <img
                    className="w-full h-full object-contain"
                    src={selectedImage}
                    alt={name}
                />
            </div>

            {/* Thumbnail Images */}
            <div className="mt-4 flex gap-2 justify-center">
                {validImages.map((image, index) => (
                    <img
                        key={index}
                        className={`w-16 h-16 object-cover border rounded-md cursor-pointer ${selectedImage === image ? "border-indigo-500 ring-2 ring-indigo-500" : "border-gray-200"
                            }`}
                        src={image}
                        alt={`${name} ${index + 1}`}
                        onClick={() => setSelectedImage(image)} // Change main image on click
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductImages;