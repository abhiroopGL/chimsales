import { motion } from 'framer-motion';
// import { FaArrowDown } from 'react-icons/fa';

const HeroBanner = () => {
    return (
        <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center text-center p-6">
            <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-6xl font-bold mb-4"
            >
                Discover the Best Chimneys
            </motion.h1>
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg md:text-xl mb-8 max-w-2xl"
            >
                Elevate your kitchen with our premium range of chimneys.
            </motion.p>
            <motion.a
                href="#filter-chips"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-6 py-3 rounded-full shadow-md hover:bg-black hover:text-white border border-white transition duration-300 flex items-center gap-2"
            >
                Discover Now
            </motion.a>
        </div>
    );
};

export default HeroBanner;
