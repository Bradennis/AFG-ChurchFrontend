import React, { useEffect, useState } from "react";
import "./EventsPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import the icons

const EventsPage = () => {
  const navigate = useNavigate();
  const today = new Date();

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [catClick, setCatClick] = useState("upcoming"); // 'upcoming' or 'past'

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/churchapp/events`
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

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
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/churchapp/events/${id}`
        );
        setEvents((prev) => prev.filter((event) => event._id !== id));
        alert("Event deleted successfully.");
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-event/${id}`);
  };

  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      return catClick === "upcoming" ? eventDate >= today : eventDate < today;
    })
    .filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className='events-page'>
      <h2 className='events-page-heading'>Events</h2>

      {/* Events Tabs */}
      <div className='events-tabs'>
        <div
          className='events-upload-side-tabs-btn activity'
          onClick={() => navigate("/events")}
        >
          Activities
        </div>
        <div
          className='events-upload-side-tabs-btn'
          onClick={() => navigate("/sermons")}
        >
          Sermons
        </div>
        <div
          className='events-upload-side-tabs-btn'
          onClick={() => navigate("/christian-library")}
        >
          Christian Library
        </div>
      </div>

      {/* Search Bar */}
      <div className='events-page-search'>
        <input
          type='text'
          className='search-bar'
          placeholder='Search for events...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className='filter-buttons'>
        <div className='upload-side-tabs'>
          <div
            className={
              catClick === "upcoming"
                ? "tabs-view active-tab"
                : "upload-side-tabs-btn"
            }
            onClick={() => setCatClick("upcoming")}
          >
            Upcoming Events
          </div>
          <div
            className={
              catClick === "past"
                ? "tabs-view active-tab"
                : "upload-side-tabs-btn"
            }
            onClick={() => setCatClick("past")}
          >
            Past Events
          </div>
        </div>
        <button onClick={() => navigate("/create-event")} className='btn-add'>
          + Add Events
        </button>
      </div>

      {/* Events Grid */}
      <div className='events-grid'>
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className='event-card'
            onMouseEnter={() =>
              (document.getElementById(event._id).style.display = "flex")
            }
            onMouseLeave={() =>
              (document.getElementById(event._id).style.display = "none")
            }
          >
            <img
              src={`${import.meta.env.VITE_API_URL}/${event.image}`}
              alt={event.title}
              className='event-image'
            />
            <div className='event-details'>
              <h3>{event.title}</h3>
              <p>
                <strong>Date:</strong> {formatDate(event.date)}
              </p>
              <p>
                <strong>Time:</strong> {event.time}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p style={{ whiteSpace: "pre-wrap" }}>{event.description}</p>
            </div>
            <div id={event._id} className='popup-buttons'>
              <button
                onClick={() => handleUpdate(event._id)}
                className='btn-edit'
              >
                <FaEdit /> Update
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className='btn-delete'
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
