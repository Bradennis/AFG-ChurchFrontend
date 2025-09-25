import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaThumbsUp,
  FaComment,
  FaThumbsDown,
  FaDownload,
  FaTimes,
} from "react-icons/fa";
import "./SermonDetail.css";
import vidmed from "../assets/vidmed.jpg";
const ChristianLibraryDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the resource based on ID
    const fetchResource = async () => {
      const resourceData = {
        id,
        title: "Faith in Action",
        description:
          "A guide to living a faith-filled life according to the Bible.",
        fileUrl: "/path-to-pdf-or-ebook",
        likes: 85,
      };
      const commentsData = [
        { id: 1, user: "John Doe", comment: "Very insightful!" },
        { id: 2, user: "Jane Smith", comment: "Great read, thanks!" },
      ];
      setResource(resourceData);
      setComments(commentsData);
      setLikes(resourceData.likes);
    };

    fetchResource();
  }, [id]);

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

  if (!resource) {
    return <div>Loading...</div>;
  }

  return (
    <div className='resource-detail-page'>
      <FaTimes
        onClick={() => navigate("/christian-library")}
        style={{
          position: "absolute",
          right: "30px",
          cursor: "pointer",
          color: "#284268",
        }}
      />
      <h2>{resource.title}</h2>

      {/* Resource Display Section */}
      <div className='resource-container'>
        <img src={vidmed} alt='Resource Cover' className='resource-cover' />
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

      <p className='resource-description'>{resource.description}</p>

      <div className='single-Resource-prof'>
        <div className='single-Resource-prof-leftside'>
          <div className='profImage'>
            <img src={vidmed} alt='Author Image' />
          </div>

          <div>
            <p style={{ fontWeight: "bold" }}>Author: Jane Doe</p>
          </div>
        </div>
        <p style={{ marginTop: "10px" }}>Published: Jan 10, 2023</p>
      </div>

      {/* Like and Comment Section */}
      <div className='like-comment-section'>
        <div className='like-button' onClick={handleLike}>
          <FaThumbsUp /> {likes} Likes
        </div>

        <div className='like-button'>
          <FaComment /> {comments.length} Comments
        </div>
      </div>

      {/* Add New Comment */}
      <div className='new-comment'>
        <textarea
          placeholder='Add a comment...'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>
          <FaComment /> Add Comment
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

                  <div>
                    <p style={{ fontWeight: "bold" }}>Pas Alimo</p>
                    <p>Head Pastor</p>
                  </div>
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

export default ChristianLibraryDetail;
