"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Avatar, 
  Descriptions, 
  Tabs, 
  Table,
  Timeline,
  Modal,
  message,
  Space,
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  PrinterOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

// Mock patient data
const mockPatientData = {
  '1': {
    id: 'PT001',
    firstName: 'John',
    lastName: 'Smith',
    fullName: 'John Smith',
    dateOfBirth: '1979-03-15',
    age: 45,
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
    status: 'Active',
    dateJoined: '2023-06-15',
    lastVisit: '2024-01-15',
    avatar: null,
    notes: 'Patient is compliant with medication and follows diet restrictions.',
  },
  // Add more mock data as needed
};

// Mock appointments data
const mockAppointments = [
  {
    key: '1',
    date: '2024-01-15',
    time: '10:00 AM',
    type: 'Follow-up',
    doctor: 'Dr. Sarah Wilson',
    status: 'Completed',
    notes: 'Blood pressure check, medication adjustment',
  },
  {
    key: '2',
    date: '2024-01-22',
    time: '02:30 PM',
    type: 'Consultation',
    doctor: 'Dr. Sarah Wilson',
    status: 'Scheduled',
    notes: 'Routine check-up',
  },
];

// Mock medical records
const mockMedicalRecords = [
  {
    key: '1',
    date: '2024-01-15',
    type: 'Lab Results',
    description: 'Blood Sugar Test',
    result: 'Normal',
    doctor: 'Dr. Sarah Wilson',
  },
  {
    key: '2',
    date: '2024-01-10',
    type: 'Prescription',
    description: 'Metformin 500mg',
    result: 'Prescribed',
    doctor: 'Dr. Sarah Wilson',
  },
];

const PatientDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id;
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate API call to fetch patient data
    setTimeout(() => {
      const patientData = mockPatientData[patientId];
      if (patientData) {
        setPatient(patientData);
      }
      setLoading(false);
    }, 1000);
  }, [patientId]);

  const handleBack = () => {
    router.push('/tenant-admin/patients');
  };

  const handleEdit = () => {
    router.push(`/tenant-admin/patients/${patientId}/edit`);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete Patient',
      content: 'Are you sure you want to delete this patient? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        message.success('Patient deleted successfully');
        router.push('/tenant-admin/patients');
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading patient details...</div>
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

  const appointmentColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : status === 'Scheduled' ? 'blue' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];

  const medicalRecordsColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
    },
  ];

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Personal Information" className="h-full">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Full Name">{patient.fullName}</Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  {dayjs(patient.dateOfBirth).format('MMMM DD, YYYY')} ({patient.age} years)
                </Descriptions.Item>
                <Descriptions.Item label="Gender">{patient.gender}</Descriptions.Item>
                <Descriptions.Item label="Blood Type">{patient.bloodType}</Descriptions.Item>
                <Descriptions.Item label="Marital Status">{patient.maritalStatus}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Contact Information" className="h-full">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Phone">
                  <Space>
                    <PhoneOutlined />
                    {patient.phone}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Space>
                    <MailOutlined />
                    {patient.email}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Address">{patient.address}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Emergency Contact" className="h-full">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Name">{patient.emergencyContactName}</Descriptions.Item>
                <Descriptions.Item label="Phone">{patient.emergencyContactPhone}</Descriptions.Item>
                <Descriptions.Item label="Relationship">{patient.emergencyContactRelation}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Medical Information" className="h-full">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Assigned Doctor">{patient.assignedDoctor}</Descriptions.Item>
                <Descriptions.Item label="Insurance">{patient.insurance}</Descriptions.Item>
                <Descriptions.Item label="Medical History">{patient.medicalHistory}</Descriptions.Item>
                <Descriptions.Item label="Last Visit">
                  {dayjs(patient.lastVisit).format('MMMM DD, YYYY')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'appointments',
      label: 'Appointments',
      children: (
        <Card>
          <Table
            columns={appointmentColumns}
            dataSource={mockAppointments}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
    {
      key: 'medical-records',
      label: 'Medical Records',
      children: (
        <Card>
          <Table
            columns={medicalRecordsColumns}
            dataSource={mockMedicalRecords}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
    {
      key: 'timeline',
      label: 'Timeline',
      children: (
        <Card>
          <Timeline
            items={[
              {
                color: 'green',
                children: (
                  <div>
                    <div className="font-medium">Follow-up Appointment</div>
                    <div className="text-sm text-gray-500">January 15, 2024 - Blood pressure check completed</div>
                  </div>
                ),
              },
              {
                color: 'blue',
                children: (
                  <div>
                    <div className="font-medium">Lab Results</div>
                    <div className="text-sm text-gray-500">January 10, 2024 - Blood sugar test normal</div>
                  </div>
                ),
              },
              {
                color: 'orange',
                children: (
                  <div>
                    <div className="font-medium">Prescription Updated</div>
                    <div className="text-sm text-gray-500">January 5, 2024 - Metformin dosage adjusted</div>
                  </div>
                ),
              },
              {
                children: (
                  <div>
                    <div className="font-medium">Patient Registered</div>
                    <div className="text-sm text-gray-500">June 15, 2023 - Initial registration</div>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            size="large"
          >
            Back
          </Button>
          <div className="flex items-center gap-4">
            <Avatar
              size={64}
              src={patient.avatar}
              icon={<UserOutlined />}
            />
            <div>
              <h1 className="text-2xl font-bold">{patient.fullName}</h1>
              <div className="flex items-center gap-4 text-gray-500">
                <span>ID: {patient.id}</span>
                <Tag color={patient.status === 'Active' ? 'green' : 'orange'}>
                  {patient.status}
                </Tag>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button 
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">{patient.age}</div>
            <div className="text-gray-500">Years Old</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">{patient.bloodType}</div>
            <div className="text-gray-500">Blood Type</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">{mockAppointments.length}</div>
            <div className="text-gray-500">Appointments</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {dayjs().diff(dayjs(patient.lastVisit), 'day')}
            </div>
            <div className="text-gray-500">Days Since Last Visit</div>
          </Card>
        </Col>
      </Row>

      {/* Detailed Information Tabs */}
      <Card className="shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Card>
    </div>
  );
};

export default PatientDetailsPage;
