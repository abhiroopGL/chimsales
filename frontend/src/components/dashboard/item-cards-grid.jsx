import ItemCard from "./item-card.jsx";
import {useSelector} from "react-redux";

export default function ItemCardsGrid() {
    const products = useSelector(state => state.products.publicProducts);
    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
                <ItemCard key={product._id} product={product} />
            ))}
        </div>
    );
}