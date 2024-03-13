import React, { useState ,useEffect} from 'react';
import { Button, Modal, Form, Input, DatePicker ,message} from 'antd';
import { EditOutlined, DeleteOutlined,EyeOutlined } from '@ant-design/icons'; // Importing Ant Design icons
import moment from 'moment';


import './EmployeeDetailsPage.css';

const EmployeeDetailsPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [employeeDetailsModalVisible, setEmployeeDetailsModalVisible] = useState(false);


  const handleFileChange = e => setFile(e.target.files[0]);
  const handleModalClose = () => {
    setModalVisible(false);
  };
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeDetailsModalVisible(true);
  };
  
  const handleEdit = (employee) => {
    // Set the selected employee for editing
    setSelectedEmployee(employee);
    form.setFieldsValue({
      name: employee.name,
      code: employee.code,
      email: employee.email,
      contact: employee.contact,
      fatherName: employee.fatherName,
      motherName: employee.motherName,
      birthday: moment(employee.birthday), // You'll need to ensure this is formatted correctly for the DatePicker component
      alternateContact: employee.alternateContact,
      relation: employee.relation,
      permanentAddress: employee.permanentAddress,
    });
    setModalVisible(true);
  };
  

  useEffect(() => {
    fetchEmployees();
  }, []);

// Within the handleDelete function in EmployeeDetailsPage.js
const handleDelete = (employee) => {
  console.log('Employee to be deleted:', employee);

  fetch(`https://hrportal-backend.onrender.com/delete/${employee._id}`, {
    method: 'DELETE',
  })
  .then(response => {
    console.log('Delete response:', response.status, response.statusText);
    if (response.ok) {
      message.success('Employee deleted successfully');
      setEmployees(employees.filter(emp => emp._id !== employee._id));
    } else {
      throw new Error('Failed to delete the employee');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    message.error('An error occurred while deleting the employee. Please try again later.');
  });
};

  
  const [form] = Form.useForm();

  const handleCreateEmployee = () => {
    setModalVisible(true);
  };

  const handleFormSubmit = () => {
    form.validateFields().then(values => {
      // Construct FormData as usual
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        formData.append(key, value);
      }
      if (file) {
        formData.append('image', file);
      }
  
      // Determine the endpoint and method
      const endpoint = selectedEmployee ? `https://hrportal-backend.onrender.com/update/${selectedEmployee._id}` : 'https://hrportal-backend.onrender.com/create';
      const method = selectedEmployee ? 'PUT' : 'POST';
  
      fetch(endpoint, { method, body: formData })
        .then(response => {
          if(response.ok) {
            message.success(`Employee ${selectedEmployee ? 'updated' : 'created'} successfully`);
            setModalVisible(false);
            form.resetFields();
            setSelectedEmployee(null); // Clear the selected employee
            // You should refetch or manually update your employees list here
          } else {
            throw new Error(`Failed to ${selectedEmployee ? 'update' : 'create'} employee`);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          message.error(`An error occurred while ${selectedEmployee ? 'updating' : 'creating'} the employee. Please try again later.`);
        });
    });
  };
  

  const fetchEmployees = () => {
    fetch('https://hrportal-backend.onrender.com/api/employees')
       .then(response => response.json())
       .then(data => {
         setEmployees(data);
         console.log(data)
         console.log('Fetched employees image:', data.imagePath); // Log the fetched data
         console.log('Fetched employees data:', data)
       })
       .catch(error => console.error('Error fetching employees:', error));
   };

  return (
    <div className="employee-details-container">
      <h2>Employee Details</h2>
      <Button className="create-btn" type="primary" onClick={handleCreateEmployee}>Create New Employee</Button>
      <div className="employee-table-container"> 
        <table className="employee-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {employees.map(employee => (
              <tr key={employee._id}>
               <td>
                <img src={`/uploads//${employee.imagePath}`} alt="Employee" className="employee-image" /></td>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>
                  <Button onClick={() => handleEdit(employee)} className="action-btn" icon={<EditOutlined style={{ color: '#1890ff' }} />} />
                  <Button onClick={() => handleDelete(employee)} className="action-btn" icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} />
                  <Button onClick={() => handleViewDetails(employee)} className="action-btn" icon={<EyeOutlined />} />

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
  title="Employee Details"
  visible={employeeDetailsModalVisible}
  onCancel={() => setEmployeeDetailsModalVisible(false)}
  footer={[
    <Button key="back" onClick={() => setEmployeeDetailsModalVisible(false)}>
      Close
    </Button>,
  ]}
  destroyOnClose={true}
>
  {selectedEmployee && (
    <div>
      <p><strong>Name:</strong> {selectedEmployee.name}</p>
      <p><strong>Email:</strong> {selectedEmployee.email}</p>
      <p><strong>Department:</strong> {selectedEmployee.department}</p>
      {/* Add other details as needed */}
      <p><strong>Alternate Contact:</strong> {selectedEmployee.alternateContact}</p>
      <p><strong>Birthday:</strong> {selectedEmployee.birthday}</p>
      <p><strong>Code:</strong> {selectedEmployee.code}</p>
      <p><strong>Contact:</strong> {selectedEmployee.contact}</p>
      <p><strong>Father's Name:</strong> {selectedEmployee.fatherName}</p>
      <p><strong>Mother's Name:</strong> {selectedEmployee.motherName}</p>
      <p><strong>Permanent Address:</strong> {selectedEmployee.permanentAddress}</p>
      <p><strong>Relation:</strong> {selectedEmployee.relation}</p>
      {/* Add other fields similarly */}

      {/* Display Assets */}
      {selectedEmployee.assets.length > 0 && (
        <div>
          <h3>Assets:</h3>
          {selectedEmployee.assets.map(asset => (
            <div key={asset._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px 0' }}>
              <p><strong>Asset Name:</strong> {asset.assetName}</p>
              <p><strong>Assigned Date:</strong> {new Date(asset.assignedDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</Modal>



      <Modal
        title="Create New Employee"
        visible={modalVisible}
        onCancel={handleModalClose}
        onOk={handleFormSubmit}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Please input the code!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contact" label="Contact" rules={[{ required: true, message: 'Please input the contact!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fatherName" label="Father's Name" rules={[{ required: true, message: "Please input the father's name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="motherName" label="Mother's Name" rules={[{ required: true, message: "Please input the mother's name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="birthday" label="Birthday" rules={[{ required: true, message: 'Please select the birthday!' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="alternateContact" label="Alternate Contact">
            <Input />
          </Form.Item>
          <Form.Item name="relation" label="Relation" rules={[{ required: true, message: 'Please input the relation!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Upload Image">
            <input type="file" onChange={handleFileChange} />
          </Form.Item>
          <Form.Item name="permanentAddress" label="Permanent Address" rules={[{ required: true, message: 'Please input the permanent address!' }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default EmployeeDetailsPage;
