const ProductInfo = ({ name, price }) => (
    <div>
        <h2 className="text-3xl font-bold text-black">{name}</h2>
        <p className="text-2xl text-gray-800 mt-2">{price}</p>
    </div>
);

export default ProductInfo;
