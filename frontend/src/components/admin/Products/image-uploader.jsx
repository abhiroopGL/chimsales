import { useRef } from "react";
import { Plus } from "lucide-react"; // or any plus icon you like

const ImageUploader = ({ images, setImages }) => {
    const fileInputRef = useRef();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prev) => [...prev, ...files]);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="flex flex-wrap gap-4">
            {images.map((img, idx) => (
                <div key={idx} className="w-24 h-24 rounded-lg border flex items-center justify-center overflow-hidden">
                    <img
                        src={typeof img === "string" ? img : URL.createObjectURL(img)}
                        alt="preview"
                        className="object-cover w-full h-full"
                    />
                </div>
            ))}
            <div
                onClick={triggerFileInput}
                className="w-24 h-24 rounded-lg border-dashed border-2 flex items-center justify-center cursor-pointer hover:bg-gray-100"
            >
                <Plus size={32} />
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default ImageUploader;
