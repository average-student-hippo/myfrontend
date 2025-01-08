import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';  // Add this import
import { removeFromCart } from '../../redux/actions/cart';
import { X, ArrowRight, ShoppingCart } from 'lucide-react';
import { backend_url } from '../../server';

const CartPopup = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Add this hook

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const handleCheckout = () => {
    setOpenCart(false);  // Close the cart popup before navigation
    navigate('/checkout');  // Use navigate instead of window.location
  };

  const handleViewCart = () => {
    setOpenCart(false);  // Close the cart popup before navigation
    navigate('/cart');  // Use navigate instead of window.location
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute right-4 top-16 w-96 bg-white rounded-lg shadow-lg flex flex-col">
        <div className="absolute -top-2 right-[120px] w-4 h-4 bg-white transform rotate-45 shadow-lg z-0" />

        <div className="relative z-10 bg-white rounded-lg flex-1">
          {/* Header section remains the same */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Cart items</h2>
              <button 
                onClick={() => setOpenCart(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Cart items section remains the same */}
          <div className="max-h-[300px] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cart.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item}
                    onRemove={() => dispatch(removeFromCart(item))}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Updated footer section with improved button styling */}
        <div className="p-4 border-t bg-white space-y-3">
          <button 
            onClick={handleCheckout}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 flex items-center justify-center space-x-2 cursor-pointer transition-colors duration-200"
          >
            <span>Checkout</span>
            <ArrowRight size={18} />
            <span className="ml-1">Ugx {totalPrice.toLocaleString()}</span>
          </button>
          <button 
            onClick={handleViewCart}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 flex items-center justify-center space-x-2 cursor-pointer transition-colors duration-200"
          >
            <ShoppingCart size={18} />
            <span>View cart</span>
          </button>
        </div>
      </div>

      <div 
        className="fixed inset-0 bg-transparent cursor-pointer" 
        onClick={() => setOpenCart(false)}
      />
    </div>
  );
};

const CartItem = ({ item, onRemove }) => {
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
            {item.qty} × Ugx {item.discountPrice.toLocaleString()}
          </p>
        </div>
      </div>
      <button 
        onClick={onRemove}
        className="text-gray-400 hover:text-gray-600 flex-shrink-0 cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default CartPopup;