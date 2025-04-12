import { useState } from "react";

const chips = ["All", "Wall-Mounted", "Auto Clean", "Island", "Top Rated"];

export default function FilterChips({ onSelect }) {
    const [selected, setSelected] = useState("All");

    return (
        <div id="filter-chips" className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-hide bg-white">
            {chips.map((chip) => (
                <button
                    key={chip}
                    onClick={() => {
                        setSelected(chip);
                        if (onSelect) onSelect(chip);
                    }}
                    className={`px-4 py-1 border rounded-full transition-colors duration-300 whitespace-nowrap text-sm md:text-base font-medium hover:bg-black hover:text-white active:scale-95 ${
                        selected === chip ? "bg-black text-white" : "text-black border-black"
                    }`}
                >
                    {chip}
                </button>
            ))}
        </div>
    );
}