import { useNavigate } from "react-router-dom";

const ProductList = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div
            className="bg-black text-white p-4 rounded-xl shadow-md hover:scale-105 transition-all cursor-pointer"
            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
        >
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm">₹{product.price}</p>
        </div>
    );
};

export default ProductList;
