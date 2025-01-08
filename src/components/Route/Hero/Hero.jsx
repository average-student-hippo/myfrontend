import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { categoriesData } from '../../../static/data';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced slider data with shoes
  const sliderData = [
    {
      title: "iPhone 15 Pro",
      subtitle: "Titanium. So strong. So light. So Pro.",
      image: "/iphone-15.png",
      category: "Smartphones",
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      title: "MacBook Air",
      subtitle: "Supercharged by M2",
      image: "/mackbook.png",
      category: "Laptops",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Nike Air Max",
      subtitle: "Step into the future of comfort",
      image: "/nikeair.png",
      category: "Shoes",
      gradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  // Enhanced auto-slide effect with transition handling
  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleSlideChange = (newIndex) => {
    setIsTransitioning(true);
    setCurrentSlide(newIndex);
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${categoryName}`);
  };

  const handlePopupToggle = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % sliderData.length);
  };

  const prevSlide = () => {
    handleSlideChange((currentSlide - 1 + sliderData.length) % sliderData.length);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enhanced First Card with Slider */}
        <div className="md:col-span-2 relative rounded-3xl overflow-hidden h-[400px] group">
          <div className={`absolute inset-0 bg-gradient-to-r ${sliderData[currentSlide].gradient} transition-all duration-500`} />
          
          {/* Text Background Overlay for Better Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
          
          <img
            src={sliderData[currentSlide].image}
            alt={sliderData[currentSlide].title}
            className={`absolute right-0 h-full object-contain transition-all duration-500 transform
              ${isTransitioning ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
              group-hover:scale-105`}
          />
          
          {/* Content with Enhanced Text Readability */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
            <div className="text-shadow-lg">
              <h2 className="text-4xl font-bold text-white">{sliderData[currentSlide].title}</h2>
              <p className="mt-2 text-lg text-white/90">{sliderData[currentSlide].subtitle}</p>
            </div>
            <button
              onClick={() => handleCategoryClick(sliderData[currentSlide].category)}
              className="flex items-center space-x-2 bg-white backdrop-blur-sm text-black px-6 py-2 rounded-full w-fit hover:bg-white/90 transition-colors"
            >
              <span>Learn More</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Enhanced Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Enhanced Slider Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {sliderData.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* GoPro Card with Video */}
        <div className="relative rounded-3xl overflow-hidden h-[400px] group">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/herovid2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-6 flex flex-col justify-between">
            <div className="text-white">
              <p className="text-sm">GoPro. Creator Edition</p>
              <h3 className="text-2xl font-bold mt-1">HERO 12 Black</h3>
            </div>
            <button
              onClick={() => handleCategoryClick('Cameras')}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full w-fit hover:bg-white/30 transition-colors"
            >
              <span>Learn More</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* HomePod Card */}
        <div className="relative rounded-3xl overflow-hidden h-[400px] bg-black group">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent" />
          <img
            src="/homepod.png"
            alt="Apple HomePod"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-3/4 object-contain transition-transform duration-500 transform group-hover:scale-105"
          />
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="text-white">
              <h3 className="text-2xl font-bold">Apple HomePod</h3>
              <p className="mt-1 opacity-80">Profound sound</p>
            </div>
            <button
              onClick={() => handleCategoryClick('Speakers')}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full w-fit hover:bg-white/30 transition-colors"
            >
              <span>Learn More</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-3xl p-6 border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Popular Categories</h3>
          <button
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center group"
            onClick={handlePopupToggle}
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesData.slice(0, 6).map((category, index) => (
            <button
              key={index}
              className={`${category.color} rounded-2xl p-4 text-center transition-transform hover:scale-105 group`}
              onClick={() => handleCategoryClick(category.title)}
            >
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={`/CategoryImages/${category.title}.png`}
                  alt={`${category.title} category`}
                  className="w-24 h-24 object-contain"
                />
                <span className="font-medium text-gray-900 mt-2">{category.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handlePopupToggle}
        >
          <div
            className="bg-white rounded-3xl p-6 border w-[90%] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">All Categories</h3>
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={handlePopupToggle}
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categoriesData.map((category, index) => (
                <button
                  key={index}
                  className={`${category.color} rounded-2xl p-4 text-center transition-transform hover:scale-105 group`}
                  onClick={() => handleCategoryClick(category.title)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={`/CategoryImages/${category.title}.png`}
                      alt={`${category.title} category`}
                      className="w-24 h-24 object-contain"
                    />
                    <span className="font-medium text-gray-900 mt-2">{category.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;