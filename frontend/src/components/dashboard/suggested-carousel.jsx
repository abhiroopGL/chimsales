export default function SuggestedCarousel() {
    return (
        <div className="px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Suggested for You</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="min-w-[200px] bg-black text-white p-4 rounded-xl hover:bg-white hover:text-black transition-colors duration-300 border border-black cursor-pointer"
                    >
                        Chimney {i}
                    </div>
                ))}
            </div>
        </div>
    );
}