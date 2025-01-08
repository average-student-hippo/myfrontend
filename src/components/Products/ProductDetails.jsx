import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, MessageCircle, ShoppingCart, Minus, Plus, Store, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllProductsShop } from "../../redux/actions/product";
import { addToWishlist, removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import axios from "axios";
import Ratings from "./Ratings";
import { backend_url, server } from "../../server";

const ImageMagnifier = ({ src, alt }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const handleMouseMove = (e) => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x, y });
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <div className="relative w-full h-full">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      />
      {showZoom && (
        <div
          className="absolute w-64 h-64 pointer-events-none border-2 border-gray-200 hidden lg:block"
          style={{
            top: `${mousePosition.y - 128}px`,
            left: `${mousePosition.x - 128}px`,
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: '400%',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  );
};

const ProductDetails = ({ data }) => {
  const { products } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [count, setCount] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const [startIndex, setStartIndex] = useState(0);

  const THUMBNAILS_TO_SHOW = 4;

  useEffect(() => {
    dispatch(getAllProductsShop(data?.shop._id));
    setIsWishlisted(wishlist?.some((item) => item._id === data?._id));
  }, [data, wishlist, dispatch]);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (isWishlisted) {
      dispatch(removeFromWishlist(data));
    } else {
      dispatch(addToWishlist(data));
    }
  };

  const handleAddToCart = () => {
    if (cart?.some((item) => item._id === data._id)) {
      toast.error("Item already in cart!");
      return;
    }
    
    if (data.stock < 1) {
      toast.error("Product out of stock!");
      return;
    }

    dispatch(addTocart({ ...data, qty: count }));
    toast.success("Added to cart successfully!");
  };

  const handleMessage = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to send a message");
      return;
    }

    try {
      const res = await axios.post(`${server}/conversation/create-new-conversation`, {
        groupTitle: data._id + user._id,
        userId: user._id,
        sellerId: data.shop._id,
      });
      navigate(`/inbox?${res.data.conversation._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating conversation");
    }
  };

  const nextImages = () => {
    if (startIndex + THUMBNAILS_TO_SHOW < data?.images.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const previousImages = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  // Calculate ratings
  const totalReviews = products?.reduce((acc, product) => acc + product.reviews.length, 0) || 0;
  const averageRating = (products?.reduce((acc, product) => 
    acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), 0) / totalReviews || 0
  ).toFixed(2);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="w-3/4 mx-auto aspect-square rounded-lg overflow-hidden bg-gray-100">
              <ImageMagnifier
                src={`${backend_url}${data?.images[selectedImage]}`}
                alt={data?.name}
              />
            </div>
            <div className="relative">
              {startIndex > 0 && (
                <button
                  onClick={previousImages}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-1 z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex justify-center gap-4 overflow-hidden px-8">
                {data?.images.slice(startIndex, startIndex + THUMBNAILS_TO_SHOW).map((image, index) => (
                  <button
                    key={startIndex + index}
                    onClick={() => setSelectedImage(startIndex + index)}
                    className={`flex-shrink-0 w-20 aspect-square rounded-lg overflow-hidden ${
                      selectedImage === startIndex + index ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <img
                      src={`${backend_url}${image}`}
                      alt={`${data?.name} ${startIndex + index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {startIndex + THUMBNAILS_TO_SHOW < data?.images?.length && (
                <button
                  onClick={nextImages}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-1 z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Rest of the component remains the same */}
          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{data?.name}</h1>
            {/* <p className="text-gray-600">{data?.description}</p> */}
            
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">Ugx {data?.discountPrice.toLocaleString()}</span>
              {data?.originalPrice.toLocaleString() && (
                <span className="text-xl text-gray-500 line-through">Ugx {data?.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setCount(Math.max(1, count - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-gray-700">{count}</span>
                <button
                  onClick={() => setCount(count + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleWishlist}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart
                  className={`w-6 h-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleMessage}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Message</span>
              </button>
            </div>

            {/* Shop Info */}
            <div className="border-t pt-6">
              <Link to={`/shop/preview/${data?.shop._id}`} className="flex items-center space-x-4">
                <img
                  src={`${backend_url}${data?.shop?.avatar}`}
                  alt={data?.shop?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{data?.shop?.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Ratings rating={Number(averageRating)} />
                    <span className="text-gray-500">({totalReviews} reviews)</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs section remains the same */}
        <div className="mt-16">
          <div className="border-b">
            <nav className="flex space-x-8">
              {["details", "reviews", "seller"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "details" && (
              <p className="text-gray-600 whitespace-pre-line">{data?.description}</p>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {data?.reviews.map((review, index) => (
                  <div key={index} className="flex space-x-4">
                    <img
                      src={`${backend_url}/${review.user.avatar}`}
                      alt={review.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium">{review.user.name}</h4>
                      <Ratings rating={review.rating} />
                      <p className="text-gray-600 mt-1">{review.comment}</p>
                    </div>
                  </div>
                ))}
                {data?.reviews.length === 0 && (
                  <p className="text-gray-500 text-center">No reviews yet</p>
                )}
              </div>
            )}

            {activeTab === "seller" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-4">About the Seller</h3>
                  <p className="text-gray-600">{data?.shop?.description}</p>
                </div>
                <div className="space-y-4">
                  <p>Joined on: {data?.shop?.createdAt?.slice(0, 10)}</p>
                  <p>Total Products: {products?.length}</p>
                  <p>Total Reviews: {totalReviews}</p>
                  <Link
                    to={`/shop/preview/${data?.shop._id}`}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                  >
                    <Store className="w-5 h-5" />
                    <span>Visit Shop</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;