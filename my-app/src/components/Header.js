import React from "react";
import { Menu, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="shadow-sm bg-white sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
            N
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            <Link to="/">NaijaFreelance</Link>
          </h1>
        </div>

        {/* Navigation Links – hide on mobile */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <Link to="/browse-jobs" className="hover:text-green-600">Browse Jobs</Link>
          <a href="#top-freelancers" className="hover:text-green-600">Find Freelancers</a>
          <a href="#jobs" className="hover:text-green-600">Post a Job</a>
        </nav>

        {/* Icons / Auth Buttons */}
        <div className="flex items-center gap-4">
          <button className="md:hidden">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Login Link */}
          <Link
            to="/login"
            className="hidden md:block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </Link>

          {/* Sign Up Link */}
          <Link
            to="/signup"
            className="hidden md:block border border-gray-300 px-4 py-2 rounded-lg hover:border-gray-400 transition flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
