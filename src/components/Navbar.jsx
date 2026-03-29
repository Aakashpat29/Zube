// src/components/Navbar.jsx
import { Link } from "react-router-dom";

function Navbar({ toggleSidebar }) {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="h-14 bg-white border-b flex items-center px-4">
      <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-3 hover:bg-gray-100 rounded-full text-2xl"
          >
            ☰
          </button>
          <Link to="/" className="flex items-center gap-1">
            <span className="text-3xl text-red-600">▶️</span>
            <span className="text-2xl font-bold">YouTube</span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="flex border border-gray-300 rounded-full">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 px-5 py-2 focus:outline-none"
            />
            <button className="px-7 bg-gray-100 border-l hover:bg-gray-200">
              🔍
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/upload"
            className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100 rounded-full"
          >
            📤 Upload
          </Link>
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-black text-white px-6 py-2 rounded-full"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full">
                Sign in
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
