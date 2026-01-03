import "./homepage.css";
import heroImg from "../assets/churchBuilding.jpg";
import prof from "../assets/defaultProf.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = ({ isAdmin = true }) => {
  const navigate = useNavigate();
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

  // Birthday celebrants in next 2 days
  const [birthdayCelebrants, setBirthdayCelebrants] = useState([]);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/churchapp/tasks/getAllMembers`
        );
        const today = new Date();
        const in2Days = new Date(today);
        in2Days.setDate(today.getDate() + 2);
        // Only compare month and day
        const celebrants = data.filter((member) => {
          if (!member.dateOfBirth) return false;
          const dob = new Date(member.dateOfBirth);
          const thisYear = new Date(
            today.getFullYear(),
            dob.getMonth(),
            dob.getDate()
          );
          return thisYear >= today && thisYear <= in2Days;
        });
        setBirthdayCelebrants(celebrants);
      } catch (e) {
        setBirthdayCelebrants([]);
      }
    };
    fetchBirthdays();
  }, []);

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
        console.log("hello world");

        console.log(data);
      } catch (error) {
        console.error("Error fetching proceeds summary:", error);
      }
    };

    fetchMembersSummary();
    fetchProceedsSummary();
  }, []);

  return (
    <div className='home-page-main modern-home'>
      <div className='hero-section'>
        <img src={heroImg} alt='Church' className='hero-img' />
        <div className='hero-message'>
          <h2>Welcome to Amazing Full Gospel Evangelistic Church</h2>
          <h5>Adjumani Kopey Assembly</h5>
          <p>
            Empowering lives, building faith, and serving the community
            together.
          </p>
        </div>
      </div>
      <div className='modern-grid'>
        <div>
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
                summary based on records for the current quarter
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
              <button onClick={() => navigate("/members")}>
                Manage Members
              </button>
              <button onClick={() => navigate("/donations")}>
                Track Finances
              </button>
              <button onClick={() => navigate("/attendance")}>
                Track Attendance
              </button>
              <button onClick={() => navigate("/messages")}>
                Broadcast Messages
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className='birthday-celebrants modern-card'>
            <h4>🎂 Birthdays in 2 Days</h4>
            {birthdayCelebrants.length === 0 ? (
              <p style={{ color: "#888", fontStyle: "italic" }}>
                No upcoming birthdays in the next 2 days.
              </p>
            ) : (
              <ul className='birthday-list'>
                {birthdayCelebrants.map((member) => (
                  <li key={member.id} className='birthday-item'>
                    <img
                      src={
                        member.profileImage
                          ? `${import.meta.env.VITE_API_URL}/${
                              member.profileImage
                            }`
                          : prof
                      }
                      alt='Profile'
                      className='birthday-pic'
                    />
                    <div>
                      <span className='birthday-name'>{member.fullName}</span>
                      <span className='birthday-date'>
                        {new Date(member.dateOfBirth).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className='modern-card church-stats'>
            <h4>Church Stats</h4>
            <ul>
              <li>Active Departments: 7</li>
              <li>Weekly Attendance: 92%</li>
              <li>Last Event: Youth Revival (3 days ago)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
