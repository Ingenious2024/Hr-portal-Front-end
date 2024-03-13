import React, { useState } from 'react';
import { Form, Input, Button, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './CreateAnnouncementPage.css'; 

const CreateAnnouncementPage = () => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const authorId = localStorage.getItem('Userid'); 

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('announcementContent', values.announcementContent);
      if (authorId) {
        formData.append('authorId', authorId);
        console.log(authorId)
      }
      console.log(authorId)
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
  
      const response = await fetch('https://hrportal-backend.onrender.com/api/announcement/create', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        const data = await response.json();
        // Reset form after successful submission
        form.resetFields();
        // Show success message
        message.success('Announcement created successfully.');
        console.log('Created announcement ID:', data.id);
      } else {
        // Handle error cases
        message.error('Failed to create announcement.');
        console.error('Error creating announcement:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      message.error('Failed to create announcement.');
    }
  };

  const handleImageChange = (info) => {
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  return (
    <div className="announcement-container">
      <h1>Create Announcement</h1>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="announcementContent" rules={[{ required: true, message: 'Please enter announcement content' }]}>
          <Input.TextArea rows={4} placeholder="Enter announcement content" />
        </Form.Item>
        <Form.Item>
          <Form.Item
            name="image"
            valuePropName="fileList"
            getValueFromEvent={handleImageChange}
            noStyle
          >
            <Upload.Dragger name="file" multiple={false} accept="image/*" beforeUpload={() => false}>
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Click or drag image to this area to upload</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateAnnouncementPage;
