import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import HomePage from "./pages/HomePage";
import DonationsPage from "./pages/DonationsPage";
import EventsPage from "./pages/EventsPage";
import ReportsPage from "./pages/ReportsPage";
import MembersPage from "./pages/MembersPage";
import SettingsPage from "./pages/SettingsPage";
import MemberDetailsPage from "./pages/MemberDetails";
import ProfilePicture from "./Components/ProfilePicture";
import EditMember from "./pages/EditMember";
import Payment from "./Components/Payment";
import AddOfferring from "./Components/AddOfferring";
// import CreateEvents from "./Components/CreateEvents";
// import SermonPage from "./Components/SermonPage";
// import ChristianLibrary from "./Components/ChristianLibrary";
// import SermonDetail from "./Components/SermonDetail";
// import ChristianLibraryDetail from "./Components/ChristianLibraryDetail";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import ProtectedRoute from "./Context/ProtectedRoute";
import AddMember from "./pages/AddMember";
import DonationDetails from "./Components/DonationDetails";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import UpdateEvent from "./Components/UpdateEvent";
// import UpdateSermonPage from "./Components/UpdateSermonPage";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path='/login' element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path='/*'
            element={
              <ProtectedRoute>
                <div>
                  <Sidebar />
                  <div className='content'>
                    <Routes>
                      <Route path='/' element={<HomePage />} />
                      <Route path='/donations' element={<DonationsPage />} />
                      <Route path='/events' element={<EventsPage />} />
                      <Route path='/reports' element={<ReportsPage />} />
                      <Route path='/members' element={<MembersPage />} />
                      <Route path='/settings' element={<SettingsPage />} />
                      <Route
                        path='/memberDetails'
                        element={<MemberDetailsPage />}
                      />
                      <Route
                        path='/profilePicture'
                        element={<ProfilePicture />}
                      />
                      <Route path='/add-member' element={<AddMember />} />
                      <Route path='/edit-member' element={<EditMember />} />
                      <Route path='/payment' element={<Payment />} />
                      <Route path='/add-offering' element={<AddOfferring />} />
                      <Route
                        path='/donation-details/:date'
                        element={<DonationDetails />}
                      />
                      {/* <Route path='/create-event' element={<CreateEvents />} />
                      <Route
                        path='/update-event/:id'
                        element={<UpdateEvent />}
                      />
                      <Route path='/sermons' element={<SermonPage />} />
                      <Route
                        path='/update-sermon/:id'
                        element={<UpdateSermonPage />}
                      />
                      <Route
                        path='/christian-library'
                        element={<ChristianLibrary />}
                      />
                      <Route path='/sermon/:id' element={<SermonDetail />} />
                      <Route
                        path='/library/:id'
                        element={<ChristianLibraryDetail />}
                      /> */}
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>

      <ToastContainer />
    </div>
  );
};

export default App;
