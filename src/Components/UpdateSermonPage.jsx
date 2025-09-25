import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateSermonPage.css";

const UpdateSermonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    date: "",
    description: "",
    mediaType: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSermonDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/churchapp/sermon/${id}`
        );
        const { title, speaker, date, description } = response.data;
        setFormData({ title, speaker, date: date.split("T")[0], description });
      } catch (err) {
        console.error("Error fetching sermon details:", err);
        setError("Failed to fetch sermon details.");
      }
    };
    fetchSermonDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") setThumbnail(files[0]);
    else if (name === "media") setMedia(files[0]);
    else setFormData({ ...formData, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
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
      await axios.patch(
        `http://localhost:3000/churchapp/sermon/update/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      navigate("/sermons");
    } catch (err) {
      console.error("Error updating sermon:", err);
      setError("Failed to update sermon. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='update-sermon-page'>
      <h2>Update Sermon</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className='update-form' onSubmit={handleUpdateSubmit}>
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
          Speaker:
          <input
            type='text'
            name='speaker'
            value={formData.speaker}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Date:
          <input
            type='date'
            name='date'
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
            }}
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
          />
        </label>
        <label>Media Type:</label>
        <select
          style={{ width: "80px", padding: "10px" }}
          name='mediaType'
          value={formData.mediaType}
          onChange={handleInputChange}
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
          />
        ) : (
          <input
            type='file'
            name='media'
            accept='video/*'
            onChange={handleInputChange}
          />
        )}
        <button type='submit' disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Sermon"}
        </button>
        <button
          type='button'
          className='cancelBtn'
          onClick={() => navigate("/sermons")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateSermonPage;
