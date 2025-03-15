import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Home = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const HLogout = async () => {
    // console.log("logout button clicked")
    await logout();
    // console.log("user logout")
    navigate('/signin');
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center">
      {isAuthenticated && (
        <button
          onClick={HLogout}
          className="absolute top-6 right-6 px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
          Anuj Belsare
        </h1>
        <p className="mt-4 text-gray-300">
          Passionate about AI and web development. Building innovative solutions that merge AI with the web.
        </p>

        <div className="mt-6">
          <Link
            to="https://www.linkedin.com/in/anuj-belsare"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 font-bold text-white bg-blue-600 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Connect on LinkedIn
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
