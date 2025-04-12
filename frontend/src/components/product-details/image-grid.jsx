import React from 'react';

const ImageGrid = ({ images, mainImage, setMainImage }) => (
    <div className="grid grid-cols-4 gap-4">
        {images.map((image, idx) => (
            <img
                key={idx}
                src={image}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setMainImage(image)}
                className={`w-full h-20 object-cover cursor-pointer rounded-md border-2 transition-all ${
                    mainImage === image ? 'border-black' : 'border-gray-300'
                }`}
            />
        ))}
    </div>
);

export default ImageGrid;
