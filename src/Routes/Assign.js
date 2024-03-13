import React, { useState, useEffect } from 'react';
import { Typography, Button, Table, Modal, Form, Input, Space, Card } from 'antd';
import axios from 'axios';

const { Text } = Typography;

const AssignAssetPage = () => {
  const [employees, setEmployees] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [assetDescription, setAssetDescription] = useState('');
  const [assigningAsset, setAssigningAsset] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://hrportal-backend.onrender.com/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const showModal = (employee) => {
    setSelectedEmployee(employee);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setAssetDescription('');
    setAssigningAsset(false);
  };

  const handleFormSubmit = async () => {
    try {
      if (!selectedEmployee || !selectedEmployee._id) {
        console.error('No employee selected or invalid employee data.');
        return;
      }

      setAssigningAsset(true);

      await axios.post(`https://hrportal-backend.onrender.com/api/employee/${selectedEmployee._id}/assign-asset`, {
        assetName: assetDescription,
        assignedDate: new Date().toISOString(),
        returnDate: new Date().toISOString(),
      });

      const updatedEmployeesResponse = await axios.get('https://hrportal-backend.onrender.com/api/employees');
      setEmployees(updatedEmployeesResponse.data);

      Modal.success({
        title: 'Asset Assigned Successfully',
        content: 'The asset has been assigned successfully.',
      });

      setVisible(false);
      setAssetDescription('');
      setAssigningAsset(false);
    } catch (error) {
      console.error('Error:', error.message);
      Modal.error({
        title: 'Failed to Assign Asset',
        content: 'There was an error while assigning the asset.',
      });
      setAssigningAsset(false);
    }
  };

  return (
    <div style={{ padding: '20px', height: 'calc(100vh - 40px)', overflow: 'auto' }}>
      <Typography.Title level={2} style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', marginBottom: '20px' }}>
        Assign Assets to Employees
      </Typography.Title>

      <Card>
        <Table dataSource={employees} rowKey="_id">
          <Table.Column title="Employee Name" dataIndex="name" key="name" />
          <Table.Column
            title="Assigned Assets"
            dataIndex="assets"
            key="assets"
            render={(assets) => (
              <Space direction="vertical">
                {assets.map((asset, index) => (
                  <div key={index}>
                    <Text strong>Asset Name:</Text> {asset.assetName}<br />
                    <Text strong>Assigned Date:</Text> {new Date(asset.assignedDate).toLocaleDateString()}
                  </div>
                ))}
              </Space>
            )}
          />
          <Table.Column
            title="Actions"
            key="actions"
            render={(text, record) => (
              <Button type="primary" onClick={() => showModal(record)}>
                Assign Asset
              </Button>
            )}
          />
        </Table>
      </Card>

      <Modal
        title={`Assign Asset to ${selectedEmployee?.name}`}
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={assigningAsset} onClick={handleFormSubmit}>
            Assign Asset
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Asset Description">
            <Input.TextArea
              value={assetDescription}
              onChange={(e) => setAssetDescription(e.target.value)}
              placeholder="Enter asset description"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssignAssetPage;
