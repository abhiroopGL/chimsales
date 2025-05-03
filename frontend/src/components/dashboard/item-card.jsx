import { Link } from 'react-router-dom';

const ItemCard = ({ product }) => {
    return (
        <Link to={`/item/${product.id}`} className="block">
            <div className="bg-white text-black p-6 rounded-lg shadow-md hover:scale-105 transform transition duration-300">
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-lg font-bold">{product.price}</p>
            </div>
        </Link>
    );
};

export default ItemCard;
