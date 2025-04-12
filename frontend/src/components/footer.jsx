const Footer = () => {
    return (
        <footer className="bg-black text-white w-full px-6 py-10 mt-10">
            <div className="bg-black text-white px-4 py-12 text-center mb-10">
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
            <div className="grid md:grid-cols-2 gap-8 text-sm mb-10">
                <div>
                    <h3 className="font-semibold mb-2">Company</h3>
                    <ul className="space-y-1">
                        <li><a href="#about" className="hover:underline">About Us</a></li>
                        <li><a href="#team" className="hover:underline">Our Team</a></li>
                        <li><a href="#careers" className="hover:underline">Careers</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Support</h3>
                    <ul className="space-y-1">
                        <li><a href="#help" className="hover:underline">Help Center</a></li>
                        <li><a href="#returns" className="hover:underline">Returns</a></li>
                        <li><a href="#warranty" className="hover:underline">Warranty Info</a></li>
                    </ul>
                </div>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <address className="not-italic">
                    <ul className="space-y-1">
                        <li>Email: <a href="mailto:support@chimneystore.com" className="hover:underline">support@chimneystore.com</a></li>
                        <li>Phone: <a href="tel:+1234567890" className="hover:underline">+123-456-7890</a></li>
                        <li>Address: 123 Flame Street, Kitchen City</li>
                    </ul>
                </address>
            </div>
            <div className="text-center text-xs text-gray-400 mt-8">
                &copy; {new Date().getFullYear()} Chimney Store. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
