import React, { useEffect, useState } from "react";
import { FaEdit, FaTimes, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ChristianLibrary.css";
import axios from "axios";

const ChristianLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(true); // Modify based on actual admin status
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    type: "Book", // or "Article", "Audio"
    description: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [media, setMedia] = useState(null);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/churchapp/library"
        );
        setResources(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching sermons:", err);
      }
    };
    fetchSermons();
  }, []);

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") setThumbnail(files[0]);
    else if (name === "media") setMedia(files[0]);
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("description", formData.description);
    data.append("type", formData.type);
    if (thumbnail) data.append("thumbnail", thumbnail);
    if (media) data.append("media", media);

    try {
      const response = await axios.post(
        "http://localhost:3000/churchapp/library/upload",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("library uploaded:", response.data);
      setResources([response.data, ...resources]); // Add the new library resource to the list
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to upload library resource. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:3000/churchapp/events/${id}`);
        setEvents((prev) => prev.filter((event) => event._id !== id));
        alert("Event deleted successfully.");
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleCardClick = (resourceId) => {
    navigate(`/library/${resourceId}`);
  };

  return (
    <div className='library-page'>
      <FaTimes
        onClick={() => navigate("/events")}
        style={{
          position: "absolute",
          right: "30px",
          cursor: "pointer",
          color: "#284268",
        }}
      />
      <div className='library-header'>
        <h2 className='library-page-heading'>Christian Library</h2>
        <FaTimes
          className='close-icon'
          onClick={() => navigate("/events")}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Search Bar */}
      <div className='library-page-search'>
        <input
          type='text'
          className='search-bar'
          placeholder='Search for books, articles, etc...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Admin Upload Button */}
      {isAdmin && (
        <div className='admin-library-upload-button'>
          <button onClick={() => setIsModalOpen(true)}>
            Upload New Resource
          </button>
        </div>
      )}

      {/* Resources Grid */}
      <div className='resources-grid'>
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className='resource-card'
              onClick={() => handleCardClick(resource.id)}
              onMouseEnter={() => setHoveredCard(resource._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img
                src={resource.image}
                alt={resource.title}
                className='resource-image'
              />
              <div className='resource-details'>
                <h3>{resource.title}</h3>
                <p>Author: {resource.author}</p>
                <p>Type: {resource.type}</p>
                <p>Date:{formatDate(resource.createdAt)}</p>
                <p>{resource.description}</p>
                <a href={resource.fileUrl} target='_blank' rel='noreferrer'>
                  View Resource
                </a>
              </div>

              {isAdmin && hoveredCard === resource._id && (
                <div className='card-actions'>
                  <button
                    className='edit-button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(resource._id);
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className='delete-button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(resource._id);
                    }}
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No resources match your search.</p>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h2>Upload New Resource</h2>
            <form className='upload-form' onSubmit={handleSubmit}>
              <label>
                Title:
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Author:
                <input
                  type='text'
                  name='author'
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Type:
                <select
                  name='type'
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value='Book'>Book</option>
                  <option value='Article'>Article</option>
                  <option value='Audio'>Audio</option>
                </select>
              </label>
              <label>
                Description:
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Thumbnail:
                <input
                  type='file'
                  name='thumbnail'
                  accept='image/*'
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Resource File:
                <input
                  type='file'
                  name='media'
                  accept='.pdf,.mp3'
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type='submit' disabled={isLoading}>
                {isLoading ? "Uploading..." : "Upload Sermon"}
              </button>
            </form>
            <button
              className='cancelBtn'
              style={{ marginBlock: "20px" }}
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChristianLibrary;
