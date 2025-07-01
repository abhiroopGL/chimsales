import { motion } from 'framer-motion';

const ProductInfo = ({ name, price }) => (
    <div>
        <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-black"
        >
            {name}
        </motion.h2>
        <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl text-gray-800 mt-2"
        >
            ${price}
        </motion.p>
    </div>
);

export default ProductInfo;