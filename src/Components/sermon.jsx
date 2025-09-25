import React, { useState, useEffect } from "react";
import { FaEdit, FaTimes, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SermonPage.css";

const SermonPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(true); // Change based on user role
  const [sermons, setSermons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    date: "",
    description: "",
    mediaType: "",
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
          "http://localhost:3000/churchapp/sermon"
        );
        setSermons(response.data);
      } catch (err) {
        console.error("Error fetching sermons:", err);
      }
    };
    fetchSermons();
  }, []);

  const filteredSermons = sermons.filter(
    (sermon) =>
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.description.toLowerCase().includes(searchTerm.toLowerCase())
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
    data.append("speaker", formData.speaker);
    data.append("date", formData.date);
    data.append("description", formData.description);
    data.append("mediaType", formData.mediaType);
    if (thumbnail) data.append("thumbnail", thumbnail);
    if (media) data.append("media", media);

    try {
      const response = await axios.post(
        "http://localhost:3000/churchapp/sermon/createSermon",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSermons([response.data, ...sermons]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to upload sermon. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sermon?")) {
      try {
        await axios.delete(`http://localhost:3000/churchapp/sermon/${id}`);
        setSermons((prev) => prev.filter((sermon) => sermon._id !== id));
        alert("Sermon deleted successfully.");
      } catch (error) {
        console.error("Error deleting sermon:", error);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-sermon/${id}`);
  };

  const handleSermonClick = (id) => {
    navigate(`/sermon/${id}`);
  };

  return (
    <div className='sermon-page'>
      <div className='sermon-header'>
        <FaTimes
          onClick={() => navigate("/events")}
          style={{
            position: "absolute",
            right: "30px",
            cursor: "pointer",
            color: "#284268",
          }}
        />
        <h2 className='sermon-page-heading'>Sermons</h2>
        {isAdmin && (
          <button
            className='upload-button'
            onClick={() => setIsModalOpen(true)}
          >
            Upload New Sermon
          </button>
        )}
      </div>

      <div className='sermon-search'>
        <input
          type='text'
          className='search-bar'
          placeholder='Search for sermons...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='events-grid'>
        {filteredSermons.length > 0 ? (
          filteredSermons.map((sermon) => (
            <div
              key={sermon._id}
              className='event-card'
              onClick={() => handleSermonClick(sermon._id)}
              onMouseEnter={() => setHoveredCard(sermon._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {sermon.mediaType === "audio" ? (
                <>
                  {hoveredCard === sermon._id ? (
                    <audio controls className='audio-player'>
                      <source
                        src={`http://localhost:3000/${sermon.video}`}
                        type='audio/mp3'
                      />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <div className='video-thumbnail'>
                      <img
                        src={`http://localhost:3000/${sermon.thumbnail}`}
                        alt={sermon.title}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div>
                  {hoveredCard === sermon._id ? (
                    <video
                      src={`http://localhost:3000/${sermon.video}`}
                      className='video-preview'
                      autoPlay
                      loop
                    />
                  ) : (
                    <div className='video-thumbnail'>
                      <img
                        src={`http://localhost:3000/${sermon.thumbnail}`}
                        alt={sermon.title}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className='event-details'>
                <h3>{sermon.title}</h3>
                <p>Speaker: {sermon.speaker}</p>
                <p>Date: {new Date(sermon.date).toLocaleDateString()}</p>
                <p>{sermon.description}</p>
              </div>

              {isAdmin && (
                <div id={sermon._id} className='popup-buttons'>
                  <button
                    className='btn-edit'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(sermon._id);
                    }}
                  >
                    <FaEdit /> Update
                  </button>
                  <button
                    className='btn-delete'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(sermon._id);
                    }}
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No sermons match your search.</p>
        )}
      </div>

      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            {error && <p className='error-message'>{error}</p>}
            <h2>Upload New Sermon</h2>
            <form className='upload-form' onSubmit={handleSubmit}>
              <label>Title:</label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <label>Speaker:</label>
              <input
                type='text'
                name='speaker'
                value={formData.speaker}
                onChange={handleInputChange}
                required
              />
              <label>Date:</label>
              <input
                type='date'
                name='date'
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              <label>Description:</label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
              <label>Thumbnail:</label>
              <input
                type='file'
                name='thumbnail'
                accept='image/*'
                onChange={handleInputChange}
                required
              />

              <label>Media Type:</label>
              <select
                style={{ width: "80px", padding: "10px" }}
                name='mediaType'
                value={formData.mediaType}
                onChange={handleInputChange}
                required
              >
                <option value='video'>Video</option>
                <option value='audio'>Audio</option>
              </select>
              <label>Media:</label>

              {formData.mediaType === "audio" ? (
                <input
                  type='file'
                  name='media'
                  accept='audio/*'
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <input
                  type='file'
                  name='media'
                  accept='video/*'
                  onChange={handleInputChange}
                  required
                />
              )}

              <button type='submit' disabled={isLoading}>
                {isLoading ? "Uploading..." : "Upload Sermon"}
              </button>
            </form>
            <button
              className='cancel-button'
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SermonPage;

// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTimes, FaTrashAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./SermonPage.css";

// const SermonPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAdmin, setIsAdmin] = useState(true); // Change based on user role
//   const [sermons, setSermons] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     speaker: "",
//     date: "",
//     description: "",
//   });
//   const [thumbnail, setThumbnail] = useState(null);
//   const [media, setMedia] = useState(null);
//   const [error, setError] = useState("");
//   const [hoveredCard, setHoveredCard] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSermons = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3000/churchapp/sermon"
//         );
//         setSermons(response.data);
//         console.log(response.data);
//       } catch (err) {
//         console.error("Error fetching sermons:", err);
//       }
//     };
//     fetchSermons();
//   }, []);

//   const filteredSermons = sermons.filter(
//     (sermon) =>
//       sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sermon.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "thumbnail") setThumbnail(files[0]);
//     else if (name === "media") setMedia(files[0]);
//     else setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     const data = new FormData();
//     data.append("title", formData.title);
//     data.append("speaker", formData.speaker);
//     data.append("date", formData.date);
//     data.append("description", formData.description);
//     if (thumbnail) data.append("thumbnail", thumbnail);
//     if (media) data.append("media", media);

//     try {
//       const response = await axios.post(
//         "http://localhost:3000/churchapp/sermon/createSermon",
//         data,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       console.log("Sermon uploaded:", response.data);
//       setSermons([response.data, ...sermons]); // Add the new sermon to the list
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to upload sermon. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSermonClick = (id) => {
//     navigate(`/sermon/${id}`);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this event?")) {
//       try {
//         await axios.delete(`http://localhost:3000/churchapp/sermon/${id}`);
//         setEvents((prev) => prev.filter((sermon) => sermon._id !== id));
//         alert("Event deleted successfully.");
//       } catch (error) {
//         console.error("Error deleting event:", error);
//       }
//     }
//   };

//   const handleUpdate = (id) => {
//     navigate(`/update-sermon/${id}`);
//   };
//   console.log();

//   return (
//     <div className='sermon-page'>
//       <div className='sermon-header'>
//         <FaTimes
//           onClick={() => navigate("/events")}
//           style={{
//             position: "absolute",
//             right: "30px",
//             cursor: "pointer",
//             color: "#284268",
//           }}
//         />
//         <h2 className='sermon-page-heading'>Sermons</h2>
//       </div>

//       <div className='sermon-page-search'>
//         <input
//           type='text'
//           className='search-bar'
//           placeholder='Search for sermons...'
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {isAdmin && (
//         <div className='admin-sermon-upload-button'>
//           <button onClick={() => setIsModalOpen(true)}>
//             Upload New Sermon
//           </button>
//         </div>
//       )}

//       <div className='sermons-grid'>
//         {filteredSermons.length > 0 ? (
//           filteredSermons.map((sermon) => (
//             <div
//               key={sermon._id}
//               onClick={() => handleSermonClick(sermon._id)}
//               className='sermon-card'
//               onMouseEnter={() => setHoveredCard(sermon._id)}
//               onMouseLeave={() => setHoveredCard(null)}
//             >
//               <div className='sermon-container' key={sermon.id}>
//                 <div className='media-wrapper'>
//                   <img
//                     src={`http://localhost:3000/${sermon.thumbnail}`}
//                     alt={sermon.title}
//                     className='thumbnail'
//                   />
//                   <video controls className='video'>
//                     <source
//                       src={`http://localhost:3000/${sermon.video}`}
//                       type='video/mp4'
//                     />
//                     Your browser does not support the video tag.
//                   </video>
//                 </div>
//               </div>

//               <div className='sermon-details'>
//                 <h3>{sermon.title}</h3>
//                 <p>Speaker: {sermon.speaker}</p>
//                 <p>Date: {new Date(sermon.date).toLocaleDateString()}</p>
//                 <p>{sermon.description}</p>
//                 <p style={{ color: "green" }}>Watch Sermon</p>
//               </div>

//               {isAdmin && hoveredCard === sermon._id && (
//                 <div className='card-actions'>
//                   <button
//                     className='edit-button'
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleUpdate(sermon._id);
//                     }}
//                   >
//                     <FaEdit /> Edit
//                   </button>
//                   <button
//                     className='delete-button'
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDelete(sermon._id);
//                     }}
//                   >
//                     <FaTrashAlt /> Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No sermons match your search.</p>
//         )}
//       </div>

//       {isModalOpen && (
//         <div className='modal-overlay'>
//           <div className='modal-content'>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             <h2>Upload New Sermon</h2>
//             <form className='upload-form' onSubmit={handleSubmit}>
//               <label>
//                 Title:
//                 <input
//                   type='text'
//                   name='title'
//                   placeholder='Sermon Title'
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Speaker:
//                 <input
//                   type='text'
//                   name='speaker'
//                   placeholder='Speaker'
//                   value={formData.speaker}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Date:
//                 <input
//                   type='date'
//                   name='date'
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Description:
//                 <textarea
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     marginBottom: "20px",
//                     border: "1px solid #ddd",
//                     borderRadius: "6px",
//                     whiteSpace: "pre-wrap",
//                   }}
//                   name='description'
//                   placeholder='Description'
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Thumbnail:
//                 <input
//                   type='file'
//                   name='thumbnail'
//                   accept='image/*'
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Video:
//                 <input
//                   type='file'
//                   name='media'
//                   accept='video/*,audio/*'
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <button type='submit' disabled={isLoading}>
//                 {isLoading ? "Uploading..." : "Upload Sermon"}
//               </button>
//             </form>
//             <button
//               className='cancelBtn'
//               onClick={() => setIsModalOpen(false)}
//               style={{ marginTop: "20px" }}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SermonPage;
