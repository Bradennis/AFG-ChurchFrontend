import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddMember.css";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import prof from "../assets/defaultProf.jpg";

const AddMember = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    otherNames: "",
    contact: "",
    otherContact: "",
    role: "",
    dateOfBaptism: "",
    email: "",
    dateOfBirth: "",
    residentialAddress: "",
    GPSAddress: "",
    streetName: "",
    gender: "",
    maritalStatus: "",
    nameOfSpouse: "", // Corrected property name
    numberOfChildren: "",
    departments: [],
    personOfContact: "",
    relationToPersonOfContact: "",
    personsPhone: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const { member } = location.state || {};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      let updatedDepartments = [...formData.departments];
      if (checked) {
        updatedDepartments.push(value);
      } else {
        updatedDepartments = updatedDepartments.filter(
          (dept) => dept !== value
        );
      }
      setFormData({
        ...formData,
        departments: updatedDepartments,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);

    try {
      const response = await axios.patch(
        `https://afg-churchbackend.onrender.com/churchapp/tasks/editMember/${member._id}`,
        formData
      );
      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/members");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='add-member-form'>
      <h2>Edit Member</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <div className='document-fa-div-singles'>
            <label htmlFor='img'>
              <img
                src={prof}
                alt=''
                width='100px'
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
              <div>
                <p style={{ marginLeft: "10px", fontWeight: "bold" }}>
                  Add image
                </p>
                <p style={{ fontSize: "0.7rem", color: "grey" }}>
                  {/* {imageFile ? imageFile.name : ""} */}
                </p>
              </div>
            </label>
            <input
              type='file'
              name=''
              id='img'
              // onChange={(e) => setImageFile(e.target.files[0])}
            />
            {/* {imageFile && (
              <FaTimes
                color='grey'
                style={{ cursor: "pointer" }}
                onClick={() => setImageFile(null)}
              />
            )} */}
          </div>

          <div className='form-category'>
            <div className='form-list'>
              <label htmlFor='firstName'>First Name</label>
              <input
                type='text'
                id='firstName'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                placeholder={member.firstName}
              />
            </div>
            <div className='form-list'>
              <label htmlFor='lastName'>Last Name</label>
              <input
                type='text'
                id='lastName'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                placeholder={member.lastName}
              />
            </div>
          </div>

          <div className='form-list'>
            <label htmlFor='otherNames'>Other Names</label>
            <input
              type='text'
              id='otherNames'
              name='otherNames'
              value={formData.otherNames}
              onChange={handleChange}
              placeholder={member.otherNames}
            />
          </div>

          <div className='form-list'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder={member.email}
            />
          </div>

          <div className='form-category'>
            <div className='form-list'>
              <label htmlFor='contact'>Contact</label>
              <input
                type='text'
                id='contact'
                name='contact'
                value={formData.contact}
                onChange={handleChange}
                placeholder={member.contact}
              />
            </div>

            <div className='form-list'>
              <label htmlFor='contact'>Other Contact</label>
              <input
                type='text'
                id='otherContact'
                name='otherContact'
                value={formData.otherContact}
                onChange={handleChange}
                placeholder={member.otherContact}
              />
            </div>
          </div>
          <div className='form-list'>
            <label htmlFor='dateOfBirth'>Date of Birth</label>
            <input
              type='date'
              id='dateOfBirth'
              name='dateOfBirth'
              value={formData.dateOfBirth}
              onChange={handleChange}
              placeholder={member.dateOfBirth}
            />
          </div>

          <div className='form-list'>
            <label htmlFor='address'>Residential Address</label>
            <textarea
              type='text'
              id='residentialAddress'
              name='residentialAddress'
              value={formData.residentialAddress}
              onChange={handleChange}
              placeholder={member.residentialAddress}
            />
          </div>

          <div className='form-category'>
            <div className='form-list'>
              <label htmlFor='GPSAddress'>GPS Address</label>
              <input
                type='text'
                id='GPSAddress'
                name='GPSAddress'
                value={formData.GPSAddress}
                onChange={handleChange}
                placeholder={member.GPSAddress}
              />
            </div>

            <div className='form-list'>
              <label htmlFor='streetName'>Street Name</label>
              <input
                type='text'
                id='streetName'
                name='streetName'
                value={formData.streetName}
                onChange={handleChange}
                placeholder={member.streetName}
              />
            </div>
          </div>

          <div className='form-category'>
            {/* Gender Select */}
            <div className='form-list'>
              <label htmlFor='gender'>Gender</label>
              <select
                id='gender'
                name='gender'
                value={formData.gender}
                onChange={handleChange}
              >
                <option value=''>{member.gender}</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </select>
            </div>

            {/* Marital Status Select */}
            <div className='form-list'>
              <label htmlFor='maritalStatus'>Marital Status</label>
              <select
                id='maritalStatus'
                name='maritalStatus'
                value={formData.maritalStatus}
                onChange={handleChange}
              >
                <option value='' disabled>
                  {member.maritalStatus}
                </option>
                <option value='single'>Single</option>
                <option value='married'>Married</option>
                <option value='divorced'>Divorced</option>
              </select>
            </div>
          </div>

          {/* Conditionally Render Spouse Name and Number of Children Fields */}
          {member.maritalStatus === "married" && (
            <div className='category'>
              <div className='form-list'>
                <label htmlFor='nameOfSpouse'>Name of Spouse</label>
                <input
                  type='text'
                  id='nameOfSpouse'
                  name='nameOfSpouse' // Match the correct property
                  value={formData.nameOfSpouse} // Use corrected property
                  onChange={handleChange}
                  placeholder={member.nameOfSpouse}
                />
              </div>
              <div className='form-list'>
                <label htmlFor='numberOfChildren'>Number of Children</label>
                <input
                  type='number'
                  id='numberOfChildren'
                  name='numberOfChildren'
                  value={formData.numberOfChildren}
                  onChange={handleChange}
                  placeholder={member.numberOfChildren}
                />
              </div>
            </div>
          )}

          {member.maritalStatus === "divorced" && (
            <div className='form-list'>
              <label htmlFor='numberOfChildren'>Number of Children</label>
              <input
                type='number'
                id='numberOfChildren'
                name='numberOfChildren'
                value={formData.numberOfChildren}
                onChange={handleChange}
                placeholder={member.numberOfChildren}
              />
            </div>
          )}

          {/* Department Checkboxes */}
          <div className='form-list'>
            <label>Departments to Join</label>
            <div className='checkbox-group'>
              <div className='check-box-split'>
                <label>Choir</label>
                <input
                  type='checkbox'
                  name='departments'
                  value='choir'
                  onChange={handleChange}
                />
              </div>

              <div className='check-box-split'>
                <label> Ushers</label>
                <input
                  type='checkbox'
                  name='departments'
                  value='ushers'
                  onChange={handleChange}
                />
              </div>

              <div className='check-box-split'>
                <label>Technical</label>
                <input
                  type='checkbox'
                  name='departments'
                  value='technical'
                  onChange={handleChange}
                />
              </div>

              <div className='check-box-split'>
                <label>Media</label>
                <input
                  type='checkbox'
                  name='departments'
                  value='media'
                  onChange={handleChange}
                />
              </div>

              <div className='check-box-split'>
                <label>Welfare</label>
                <input
                  type='checkbox'
                  name='departments'
                  value='welfare'
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className='form-list'>
            <label htmlFor='role'> Role</label>
            <input
              type='text'
              id='role'
              name='role'
              value={formData.role}
              onChange={handleChange}
              placeholder={member.role}
            />
          </div>

          <div className='form-list'>
            <label htmlFor='dateOfBaptism'> Date Of Baptism</label>
            <input
              type='date'
              id='dateOfBaptism'
              name='dateOfBaptism'
              value={formData.dateOfBaptism}
              onChange={handleChange}
              placeholder={member.dateOfBaptism}
            />
          </div>
          <div className='form-category'>
            <div className='form-list'>
              <label htmlFor='personOfContact'>Person of Contact</label>
              <input
                type='text'
                id='personOfContact'
                name='personOfContact'
                value={formData.personOfContact}
                onChange={handleChange}
                placeholder={member.personOfContact}
              />
            </div>

            <div className='form-list'>
              <label htmlFor='relationToPersonOfContact'>
                Relation to Person
              </label>
              <input
                type='text'
                id='relationToPersonOfContact'
                name='relationToPersonOfContact'
                value={formData.relationToPersonOfContact}
                onChange={handleChange}
                placeholder={member.relationToPersonOfContact}
              />
            </div>
          </div>
          <div className='form-list'>
            <label htmlFor='personsPhone'>Person's Phone</label>
            <input
              type='text'
              id='personsPhone'
              name='personsPhone'
              value={formData.personsPhone}
              onChange={handleChange}
              placeholder={member.personsPhone}
            />
          </div>
        </div>

        {loading ? (
          <ClipLoader color='#243247' className='clipLoader' />
        ) : (
          <div className='submit-category'>
            <button type='submit' className='submit-btn' onClick={handleSubmit}>
              save
            </button>

            <button
              onClick={() => navigate("/members")}
              className='submit-btn'
              style={{
                background: "white",
                color: "#284268",
                boxShadow: "1px 1px 2px rgb(99, 100, 103)",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddMember;
