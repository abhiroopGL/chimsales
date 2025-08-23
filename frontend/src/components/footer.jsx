import { useState, useEffect, useRef } from "react"

const Footer = () => {
    const supportLinks = [
        { href: "/contact", label: "Help Center" },
        { href: "#returns", label: "Returns", tooltip: "Coming soon — feature not available yet." },
        { href: "#warranty", label: "Warranty Info", tooltip: "Coming soon — feature not available yet." },
    ];

    const [visibleTooltip, setVisibleTooltip] = useState(null);
    const tooltipRef = useRef(null);

    const handleTap = (label, e) => {
        e.preventDefault();
        setVisibleTooltip((prev) => (prev === label ? null : label));
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target)
            ) {
                setVisibleTooltip(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [tooltipRef]);

    return (
        <footer className="bg-black text-white w-full px-6 py-10 mt-10 font-sans">
            <div className="grid md:grid-cols-2 gap-8 text-sm mb-10">
                <div>
                    <h3 className="font-semibold mb-4">Company</h3>
                    <ul className="space-y-2">
                        {[
                            { href: "/about", label: "About Us" },
                            { href: "/about", label: "Our Team" },
                            { href: "#careers", label: "Careers" },
                        ].map(({ href, label }) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    className="underline-grow text-white hover:text-gray-300 transition-colors duration-300 transform hover:scale-105 inline-block"
                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Support</h3>
                    <ul className="space-y-2">
                        {supportLinks.map(({ href, label, tooltip }) => (
                            <li key={label} className="relative" ref={visibleTooltip === label ? tooltipRef : null}>
                                {tooltip ? (
                                    <>
                                        <a
                                            href={href}
                                            onClick={(e) => handleTap(label, e)}
                                            className="underline-grow text-white cursor-pointer inline-block"
                                        >
                                            {label}
                                        </a>
                                        {visibleTooltip === label && (
                                            <div className="absolute z-50 bg-gray-800 text-gray-200 text-xs rounded px-3 py-1 mt-1 max-w-xs left-0 shadow-lg">
                                                {tooltip}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <a
                                        href={href}
                                        className="underline-grow text-white hover:text-gray-300 transition-colors duration-300 transform hover:scale-105 inline-block"
                                    >
                                        {label}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="text-center text-xs text-gray-400 mt-8 select-none">
                &copy; {new Date().getFullYear()} Metal Co Steel Kuwait. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
