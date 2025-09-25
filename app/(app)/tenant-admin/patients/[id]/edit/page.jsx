"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  message, 
  Row, 
  Col, 
  Divider,
  Upload,
  Avatar,
  Spin
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  UserOutlined,
  UploadOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

// Mock patient data (same as in details page)
const mockPatientData = {
  '1': {
    id: 'PT001',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1979-03-15',
    gender: 'Male',
    bloodType: 'O+',
    maritalStatus: 'Married',
    phone: '+1 234-567-8901',
    email: 'john.smith@email.com',
    address: '123 Main St, New York, NY 10001',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    emergencyContactName: 'Jane Smith',
    emergencyContactPhone: '+1 234-567-8999',
    emergencyContactRelation: 'Spouse',
    assignedDoctor: 'Dr. Sarah Wilson',
    insurance: 'Blue Cross Blue Shield',
    medicalHistory: 'Hypertension, Type 2 Diabetes',
    notes: 'Patient is compliant with medication and follows diet restrictions.',
    avatar: null,
  },
};

const EditPatientPage = () => {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id;
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch patient data
    setTimeout(() => {
      const patientData = mockPatientData[patientId];
      if (patientData) {
        setPatient(patientData);
        setAvatarUrl(patientData.avatar);
        
        // Populate form with existing data
        form.setFieldsValue({
          ...patientData,
          dateOfBirth: patientData.dateOfBirth ? dayjs(patientData.dateOfBirth) : null,
        });
      }
      setInitialLoading(false);
    }, 1000);
  }, [patientId, form]);

  const handleBack = () => {
    router.push(`/tenant-admin/patients/${patientId}`);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Format the data
      const patientData = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        avatar: avatarUrl,
        id: patient.id, // Keep original ID
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Updated patient data:', patientData);
      
      message.success('Patient updated successfully!');
      router.push(`/tenant-admin/patients/${patientId}`);
      
    } catch (error) {
      console.error('Error updating patient:', error);
      message.error('Failed to update patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response?.url || URL.createObjectURL(info.file.originFileObj));
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Patient not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          size="large"
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Patient</h1>
          <p className="text-gray-500">Update patient information - ID: {patient.id}</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          size="large"
        >
          {/* Avatar Upload Section */}
          <div className="text-center mb-6">
            <Avatar
              size={100}
              src={avatarUrl}
              icon={<UserOutlined />}
              className="mb-4"
            />
            <div>
              <Upload
                name="avatar"
                listType="text"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleAvatarChange}
                customRequest={({ file, onSuccess }) => {
                  // Simulate upload
                  setTimeout(() => {
                    onSuccess({ url: URL.createObjectURL(file) });
                  }, 1000);
                }}
              >
                <Button icon={<UploadOutlined />}>Change Photo</Button>
              </Upload>
              <p className="text-sm text-gray-500 mt-2">
                Upload patient photo (JPG/PNG, max 2MB)
              </p>
            </div>
          </div>

          <Divider />

          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true, message: 'Please enter first name' }]}
                >
                  <Input placeholder="Enter first name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true, message: 'Please enter last name' }]}
                >
                  <Input placeholder="Enter last name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="dateOfBirth"
                  label="Date of Birth"
                  rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    placeholder="Select date of birth"
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: 'Please select gender' }]}
                >
                  <Select placeholder="Select gender">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="bloodType"
                  label="Blood Type"
                >
                  <Select placeholder="Select blood type">
                    <Option value="A+">A+</Option>
                    <Option value="A-">A-</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B-">B-</Option>
                    <Option value="AB+">AB+</Option>
                    <Option value="AB-">AB-</Option>
                    <Option value="O+">O+</Option>
                    <Option value="O-">O-</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="maritalStatus"
                  label="Marital Status"
                >
                  <Select placeholder="Select marital status">
                    <Option value="Single">Single</Option>
                    <Option value="Married">Married</Option>
                    <Option value="Divorced">Divorced</Option>
                    <Option value="Widowed">Widowed</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    { required: true, message: 'Please enter phone number' },
                    { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number' }
                  ]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input placeholder="Enter email address" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: 'Please enter address' }]}
                >
                  <TextArea 
                    rows={3} 
                    placeholder="Enter complete address"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: 'Please enter city' }]}
                >
                  <Input placeholder="Enter city" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: 'Please enter state' }]}
                >
                  <Input placeholder="Enter state" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="zipCode"
                  label="ZIP Code"
                  rules={[{ required: true, message: 'Please enter ZIP code' }]}
                >
                  <Input placeholder="Enter ZIP code" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* Emergency Contact */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="emergencyContactName"
                  label="Contact Name"
                  rules={[{ required: true, message: 'Please enter emergency contact name' }]}
                >
                  <Input placeholder="Enter emergency contact name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="emergencyContactPhone"
                  label="Contact Phone"
                  rules={[
                    { required: true, message: 'Please enter emergency contact phone' },
                    { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number' }
                  ]}
                >
                  <Input placeholder="Enter emergency contact phone" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="emergencyContactRelation"
                  label="Relationship"
                  rules={[{ required: true, message: 'Please enter relationship' }]}
                >
                  <Select placeholder="Select relationship">
                    <Option value="Spouse">Spouse</Option>
                    <Option value="Parent">Parent</Option>
                    <Option value="Child">Child</Option>
                    <Option value="Sibling">Sibling</Option>
                    <Option value="Friend">Friend</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* Medical Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="assignedDoctor"
                  label="Assigned Doctor"
                  rules={[{ required: true, message: 'Please select assigned doctor' }]}
                >
                  <Select placeholder="Select assigned doctor">
                    <Option value="Dr. Sarah Wilson">Dr. Sarah Wilson</Option>
                    <Option value="Dr. Michael Brown">Dr. Michael Brown</Option>
                    <Option value="Dr. Jessica Lee">Dr. Jessica Lee</Option>
                    <Option value="Dr. David Chen">Dr. David Chen</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="insurance"
                  label="Insurance Provider"
                >
                  <Input placeholder="Enter insurance provider" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  name="medicalHistory"
                  label="Medical History"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Enter known medical conditions, allergies, medications, etc."
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  name="notes"
                  label="Additional Notes"
                >
                  <TextArea 
                    rows={3} 
                    placeholder="Any additional notes or comments"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button size="large" onClick={handleBack}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              size="large"
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
            >
              Update Patient
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EditPatientPage;
