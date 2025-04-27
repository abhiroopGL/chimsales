const ProductCard = ({ product, onEdit, onDelete }) => {
    return (
        <div className="border rounded-lg shadow-md p-4 bg-white flex flex-col">
            <img src={product.images?.[0]} alt={product.name} className="h-40 object-cover rounded-md mb-2" />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p>${product.price}</p>
            <div className="flex justify-between mt-4">
                <button onClick={() => onEdit(product)} className="text-blue-500">Edit</button>
                <button onClick={() => onDelete(product._id)} className="text-red-500">Delete</button>
            </div>
        </div>
    );
};

export default ProductCard;
