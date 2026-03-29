import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";
import VideoCard from "../components/VideoCard";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Watch History
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/history");
      setHistory(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch watch history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear entire watch history
  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all watch history?")) {
      return;
    }

    try {
      await API.delete("/users/history/clear");
      setHistory([]);
      alert("Watch history cleared successfully");
    } catch (error) {
      console.error("Failed to clear history:", error);
      alert("Failed to clear history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Watch History</h1>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-5 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full font-medium transition"
            >
              🗑️ Clear History
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 aspect-video rounded-xl"></div>
                <div className="mt-3 h-4 bg-gray-300 rounded"></div>
                <div className="mt-2 h-3 bg-gray-300 rounded w-3/5"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && history.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-2xl font-semibold text-gray-400">
              No watch history yet
            </h2>
            <p className="text-gray-500 mt-2">
              Videos you watch will appear here
            </p>
          </div>
        )}

        {/* History Videos */}
        {!loading && history.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {history.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default History;
