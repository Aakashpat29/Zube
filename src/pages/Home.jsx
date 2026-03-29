// src/pages/Home.jsx
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import VideoCard from "../components/VideoCard.jsx";
import API from "../services/api";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async (searchQuery = "") => {
      try {
        setLoading(true);

        const endpoint = searchQuery
          ? `/videos?query=${encodeURIComponent(searchQuery)}`
          : "/videos";

        const res = await API.get(endpoint);

        setVideos(res.data?.data?.videos || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </MainLayout>
  );
}

export default Home;
