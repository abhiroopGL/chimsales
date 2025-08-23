import { useState } from "react";
import { MapPin, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Directions = () => {
    const [open, setOpen] = useState(false);

    const latitude = 29.322487;
    const longitude = 47.934133;

    const handleDirections = () => {
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
            "_blank"
        );
    };

    return (
        <div
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 pointer-events-auto"
            style={{ position: "fixed" }}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="p-3 bg-black text-white rounded-full shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center"
            >
                {open ? <ChevronRight size={20} /> : <MapPin size={20} />}
            </button>

            {/* Expandable Action */}
            <AnimatePresence>
                {open && (
                    <motion.button
                        onClick={handleDirections}
                        className="flex items-center gap-2 bg-black text-white rounded-full shadow-xl overflow-hidden h-10 p-2"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        {/* Icon stays fixed */}
                        <MapPin className="w-5 h-5 flex-shrink-0" />

                        {/* Text animates separately */}
                        <motion.span
                            className="text-sm font-medium"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            Directions
                        </motion.span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Directions;
