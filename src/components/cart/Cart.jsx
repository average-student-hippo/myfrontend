import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../../redux/actions/cart';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  ShoppingBag,
  Truck,
  Clock,
  Shield
} from 'lucide-react';
import { backend_url } from '../../server';

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const subtotal = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
  const shipping = subtotal > 100000 ? 0 : 5000; // Free shipping over 100k
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 space-y-6">
                  {cart.map((item) => (
                    <CartItem 
                      key={item.id} 
                      item={item}
                      onRemove={() => dispatch(removeFromCart(item))}
                    />
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              {/* <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DeliveryInfo 
                    icon={<Truck />}
                    title="Free Delivery"
                    description="For orders over Ugx 100,000"
                  />
                  <DeliveryInfo 
                    icon={<Clock />}
                    title="Same Day Delivery"
                    description="Order before 2 PM"
                  />
                  <DeliveryInfo 
                    icon={<Shield />}
                    title="Secure Payment"
                    description="100% secure checkout"
                  />
                </div>
              </div> */}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <OrderSummary 
                subtotal={subtotal}
                shipping={shipping}
                total={total}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CartItem = ({ item, onRemove }) => {
  const [quantity, setQuantity] = useState(item.qty);
  const dispatch = useDispatch();

  const handleQuantityChange = (newQty) => {
    if (newQty >= 1 && newQty <= item.stock) {
      setQuantity(newQty);
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { ...item, qty: newQty }});
    }
  };

  return (
    <div className="flex items-start space-x-6 py-6 border-b last:border-0">
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={`${backend_url}${item?.images[0]}`}
          alt={item.name}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-4">
          SKU: {item.sku} | Stock: {item.stock}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-2 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              className="w-16 text-center border-x py-1"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-2 hover:bg-gray-100"
              disabled={quantity >= item.stock}
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <p className="text-lg font-semibold">
              Ugx {(item.discountPrice * quantity).toLocaleString()}
            </p>
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeliveryInfo = ({ icon, title, description }) => (
  <div className="flex items-start space-x-3">
    <div className="text-gray-600">{icon}</div>
    <div>
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

const OrderSummary = ({ subtotal, shipping, total }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
    
    <div className="space-y-4">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>Ugx {subtotal.toLocaleString()}</span>
      </div>
      
      <div className="flex justify-between text-gray-600">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : `Ugx ${shipping.toLocaleString()}`}</span>
      </div>
      
      {shipping > 0 && (
        <div className="text-sm text-gray-500">
          Add Ugx {(100000 - subtotal).toLocaleString()} more for free shipping
        </div>
      )}
      
      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>Ugx {total.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={() => window.location.href = '/checkout'}
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  </div>
);

const EmptyCart = () => (
  <div className="text-center py-16 bg-white rounded-lg shadow">
    <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
    <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
    <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
    <button
      onClick={() => window.location.href = '/'}
      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
    >
      Start Shopping
    </button>
  </div>
);

export default Cart;