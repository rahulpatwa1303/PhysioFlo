"use client";
import { Card, Button, Table, Space, Typography, Tag, Select, Input, Row, Col, Modal, Form, DatePicker, TimePicker } from 'antd';
import { CalendarOutlined, PlusOutlined, EditOutlined, EyeOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

// Enhanced mock appointment data
const mockAppointments = [
  { 
    id: 'A001', 
    patient: 'John Smith', 
    patientId: 'PT001',
    phone: '+1 234-567-8901',
    doctor: 'Dr. Sarah Wilson',
    date: '2025-09-23', 
    time: '09:00', 
    duration: 30,
    type: 'Consultation', 
    status: 'Confirmed',
    reason: 'Regular checkup',
    notes: 'First-time patient'
  },
  { 
    id: 'A002', 
    patient: 'Emily Johnson', 
    patientId: 'PT002',
    phone: '+1 234-567-8902',
    doctor: 'Dr. Michael Chen',
    date: '2025-09-23', 
    time: '10:30', 
    duration: 45,
    type: 'Follow-up', 
    status: 'Pending',
    reason: 'Cardiac follow-up',
    notes: 'Bring previous test results'
  },
  { 
    id: 'A003', 
    patient: 'Robert Davis', 
    patientId: 'PT003',
    phone: '+1 234-567-8903',
    doctor: 'Dr. Jennifer Lee',
    date: '2025-09-22', 
    time: '14:00', 
    duration: 30,
    type: 'Check-up', 
    status: 'Completed',
    reason: 'Diabetes management',
    notes: 'Medication adjustment needed'
  },
  { 
    id: 'A004', 
    patient: 'Lisa Garcia', 
    patientId: 'PT004',
    phone: '+1 234-567-8904',
    doctor: 'Dr. Sarah Wilson',
    date: '2025-09-24', 
    time: '11:00', 
    duration: 60,
    type: 'Treatment', 
    status: 'Confirmed',
    reason: 'Physical therapy session',
    notes: 'Requires special equipment'
  }
];

const columns = [
  { 
    title: 'Appointment ID', 
    dataIndex: 'id', 
    key: 'id',
    width: 120
  },
  { 
    title: 'Patient', 
    dataIndex: 'patient', 
    key: 'patient',
    render: (text, record) => (
      <div>
        <div className="font-medium">{text}</div>
        <div className="text-sm text-gray-500">{record.patientId}</div>
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
    title: 'Date & Time', 
    key: 'datetime',
    render: (_, record) => (
      <div>
        <div>{record.date}</div>
        <div className="text-sm text-gray-500">{record.time} ({record.duration}min)</div>
      </div>
    )
  },
  { 
    title: 'Type', 
    dataIndex: 'type', 
    key: 'type',
    render: (type) => {
      const colors = {
        'Consultation': 'blue',
        'Follow-up': 'green',
        'Check-up': 'orange',
        'Treatment': 'purple'
      };
      return <Tag color={colors[type]}>{type}</Tag>;
    }
  },
  { 
    title: 'Status', 
    dataIndex: 'status', 
    key: 'status',
    render: (status) => {
      const colors = {
        'Confirmed': 'green',
        'Pending': 'orange',
        'Completed': 'blue',
        'Cancelled': 'red',
        'No Show': 'gray'
      };
      return <Tag color={colors[status]}>{status}</Tag>;
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<EyeOutlined />} size="small" type="primary">View</Button>
        <Button icon={<EditOutlined />} size="small">Edit</Button>
        <Button icon={<PhoneOutlined />} size="small">Call</Button>
      </Space>
    )
  }
];

const StaffAppointmentsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [doctorFilter, setDoctorFilter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddAppointment = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('Adding appointment:', values);
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const filteredData = mockAppointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchText.toLowerCase()) ||
                         appointment.patientId.toLowerCase().includes(searchText.toLowerCase()) ||
                         appointment.phone.includes(searchText) ||
                         appointment.doctor.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || appointment.status === statusFilter;
    const matchesDoctor = !doctorFilter || appointment.doctor === doctorFilter;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={3}>Appointment Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAppointment}>
          Schedule Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">47</div>
            <div className="text-sm text-gray-500">Today's Appointments</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">38</div>
            <div className="text-sm text-gray-500">Confirmed</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">6</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-sm text-gray-500">No Shows</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Search
              placeholder="Search patients, doctors, or appointment ID"
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
              <Option value="Confirmed">Confirmed</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
              <Option value="No Show">No Show</Option>
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
            <Button type="primary" icon={<CalendarOutlined />}>
              Calendar View
            </Button>
          </Col>
          <Col span={4}>
            <Button>
              Export List
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Appointments Table */}
      <Card title={`Appointments (${filteredData.length})`}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Reason for Visit:</strong> {record.reason}
                  </div>
                  <div>
                    <strong>Duration:</strong> {record.duration} minutes
                  </div>
                </div>
                <div className="mt-2">
                  <strong>Notes:</strong> {record.notes}
                </div>
              </div>
            ),
          }}
        />
      </Card>

      {/* Add Appointment Modal */}
      <Modal
        title="Schedule New Appointment"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="patient"
                label="Patient"
                rules={[{ required: true, message: 'Please select patient' }]}
              >
                <Select placeholder="Select patient">
                  <Option value="PT001">John Smith (PT001)</Option>
                  <Option value="PT002">Emily Johnson (PT002)</Option>
                  <Option value="PT003">Robert Davis (PT003)</Option>
                  <Option value="PT004">Lisa Garcia (PT004)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="doctor"
                label="Doctor"
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
            <Col span={8}>
              <Form.Item
                name="date"
                label="Appointment Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="time"
                label="Appointment Time"
                rules={[{ required: true, message: 'Please select time' }]}
              >
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="Duration (minutes)"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <Select placeholder="Select duration">
                  <Option value={30}>30 minutes</Option>
                  <Option value={45}>45 minutes</Option>
                  <Option value={60}>60 minutes</Option>
                  <Option value={90}>90 minutes</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Appointment Type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select placeholder="Select type">
                  <Option value="Consultation">Consultation</Option>
                  <Option value="Follow-up">Follow-up</Option>
                  <Option value="Check-up">Check-up</Option>
                  <Option value="Treatment">Treatment</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="Confirmed">Confirmed</Option>
                  <Option value="Pending">Pending</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="reason"
            label="Reason for Visit"
            rules={[{ required: true, message: 'Please enter reason' }]}
          >
            <Input placeholder="Enter reason for the appointment" />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Additional Notes"
          >
            <Input.TextArea rows={3} placeholder="Enter any additional notes or special instructions" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffAppointmentsPage;
