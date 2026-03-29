// components/VideoCard.jsx
import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {
  const navigate = useNavigate();

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      onClick={() => navigate(`/watch/${video._id}`)}
      className="cursor-pointer group"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Duration Badge */}
        {video.duration > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>
      {/* Video Details */}
      <div className="flex gap-3 mt-3">
        {/* Channel Avatar */}
        <img
          src={video.owner?.avatar || "/default-avatar.png"}
          alt={video.owner?.username}
          className="w-9 h-9 rounded-full flex-shrink-0 mt-1"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[15px] leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {video.title}
          </h3>

          <p className="text-sm text-gray-600 mt-2">
            {video.owner?.username || video.owner?.fullName}
          </p>

          <p className="text-sm text-gray-600">
            {video.views} views •{" "}
            {new Date(video.createdAt || Date.now()).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
              },
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
