import { useEffect, useState } from "react"
import API from "../services/api"

const Like = () => {
  const [videos, setVideos] = useState([])
  const [comments, setComments] = useState([])
  const [tweets, setTweets] = useState([])

  const fetchAllLikes = async () => {
    try {
      const [videoRes, commentRes, tweetRes] = await Promise.all([
        API.get("/likes/videos"),
        API.get("/likes/comments"),
        API.get("/likes/tweets"),
      ])

      setVideos(videoRes.data.data.map(v => v.video))
      setComments(commentRes.data.data.map(c => c.comment))
      setTweets(tweetRes.data.data.map(t => t.tweet))
    } catch (error) {
      console.error("Error fetching likes:", error)
    }
  }

  useEffect(() => {
    fetchAllLikes()
  }, [])

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">❤️ Your Likes</h1>

      {/* VIDEOS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          🎬 Liked Videos ({videos.length})
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {videos.map(video => (
            <div key={video._id}>
              <img src={video.thumbnail} className="rounded" />
              <p>{video.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMMENTS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          💬 Liked Comments ({comments.length})
        </h2>

        {comments.map(comment => (
          <div key={comment._id} className="border p-3 rounded mb-2">
            <p className="font-semibold">
              {comment.owner?.username}
            </p>
            <p>{comment.content}</p>
          </div>
        ))}
      </section>

      {/* TWEETS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          🐦 Liked Tweets ({tweets.length})
        </h2>

        {tweets.map(tweet => (
          <div key={tweet._id} className="border p-3 rounded mb-2">
            <p className="font-semibold">
              {tweet.owner?.username}
            </p>
            <p>{tweet.content}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Like