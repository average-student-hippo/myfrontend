import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, ChevronDown, Phone, Menu, X, LogOut } from "lucide-react";
import CartPopup from "../cart/CartPopup";
import { categoriesData } from "../../static/data";
import { backend_url } from "../../server";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { server } from "../../server";
import { toast } from "react-toastify";
import axios from 'axios';
import WishlistPopup from "../Wishlist/WishlistPopup";


const Header = () => {
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isCartOpen, setOpenCart] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filter products based on search term
    if (term.length > 2) {
      const results = categoriesData.filter(product =>
        product.title.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   if (searchTerm.trim()) {
  //     navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  //     setSearchResults([]);
  //   }
  // };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchResults([]);
      setSearchTerm(""); // Optional: clear the search input after submission
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${encodeURIComponent(category.title)}`);
    setIsDropDownOpen(false);
  };

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const profileMenuItems = isAuthenticated ? (
    isSeller ? [
      { label: "My Dashboard", link: "/dashboard" },
      { label: "Logout", link: "/logout" }
    ] : [
      { label: "Profile", link: "/profile" },
      { label: "Logout", link: "/logout" }
    ]
  ) : [
    { label: "Register as Buyer", link: "/register" },
    { label: "Register as Seller", link: "/shop-create" },
    { label: "Login", link: "/login" }
  ];

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block w-full bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              <Link to="/about" className="text-sm text-gray-600 hover:text-blue-600">About Us</Link>
              <Link to="/track" className="text-sm text-gray-600 hover:text-blue-600">Order Tracking</Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-blue-600">Contact Us</Link>
              <Link to="/faqs" className="text-sm text-gray-600 hover:text-blue-600">FAQs</Link>
            </div>
            <div className="flex space-x-4">
              <select className="text-sm text-gray-600 bg-transparent">
                <option>English</option>
                <option>Spanish</option>
              </select>
              <select className="text-sm text-gray-600 bg-transparent">
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/africo-full.png"
                alt="Logo"
                className="h-8 w-auto"
              />
            </Link>

            {/* Search and Categories - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl">
              <div className="relative">
                <button
                  className="flex items-center h-11 px-4 bg-gray-100 rounded-l-md border-r border-gray-300"
                  onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                >
                  <span className="mr-2">All categories</span>
                  <ChevronDown size={16} />
                </button>

                {isDropDownOpen && (
                  <div className="absolute top-full left-0 w-[270px] bg-white rounded-b-md shadow-lg z-50">
                    {categoriesData.map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <img
                          src={category.icon}
                          className="w-6 h-6 object-contain"
                          alt={category.title}
                        />
                        <span className="ml-3">{category.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleSearchSubmit} className="flex flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="I'm shopping for..."
                  className="w-full px-4 border-y border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="px-6 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                  <Search size={20} />
                </button>
              </form>

              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <Link
                      key={index}
                      to={`/products?category=${result.title}`}
                      className="flex items-center p-3 hover:bg-gray-50"
                      onClick={() => setSearchResults([])}
                    >
                      <img src={result.icon} alt={result.title} className="w-8 h-8 object-contain" />
                      <span className="ml-3">{result.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right section - Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="tel:+001123456789">
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-blue-600" />
                <div className="ml-2">
                  <p className="text-sm text-gray-500">Need Help?</p>
                  <p className="text-sm font-medium">+001 123 456 789</p>
                </div>
              </div>
              </a>

              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist?.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setOpenCart(true)}
                className="relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart?.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2"
                >
                  {isAuthenticated ? (
                    <img
                      src={`${backend_url}${user.avatar}`}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="p-2 rounded-full bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <ChevronDown size={16} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    {profileMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.link}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile buttons */}
            <div className="flex lg:hidden items-center space-x-4">
              <button
                onClick={() => setOpenCart(true)}
                className="relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart?.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search - shown below header */}
          <div className="lg:hidden mt-4">
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="I'm shopping for..."
                className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="px-6 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                <Search size={20} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute top-0 left-0 w-4/5 h-full bg-white overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="mb-4"
              >
                <X size={24} />
              </button>

              <div className="space-y-4">
                {/* Mobile Categories */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Categories</h3>
                  {categoriesData.map((category, index) => (
                    <Link
                      key={index}
                      to={`/products?category=${category.title}`}
                      className="flex items-center py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <img src={category.icon} alt={category.title} className="w-6 h-6 mr-3" />
                      <span>{category.title}</span>
                    </Link>
                  ))}
                </div>

                {/* Mobile Navigation */}
                <div className="space-y-2">
                  <Link to="/about" className="block py-2">About Us</Link>
                  <Link to="/track" className="block py-2">Order Tracking</Link>
                  <Link to="/contact" className="block py-2">Contact Us</Link>
                  <Link to="/faqs" className="block py-2">FAQs</Link>
                </div>

                {/* Mobile Profile Section */}
                <div className="border-t pt-4">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={`${backend_url}${user.avatar}`}
                          alt="Profile"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className="font-medium">{user.name}</span>
                      </div>
                      {isSeller ? (
                        <Link to="/dashboard" className="block py-2">My Dashboard</Link>
                      ) : (
                        <Link to="/profile" className="block py-2">Profile</Link>
                      )}
                      <div
                              className="flex items-center cursor-pointer w-full mb-8"
                              onClick={logoutHandler}
                            >
                              <AiOutlineLogin size={20}  />
                              <span
                                className="pl-3 800px:block hidden"
                              >
                                logout
                              </span>
                            </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link to="/login" className="block py-2"><AiOutlineLogin size={20} />Login</Link>
                      <Link to="/register" className="block py-2">Register as Buyer</Link>
                      <Link to="/shop-create" className="block py-2">Register as Seller</Link>
                    </div>
                  )}
                </div>

                {/* Mobile Contact */}
                <div className="border-t pt-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Need Help?</p>
                      <p className="text-sm font-medium">+001 123 456 789</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && <CartPopup setOpenCart={setOpenCart} />}

      {/* Wishlist Modal */}
      {isWishlistOpen && <WishlistPopup setOpenWishlist={setIsWishlistOpen} />}
    </>
  );
};

export default Header;