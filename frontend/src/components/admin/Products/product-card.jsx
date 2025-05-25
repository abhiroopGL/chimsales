// product-card.jsx
import { FaTrash, FaUndoAlt } from 'react-icons/fa'; // Add FaUndoAlt import
import useAppNavigation from '../../../hooks/useAppNavigation.jsx';

const ProductCard = ({ product, onDelete, onRestore }) => { // Add onRestore prop
    const { goToEditProduct } = useAppNavigation();

    const handleCardClick = () => {
        goToEditProduct(product._id);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(product._id);
    };

    const handleRestoreClick = (e) => {
        e.stopPropagation();
        onRestore(product._id);
    };

    // Function to determine status tag styling
    const getStatusStyles = () => {
        if (product.deleted) {
            return 'bg-red-100 text-red-700';
        }
        switch (product.status) {
            case 'published':
                return 'bg-green-100 text-green-700';
            case 'draft':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-200 text-gray-700';
        }
    };

    // Function to get status text
    const getStatusText = () => {
        if (product.deleted) return 'Deleted';
        return product.status === 'published' ? 'Active' : 'Draft';
    };

    return (
        <div
            className={`border rounded-xl shadow hover:shadow-lg transition-all cursor-pointer p-4 bg-white flex flex-col relative group
                ${product.deleted ? 'opacity-75' : 'opacity-100'}`}
            onClick={handleCardClick}
        >
            <img
                src={product.images?.[0] || '/placeholder-image.jpg'} // Add a fallback image
                alt={product.name}
                className="h-48 w-full object-cover rounded-md mb-4"
            />

            {/* Status Tag */}
            <div className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles()}`}>
                {getStatusText()}
            </div>

            {/* Delete/Restore Button */}
            <button
                onClick={product.deleted ? handleRestoreClick : handleDeleteClick}
                className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow group-hover:shadow-md transition
                    ${product.deleted
                    ? 'text-blue-500 hover:text-blue-700'
                    : 'text-red-500 hover:text-red-700'}`}
                title={product.deleted ? 'Restore Product' : 'Delete Product'}
            >
                {product.deleted ? <FaUndoAlt size={16} /> : <FaTrash size={16} />}
            </button>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-semibold">${product.price}</p>
                    {product.deletedAt && (
                        <p className="text-xs text-gray-500">
                            Deleted: {new Date(product.deletedAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;