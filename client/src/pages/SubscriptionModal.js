// SubscriptionModal.js
import React, { useState } from 'react';
import api from '../api';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState(0); // Assuming 0 is the default plan
  const [apiLink, setApiLink] = useState(null);
    const payment= async ()=>{
        const response = await api.post('/api/payments/create-payment-link',{
            package_id:subscriptionPlan
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = response.data;
          const link = data.link;
          setApiLink(link);

          // Open the link in a new window/tab
          window.open(link, '_blank');
    }
  const handlePlanChange = (plan) => {
    setSubscriptionPlan(plan);
  };
     const [paymentData, setPaymentData] = useState([]);


  const handleSubscribe = () => {
    // Implement subscription logic here
    console.log(`Subscribing to plan ${subscriptionPlan}`);
    // Close the modal after subscription
    onClose();
  };

  return (
    <div className={`fixed inset-0 overflow-y-auto ${isOpen ? '' : 'hidden'}`}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* Icon or Logo for Subscription */}
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Your SVG icon or logo */}
                </svg>
              </div>

              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Choose a Subscription Plan</h3>

                {/* Subscription Plan Options */}
                <div className="mt-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-green-600"
                      name="subscriptionPlan"
                      value={2}
                      checked={subscriptionPlan === 2}
                      onChange={() => handlePlanChange(2)}
                    />
                    <span className="ml-2 text-gray-700">Basic Plan</span>
                  </label>

                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      className="form-radio text-green-600"
                      name="subscriptionPlan"
                      value={3}
                      checked={subscriptionPlan === 3}
                      onChange={() => handlePlanChange(3)}
                    />
                    <span className="ml-2 text-gray-700">Advanced Plan</span>
                  </label>

                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      className="form-radio text-green-600"
                      name="subscriptionPlan"
                      value={4}
                      checked={subscriptionPlan === 4}
                      onChange={() => handlePlanChange(4)}
                    />
                    <span className="ml-2 text-gray-700">Pro Plan</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={payment}
            >
              Subscribe
            </button>

            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
