// src/layouts/MainLayout.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout({ children, fullWidth = false }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* SIDEBAR */}
      {!fullWidth && (
        <div
          className={`h-full bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? "w-60" : "w-20"
          }`}
        >
          <Sidebar isOpen={isSidebarOpen} />
        </div>
      )}

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
