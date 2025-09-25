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
  Divider,
  Form,
  Input,
  Select,
  DatePicker
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
  PlusOutlined,
  MessageOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

// Mock patient data (same structure as admin but doctor-focused)
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
    phone: '+1 234-567-8901',
    email: 'john.smith@email.com',
    address: '123 Main St, New York, NY 10001',
    emergencyContactName: 'Jane Smith',
    emergencyContactPhone: '+1 234-567-8999',
    emergencyContactRelation: 'Spouse',
    insurance: 'Blue Cross Blue Shield',
    medicalHistory: 'Hypertension, Type 2 Diabetes',
    status: 'Active',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-01-22',
    avatar: null,
  },
};

// Mock notes data
const mockPatientNotes = [
  {
    key: '1',
    date: '2024-01-15',
    type: 'Progress Note',
    content: 'Patient reports feeling well. Blood pressure stable at 130/80. Continue current medication regimen.',
    doctor: 'Dr. Sarah Wilson',
  },
  {
    key: '2',
    date: '2024-01-10',
    type: 'Prescription',
    content: 'Prescribed Metformin 500mg twice daily. Patient educated on proper timing and side effects.',
    doctor: 'Dr. Sarah Wilson',
  },
];

// Mock appointments (same as admin view)
const mockAppointments = [
  {
    key: '1',
    date: '2024-01-15',
    time: '10:00 AM',
    type: 'Follow-up',
    status: 'Completed',
    notes: 'Blood pressure check, medication adjustment',
  },
  {
    key: '2',
    date: '2024-01-22',
    time: '02:30 PM',
    type: 'Consultation',
    status: 'Scheduled',
    notes: 'Routine check-up',
  },
];

const DoctorPatientDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id;
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [noteModal, setNoteModal] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [form] = Form.useForm();

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
    router.push('/doctor/patients');
  };

  const handleCall = () => {
    message.info(`Calling ${patient.phone}...`);
  };

  const handleMessage = () => {
    router.push(`/doctor/messages?patientId=${patientId}`);
  };

  const handleAddNote = () => {
    setNoteModal(true);
  };

  const handleScheduleAppointment = () => {
    setAppointmentModal(true);
  };

  const handleNoteSubmit = (values) => {
    console.log('New note:', values);
    message.success('Note added successfully');
    setNoteModal(false);
    form.resetFields();
  };

  const handleAppointmentSubmit = (values) => {
    console.log('New appointment:', values);
    message.success('Appointment scheduled successfully');
    setAppointmentModal(false);
    form.resetFields();
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

  const notesColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => (
        <Tag color={type === 'Progress Note' ? 'blue' : type === 'Prescription' ? 'green' : 'orange'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
      width: 150,
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
              </Descriptions>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Medical Information" className="h-full">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Medical History">{patient.medicalHistory}</Descriptions.Item>
                <Descriptions.Item label="Insurance">{patient.insurance}</Descriptions.Item>
                <Descriptions.Item label="Last Visit">
                  {dayjs(patient.lastVisit).format('MMMM DD, YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Next Appointment">
                  {patient.nextAppointment ? dayjs(patient.nextAppointment).format('MMMM DD, YYYY') : 'Not scheduled'}
                </Descriptions.Item>
                <Descriptions.Item label="Emergency Contact">
                  {patient.emergencyContactName} ({patient.emergencyContactRelation})
                  <br />
                  <small>{patient.emergencyContactPhone}</small>
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
        <Card 
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleScheduleAppointment}>
              Schedule Appointment
            </Button>
          }
        >
          <Table
            columns={appointmentColumns}
            dataSource={mockAppointments}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
    {
      key: 'notes',
      label: 'Patient Notes',
      children: (
        <Card 
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNote}>
              Add Note
            </Button>
          }
        >
          <Table
            columns={notesColumns}
            dataSource={mockPatientNotes}
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
                    <div className="font-medium">Progress Note Added</div>
                    <div className="text-sm text-gray-500">January 15, 2024 - Patient reports feeling well</div>
                  </div>
                ),
              },
              {
                color: 'orange',
                children: (
                  <div>
                    <div className="font-medium">Prescription Updated</div>
                    <div className="text-sm text-gray-500">January 10, 2024 - Metformin prescribed</div>
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
            icon={<PhoneOutlined />}
            onClick={handleCall}
          >
            Call
          </Button>
          <Button 
            icon={<MessageOutlined />}
            onClick={handleMessage}
          >
            Message
          </Button>
          <Button 
            icon={<CalendarOutlined />}
            onClick={handleScheduleAppointment}
          >
            Schedule
          </Button>
          <Button 
            type="primary"
            icon={<EditOutlined />}
            onClick={handleAddNote}
          >
            Add Note
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

      {/* Add Note Modal */}
      <Modal
        title="Add Patient Note"
        open={noteModal}
        onCancel={() => setNoteModal(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleNoteSubmit}
        >
          <Form.Item
            name="type"
            label="Note Type"
            rules={[{ required: true, message: 'Please select note type' }]}
          >
            <Select placeholder="Select note type">
              <Option value="Progress Note">Progress Note</Option>
              <Option value="Prescription">Prescription</Option>
              <Option value="Consultation">Consultation</Option>
              <Option value="Lab Results">Lab Results</Option>
              <Option value="Follow-up">Follow-up</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="content"
            label="Note Content"
            rules={[{ required: true, message: 'Please enter note content' }]}
          >
            <TextArea rows={6} placeholder="Enter detailed note content..." />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setNoteModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Add Note</Button>
          </div>
        </Form>
      </Modal>

      {/* Schedule Appointment Modal */}
      <Modal
        title="Schedule Appointment"
        open={appointmentModal}
        onCancel={() => setAppointmentModal(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAppointmentSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().endOf('day')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="time"
                label="Time"
                rules={[{ required: true, message: 'Please select time' }]}
              >
                <Select placeholder="Select time">
                  <Option value="09:00 AM">09:00 AM</Option>
                  <Option value="10:00 AM">10:00 AM</Option>
                  <Option value="11:00 AM">11:00 AM</Option>
                  <Option value="02:00 PM">02:00 PM</Option>
                  <Option value="03:00 PM">03:00 PM</Option>
                  <Option value="04:00 PM">04:00 PM</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="type"
            label="Appointment Type"
            rules={[{ required: true, message: 'Please select appointment type' }]}
          >
            <Select placeholder="Select appointment type">
              <Option value="Consultation">Consultation</Option>
              <Option value="Follow-up">Follow-up</Option>
              <Option value="Check-up">Check-up</Option>
              <Option value="Treatment">Treatment</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={3} placeholder="Additional notes..." />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setAppointmentModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Schedule Appointment</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorPatientDetailsPage;
