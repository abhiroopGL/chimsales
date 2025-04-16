import HeroBanner from "../../components/dashboard/hero-banner.jsx";
import FilterChips from "../../components/dashboard/filter-chips.jsx";
import ItemCardsGrid from "../../components/dashboard/item-cards-grid.jsx";
import SuggestedCarousel from "../../components/dashboard/suggested-carousel.jsx";
import Footer from "../../components/footer.jsx";
export default function Dashboard() {
    return (
        <div className="bg-white min-h-screen text-black">
            <HeroBanner />
            <FilterChips />
            <ItemCardsGrid />
            <SuggestedCarousel />
            <Footer />
        </div>
    );
}
