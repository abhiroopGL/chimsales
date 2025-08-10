const Footer = () => {
  return (
    <footer className="bg-black text-white w-full px-6 py-10 mt-10 font-sans">
      <div className="grid md:grid-cols-2 gap-8 text-sm mb-10">
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            {[
              { href: "/about", label: "About Us" },
              { href: "#team", label: "Our Team" },
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
            {[
              { href: "#help", label: "Help Center" },
              { href: "#returns", label: "Returns" },
              { href: "#warranty", label: "Warranty Info" },
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
      </div>

      <div className="text-center text-xs text-gray-400 mt-8 select-none">
        &copy; {new Date().getFullYear()} Chimney Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
