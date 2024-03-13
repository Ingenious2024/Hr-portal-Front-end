import React, { useState } from 'react';
import CustomerReview from '../CustomerReview/CustomerReview';
import Updates from '../Updates/Updates';
import Announcement from '../Announcement/Announcement';
import './RightSide.css';
import { useAuth } from "../../Routes/AuthContext"; 
const RightSide = () => {
  const [showUpdates, setShowUpdates] = useState(true);
  const { isLoggedIn } = useAuth();
  const toggleUpdates = () => {
    setShowUpdates(prevState => !prevState);
  };
  if (!isLoggedIn) return null;
  return (
    <>
    <div className="RightSide">
      <div>
      <div className="toggle-container">
          <input type="checkbox" id="toggle" className="toggle-input" checked={showUpdates} onChange={toggleUpdates} />
          <label htmlFor="toggle" className="toggle-label">
            <div className="toggle-button"></div>
          </label>
          <span>Show Updates</span>
        </div>
        <h3>Updates</h3>
        <Updates />
      </div>
      {!showUpdates && <Announcement />}
      {showUpdates && <CustomerReview />}
    </div>
    </>
  );
};

export default RightSide;
