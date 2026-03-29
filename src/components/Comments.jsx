import { useEffect, useState } from "react";
import API from "../services/api";

function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Reply state
  const [replies, setReplies] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [replyInput, setReplyInput] = useState({});

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${videoId}`);
      setComments(res.data.data.comments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await API.post(`/comments/${videoId}`, {
        content: newComment,
      });

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  // Like comment (Optimistic)
  const handleCommentLike = async (commentId) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId
          ? {
              ...c,
              isLiked: !c.isLiked,
              likesCount: c.isLiked
                ? c.likesCount - 1
                : c.likesCount + 1,
            }
          : c
      )
    );

    try {
      await API.post(`/likes/toggle/c/${commentId}`);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch replies
  const fetchReplies = async (commentId) => {
    const res = await API.get(`/comments/replies/${commentId}`);

    setReplies((prev) => ({
      ...prev,
      [commentId]: res.data.data,
    }));
  };

  // Toggle replies
  const toggleReplies = async (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    if (!replies[commentId]) {
      await fetchReplies(commentId);
    }
  };

  // Add reply
  const handleAddReply = async (commentId) => {
    const content = replyInput[commentId];
    if (!content?.trim()) return;

    try {
      await API.post(`/comments/${videoId}`, {
        content,
        parentComment: commentId,
      });

      setReplyInput((prev) => ({ ...prev, [commentId]: "" }));
      fetchReplies(commentId);
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const past = new Date(date);

    const diffInSeconds = Math.floor((now - past) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);

    if (diffInSeconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days < 7) return `${days} days ago`;

    return past.toLocaleDateString();
  };

  useEffect(() => {
    if (videoId) fetchComments();
  }, [videoId]);

  return (
    <div className="mt-6">

      {/* Title */}
      <h2 className="text-lg font-semibold mb-4">
        Comments ({comments.length})
      </h2>

      {/* Add Comment */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Post
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Loading comments...</p>}

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">

            {/* Avatar */}
            <img
              src={comment.owner?.avatar || "/default-avatar.png"}
              className="w-10 h-10 rounded-full"
            />

            <div className="flex-1">

              {/* Username */}
              <p className="text-sm font-semibold">
                {comment.owner?.username}
                <span className="text-gray-500 text-xs ml-2">
                  • {formatTime(comment.createdAt)}
                </span>
              </p>

              {/* Content */}
              <p className="text-sm">{comment.content}</p>

              {/* Actions */}
              <div className="flex flex-col mt-2 text-sm">

                {/* Row 1 */}
                <div className="flex gap-4">

                  {/* Like */}
                  <button
                    onClick={() => handleCommentLike(comment._id)}
                    className={`flex items-center gap-1 ${
                      comment.isLiked ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    👍 {comment.likesCount || 0}
                  </button>

                  {/* Reply */}
                  <button
                    onClick={() => toggleReplies(comment._id)}
                    className="text-gray-500"
                  >
                    Reply
                  </button>

                </div>

                {/* View Replies */}
                {comment.repliesCount > 0 && (
                  <button
                    onClick={() => toggleReplies(comment._id)}
                    className="text-blue-500 mt-1"
                  >
                    {showReplies[comment._id]
                      ? "Hide replies ▲"
                      : `View ${comment.repliesCount} replies ▼`}
                  </button>
                )}

              </div>

              {/* Reply Input */}
              {showReplies[comment._id] && (
                <div className="mt-2 flex gap-2">
                  <input
                    value={replyInput[comment._id] || ""}
                    onChange={(e) =>
                      setReplyInput((prev) => ({
                        ...prev,
                        [comment._id]: e.target.value,
                      }))
                    }
                    placeholder="Write a reply..."
                    className="border px-2 py-1 text-sm rounded w-full"
                  />
                  <button
                    onClick={() => handleAddReply(comment._id)}
                    className="text-blue-500"
                  >
                    Send
                  </button>
                </div>
              )}

              {/* Replies */}
              {showReplies[comment._id] && (
                <div className="ml-6 mt-3">
                  {replies[comment._id]?.map((reply) => (
                    <div key={reply._id} className="flex gap-2 mb-2">
                      <img
                        src={reply.owner?.avatar || "/default-avatar.png"}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <p className="text-xs font-semibold">
                          {reply.owner?.username}
                          <span className="text-gray-400 ml-2">
                            • {formatTime(reply.createdAt)}
                          </span>
                        </p>
                        <p className="text-xs">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {!loading && comments.length === 0 && (
        <p className="text-gray-500">No comments yet</p>
      )}
    </div>
  );
}

export default Comments;