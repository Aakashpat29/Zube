// components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCompass,
  FiPlayCircle,
  FiClock,
  FiThumbsUp,
  FiUser,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import API from "../services/api";

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [subscriptions, setSubscriptions] = useState([]);

  const menuItems = [
    { icon: <FiHome size={24} />, label: "Home", path: "/" },
    { icon: <FiCompass size={24} />, label: "Explore", path: "/explore" },
    { icon: <FiPlayCircle size={24} />, label: "Shorts", path: "/shorts" },
    { icon: <FiClock size={24} />, label: "History", path: "/history" },
    { icon: <FiThumbsUp size={24} />, label: "Liked videos", path: "/likes" },
  ];

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await API.get("/subscriptions/my");
        setSubscriptions(res.data.data || []);
      } catch (error) {
        // silent fail
      }
    };

    if (localStorage.getItem("token")) {
      fetchSubscriptions();
    }
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Fixed only on mobile, better behavior on desktop */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r z-50 transition-all duration-300 overflow-y-auto shadow-xl
          ${isOpen ? "w-72" : "w-0 md:w-72"} 
          md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="pt-16 px-3 pb-8 md:pt-4">
          {/* Main Menu */}
          <div className="space-y-1 mb-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-6 px-6 py-[14px] rounded-xl hover:bg-gray-100 transition-all text-[15px]
                  ${
                    location.pathname === item.path
                      ? "bg-gray-100 font-medium text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Subscriptions Section */}
          {subscriptions.length > 0 && (
            <>
              <div className="px-6 mb-3">
                <h3 className="text-xs font-semibold text-gray-500 tracking-widest">
                  SUBSCRIPTIONS
                </h3>
              </div>
              <div className="space-y-1 mb-8">
                {subscriptions.slice(0, 8).map((sub) => (
                  <Link
                    key={sub.channel?._id}
                    to={`/channel/${sub.channel?.username}`}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100 rounded-xl text-sm"
                  >
                    <img
                      src={sub.channel?.avatar || "/default-avatar.png"}
                      className="w-8 h-8 rounded-full object-cover"
                      alt={sub.channel?.username}
                    />
                    <span className="truncate">{sub.channel?.username}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Footer Links */}
          <div className="px-6 text-xs text-gray-500 space-y-4 mt-10">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <span>About</span>
              <span>Press</span>
              <span>Copyright</span>
              <span>Contact us</span>
              <span>Creators</span>
              <span>Advertise</span>
              <span>Developers</span>
            </div>
            <p>© 2026 Aakash YouTube Clone</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
