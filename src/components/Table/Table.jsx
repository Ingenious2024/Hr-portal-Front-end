import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Modal from "antd/lib/modal/Modal";
import "./Table.css";

// Function to fetch data from API
async function fetchData() {
  try {
    const response = await fetch("https://hrportal-backend.onrender.com/api/employees");
    const data = await response.json();
    // Extracting attendance status for each employee
    const rows = data.map((employee) => {
      const latestAttendance = employee.attendance[0]; // Assuming the latest attendance is at index 0
      return {
        id: employee._id,
        name: employee.name,
        trackingId: employee.code,
        date: latestAttendance
          ? new Date(latestAttendance.date).toLocaleDateString()
          : "N/A",
        status: latestAttendance ? latestAttendance.status : "N/A",
        attendanceAPI: `https://hrportal-backend.onrender.com/api/employees/${employee._id}/attendance`,
      };
    });
    return rows;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
}

const makeStyle = (status) => {
  if (status === "Present") {
    return {
      background: "rgb(145 254 159 / 47%)",
      color: "green",
    };
  } else {
    return {
      background: "#ffadad8f",
      color: "red",
    };
  }
};

export default function BasicTable() {
  const [rows, setRows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchData().then((data) => {
      setRows(data);
    });
  }, []);

  const handleOpenModal = async (attendanceAPI) => {
    try {
      const response = await fetch(attendanceAPI);
      const data = await response.json();
      setAttendanceData(data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching attendance data: ", error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="Table">
      <h3>Recent Orders</h3>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="left">Tracking ID</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.trackingId}</TableCell>
                <TableCell align="left">{row.date}</TableCell>
                <TableCell align="left">
                  <span className="status" style={makeStyle(row.status)}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell align="left">
                  <Button onClick={() => handleOpenModal(row.attendanceAPI)}>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        title="Attendance Summary"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </div>
  );
}
