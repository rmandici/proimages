import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-opacity-0 text-white">
      <div className="px-6 py-4 flex items-center justify-between w-full">
        {/* Titlu */}
        <div className=" text-xl font-bold">
          PROIMAGES
          <div>Eduard Vinatoru</div>
        </div>

        {/* Hamburger (mobil) */}
        <button
          className="sm:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Meniu Desktop */}
        <nav className="hidden sm:flex space-x-6 text-white font-semibold">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/portfolio" className="hover:text-gray-300">
            Portfolio
          </Link>
          <Link to="/contact" className="hover:text-gray-300">
            Contact
          </Link>
        </nav>
      </div>

      {/* Meniu Mobile */}
      {menuOpen && (
        <div className="sm:hidden bg-black bg-opacity-90 text-white px-4 py-2 space-y-2 text-center">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/portfolio" onClick={() => setMenuOpen(false)}>
            Portfolio
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
