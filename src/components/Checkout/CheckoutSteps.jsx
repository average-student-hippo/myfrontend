import React from 'react';
import { Check, Truck, CreditCard, PartyPopper } from 'lucide-react';

const CheckoutSteps = ({ active }) => {
  const steps = [
    {
      id: 1,
      name: 'Shipping',
      icon: Truck
    },
    {
      id: 2,
      name: 'Payment',
      icon: CreditCard
    },
    {
      id: 3,
      name: 'Success',
      icon: PartyPopper
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="relative flex justify-between">
        {/* Progress bar background */}
        <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-gray-200" />
        
        {/* Active progress bar */}
        <div 
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-blue-500 transition-all duration-500 ease-in-out"
          style={{ width: `${((active - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {steps.map((step) => {
          const isActive = active >= step.id;
          const isComplete = active > step.id;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              {/* Step circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                  }`}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              
              {/* Step label */}
              <div className="mt-2 text-sm font-medium">
                <span className={isActive ? 'text-blue-500' : 'text-gray-400'}>
                  {step.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;