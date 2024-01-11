import React, {useState , useCallback} from "react";
import { useNavigate } from "react-router-dom";
import {FcGoogle} from 'react-icons/fc';
import { useAuth } from "../provider/authProvider";

import api from '../api.js';
const LoginPage = () => {
    // const API_URL = "http://localhost:5000/api/users/login"
    const [error, setError] = useState(""); // State to store the error message
    const navigate = useNavigate();
    // const signIn = useSignIn();
    const { setToken } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

        try {
          const response = await api.post(
            '/api/users/login',
            {
              email: email,
              password: password,
            }
          );

          const { data } = response;
          console.log(response)

          if (data && data.data && data.data.token) {
            // Save the token to state or local storage for future use
            setToken(data.data.token);
            // localStorage.setItem('token', data.data.token);
            // Check if the user information is directly available in the response
            const userData = data.data ? data.data : data;
            // login(userData);
            // Redirect to the desired page upon successful login

            if(data.data.user_role === "user" ){
                navigate('/home'); // Change '/dashboard' to the desired route
            } else if (data.data.user_role === "admin"){
                navigate('/admin'); // Change '/dashboard' to the desired route
            }

            // Additional logic to handle user information if needed
            console.log('User information:', userData);
          } else {
            // Handle the case where the backend did not provide a token
            console.error('Authentication failed:', 'Token not present in the response');

            setError("Invalid email or password"); // Set error message
          }
        } catch (error) {
          // Handle network errors or other issues
          console.error('Error during login:', error);
          setError("Invalid email or password"); // Set error message
          // Check if the error response contains data
          if (error.response && error.response.data) {
            const { data } = error.response;

            // Check if the error response contains a token
            if (data && data.token) {
              // Handle the case where the backend provided a token unexpectedly
              console.error('Unexpected token in the error response:', data.token);
            } else {
              // Handle the case where the expected token is not present
              console.error('Expected token not present in the error response:', data);
            }
          } else {
            console.error('No error response from server');
            setError("Something went wrong. Please try again."); // Set a generic error message
          }
        }
  };

    return (
        <div className="flex flex-row min-h-screen justify-center">
            {/*Slogan left hand side container*/}
            <div className="sm:w-1/2 bg-green-500 text-white flex items-center justify-center ">
                <div className="hidden sm:block ">
                    <div className="text:1xl 2xl:text-4xl xl:text-3xl lg:text:2xl md:text:2xl mb-2">The perfect mate for your next adventure.</div>
                </div>
            </div>
            {/*Slogan left hand side container*/}

            {/*Right hand side Container  Container*/}
            <div className="sm:w-1/2 bg-white flex items-center justify-center">
                <div className="w-full max-w-xl px-8 py-6 lg:mx-8 rounded-md ">
                    <h1 className="text-4xl md:text-4xl lg:text-5xl mb-6 text-center">Welcome Back</h1>

                    {/*Login Form*/}
                    <form className="flex flex-col gap-4"  onSubmit={handleSubmit}>

                        {/*Email*/}
                        <div className="flex flex-col py-2">
                            <label className="text-black flex">Email</label>
                            <input className="text-black rounded-md bg-green-100 mt-2 p-2 focus:border-green-500 focus:bg-greem-200 focus:outline-none w-full md:w-auto"
                                   type= "text"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}

                            />
                        </div>
                        {/*Email*/}

                        {/*Password*/}
                        <div className="flex flex-col text-black py-2">
                            <label className="text-black flex">Password</label>
                            <input
                                className="rounded-md bg-green-100 mt-2 p-2 focus:border-green-500 focus:bg-green-200 focus:outline-none w-full md:w-auto"
                                type= "password"

                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        {/*Password*/}

                        {/* Display the error message with Tailwind CSS */}
                        {error && <div className="text-red-500">{error}</div>}

                        {/*Login button*/}
                        <div className="flex flex-col text-white py-2 bg-green-600 rounded-lg font-bold hover:bg-green-700 hover:scale-105 duration-300">
                            <button type="submit" className="" >
                                Log In
                            </button>
                        </div>
                        {/*Login button*/}

                    </form>
                    {/*Login Form*/}


                    <div className="mt-10 grid grid-cols-3 items-center text-black">
                        <hr className="border-gray-400"/>
                        <p className="text-center">OR</p>
                        <hr className="border-gray-400"/>
                    </div>

                    {/*Login with Google button*/}
                    <button className="bg-white border-2 py-2 w-full rounded-xl mt-5 flex justify-center items-center hover:bg-gray-100 hover:scale-105 duration-300">
                        <FcGoogle className="mr-3" size={22}/>
                        Login with Google
                    </button>
                    {/*Login with Google button*/}

                    <div className="mt-5 text-xs flex justify-between items-center">
                        <p className="text-decoration-line: underline">Don't have an account?</p>
                        <button className="py-2 px-5 text-white bg-green-600 font-bold border rounded-xl hover:scale-105 duration-300" onClick={() => navigate('/register')}>Register</button>
                    </div>

                    <br />


                </div>
            </div>
            {/*Right-hand side Container*/}

        </div>
    )
};

export default LoginPage;



