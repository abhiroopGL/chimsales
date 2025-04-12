import { useState } from 'react';
import ImageGrid from "./image-grid.jsx";

const ImageSection = ({ images }) => {
    const [mainImage, setMainImage] = useState(images[0]);

    return (
        <div className="flex flex-col items-center">
            <img
                src={mainImage}
                alt="Main product"
                className="w-full max-w-md border-4 border-black rounded-lg mb-6 transition-all duration-300"
            />
            <ImageGrid
                images={images}
                mainImage={mainImage}
                setMainImage={setMainImage}
            />
        </div>
    );
};

export default ImageSection;
