import "./homepage.css";
import social from "../assets/socialTalk.png";
import vidmed from "../assets/vidmed.jpg";
import sermonThumb from "../assets/revival.jpg";
import { useEffect, useState } from "react";
import axios from "axios";

const HomePage = ({ isAdmin = true }) => {
  const [expandedAnnouncements, setExpandedAnnouncements] = useState({});
  const [membersSummary, setMembersSummary] = useState({
    totalMembers: 0,
    newThisWeek: 0,
    adults: 0,
    under18: 0,
  });
  // server/files/1735339434031-healthtips.jpg
  const [proceedsSummary, setProceedsSummary] = useState({
    totalProceeds: 0,
    newThisWeek: 0,
    allOfferings: 0,
    tithes: 0,
    welfare: 0,
  });
  const announcements = [
    {
      id: 1,
      text: "🎉 Congratulations to our youth group for organizing a successful charity drive! Your efforts have impacted many lives positively.Congratulations to our youth group for organizing a successful charity drive! Your efforts have impacted many lives positivelyCongratulations to our youth group for organizing a successful charity drive! Your efforts have impacted many lives positivelyCongratulations to our youth group for organizing a successful charity drive! Your efforts have impacted many lives positivelyCongratulations to our youth group for organizing a successful charity drive! Your efforts have impacted many lives positivelyCongratulations to our youth group for organizing a successful charity drive! Your efforts have impacted many lives positivelyCongratulations to our youth group for organizing a successful charity drive! Your efforts have impacted many lives positivelyCongratulations to our youth group for organizing a successful charity drive! Your efforts have impacted many lives positively",
    },
    {
      id: 2,
      text: "📅 Mark your calendars! Next week's prayer session will focus on community outreach and evangelism.",
    },
    {
      id: 3,
      text: "✨ A big thank you to everyone who contributed to the renovation of the church hall. Your support is greatly appreciated!",
    },
  ];
  const toggleReadMore = (id) => {
    setExpandedAnnouncements((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const events = [
    {
      date: "18th Sept. 2024",
      time: "6:30 PM",
      program: "The Gospel Experience",
      img: social,
    },
    {
      date: "14th Feb. 2024",
      time: "6:30 PM",
      program: "3 Days Revival",
      img: vidmed,
    },
  ];

  useEffect(() => {
    const fetchMembersSummary = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/churchapp/tasks/getAllMembersSummary`
        );
        setMembersSummary(data);
      } catch (error) {
        console.error("Error fetching members summary:", error);
      }
    };

    const fetchProceedsSummary = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/churchapp/donations/proceedsSummary`
        );
        setProceedsSummary({
          totalProceeds: data.totalProceeds,
          newThisWeek: data.newThisWeek,
          allOfferings: data.allOfferings,
          tithes: data.tithes,
          welfare: data.welfare,
        });

        console.log(data);
      } catch (error) {
        console.error("Error fetching proceeds summary:", error);
      }
    };

    fetchMembersSummary();
    fetchProceedsSummary();
  }, []);

  return (
    <div className='home-page-main'>
      {isAdmin ? (
        <>
          <div className='home-heading'>
            <h3>Welcome, Admin</h3>
            <p>Here's a summary of your church's activities</p>
          </div>
          <div className='home-boxes'>
            <h4>Members Overview</h4>
            <div className='sub-boxes'>
              <div className='inner-boxes'>
                <h4>{membersSummary.totalMembers}</h4>
                <p>Total Members</p>
              </div>
              <div className='inner-boxes'>
                <h4>{membersSummary.newThisWeek}</h4>
                <p>New This Week</p>
              </div>
              <div className='inner-boxes'>
                <h4>{membersSummary.adults}</h4>
                <p>Adults</p>
              </div>
              <div className='inner-boxes'>
                <h4>{membersSummary.under18}</h4>
                <p>Under 18</p>
              </div>
            </div>
          </div>
          <div className='home-boxes'>
            <div>
              <h4>Proceeds Summary</h4>
              <p style={{ color: "grey" }}>
                summary based on records for the current quater
              </p>
            </div>

            <div className='sub-boxes'>
              <div className='inner-boxes'>
                <h4>GH₵ {proceedsSummary.totalProceeds.toLocaleString()}</h4>
                <p>Total Proceeds</p>
              </div>
              <div className='inner-boxes'>
                <h4>GH₵ {proceedsSummary.newThisWeek.toLocaleString()}</h4>
                <p>New This Week</p>
              </div>
              <div className='inner-boxes'>
                <h4>GH₵ {proceedsSummary.allOfferings.toLocaleString()}</h4>
                <p>All Offerings</p>
              </div>
              <div className='inner-boxes'>
                <h4>GH₵ {proceedsSummary.tithes.toLocaleString()}</h4>
                <p>Tithes</p>
              </div>
              <div className='inner-boxes'>
                <h4>GH₵ {proceedsSummary.welfare.toLocaleString()}</h4>
                <p>Welfare</p>
              </div>
            </div>
          </div>
          <div className='home-quick-actions'>
            <h4>Quick Actions</h4>
            <div className='quick-actions-box'>
              <button>Manage Members</button>
              <button>Track Finances</button>
              <button>Plan Events</button>
              <button>Broadcast Messages</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='home-heading'>
            <h3>Welcome to the Church Management System</h3>
            <p>
              Explore upcoming events and stay connected with our community.
            </p>
          </div>
          <div className='featured-sermon'>
            <h4>Featured Sermon</h4>
            <div className='sermon-card'>
              <img src={sermonThumb} alt='Featured Sermon' />
              <div className='sermon-details'>
                <p>Title: The Power of Faith</p>
                <p>By: Pastor John Doe</p>
                <button>Watch Now</button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className='home-side-events'>
        <div className='weekly-announcements'>
          <h4>Weekly Announcements</h4>
          {announcements.map(({ id, text }) => (
            <div className='announcement-card' key={id}>
              <p className='announcement-text'>
                {expandedAnnouncements[id] ? text : `${text.slice(0, 50)}...`}
              </p>
              <button className='read-more' onClick={() => toggleReadMore(id)}>
                {expandedAnnouncements[id] ? "Read Less" : "Read More"}
              </button>
            </div>
          ))}
        </div>
        <h4>Upcoming Events</h4>
        <div className='events'>
          {events.map(({ date, time, program, img }, index) => (
            <div className='event-sub' key={index}>
              <img src={img} alt='event' />
              <div className='eventDetails'>
                <p className='event-name'>{program}</p>
                <p className='event-date'>
                  {date} <span>@ {time}</span>
                </p>
                <button className='learn-more'>Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
