import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'antd';
import './CustomerReview.css'; // Ensure this file includes your global CSS rules

function App() {
  const [holidays, setHolidays] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch('https://hrportal-backend.onrender.com/api/schedule');
        const data = await response.json();
        // Filter for the holiday with the specific date "0055-05-05"
        const filteredHolidays = data.filter(holiday => holiday.date.startsWith('0055-05-05'));
        setHolidays(filteredHolidays);
      } catch (error) {
        console.error('Error fetching holidays:', error);
      }
    };
    fetchHolidays();
  }, []);

  const handleOpenModal = () => setModalVisible(true);

  const handleCloseModal = () => setModalVisible(false);

  return (
    <div className="carousel-container">
      <h2>Special Historical Holiday</h2>
      {holidays.length > 0 ? (
        holidays.map((holiday, index) => (
          <div key={index} className="card-wrapper" style={{ backgroundImage: 'url("https://tse3.mm.bing.net/th?id=OIP.nKTMv2ouXDp0cyowtBc8vAHaEz&pid=Api&P=0&h=180")', backgroundSize: 'cover' }}>
            <Card
              className="login-panel" // Apply the glass effect
              title={<div className="card-title">{holiday.title}</div>}
              extra={<Button className='detail-button' onClick={handleOpenModal}>Details</Button>}
            >
              <h3>{holiday.description}</h3>
              <h4>{holiday.date.replace('T00:00:00.000Z', '')}</h4>
            </Card>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
      <Modal
        title="Holiday Details"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>
        ]}
      >
        <ul>
          {holidays.map((holiday, index) => (
            <li key={index}>{holiday.title} - {holiday.date.replace('T00:00:00.000Z', '')}</li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

export default App;
