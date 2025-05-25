// src/components/admin/Products/filter-tabs.jsx
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../../redux/slices/productSlice.jsx";

const FilterTabs = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.products.filter);

    const handleFilterChange = (newFilter) => {
        dispatch(setFilter(newFilter));
    };

    return (
        <div className="flex gap-4 mb-6">
            <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 rounded-md transition-all duration-200
                    ${filter === "all"
                    ? "bg-black text-white"
                    : "bg-white text-black border border-black hover:bg-gray-100"}`}
            >
                All Products
            </button>
            <button
                onClick={() => handleFilterChange("published")}
                className={`px-4 py-2 rounded-md transition-all duration-200
                    ${filter === "published"
                    ? "bg-black text-white"
                    : "bg-white text-black border border-black hover:bg-gray-100"}`}
            >
                Published
            </button>
            <button
                onClick={() => handleFilterChange("draft")}
                className={`px-4 py-2 rounded-md transition-all duration-200
                    ${filter === "draft"
                    ? "bg-black text-white"
                    : "bg-white text-black border border-black hover:bg-gray-100"}`}
            >
                Drafts
            </button>
            <button
                onClick={() => handleFilterChange("archived")}
                className={`px-4 py-2 rounded-md transition-all duration-200
                    ${filter === "archived"
                    ? "bg-black text-white"
                    : "bg-white text-black border border-black hover:bg-gray-100"}`}
            >
                Archived
            </button>
        </div>
    );
};

export default FilterTabs;