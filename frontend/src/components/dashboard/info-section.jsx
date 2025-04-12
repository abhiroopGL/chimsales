export default function InfoSection() {
    return (
        <div className="bg-black text-white px-4 py-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Our Chimneys?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div>
                    <h4 className="text-xl font-semibold mb-2">Silent Operation</h4>
                    <p className="text-sm">Less noise. More peace while cooking.</p>
                </div>
                <div>
                    <h4 className="text-xl font-semibold mb-2">Auto Clean</h4>
                    <p className="text-sm">Hassle-free maintenance with advanced tech.</p>
                </div>
                <div>
                    <h4 className="text-xl font-semibold mb-2">Modern Design</h4>
                    <p className="text-sm">A chimney that fits into your stylish kitchen.</p>
                </div>
            </div>
        </div>
    );
}