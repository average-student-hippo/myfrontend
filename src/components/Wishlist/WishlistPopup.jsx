import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { X, Heart, ShoppingCart } from "lucide-react";
import { backend_url } from "../../server";

const WishlistPopup = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const handleViewWishlist = () => {
    window.location.href = "/wishlist";
  };

  const addToCartHandler = (item) => {
    const newItem = { ...item, qty: 1 };
    dispatch(addTocart(newItem));
    setOpenWishlist(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute right-4 top-16 w-96 bg-white rounded-lg shadow-lg flex flex-col">
        {/* Extended arrow pointing up */}
        <div className="absolute -top-2 right-[120px] w-4 h-4 bg-white transform rotate-45 shadow-lg z-0" />

        {/* Main content */}
        <div className="relative z-10 bg-white rounded-lg flex-1">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Your Wishlist</h2>
              <button
                onClick={() => setOpenWishlist(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {wishlist.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Your wishlist is empty
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {wishlist.map((item) => (
                  <WishlistItem
                    key={item.id}
                    item={item}
                    onRemove={() => dispatch(removeFromWishlist(item))}
                    onAddToCart={() => addToCartHandler(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fixed footer with buttons */}
        <div className="p-4 border-t bg-white space-y-3">
          <button
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 flex items-center justify-center space-x-2"
            onClick={handleViewWishlist}
          >
            <Heart size={18} />
            <span>View Wishlist</span>
          </button>
        </div>
      </div>

      <div
        className="fixed inset-0 bg-transparent"
        onClick={() => setOpenWishlist(false)}
      />
    </div>
  );
};

const WishlistItem = ({ item, onRemove, onAddToCart }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-md flex items-center justify-center p-2">
          <img
            src={`${backend_url}${item?.images[0]}`}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium truncate">{item.name}</h3>
          <p className="text-sm text-gray-500">
            Ugx {item.discountPrice.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onAddToCart}
          className="text-gray-400 hover:text-green-600"
        >
          <ShoppingCart size={18} />
        </button>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default WishlistPopup;
