import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaThumbsUp,
  FaComment,
  FaThumbsDown,
  FaDownload,
  FaTimes,
} from "react-icons/fa";
import "./SermonDetail.css";
import sermonVid from "../assets/hci.mp4";
import vidmed from "../assets/vidmed.jpg";

const SermonDetail = () => {
  const { id } = useParams();
  const [sermons, setSermon] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { sermon } = location.state || {};

  console.log(sermon);

  // useEffect(() => {
  //   // Fetch the sermon based on ID
  //   const fetchSermon = async () => {
  //     const sermonData = {
  //       id,
  //       title: "The Power of Faith",
  //       description: "A deep dive into how faith works in our lives.",
  //       videoUrl: sermonVid,
  //       likes: 120,
  //     };
  //     const commentsData = [
  //       { id: 1, user: "John Doe", comment: "Amazing sermon!" },
  //       { id: 2, user: "Jane Smith", comment: "Very uplifting!" },
  //     ];
  //     setSermon(sermonData);
  //     setComments(commentsData);
  //     setLikes(sermonData.likes);
  //   };

  //   fetchSermon();
  // }, [id]);

  const handleLike = () => {
    setLikes(likes + 1);
    // Send the updated like count to the backend
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() === "") return;

    const newCommentData = {
      id: comments.length + 1,
      user: "Current User",
      comment: newComment,
    };
    setComments([...comments, newCommentData]);
    setNewComment("");
    // Send the new comment to the backend
  };

  if (!sermon) {
    return <div>Loading...</div>;
  }

  return (
    <div className='sermon-detail-page'>
      <FaTimes
        onClick={() => navigate("/sermons")}
        style={{
          position: "absolute",
          right: "30px",
          cursor: "pointer",
          color: "#284268",
        }}
      />
      <h2>{sermon.title}</h2>

      {/* Video Player */}
      <div className='video-container'>
        {sermon.mediaType === "audio" ? (
          <audio controls className='audio-player'>
            <source
              src={`http://localhost:3000/${sermon.video}`}
              type='audio/mp3'
            />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <div className='video-thumbnail'>
            <video
              src={`http://localhost:3000/${sermon.video}`}
              className='video-preview'
              autoPlay
              loop
            />
          </div>
        )}
      </div>

      <div
        style={{
          textAlign: "center",
          width: "80px",
          cursor: "pointer",
          background: " rgb(236, 243, 246)",
          padding: "5px",
        }}
      >
        <FaDownload />
        <p>Download</p>
      </div>

      <p className='sermon-description'>{sermon.description}</p>

      <div className='single-Resource-prof'>
        <div className='single-Resource-prof-leftside'>
          <div className='profImage'>
            <img src={vidmed} alt='image here' />
          </div>

          <div>
            <p style={{ fontWeight: "bold" }}>{sermon.speaker}</p>
            <p>Head Pastor</p>
          </div>
        </div>
        <p style={{ marginTop: "10px" }}>Thur Dec.4</p>
      </div>

      {/* Like and Comment Section */}
      <div className='like-comment-section'>
        <div className='like-button' onClick={handleLike}>
          <FaThumbsUp /> {likes} Likes
        </div>

        <div className='like-button'>
          <FaComment /> 12 Comments
        </div>
      </div>

      {/* Add New Comment */}
      <div className='new-comment'>
        <textarea
          placeholder='Add a comment...'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={""}>
          <FaComment /> add Comment
        </button>
      </div>

      {/* Comments Section */}
      <div className='comments-section'>
        <h3>Comments</h3>

        {comments.map(({ user, comment }, index) => {
          return (
            <div style={{ marginBottom: "50px" }} key={index}>
              <div className='single-Resource-prof'>
                <div className='single-Resource-prof-leftside'>
                  <div className='profImage'>
                    <img src={vidmed} alt='image here' />
                  </div>

                  <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                    {user}
                  </p>
                </div>
                <p style={{ marginTop: "10px" }}>Thur Dec.4</p>
              </div>
              <div className='comments-info' style={{ paddingInline: "20px" }}>
                {comment}
              </div>
              <div className='react-buttons'>
                <div className='up-reactions'>
                  <FaThumbsUp style={{ cursor: "pointer" }} />
                  <p className='up-value'>1</p>
                </div>
                <div className='up-reactions'>
                  <FaThumbsDown style={{ cursor: "pointer" }} />
                  <p className='up-value'>1</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SermonDetail;
