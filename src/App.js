import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainDash from './components/MainDash/MainDash';
import RightSide from './components/RigtSide/RightSide.jsx';
import Sidebar from './components/Sidebar.jsx';
import Assign from './Routes/Assign'; // Changed import name
import Attendance from './Routes/Attendance';
import Employees from './Routes/Employess'; // Changed import name
import ProtectedRoute from "./components/ProtectedRoute";
import CreateAnnouncementPage from './components/Announcement/createAnnouncement';
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <div className="App">
      <div className="AppGlass">
      <Sidebar />
        <Routes>
          <Route path="/" element={<ProtectedRoute><MainDash /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/assetsPage" element={<ProtectedRoute><Assign /></ProtectedRoute>} />
          <Route path="/employee" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/SchedulePage" element={<ProtectedRoute><CreateAnnouncementPage /></ProtectedRoute>} />
          {/* Remove the login route from here */}
        </Routes>
        <RightSide/>
      </div>
    </div>
  );
}

export default App;
