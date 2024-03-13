import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Paper, Typography, Badge, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
import { Layout, message } from 'antd';
import "../App.css";

const { Content } = Layout;

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://hrportal-backend.onrender.com/api/employees');
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleMarkAttendance = async (id, newStatus) => {
    try {
      const lastClickTime = localStorage.getItem(`lastClickTime_${id}`); // Get last click timestamp
      const twelveHoursAgo = new Date();
      twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

      if (lastClickTime && new Date(lastClickTime) > twelveHoursAgo) {
        message.warning(`You can only mark attendance once in 12 hours`);
        return;
      }

      const today = new Date().toISOString(); // Get current timestamp

      // Display circle animation
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1000); // Reset message after 1 second

      await axios.post(`https://hrportal-backend.onrender.com/api/employee/${id}/mark-attendance`, { timestamp: today, status: newStatus });
      message.success(`Marked ${newStatus} for employee ${id}`);

      localStorage.setItem(`lastClickTime_${id}`, today); // Save current timestamp to localStorage

      setAttendanceData(prevData =>
        prevData.map(employee => {
          if (employee._id === id) {
            const updatedEmployee = { ...employee };
            updatedEmployee.attendance.push({ timestamp: today, status: newStatus });
            return updatedEmployee;
          }
          return employee;
        })
      );
    } catch (error) {
      console.error('Error marking attendance:', error);
      message.error('Failed to mark attendance');
    }
  };

  const isButtonDisabled = (id) => {
    const lastClickTime = localStorage.getItem(`lastClickTime_${id}`);
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);
    return lastClickTime && new Date(lastClickTime) > twelveHoursAgo;
  };

  return (
    <Content className='updown' style={{ padding: '24px', minHeight: 280 }}>
      <div className="scrollable-container">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper style={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>Attendance</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceData.map(employee => (
                      <TableRow key={employee._id}>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>
                          <Badge color={employee.status === 'Present' ? 'success' : 'error'} badgeContent={employee.status} />
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleMarkAttendance(employee._id, 'Present')}
                            disabled={isButtonDisabled(employee._id) || employee.status === 'Present'}
                            className="action-button present"
                          >
                            Present
                            {showMessage && <div className="circle"></div>}
                          </Button>
                          <Button
                            onClick={() => handleMarkAttendance(employee._id, 'Absent')}
                            disabled={isButtonDisabled(employee._id) || employee.status === 'Absent'}
                            className="action-button absent"
                          >
                            Absent
                            {showMessage && <div className="circle"></div>}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Content>
  );
};

export default Attendance;
