import React, { useState } from 'react';

const PromoGrid = ({ promotions = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Discover some of <span className="text-blue-500">our promotions</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Top Left Panel */}
        <div className="bg-blue-50 rounded-2xl p-6 transition-transform duration-300 hover:scale-105">
          <div className="space-y-2">
            <p className="text-gray-600">Google</p>
            <h2 className="text-2xl font-bold">Pixel Watch 2</h2>
            <p className="text-gray-600">Help by Google. Health by Fitbit.</p>
          </div>
          <div className="mt-4">
            <img 
              src="pixelwatch.png"
              alt="Pixel Watch 2"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Center Panel */}
        <div className="relative col-span-1 md:col-span-2 lg:col-span-1 h-[400px] rounded-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/30" />
          <video 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted
            playsInline
          >
            <source src="herovid2.mp4" type="video/mp4" />
          </video>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="text-lg">Dji Mavic 3 Pro</p>
            <h2 className="text-3xl font-bold mb-4">Inspiration in Focus</h2>
            <button className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-300 hover:bg-white/30">
              Learn More
            </button>
          </div>
        </div>

        {/* Top Right Panel */}
        <div className="bg-orange-50 rounded-2xl p-6 transition-transform duration-300 hover:scale-105">
          <div className="space-y-2">
            <p className="text-green-600">Apple</p>
            <h2 className="text-2xl font-bold text-green-500">Watch Ultra 2</h2>
            <p className="text-green-500 ">Elegance woven into every band.</p>
          </div>
          <div className="mt-4">
            <img 
              src="banner-2.png"
              alt="Apple Watch Ultra 2"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Bottom Left Panel */}
        {/* <div className="bg-gray-900 rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105">
          <div className="relative h-[300px]">
            <img 
              src="/api/placeholder/400/300"
              alt="Sony Camera"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-sm">Sony</p>
              <h2 className="text-2xl font-bold mb-4">Best Lens Cameras</h2>
              <button className="px-4 py-1 border border-white rounded-full text-sm transition-colors duration-300 hover:bg-white hover:text-black">
                Explore
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Right Panel */}
        {/* <div className="bg-black rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105">
          <div className="relative h-[300px]">
            <img 
              src="/api/placeholder/400/300"
              alt="Xbox Gaming"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-sm">XBOX Games</p>
              <h2 className="text-2xl font-bold text-green-500 mb-4">Follow Your Dream</h2>
              <button className="px-4 py-1 border border-green-500 text-green-500 rounded-full text-sm transition-colors duration-300 hover:bg-green-500 hover:text-white">
                Follow
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PromoGrid;