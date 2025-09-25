import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaPenAlt, FaTimes } from "react-icons/fa";
import prof from "../assets/defaultProf.jpg";
import "./MemberDetails.css";

const MemberDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { member } = location.state || {};

  console.log(member);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const options = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  return (
    <div className='member-details'>
      {/* Header */}
      <div className='details-heading'>
        <p>Member Details</p>
        <FaTimes cursor='pointer' onClick={() => navigate("/members")} />
      </div>

      {/* Profile Section */}
      <div className='profile'>
        <div
          className='prof-image'
          onClick={() => navigate("/profilePicture", { state: { member } })}
        >
          <img
            src={
              member?.profileImage
                ? `https://afg-churchbackend.onrender.com/${member.profileImage}`
                : prof
            }
            alt='Profile'
          />
        </div>

        <h3>{member.fullName}</h3>
        <p>{member.role}</p>

        <Link to={"/edit-member"} state={{ member }}>
          <div className='update-details'>
            Update{" "}
            <span>
              <FaPenAlt size={15} />
            </span>
          </div>
        </Link>
      </div>

      {/* Personal Information Section */}
      <div className='section'>
        <h3 className='section-title'>Personal Information</h3>
        <div className='personal-info-details'>
          <div className='category'>
            <div className='info'>
              <p>First Name</p>
              <h4>{member.firstName}</h4>
            </div>
            <div className='info'>
              <p>Last Name</p>
              <h4>{member.lastName}</h4>
            </div>
            <div className='info'>
              <p>Other Names</p>
              <h4>{member.otherNames}</h4>
            </div>
          </div>
          <div className='category'>
            <div className='info'>
              <p>Date of Birth</p>
              <h4>{formatDate(member.dateOfBirth)}</h4>
            </div>
            <div className='info'>
              <p>Gender</p>
              <h4>{member.gender}</h4>
            </div>
          </div>
          <div className='info'>
            <p>Email</p>
            <h4>{member.email}</h4>
          </div>
          <div className='category'>
            <div className='info'>
              <p>Contact</p>
              <h4>{member.contact}</h4>
            </div>
            <div className='info'>
              <p>Other Contact</p>
              <h4>{member.otherContact}</h4>
            </div>
          </div>
          <div className='info'>
            <p>Residential Address</p>
            <h4>{member.residentialAddress}</h4>
          </div>
          <div className='category'>
            <div className='info'>
              <p>GPS Address</p>
              <h4>{member.GPSAddress}</h4>
            </div>
            <div className='info'>
              <p>Street Name</p>
              <h4>{member.streetName}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className='section'>
        <h3 className='section-title'>Emergency Contact</h3>
        <div className='category'>
          <div className='info'>
            <p>Closest Person of Contact</p>
            <h4>{member.personOfContact}</h4>
          </div>
          <div className='info'>
            <p>Relation</p>
            <h4>{member.relationToPersonOfContact}</h4>
          </div>
          <div className='info'>
            <p>Contact</p>
            <h4>{member.personsPhone}</h4>
          </div>
        </div>
      </div>

      {/* Family Information Section */}
      <div className='section'>
        <h3 className='section-title'>Family Information</h3>
        <div className='category'>
          <div className='info'>
            <p>Marital Status</p>
            <h4>{member.maritalStatus}</h4>
          </div>
        </div>

        {member.maritalStatus === "married" && (
          <div className='category'>
            <div className='info'>
              <p>Name of Spouse</p>
              <h4>{member.nameOfSpouse}</h4>
            </div>
            <div className='info'>
              <p>Number of Children</p>
              <h4>{member.numberOfChildren}</h4>
            </div>
          </div>
        )}
      </div>

      {/* Church Information Section */}
      <div className='section'>
        <h3 className='section-title'>Church Information</h3>
        <div className='category'>
          <div className='info'>
            <p>Role</p>
            <h4>{member.role}</h4>
          </div>
        </div>
        <div className='category'>
          <div className='info'>
            <p>Departments</p>
            <div className='departments'>
              {member.departments.map((itms) => (
                <h4 key={itms}>{itms}</h4>
              ))}
            </div>
          </div>
          <div className='info'>
            <p>Baptismal Date</p>
            <h4>{formatDate(member.dateOfBaptism)}</h4>
          </div>
          <div className='info'>
            <p>Local Assembly</p>
            <h4>{member.localAssembly}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
