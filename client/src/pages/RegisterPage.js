import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const validate = (data, regex) => {
  return Boolean(data.match(regex));
};

const validatePassword = (password) => {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,20}$/;
  return validate(password, reg);
};

const validateEmail = (email) => {
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  return validate(email, regex);
};


const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Add this line
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateUserInput = () => {
    const errors = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      errors.password = 'Password is invalid. It should be at least 8 characters with upper and lower case letters, numbers, and special characters';
    }

    return errors;
  };

  const handleSignUp = async () => {
    const inputErrors = validateUserInput();

    // Check if there are any errors
    if (Object.keys(inputErrors).length > 0) {
      setError("Incorrect format of email or password. It should be at least 8 characters with upper and lower case letters, numbers, and special characters");
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/register', {
        username: username,
        user_email: email,
        user_password: password,
        user_role: role, // Add this line
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { data } = response;

      // Handle successful registration
      console.log('Registration successful:', data.message);

      // Display a success toast, with a title
      toast.success("Registration successful!", {
        duration: 3000,
        // Define when the toast shows up
        position: 'top-center',
      });

      // Redirect to the desired page upon successful register
      // Wait for 1 seconds before navigating
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      // Handle registration error
      console.error('Registration error:', error.response.data);
      setError(`Registration failed: ${error.response.data.message || 'Unknown error'}`);

        // Display an error toast, with a title
        toast.error(`Registration failed: ${error.response.data.message || 'Unknown error'}`, {
        position: 'center',
        autoClose: 3000,
  });
    }
  };

return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          {error && <div className="text-red-500 mt-4">{error}</div>}
    <form className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {/* Username */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Role */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
          Role
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
        </select>
      </div>

        <div className="flex items-center justify-between flex-col">
          <button
            onClick={handleSignUp}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-4 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Back to Login
          </button>
        </div>
      </form>

    </div>
  );
};

export default RegisterPage;