import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow mb-6">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/notes" className="font-bold text-xl text-blue-600">AI Notes Summarizer</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/notes" className="hover:underline">My Notes</Link>
              <Link to="/profile" className="hover:underline">{user.username}</Link>
              <button onClick={handleLogout} className="ml-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 