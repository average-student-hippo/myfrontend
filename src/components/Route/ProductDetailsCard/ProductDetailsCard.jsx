import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, MessageCircle, X, Plus, Minus } from 'lucide-react';
import { backend_url } from '../../../server';
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../../server";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (wishlist?.find((i) => i._id === data?._id)) {
      setClick(true);
    }
  }, [wishlist, data]);

  const handleMessageSubmit = async () => {
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
  
  const addToCartHandler = (id) => {
    const isItemExists = cart?.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
      return;
    }
    if (data.stock < count) {
      toast.error("Product stock limited!");
      return;
    }
    dispatch(addTocart({ ...data, qty: count }));
    toast.success("Item added to cart successfully!");
  };

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto relative">
      <button 
  onClick={() => setOpen(false)}
  className="sticky top-4 left-[calc(100%-40px)] p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-md z-50"
>
  <X className="w-6 h-6" />
</button>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Left Column - Image and Shop Info */}
          <div className="space-y-6">
            <img 
              src={`${backend_url}${data.images?.[0]}`} 
              alt={data.name}
              className="w-full aspect-square object-cover rounded-xl"
            />
            
            <div className="flex items-center space-x-4">
              <img
                src={`${backend_url}${data?.shop?.avatar}`}
                alt={data?.shop?.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium">{data?.shop?.name}</h3>
                <div className="text-sm text-gray-500">4.5 ★ Rating</div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{data.name}</h1>
              <p className="mt-2 text-gray-600">{data.description}</p>
            </div>

            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-bold">${data.discountPrice}</span>
              {data.originalPrice && (
                <span className="text-gray-500 line-through">${data.originalPrice}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center border rounded-lg">
                <button 
                  onClick={() => setCount(Math.max(1, count - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 font-medium">{count}</span>
                <button 
                  onClick={() => setCount(count + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => click ? 
                  dispatch(removeFromWishlist(data)) : 
                  dispatch(addToWishlist(data))
                }
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart 
                  className="w-6 h-6" 
                  fill={click ? "red" : "none"}
                  stroke={click ? "red" : "currentColor"}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => addToCartHandler(data._id)}
                className="flex items-center justify-center space-x-2 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleMessageSubmit}
                className="flex items-center justify-center space-x-2 border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Message Seller</span>
              </button>
            </div>

            <div className="text-sm text-gray-500">
              {data.total_sell} sold
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;