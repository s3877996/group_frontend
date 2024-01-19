// src/PaymentHistoryTable.js
import React, { useState, useEffect } from 'react';
import api from '../api.js';

const PaymentHistoryTable = () => {
    const [paymentData, setPaymentData] = useState([]);
    useEffect(() => {
        api.get('/api/users/me/subscription')
            .then(response => {
              console.log(response.data)
              setPaymentData(response.data.data);
            })
            .catch(error => {
              console.error('Error fetching user data:', error);
            });


      }, []);
  return (
        <div className="w-full min-w-max table-auto text-left bg-white rounded-md">
          <div className="p-10 rounded-xl">
            <h2 className="max-w-sm font-bold font-sans">Payment History</h2>
            <br/>
            {/* Add your payment history table content here */}
            <table className="border border-gray-300 w-full table-auto">
              {/* Table headers */}
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Package Name</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Next Payment</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  {/* Add more headers as needed */}
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {paymentData.map((payment) => (
                  <tr key={payment.id}>
                      <td className="py-2 px-4 border-b">{payment.package_name}</td>
                      <td className="py-2 px-4 border-b">{new Date(payment.start_time).toLocaleDateString()} {new Date(payment.start_time).toLocaleTimeString()}</td>
                      <td className="py-2 px-4 border-b">{payment.amount}</td>
                      <td className="py-2 px-4 border-b">{new Date(payment.next_time).toLocaleDateString()} {new Date(payment.next_time).toLocaleTimeString()}</td>
                      <td className="py-2 px-4 border-b">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


  );
};

export default PaymentHistoryTable;
