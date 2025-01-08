import React, { useEffect } from "react";
import { Timer, ShoppingCart, ExternalLink, Badge } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import CountDown from "./CountDown";
import { backend_url } from "../../server";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((data.originalPrice - data.discountPrice) / data.originalPrice) * 100
  );

  return (
    <div
      className={`w-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden ${
        active ? "unset" : "mb-12"
      }`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="relative w-full lg:w-1/2 overflow-hidden group">
          <img
            src={`${backend_url}${data.images[0]}`}
            alt={data.name}
            className="w-full h-[300px] lg:h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <div className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-sm">
              -{discountPercentage}%
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <Badge className="w-5 h-5 text-red-500" />
              <span className="text-red-500 text-sm font-medium">Flash Sale</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {data.name}
            </h2>
            <p className="text-gray-600 mb-5 line-clamp-2 text-sm">
              {data.description}
            </p>

            {/* Price Section */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-gray-900">
                Ugx {data.discountPrice.toLocaleString()}
              </span>
              <span className="text-base text-gray-400 line-through">
                Ugx {data.originalPrice.toLocaleString()}
              </span>
            </div>

            {/* Timer and Stock */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-gray-500" />
                <CountDown
                  data={data}
                  className="text-sm text-gray-500 font-medium"
                  style={{ fontSize: "0.85rem" }}
                />
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <span className="font-semibold text-base">{data.stock}</span>
                <span className="text-sm">items</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${(data.sold_out / data.stock) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <Link to={`/product/${data._id}?isEvent=true`} className="flex-1">
              <button className="w-full px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                See Details
              </button>
            </Link>
            <button
              onClick={() => addToCartHandler(data)}
              className="flex-1 px-5 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
