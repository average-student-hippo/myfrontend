import React, { useState } from 'react';
import { AlertCircle, Mail, Phone, Clock, MapPin, CreditCard, Truck, Package, Shield } from 'lucide-react';

const PreFooter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    setEmail('');
  };

  return (
    <div className="w-full bg-gray-50 py-12 px-4">
      {/* Trust Badges Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Truck className="h-6 w-6" />, title: "Free Shipping", desc: "On orders over Ugx 400000" },
            { icon: <Shield className="h-6 w-6" />, title: "Secure Payment", desc: "100% secure checkout" },
            { icon: <Package className="h-6 w-6" />, title: "Easy Returns", desc: "10 day return policy" },
            { icon: <CreditCard className="h-6 w-6" />, title: "Payment Methods", desc: "Mobile money" }
          ].map((badge, index) => (
            <div
              key={index}
              className="flex items-center p-4 space-x-3 bg-white rounded-lg shadow-sm border"
            >
              <div className="text-primary">{badge.icon}</div>
              <div>
                <h3 className="font-semibold text-sm">{badge.title}</h3>
                <p className="text-xs text-gray-500">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Newsletter Section */}
        {/* <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Stay Updated</h2>
          <p className="text-gray-600">Subscribe to our newsletter for exclusive offers and updates</p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Subscribe
            </button>
          </form>
        </div>  */}

        {/* Contact Information */}
        {/* <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Need Help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-blue-500" />
              <span className="text-sm">1-800-123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <span className="text-sm">support@example.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm">Mon-Fri: 9AM-6PM</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <span className="text-sm">Find a Store</span>
            </div>
          </div>
        </div> 
      </div>*/}
    </div>
  );
};

export default PreFooter;
