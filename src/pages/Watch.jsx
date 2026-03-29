import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Comments from "../components/Comments";

function Watch() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subsCount, setSubsCount] = useState(0);

  // 🔥 Fetch single video + increment view count
  const fetchVideo = async () => {
    try {
      const res = await API.get(`/videos/${videoId}`);
      const data = res.data.data;

      setVideo(data);
      setLiked(data.isLiked || false);
      setLikesCount(data.likesCount || 0);

      return data;
    } catch (error) {
      console.error("❌ Fetch video error:", error);
      if (error.response?.status === 404) {
        alert("Video not found");
        navigate("/");
      }
      return null;
    }
  };

  // 🔥 Add to Watch History
  const addToWatchHistory = async () => {
    try {
      await API.post(`/users/history/${videoId}`);
      console.log("✅ Added to watch history");
    } catch (error) {
      console.error("Failed to add to watch history:", error);
      // Silent fail - don't break video watching experience
    }
  };

  // 🔥 Fetch recommended videos for sidebar
  const fetchVideos = async () => {
    try {
      const res = await API.get("/videos");
      setVideos(res.data.data?.videos || []);
    } catch (error) {
      console.error("❌ Fetch videos error:", error);
    }
  };

  // 🔥 Fetch channel subscription stats
  const fetchChannelStats = async (channelId) => {
    if (!channelId) return;

    try {
      const res = await API.get(`/subscriptions/stats/${channelId}`);
      setIsSubscribed(res.data.data.isSubscribed || false);
      setSubsCount(res.data.data.subscribersCount || 0);
    } catch (error) {
      console.error("❌ Fetch stats error:", error);
    }
  };

  // 🔥 Subscribe / Unsubscribe
  const handleSubscribe = async () => {
    if (!video?.owner?._id) return;

    const channelId = video.owner._id;
    const wasSubscribed = isSubscribed;

    setIsSubscribed(!wasSubscribed);
    setSubsCount((prev) => (wasSubscribed ? prev - 1 : prev + 1));

    try {
      await API.post(`/subscriptions/toggle/${channelId}`);
    } catch (error) {
      console.error("❌ Subscribe error:", error);
      setIsSubscribed(wasSubscribed);
      setSubsCount((prev) => (wasSubscribed ? prev + 1 : prev - 1));
      alert("Failed to update subscription");
    }
  };

  // 🔥 Like / Unlike
  const handleLike = async () => {
    const newLiked = !liked;

    setLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));

    try {
      await API.post(`/likes/toggle/v/${videoId}`);
    } catch (error) {
      console.error("❌ Like error:", error);
      setLiked(!newLiked);
      setLikesCount((prev) => (newLiked ? prev - 1 : prev + 1));
    }
  };

  // 🔄 Main load function
  useEffect(() => {
    if (!videoId) return;

    const loadData = async () => {
      setLoading(true);

      const videoData = await fetchVideo();
      await fetchVideos();

      // Add to watch history after video is loaded
      if (videoData) {
        await addToWatchHistory();
      }

      setLoading(false);
    };

    loadData();
  }, [videoId]);

  // 🔄 Load channel stats after video loads
  useEffect(() => {
    if (video?.owner?._id) {
      fetchChannelStats(video.owner._id);
    }
  }, [video?.owner?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading video...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 text-xl">Video not found</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6">
      {/* LEFT SIDE - Main Video Content */}
      <div className="flex-1">
        {/* Video Player */}
        <div className="w-full bg-black aspect-video rounded-xl overflow-hidden">
          <video
            src={video.videoFile}
            controls
            className="w-full h-full"
            autoPlay
          />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold mt-4">{video.title}</h1>

        {/* Views + Date + Actions */}
        <div className="flex justify-between items-center mt-3 text-sm">
          <p className="text-gray-600">
            {video.views?.toLocaleString() || 0} views •{" "}
            {new Date(video.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleLike}
              className={`px-5 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 ${
                liked
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              👍 {likesCount.toLocaleString()}
            </button>

            <button className="bg-gray-100 hover:bg-gray-200 px-5 py-1.5 rounded-full font-medium">
              🔁 Share
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 px-5 py-1.5 rounded-full font-medium">
              💾 Save
            </button>
          </div>
        </div>

        {/* Channel Info + Subscribe */}
        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <div className="flex items-center gap-3">
            <img
              src={video.owner?.avatar || "/default-avatar.png"}
              alt={video.owner?.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold">{video.owner?.username}</h4>
              <p className="text-sm text-gray-500">{video.owner?.fullName}</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-full font-medium transition-all min-w-[140px] ${
                isSubscribed
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {isSubscribed ? "Subscribed ✓" : "Subscribe"}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              {subsCount.toLocaleString()} subscribers
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-100 p-4 rounded-lg mt-4 text-sm whitespace-pre-wrap">
          {video.description}
        </div>

        {/* Comments */}
        <Comments videoId={videoId} />
      </div>

      {/* RIGHT SIDE - Recommended Videos */}
      <div className="w-[380px] flex-shrink-0 hidden lg:block">
        <h3 className="font-semibold mb-4 text-lg">Up next</h3>
        <div className="flex flex-col gap-4">
          {videos
            .filter((v) => v._id !== videoId)
            .slice(0, 8)
            .map((v) => (
              <div
                key={v._id}
                onClick={() => navigate(`/watch/${v._id}`)}
                className="flex gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-2 leading-tight">
                    {v.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {v.owner?.username || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {v.views?.toLocaleString() || 0} views
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Watch;
