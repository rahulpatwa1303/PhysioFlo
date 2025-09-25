"use client";
import { Card, Button, Table, Space, Typography, Tag, Select, Input, Row, Col, Modal, Form, DatePicker, Drawer } from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, EyeOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

// Enhanced mock patient data
const mockPatients = [
  { 
    id: 'PT001', 
    name: 'John Smith', 
    age: 45, 
    gender: 'Male', 
    phone: '+1 234-567-8901',
    email: 'john.smith@email.com',
    address: '123 Main St, City, State 12345',
    emergencyContact: 'Jane Smith (+1 234-567-8900)',
    bloodType: 'A+',
    allergies: 'Penicillin, Shellfish',
    status: 'Active',
    lastVisit: '2025-09-20',
    nextAppointment: '2025-09-25',
    doctor: 'Dr. Sarah Wilson',
    insurance: 'Blue Cross Blue Shield',
    medicalConditions: ['Hypertension', 'Diabetes Type 2']
  },
  { 
    id: 'PT002', 
    name: 'Emily Johnson', 
    age: 32, 
    gender: 'Female', 
    phone: '+1 234-567-8902',
    email: 'emily.johnson@email.com',
    address: '456 Oak Ave, City, State 12345',
    emergencyContact: 'Michael Johnson (+1 234-567-8901)',
    bloodType: 'O-',
    allergies: 'None',
    status: 'Active',
    lastVisit: '2025-09-21',
    nextAppointment: '2025-09-28',
    doctor: 'Dr. Michael Chen',
    insurance: 'Aetna',
    medicalConditions: ['Asthma']
  },
  { 
    id: 'PT003', 
    name: 'Robert Davis', 
    age: 58, 
    gender: 'Male', 
    phone: '+1 234-567-8903',
    email: 'robert.davis@email.com',
    address: '789 Pine St, City, State 12345',
    emergencyContact: 'Mary Davis (+1 234-567-8902)',
    bloodType: 'B+',
    allergies: 'Latex',
    status: 'Inactive',
    lastVisit: '2025-08-15',
    nextAppointment: null,
    doctor: 'Dr. Jennifer Lee',
    insurance: 'Medicare',
    medicalConditions: ['Arthritis', 'High Cholesterol']
  },
  { 
    id: 'PT004', 
    name: 'Lisa Garcia', 
    age: 29, 
    gender: 'Female', 
    phone: '+1 234-567-8904',
    email: 'lisa.garcia@email.com',
    address: '321 Elm Dr, City, State 12345',
    emergencyContact: 'Carlos Garcia (+1 234-567-8903)',
    bloodType: 'AB+',
    allergies: 'Peanuts',
    status: 'Active',
    lastVisit: '2025-09-18',
    nextAppointment: '2025-09-30',
    doctor: 'Dr. Sarah Wilson',
    insurance: 'United Healthcare',
    medicalConditions: ['Migraine']
  }
];

const columns = [
  { 
    title: 'Patient ID', 
    dataIndex: 'id', 
    key: 'id',
    width: 100
  },
  { 
    title: 'Patient Info', 
    key: 'patientInfo',
    render: (_, record) => (
      <div>
        <div className="font-medium">{record.name}</div>
        <div className="text-sm text-gray-500">{record.age} years, {record.gender}</div>
        <div className="text-sm text-gray-500">{record.phone}</div>
      </div>
    )
  },
  { 
    title: 'Contact', 
    key: 'contact',
    render: (_, record) => (
      <div>
        <div className="text-sm">{record.email}</div>
        <div className="text-sm text-gray-500">{record.phone}</div>
      </div>
    )
  },
  { 
    title: 'Doctor', 
    dataIndex: 'doctor', 
    key: 'doctor'
  },
  { 
    title: 'Status', 
    dataIndex: 'status', 
    key: 'status',
    render: (status) => {
      const color = status === 'Active' ? 'green' : 'orange';
      return <Tag color={color}>{status}</Tag>;
    }
  },
  { 
    title: 'Last Visit', 
    dataIndex: 'lastVisit', 
    key: 'lastVisit',
    render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
  },
  { 
    title: 'Next Appointment', 
    dataIndex: 'nextAppointment', 
    key: 'nextAppointment',
    render: (date) => date ? new Date(date).toLocaleDateString() : 'None scheduled'
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<EyeOutlined />} size="small" type="primary">View</Button>
        <Button icon={<EditOutlined />} size="small">Edit</Button>
        <Button icon={<CalendarOutlined />} size="small">Schedule</Button>
        <Button icon={<PhoneOutlined />} size="small">Call</Button>
      </Space>
    )
  }
];

const StaffPatientsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [doctorFilter, setDoctorFilter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddPatient = () => {
    setIsModalVisible(true);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setDrawerVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('Adding patient:', values);
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const filteredData = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchText.toLowerCase()) ||
                         patient.phone.includes(searchText) ||
                         patient.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || patient.status === statusFilter;
    const matchesDoctor = !doctorFilter || patient.doctor === doctorFilter;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={3}>Patient Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPatient}>
          Register Patient
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-sm text-gray-500">Total Patients</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">1,102</div>
            <div className="text-sm text-gray-500">Active Patients</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">145</div>
            <div className="text-sm text-gray-500">Inactive Patients</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">23</div>
            <div className="text-sm text-gray-500">New This Week</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Search
              placeholder="Search by name, ID, phone, or email"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Status"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Doctor"
              style={{ width: '100%' }}
              value={doctorFilter}
              onChange={setDoctorFilter}
              allowClear
            >
              <Option value="Dr. Sarah Wilson">Dr. Sarah Wilson</Option>
              <Option value="Dr. Michael Chen">Dr. Michael Chen</Option>
              <Option value="Dr. Jennifer Lee">Dr. Jennifer Lee</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary">
              Export List
            </Button>
          </Col>
          <Col span={4}>
            <Button>
              Import Patients
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Patients Table */}
      <Card title={`Patients (${filteredData.length})`}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onDoubleClick: () => handleViewPatient(record)
          })}
        />
      </Card>

      {/* Add Patient Modal */}
      <Modal
        title="Register New Patient"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select date of birth' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input.TextArea rows={2} placeholder="Enter complete address" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="emergencyContact"
                label="Emergency Contact"
                rules={[{ required: true, message: 'Please enter emergency contact' }]}
              >
                <Input placeholder="Name and phone number" />
              </Form.Item>
            </Col>
            <Col span={6}>
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
            <Col span={6}>
              <Form.Item
                name="assignedDoctor"
                label="Assigned Doctor"
                rules={[{ required: true, message: 'Please select doctor' }]}
              >
                <Select placeholder="Select doctor">
                  <Option value="Dr. Sarah Wilson">Dr. Sarah Wilson</Option>
                  <Option value="Dr. Michael Chen">Dr. Michael Chen</Option>
                  <Option value="Dr. Jennifer Lee">Dr. Jennifer Lee</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="allergies"
                label="Known Allergies"
              >
                <Input placeholder="Enter known allergies (comma separated)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="insurance"
                label="Insurance Provider"
              >
                <Input placeholder="Enter insurance provider" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="medicalHistory"
            label="Medical History"
          >
            <Input.TextArea rows={3} placeholder="Enter relevant medical history" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Patient Detail Drawer */}
      <Drawer
        title="Patient Details"
        placement="right"
        size="large"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <div className="text-2xl font-bold">{selectedPatient.name}</div>
              <div className="text-gray-500">{selectedPatient.id}</div>
              <Tag color={selectedPatient.status === 'Active' ? 'green' : 'orange'}>
                {selectedPatient.status}
              </Tag>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text strong>Age:</Text>
                <div>{selectedPatient.age} years</div>
              </div>
              <div>
                <Text strong>Gender:</Text>
                <div>{selectedPatient.gender}</div>
              </div>
              <div>
                <Text strong>Blood Type:</Text>
                <div>{selectedPatient.bloodType}</div>
              </div>
              <div>
                <Text strong>Assigned Doctor:</Text>
                <div>{selectedPatient.doctor}</div>
              </div>
            </div>
            
            <div>
              <Text strong>Contact Information:</Text>
              <div className="mt-2 space-y-1">
                <div>Phone: {selectedPatient.phone}</div>
                <div>Email: {selectedPatient.email}</div>
                <div>Address: {selectedPatient.address}</div>
              </div>
            </div>
            
            <div>
              <Text strong>Emergency Contact:</Text>
              <div className="mt-1">{selectedPatient.emergencyContact}</div>
            </div>
            
            <div>
              <Text strong>Insurance:</Text>
              <div className="mt-1">{selectedPatient.insurance}</div>
            </div>
            
            <div>
              <Text strong>Allergies:</Text>
              <div className="mt-1">{selectedPatient.allergies}</div>
            </div>
            
            <div>
              <Text strong>Medical Conditions:</Text>
              <div className="mt-2">
                {selectedPatient.medicalConditions.map(condition => (
                  <Tag key={condition} color="blue" className="mb-1">{condition}</Tag>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text strong>Last Visit:</Text>
                <div>{selectedPatient.lastVisit ? new Date(selectedPatient.lastVisit).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div>
                <Text strong>Next Appointment:</Text>
                <div>{selectedPatient.nextAppointment ? new Date(selectedPatient.nextAppointment).toLocaleDateString() : 'None scheduled'}</div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Space>
                <Button type="primary" icon={<EditOutlined />}>
                  Edit Patient
                </Button>
                <Button icon={<CalendarOutlined />}>
                  Schedule Appointment
                </Button>
                <Button icon={<FileTextOutlined />}>
                  View Medical Records
                </Button>
                <Button icon={<PhoneOutlined />}>
                  Call Patient
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default StaffPatientsPage;
