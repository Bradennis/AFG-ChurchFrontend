import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import "./UpdateEvent.css";

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/churchapp/events/${id}`
        );
        setEventData(response.data);
        setPreviewImage(response.data.image);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEventData({ ...eventData, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all fields to FormData
    formData.append("title", eventData.title);
    formData.append("date", eventData.date);
    formData.append("time", eventData.time);
    formData.append("location", eventData.location);
    formData.append("description", eventData.description);

    // Append image only if a new file is selected
    if (eventData.image instanceof File) {
      formData.append("image", eventData.image);
    }

    try {
      await axios.patch(
        `http://localhost:3000/churchapp/events/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      navigate("/events");
      toast.success("Event updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  return (
    <div className='update-event-page'>
      <h2>Update Event</h2>
      <form className='update-event-form' onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type='text'
          name='title'
          value={eventData.title}
          onChange={handleInputChange}
          placeholder='Enter event title'
        />

        <label>Date</label>
        <input
          type='date'
          name='date'
          value={eventData.date}
          onChange={handleInputChange}
        />

        <label>Time</label>
        <input
          type='time'
          name='time'
          value={eventData.time}
          onChange={handleInputChange}
        />

        <label>Location</label>
        <input
          type='text'
          name='location'
          value={eventData.location}
          onChange={handleInputChange}
          placeholder='Enter event location'
        />

        <label>Description</label>
        <textarea
          name='description'
          value={eventData.description}
          onChange={handleInputChange}
          placeholder='Enter event description'
        />

        <label>Image</label>
        <input type='file' accept='image/*' onChange={handleImageChange} />
        {previewImage && (
          <div className='image-preview'>
            <img src={previewImage} alt='Preview' />
          </div>
        )}

        <button type='submit' className='update-button'>
          Update Event
        </button>
      </form>
    </div>
  );
};

export default UpdateEvent;
