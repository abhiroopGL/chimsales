import HeroBanner from "../../components/dashboard/hero-banner.jsx";
import FilterChips from "../../components/dashboard/filter-chips.jsx";
import ItemCardsGrid from "../../components/dashboard/item-cards-grid.jsx";
import SuggestedCarousel from "../../components/dashboard/suggested-carousel.jsx";
import Footer from "../../components/footer.jsx";
import LoggedInUser from "../../components/dashboard/loggedInUser.jsx";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {fetchPublicProducts} from '../../redux/slices/productSlice.jsx'

export default function Dashboard() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPublicProducts());
    }, [])

    return (
        <div className="bg-white min-h-screen text-black">
            <HeroBanner />
            <div className="flex justify-between items-center px-6 py-4">
                <FilterChips />
                <LoggedInUser />
            </div>
            <ItemCardsGrid />
            <SuggestedCarousel />
            <Footer />
        </div>
    );
}
