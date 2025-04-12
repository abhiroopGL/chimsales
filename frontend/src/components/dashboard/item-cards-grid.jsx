import ItemCard from "./item-card.jsx";

const products = [
    { id: 1, title: "Chimney X1", price: "₹12,999", image: "/chimney1.jpg" },
    { id: 2, title: "Chimney X2", price: "₹15,499", image: "/chimney2.jpg" },
    { id: 3, title: "Chimney X3", price: "₹10,999", image: "/chimney3.jpg" },
];

export default function ItemCardsGrid() {
    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
                <ItemCard key={product.id} product={product} />
            ))}
        </div>
    );
}