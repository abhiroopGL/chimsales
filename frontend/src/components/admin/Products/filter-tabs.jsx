import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProducts } from "../../../redux/slices/productSlice.jsx";

const FilterTabs = () => {
    const dispatch = useDispatch();
    const { filter } = useSelector(state => state.products);

    const handleFilterChange = (newFilter) => {
        dispatch(setFilter(newFilter));
        dispatch(fetchPublicProducts(newFilter));
    };

    return (
        <div className="flex gap-4 mb-6">
            <button onClick={() => handleFilterChange("active")} className={filter === "active" ? "font-bold" : ""}>
                Active
            </button>
            <button onClick={() => handleFilterChange("deleted")} className={filter === "deleted" ? "font-bold" : ""}>
                Deleted
            </button>
        </div>
    );
};

export default FilterTabs;
