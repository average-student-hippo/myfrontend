// Payment.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Phone, X, CreditCard } from "lucide-react";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [cardType, setCardType] = useState("");
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  // Card type detection function
  const detectCardType = (number) => {
    const cardPatterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };

    for (const [type, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(number)) {
        return type;
      }
    }
    return "";
  };

  // Handle card number input with formatting
  const handleCardNumberChange = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, "");
    value = value.substring(0, 16);
    
    // Add spaces every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    
    setCardDetails((prev) => ({ ...prev, number: value }));
    if (value.length >= 4) {
      setCardType(detectCardType(value));
    } else {
      setCardType("");
    }
  };

  // Handle expiry date input with formatting
  const handleExpiryChange = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setCardDetails((prev) => ({ ...prev, expiry: value }));
  };

  // Credit card payment handler
  const creditCardHandler = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name) {
      toast.error("Please fill in all card details");
      return;
    }

    // Basic validation
    if (cardDetails.number.replace(/\s/g, "").length < 15) {
      toast.error("Please enter a valid card number");
      return;
    }

    if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return;
    }

    if (cardDetails.cvc.length < 3) {
      toast.error("Please enter a valid CVC");
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Mock successful payment
        order.paymentInfo = {
          id: `CARD_${Date.now()}`,
          status: "success",
          type: "Credit Card",
          last4: cardDetails.number.slice(-4),
          cardType: cardType
        };

        await axios.post(`${server}/order/create-order`, order, {
          headers: { "Content-Type": "application/json" },
        });

        setLoading(false);
        navigate("/order/success");
        toast.success("Payment successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
      } catch (error) {
        setLoading(false);
        toast.error("Payment failed. Please try again.");
      }
    }, 2000);
  };

  // Mobile Money Payment Handler
  const mobileMoneyHandler = async (provider) => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Initialize mobile money payment
      const { data } = await axios.post(
        `${server}/payment/mobile-money/initiate`,
        {
          phoneNumber,
          amount: orderData?.totalPrice,
          provider
        },
        config
      );

      if (data.success) {
        order.paymentInfo = {
          id: data.transactionId,
          status: "pending",
          type: `${provider.toUpperCase()} Mobile Money`,
          phoneNumber
        };

        await axios.post(`${server}/order/create-order`, order, config);
        
        const checkPaymentStatus = async () => {
          const { data: statusData } = await axios.get(
            `${server}/payment/mobile-money/status/${data.transactionId}`
          );

          if (statusData.status === "success") {
            setLoading(false);
            navigate("/order/success");
            toast.success("Payment successful!");
            localStorage.setItem("cartItems", JSON.stringify([]));
            localStorage.setItem("latestOrder", JSON.stringify([]));
            window.location.reload();
          } else if (statusData.status === "failed") {
            setLoading(false);
            toast.error("Payment failed. Please try again.");
          } else {
            setTimeout(checkPaymentStatus, 5000);
          }
        };

        checkPaymentStatus();
        toast.info("Please confirm the payment on your phone");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Choose Payment Method</h2>
              
              {/* Credit Card Section */}
              <div className="mb-8">
                <div className="border rounded-lg p-6 hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <CreditCard className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Credit Card</h3>
                      <p className="text-sm text-gray-500">Pay with Visa, Mastercard, or other cards</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={cardDetails.number}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        {cardType && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 capitalize">
                            {cardType}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={cardDetails.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CVC</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, "").substring(0, 4) }))}
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                      />
                    </div>

                    <button
                      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                      onClick={creditCardHandler}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Pay with Credit Card'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Money Section */}
              <div className="space-y-6">
                {/* MTN Mobile Money */}
                <div className="border rounded-lg p-4 hover:border-yellow-500 transition-colors cursor-pointer"
                     onClick={() => document.getElementById('mtn-modal').showModal()}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Phone className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">MTN Mobile Money</h3>
                      <p className="text-sm text-gray-500">Pay using MTN Mobile Money</p>
                    </div>
                  </div>
                </div>

                {/* Airtel Money */}
                <div className="border rounded-lg p-4 hover:border-red-500 transition-colors cursor-pointer"
                     onClick={() => document.getElementById('airtel-modal').showModal()}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <Phone className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Airtel Money</h3>
                      <p className="text-sm text-gray-500">Pay using Airtel Money</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>UGX {orderData?.subTotalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>UGX {orderData?.shipping?.toLocaleString()}</span>
                </div>
                {orderData?.discountPrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span>- UGX {orderData.discountPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>UGX {orderData?.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MTN Modal */}
      <dialog id="mtn-modal" className="modal modal-bottom sm:modal-middle">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">MTN Mobile Money Payment</h3>
            <button onClick={() => document.getElementById('mtn-modal').close()}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter MTN number (e.g., 0771234567)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50"
              onClick={() => mobileMoneyHandler('mtn')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay with MTN Mobile Money'}
            </button>
          </div>
        </div>
      </dialog>

      {/* Airtel Modal */}
      <dialog id="airtel-modal" className="modal modal-bottom sm:modal-middle">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Airtel Money Payment</h3>
            <button onClick={() => document.getElementById('airtel-modal').close()}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter Airtel number (e.g., 0751234567)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
              onClick={() => mobileMoneyHandler('airtel')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay with Airtel Money'}
            </button>
          </div>
        </div>
      </dialog>
      </div>
  );
};

export default Payment;
