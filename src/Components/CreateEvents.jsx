import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateEvents.css";

const CreateEvents = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const eventData = new FormData();
    eventData.append("title", formData.title);
    eventData.append("date", formData.date);
    eventData.append("time", formData.time);
    eventData.append("location", formData.location);
    eventData.append("description", formData.description);
    if (formData.image) {
      eventData.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/churchapp/events/createEvent",
        eventData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Event created:", response.data);
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error.response || error.message);
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='create-events-page'>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className='event-form'>
        <div className='form-group'>
          <label htmlFor='title'>Event Title:</label>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleChange}
            required
            placeholder='Enter event title'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='date'>Event Date:</label>
          <input
            type='date'
            id='date'
            name='date'
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='time'>Event Time:</label>
          <input
            type='time'
            id='time'
            name='time'
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='location'>Event Location:</label>
          <input
            type='text'
            id='location'
            name='location'
            value={formData.location}
            onChange={handleChange}
            required
            placeholder='Enter event location'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Event Description:</label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            required
            placeholder='Enter event description'
          ></textarea>
        </div>
        <div className='form-group'>
          <label htmlFor='image'>Event Image:</label>
          <input
            type='file'
            id='image'
            onChange={handleImageChange}
            accept='image/*'
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt='Event Preview'
              className='image-preview'
            />
          )}
        </div>
        {error && <p className='error-message'>{error}</p>}
        <div className='events-form-actions'>
          <button
            type='submit'
            className='events-submit-btn'
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
          <button
            type='button'
            className='cancelBtn'
            onClick={() => navigate("/events")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvents;
