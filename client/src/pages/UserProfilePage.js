import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navigation/Navbar";
const UserProfilePage = ({ token }) => {

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const storedToken = localStorage.getItem('token');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [formattedStartTime, setformattedStartTime] = useState('');
    const navigate = useNavigate();


    const handleEditUserProfile = () => {
        navigate('/profile');
    }

    useEffect(() => {
        // if (storedToken){
        // setAuthToken(storedToken);
        api.get('/api/users/me') // Assuming this is backend endpoint
            .then(response => {
                const userData = response.data.data;

                // Format start_time
                const formattedStartTime = new Date(userData.start_time).toLocaleDateString('en-US');
                setUserData(response.data.data);
                setFullname(response.data.data.fullname)
                setPhone(response.data.data.phone)
                setformattedStartTime(formattedStartTime);
                console.log(response.data)

                /*document.getElementById("username").innerHTML = `${userData.username}`;
                document.getElementById("email").innerHTML = `${userData.user_email}`;
                document.getElementById("packageId").innerHTML = `${userData.package_id}`;*/
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        // else{
        //     navigate('/login');
        // }
        // Fetch user data from the backend when the component mounts
        // Replace the URL with  actual backend endpoint

    }, [navigate]);





    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Navbar />
            <div className="flex bg-gray-100 min-h-screen items-center justify-center p-4 md:p-8"> {/* Updated: Added padding for small screens */}
                        <div className="flex-grow mx-auto max-w-md lg:max-w-3xl  bg-white rounded-xl shadow-md overflow-hidden "> {/* Updated: Adjusted max-w classes */}
                    <div className="md:flex">
                        <div className="md:flex-shrink-0 md:text-center">
                            <img className="h-48 w-full object-cover md:w-48 mx-auto sm:rounded-none md:rounded-full" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" alt="Profile Picture" />
                        </div>
                                    <div className="p-8 w-full md:w-2/3 lg:w-1/2 xl:w-2/3"> {/* Updated: Set width to full on small screens, and adjust on larger screens */}
                            <div className="uppercase tracking-wide text-sm text-green-500 font-semibold">Account</div>
                            <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{userData?.user_email}</a>
                            <div className="mt-4 mr:auto">
                                <div className="flex flex-col">
                                    <div className="flex flex-row mt-4">
                                        <div className="flex-1 ">
                                            <span className="text-gray-500">Username</span>
                                            <p className="text-black font-semibold">{userData?.username}</p>
                                        </div>
                                        <div className="flex-1 ml-6">
                                            <span className="text-gray-500">Available upload file</span>
                                            <p className="text-black font-semibold break-all">{userData?.available_doc}</p> {/* Updated: Use break-all class */}
                                        </div>
                                    </div>

                                    <div className="flex flex-row mt-4">
                                        <div className="flex-1">
                                            <span className="text-gray-500">Fullname</span>
                                            <p className="text-black font-semibold break-all">{userData?.fullname}</p>
                                        </div>
                                        <div className="flex-1 ml-6">
                                            <span className="text-gray-500">Phone number</span>
                                            <p className="text-black font-semibold break-all">{userData?.phone}</p> {/* Updated: Use break-all class */}
                                        </div>
                                    </div>

                                    <div className="flex flex-row mt-4">
                                        <div className="flex-1">
                                            <span className="text-gray-500 break-all">Subscription Type</span>
                                            <p className="text-black font-semibold">{userData?.package_name}</p>
                                        </div>
                                        <div className="flex-1 ml-6">
                                            <span className="text-gray-500">Join Day</span>
                                            <p className="text-black font-semibold">{formattedStartTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button type="button" onClick={handleEditUserProfile} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default UserProfilePage;


