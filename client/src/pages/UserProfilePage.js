import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfilePage = ({ token }) =>{

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        // Check if the response has the expected structure
        if (response.data && response.data.data) {
          // Format start_time to mm/dd/yyyy format
          const formattedData = {
            ...response.data.data,
            start_time: new Date(response.data.data.start_time).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            }),
          };

          setUserData(formattedData);
        } else {
          console.error('Unexpected response format:', response);
        }

        //setUserData(response.data.data);
        setLoading(false);
        console.log('User data:', response.data); // Add this line to log the user data
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

    return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:text-center">
            <img className="h-48 w-full object-cover md:w-48 mx-auto sm: rounded-none md:rounded-full" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" alt="Profile Picture" />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Full Stack Developer</div>
            <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{userData?.username}</a>
            <p className="mt-2 text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris. </p>
            <div className="mt-4 mr:auto">
              <div className="flex flex-col">
                <div className="flex flex-row mt-4">
                  <div className="flex-1 ">
                    <span className="text-gray-500">Email</span>
                    <p className="text-black font-semibold">{userData?.user_email}</p>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-500">Phone</span>
                    <p className="text-black font-semibold">(123) 456-7890</p>
                  </div>
                </div>
                <div className="flex flex-row mt-4">
                  <div className="flex-1 ">
                    <span className="text-gray-500">Address</span>
                    <p className="text-black font-semibold">123 Main St, San Francisco, CA 94110</p>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-500">Birthday</span>
                    <p className="text-black font-semibold">January 1, 1990</p>
                  </div>
                </div>
                <div className="flex flex-row mt-4">
                  <div className="flex-1">
                    <span className="text-gray-500">Subscription Package</span>
                    <p className="text-black font-semibold">Premium</p>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-500">Join Day</span>
                    <p className="text-black font-semibold">{userData?.start_time}</p>
                  </div>
                </div>
                <div className="flex flex-row mt-4">
                  <div className="flex-1">
                    <span className="text-gray-500">Uploaded Files</span>
                    <p className="text-black font-semibold">3</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}
export default UserProfilePage;