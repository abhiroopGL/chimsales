import { useState } from "react";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const Directions = () => {
    const [open, setOpen] = useState(false);

    const latitude = 29.322487;
    const longitude = 47.934133;

    const handleDirections = () => {
        // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
            "_blank"
        );
    };

    return (
        <div
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 pointer-events-auto"
            style={{ position: "fixed" }} // force mobile browsers
        >
            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="p-3 bg-black text-white rounded-full shadow-xl hover:bg-gray-800 transition-all"
            >
                {open ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Expandable Action */}
            {open && (
                <button
                    onClick={handleDirections}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full shadow-xl hover:bg-gray-800 transition-all"
                >
                    <MapPin className="w-5 h-5" />
                    Directions
                </button>
            )}
        </div>
    );
};

export default Directions;
