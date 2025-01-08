import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../Route/ProductCard/ProductCard";
import { AiOutlineSearch } from "react-icons/ai";

const SearchResults = () => {
  const { allProducts } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Get search query from URL
  const searchQuery = searchParams.get("q") || "";
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  // Get unique categories from products
  const categories = allProducts 
    ? [...new Set(allProducts.map((p) => p.category))]
    : [];

  useEffect(() => {
    let results = allProducts || [];

    // Apply search filter
    if (searchQuery) {
      results = results.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Apply price filter
    results = results.filter(
      (product) =>
        product.discountPrice >= priceRange[0] &&
        product.discountPrice <= priceRange[1]
    );

    // Apply stock filter
    if (inStockOnly) {
      results = results.filter((product) => product.stock > 0);
    }

    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.discountPrice - b.discountPrice;
        case "price-desc":
          return b.discountPrice - a.discountPrice;
        case "rating":
          return b.ratings - a.ratings;
        case "sold":
          return b.sold_out - a.sold_out;
        default:
          return 0;
      }
    });

    setFilteredProducts(results);
  }, [allProducts, searchQuery, selectedCategories, priceRange, inStockOnly, sortBy]);

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 md:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Summary */}
        {searchQuery && (
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900">
              Search results for "{searchQuery}"
            </h1>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 space-y-6 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg text-gray-800">Filters</h3>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Price Range (Ugx)</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full p-2 border rounded"
                />
                <span>to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Category</h4>
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category]);
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((c) => c !== category)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={category} className="text-gray-600">
                    {category}
                  </label>
                </div>
              ))}
            </div>

            {/* Stock Filter */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="inStock" className="text-gray-600">
                In Stock Only
              </label>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} results found
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="sold">Best Selling</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product._id} data={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No products found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;