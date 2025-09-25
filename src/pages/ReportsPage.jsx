import React, { useEffect, useState } from "react";
import {
  FaDownload,
  FaFilePdf,
  FaChartPie,
  FaClipboardList,
} from "react-icons/fa";
import "./ReportPage.css";
import axios from "axios";

const ReportPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [senderUsername, setSenderUsername] = useState("");
  const [selectedSearchType, setSelectedSearchType] = useState(""); // New state for selecting search type
  const [matchedReport, setMatchedReport] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [clickedCard, setClickedCard] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Fetch reports on load or when filters change
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/churchapp/report`
        );
        setReports(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", `${clickedCard} Report`);
    formData.append("date", new Date().toISOString());
    formData.append("type", clickedCard);
    formData.append("username", localStorage.getItem("username"));
    formData.append("userId", localStorage.getItem("userId"));

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/churchapp/report/upload`,
        formData
      );
      setUploadStatus("success");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
    }
  };

  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const handleSearchTypeChange = (e) => {
    setSelectedSearchType(e.target.value);
    // Reset values when changing search type
    setSelectedDate("");
    setSenderUsername("");
  };

  const generateReport = async () => {
    try {
      const params = {};

      // Add parameters based on input
      if (selectedDate)
        params.date = new Date(selectedDate).toISOString().split("T")[0]; // Format to YYYY-MM-DD
      if (senderUsername.trim()) params.username = senderUsername.trim();

      // Ensure at least one search parameter is provided
      if (!params.date && !params.username) {
        console.error("No search criteria provided.");
        return;
      }

      // Fetch reports based on parameters
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/churchapp/report`,
        { params }
      );

      // Handle response data
      if (response.data.length > 0) {
        setMatchedReport(response.data[0]); // Display the first matching report
      } else {
        setMatchedReport(null); // No match found
        setNotFound("No matching reports found.");
      }
    } catch (error) {
      console.error("Error fetching matched reports:", error);
    }
  };

  const handleCardClick = (cardType) => {
    setClickedCard((prevCard) => (prevCard === cardType ? null : cardType));
    setSelectedFile(false);
  };

  useEffect(() => {
    console.log("this is the matched report returned");

    console.log(matchedReport);
  }, [setMatchedReport]);

  return (
    <div className='report-page'>
      <div className='report-header'>
        <h2>Reports</h2>
        <p>
          Generate, submit and preview comprehensive reports on activities and
          church financial reports
        </p>
      </div>

      {/* Report Summary Section */}
      <div className='report-summary'>
        <div
          className='summary-card'
          onClick={() => handleCardClick("activity")}
        >
          <FaChartPie className='icon' />
          <div>
            <h3>Activity Reports</h3>
            <p>Review attendance records for events and sessions.</p>
          </div>
        </div>

        <div
          className='summary-card'
          onClick={() => handleCardClick("financial")}
        >
          <FaClipboardList className='icon' />
          <div>
            <h3>Financial Reports</h3>
            <p>
              Reports on financial performance and quarterly/yearly financial
              statements
            </p>
          </div>
        </div>
      </div>

      <div>
        {clickedCard === "financial" && (
          <div style={{ width: "250px" }}>
            {!selectedFile && (
              <div>
                <label htmlFor='img'>
                  <div className='submit-btn'>Add new Financial Report</div>
                </label>
                <input
                  type='file'
                  id='img'
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            )}
            {selectedFile && (
              <div>
                <button onClick={handleSubmit}>Submit Report</button>
                {uploadStatus === "success" && (
                  <p style={{ color: "green" }}>
                    Report Submission successful!
                  </p>
                )}
                {uploadStatus === "error" && (
                  <p style={{ color: "red" }}>Error uploading file.</p>
                )}
              </div>
            )}
            {selectedFile && (
              <div className='file-name'>
                Selected File: <strong>{selectedFile.name}</strong>
              </div>
            )}
          </div>
        )}

        {clickedCard === "activity" && (
          <div style={{ width: "250px" }}>
            {!selectedFile && (
              <div>
                <label htmlFor='img'>
                  <div className='submit-btn'>Add new Activity Report</div>
                </label>
                <input
                  type='file'
                  id='img'
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            )}
            {selectedFile && (
              <div>
                <button onClick={handleSubmit}>Submit Report</button>
                {uploadStatus === "success" && (
                  <p style={{ color: "green" }}>
                    Report Submission successful!
                  </p>
                )}
                {uploadStatus === "error" && (
                  <p style={{ color: "red" }}>Error uploading file.</p>
                )}
              </div>
            )}
            {selectedFile && (
              <div className='file-name'>
                Selected File: <strong>{selectedFile.name}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Generation Section */}
      <div className='report-generation'>
        <h3>Generate and Download a Report</h3>
        <div className='report-options'>
          {!selectedSearchType && (
            <div>
              <label>Select Search Type:</label>
              <select
                onChange={handleSearchTypeChange}
                value={selectedSearchType}
                className='select-search-type'
              >
                <option value=''>Select Search Type</option>
                <option value='date'>By Date</option>
                <option value='username'>By Sender's Username</option>
              </select>
            </div>
          )}

          {selectedSearchType === "date" && (
            <div>
              <label htmlFor='report-date'>Search by Date:</label>
              <input
                type='date'
                id='report-date'
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          )}

          {selectedSearchType === "username" && (
            <div>
              <label htmlFor='sender-username'>
                Search by Sender's Username:
              </label>
              <input
                type='text'
                id='sender-username'
                placeholder='Enter username'
                value={senderUsername}
                onChange={(e) => setSenderUsername(e.target.value)}
              />
            </div>
          )}

          <button onClick={generateReport} className='generate-btn'>
            Generate
          </button>
        </div>

        {/* Matched Report Section */}
        {matchedReport ? (
          <div className='matched-report'>
            <h4>Matched Report:</h4>
            <p>Title: {matchedReport.title}</p>
            <p>Date: {new Date(matchedReport.date).toLocaleDateString()}</p>
            <p>Uploaded by: {matchedReport.sender.name}</p>
            {/* <a href={`${import.meta.env.VITE_API_URL}/${matchedReport.fileUrl}`} download> */}
            <button className='download-btn'>
              <FaDownload /> Download Report
            </button>
            {/* </a> */}
          </div>
        ) : selectedDate || senderUsername ? (
          <div className='no-report'>
            {notFound === "No matching reports found." ? (
              <p>No matching reports found.</p>
            ) : (
              <p>proceed to generate reports</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReportPage;
