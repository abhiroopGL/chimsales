import { FaTrash } from 'react-icons/fa'; // react-icons for the delete icon
import useAppNavigation from '../../../hooks/useAppNavigation.jsx'; // Adjust path as needed

const ProductCard = ({ product, onDelete }) => {
    const { goToEditProduct } = useAppNavigation();

    const handleCardClick = () => {
        console.log("Going to edit product with id:", product._id);
        goToEditProduct(product._id);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Prevent triggering the edit when clicking delete
        onDelete(product._id);
    };

    return (
        <div
            className="border rounded-xl shadow hover:shadow-lg transition-all cursor-pointer p-4 bg-white flex flex-col relative group"
            onClick={handleCardClick}
        >
            <img
                src={product.images?.[0]}
                alt={product.name}
                className="h-48 w-full object-cover rounded-md mb-4"
            />

            {/* Status Tag */}
            <div className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full 
                ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}
            `}>
                {product.status === 'active' ? 'Active' : 'Draft'}
            </div>

            {/* Delete Button */}
            <button
                onClick={handleDeleteClick}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-2 bg-white rounded-full shadow group-hover:shadow-md transition"
            >
                <FaTrash size={16} />
            </button>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                <p className="text-gray-700 font-semibold">${product.price}</p>
            </div>
        </div>
    );
};

export default ProductCard;
