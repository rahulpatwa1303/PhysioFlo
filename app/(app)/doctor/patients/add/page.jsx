"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Upload,
  message,
  Row,
  Col,
  Space,
  Divider,
  Alert,
  Switch,
  Typography,
  Tabs
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  SaveOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const DoctorAddPatientPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('new');
  const [selectedHospitalPatient, setSelectedHospitalPatient] = useState(null);

  // Mock hospital patients (patients in the hospital system but not assigned to this doctor)
  const [hospitalPatients] = useState([
    {
      id: 'HP001',
      name: 'Jennifer Davis',
      age: 35,
      gender: 'Female',
      phone: '+1 234-567-8801',
      email: 'jennifer.davis@email.com',
      lastVisit: '2024-01-10',
      condition: 'Routine Check-up',
      assignedDoctor: 'Not Assigned'
    },
    {
      id: 'HP002',
      name: 'Michael Thompson',
      age: 42,
      gender: 'Male',
      phone: '+1 234-567-8802',
      email: 'michael.thompson@email.com',
      lastVisit: '2024-01-05',
      condition: 'Hypertension',
      assignedDoctor: 'Dr. Emily Rodriguez'
    },
    {
      id: 'HP003',
      name: 'Sarah Johnson',
      age: 28,
      gender: 'Female',
      phone: '+1 234-567-8803',
      email: 'sarah.j@email.com',
      lastVisit: '2024-01-08',
      condition: 'Diabetes Management',
      assignedDoctor: 'Not Assigned'
    },
    {
      id: 'HP004',
      name: 'Robert Lee',
      age: 55,
      gender: 'Male',
      phone: '+1 234-567-8804',
      email: 'robert.lee@email.com',
      lastVisit: '2023-12-15',
      condition: 'Cardiac Follow-up',
      assignedDoctor: 'Dr. James Wilson'
    }
  ]);

  const handleBack = () => {
    router.push('/doctor/patients');
  };

  const handleSubmitNewPatient = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('New Personal Patient Data:', values);
      message.success('Personal patient added successfully!');
      router.push('/doctor/patients');
    } catch (error) {
      message.error('Failed to add patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptHospitalPatient = async (patientId) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Adopting Hospital Patient:', patientId);
      message.success('Hospital patient added to your personal roster!');
      router.push('/doctor/patients');
    } catch (error) {
      message.error('Failed to add patient to your roster. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response.url);
      setLoading(false);
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

  const hospitalPatientColumns = [
    {
      title: 'Patient',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <UserOutlined className="text-gray-500" />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">ID: {record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Age/Gender',
      key: 'demographics',
      render: (_, record) => `${record.age} • ${record.gender}`,
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      key: 'contact',
      render: (phone, record) => (
        <div>
          <div className="text-sm">{phone}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
    },
    {
      title: 'Current Doctor',
      dataIndex: 'assignedDoctor',
      key: 'assignedDoctor',
      render: (doctor) => (
        <span className={doctor === 'Not Assigned' ? 'text-orange-600' : 'text-green-600'}>
          {doctor}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => handleAdoptHospitalPatient(record.id)}
          disabled={loading}
        >
          Add to My Roster
        </Button>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'new',
      label: (
        <span className="flex items-center space-x-2">
          <UserOutlined />
          <span>New Personal Patient</span>
        </span>
      ),
      children: (
        <div>
          <Alert
            message="Adding a New Personal Patient"
            description="You are creating a new patient record that will be exclusively under your care. This patient will be added to your personal roster and will not be visible to other doctors unless you explicitly share access."
            type="info"
            icon={<InfoCircleOutlined />}
            showIcon
            className="mb-6"
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitNewPatient}
            requiredMark={false}
          >
            {/* Personal Information */}
            <Card title="Personal Information" className="mb-6">
              <Row gutter={16}>
                <Col xs={24} lg={6}>
                  <Form.Item label="Profile Picture">
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      onChange={handleAvatarChange}
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="avatar" style={{ width: '100%' }} />
                      ) : (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={18}>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please input the first name!' }]}
                      >
                        <Input placeholder="Enter first name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please input the last name!' }]}
                      >
                        <Input placeholder="Enter last name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                        rules={[{ required: true, message: 'Please select date of birth!' }]}
                      >
                        <DatePicker 
                          style={{ width: '100%' }}
                          placeholder="Select date"
                          disabledDate={(current) => current && current > dayjs().endOf('day')}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: 'Please select gender!' }]}
                      >
                        <Select placeholder="Select gender">
                          <Option value="Male">Male</Option>
                          <Option value="Female">Female</Option>
                          <Option value="Other">Other</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
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
                  </Row>
                </Col>
              </Row>
            </Card>

            {/* Contact Information */}
            <Card title="Contact Information" className="mb-6">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please input phone number!' }]}
                  >
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: 'Please input email address!' },
                      { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                  >
                    <Input placeholder="Enter email address" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: 'Please input address!' }]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Enter complete address"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Emergency Contact */}
            <Card title="Emergency Contact" className="mb-6">
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="emergencyContactName"
                    label="Contact Name"
                    rules={[{ required: true, message: 'Please input emergency contact name!' }]}
                  >
                    <Input placeholder="Enter contact name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="emergencyContactPhone"
                    label="Contact Phone"
                    rules={[{ required: true, message: 'Please input emergency contact phone!' }]}
                  >
                    <Input placeholder="Enter contact phone" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="emergencyContactRelation"
                    label="Relationship"
                    rules={[{ required: true, message: 'Please select relationship!' }]}
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
            </Card>

            {/* Medical Information */}
            <Card title="Medical Information" className="mb-6">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="insurance"
                    label="Insurance Provider"
                  >
                    <Input placeholder="Enter insurance provider" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="primaryConcern"
                    label="Primary Health Concern"
                  >
                    <Input placeholder="Enter main health concern" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="medicalHistory"
                    label="Medical History"
                  >
                    <TextArea
                      rows={4}
                      placeholder="Enter relevant medical history, allergies, current medications, etc."
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="notes"
                    label="Additional Notes"
                  >
                    <TextArea
                      rows={3}
                      placeholder="Any additional notes or special considerations"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-between items-center">
              <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
                Back to Patients
              </Button>
              <Space>
                <Button onClick={handleBack}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  Add Personal Patient
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      ),
    },
    {
      key: 'hospital',
      label: (
        <span className="flex items-center space-x-2">
          <TeamOutlined />
          <span>Hospital Patients</span>
        </span>
      ),
      children: (
        <div>
          <Alert
            message="Adding Hospital Patients to Your Roster"
            description="These are existing patients in the hospital system. You can add them to your personal patient roster to take over their care or collaborate with their current doctor."
            type="info"
            icon={<InfoCircleOutlined />}
            showIcon
            className="mb-6"
          />

          <Card title="Available Hospital Patients">
            <div className="space-y-4">
              {hospitalPatients.map((patient) => (
                <Card
                  key={patient.id}
                  size="small"
                  className="border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <UserOutlined className="text-blue-500" />
                        <span className="font-semibold text-lg">{patient.name}</span>
                        <span className="text-sm text-gray-500">({patient.age} • {patient.gender})</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Contact:</strong> {patient.phone}
                        </div>
                        <div>
                          <strong>Condition:</strong> {patient.condition}
                        </div>
                        <div>
                          <strong>Current Doctor:</strong>{' '}
                          <span className={patient.assignedDoctor === 'Not Assigned' ? 'text-orange-600' : 'text-green-600'}>
                            {patient.assignedDoctor}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => handleAdoptHospitalPatient(patient.id)}
                      disabled={loading}
                    >
                      Add to My Roster
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <div className="flex justify-between items-center mt-6">
            <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
              Back to Patients
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
        >
          Back
        </Button>
        <div>
          <Title level={2} className="mb-0">Add Patient</Title>
          <Text className="text-gray-500">
            Add a new personal patient or select from existing hospital patients
          </Text>
        </div>
      </div>

      {/* Tabs for different patient types */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </div>
  );
};

export default DoctorAddPatientPage;
