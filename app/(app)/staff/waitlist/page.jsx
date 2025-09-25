"use client";
import { Card, Button, Table, Space, Typography, Tag, Select, Input, Modal, Form, DatePicker, TimePicker } from 'antd';
import { ClockCircleOutlined, PlusOutlined, CalendarOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

// Mock waitlist data
const mockWaitlist = [
  { 
    id: 'W001', 
    patient: 'Alice Cooper', 
    phone: '+1 234-567-8901',
    preferredDoctor: 'Dr. Sarah Wilson',
    appointmentType: 'Consultation',
    priority: 'High',
    preferredDate: '2025-09-25',
    preferredTime: 'Morning',
    waitingSince: '2025-09-20 10:30',
    reason: 'Urgent follow-up required',
    status: 'waiting'
  },
  { 
    id: 'W002', 
    patient: 'James Rodriguez', 
    phone: '+1 234-567-8902',
    preferredDoctor: 'Dr. Michael Chen',
    appointmentType: 'Check-up',
    priority: 'Medium',
    preferredDate: '2025-09-24',
    preferredTime: 'Afternoon',
    waitingSince: '2025-09-21 14:15',
    reason: 'Regular health checkup',
    status: 'waiting'
  },
  { 
    id: 'W003', 
    patient: 'Maria Santos', 
    phone: '+1 234-567-8903',
    preferredDoctor: 'Dr. Jennifer Lee',
    appointmentType: 'Treatment',
    priority: 'Low',
    preferredDate: '2025-09-26',
    preferredTime: 'Evening',
    waitingSince: '2025-09-22 09:00',
    reason: 'Physical therapy session',
    status: 'contacted'
  }
];

const columns = [
  { 
    title: 'Patient', 
    dataIndex: 'patient', 
    key: 'patient',
    render: (text, record) => (
      <div>
        <div className="font-medium">{text}</div>
        <div className="text-sm text-gray-500">{record.phone}</div>
      </div>
    )
  },
  { 
    title: 'Doctor Preference', 
    dataIndex: 'preferredDoctor', 
    key: 'preferredDoctor' 
  },
  { 
    title: 'Type', 
    dataIndex: 'appointmentType', 
    key: 'appointmentType' 
  },
  { 
    title: 'Priority', 
    dataIndex: 'priority', 
    key: 'priority',
    render: (priority) => {
      const color = priority === 'High' ? 'red' : priority === 'Medium' ? 'orange' : 'green';
      return <Tag color={color}>{priority}</Tag>;
    }
  },
  { 
    title: 'Preferred Date', 
    dataIndex: 'preferredDate', 
    key: 'preferredDate' 
  },
  { 
    title: 'Waiting Since', 
    dataIndex: 'waitingSince', 
    key: 'waitingSince',
    render: (date) => new Date(date).toLocaleDateString()
  },
  { 
    title: 'Status', 
    dataIndex: 'status', 
    key: 'status',
    render: (status) => {
      const color = status === 'waiting' ? 'blue' : 'green';
      return <Tag color={color}>{status === 'waiting' ? 'Waiting' : 'Contacted'}</Tag>;
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<CalendarOutlined />} size="small" type="primary">
          Schedule
        </Button>
        <Button icon={<PhoneOutlined />} size="small">
          Call
        </Button>
        <Button size="small">
          Remove
        </Button>
      </Space>
    )
  }
];

const StaffWaitlistPage = () => {
  const [searchText, setSearchText] = useState('');
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddToWaitlist = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('Adding to waitlist:', values);
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const filteredData = mockWaitlist.filter(item => {
    const matchesSearch = item.patient.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.phone.includes(searchText) ||
                         item.preferredDoctor.toLowerCase().includes(searchText.toLowerCase());
    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={3}>Patient Waitlist</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddToWaitlist}>
          Add to Waitlist
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">28</div>
            <div className="text-sm text-gray-500">Total Waiting</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">8</div>
            <div className="text-sm text-gray-500">High Priority</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-sm text-gray-500">Medium Priority</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-500">Low Priority</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <Search
            placeholder="Search patients, phone, or doctor"
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="Filter by Priority"
            style={{ width: 150 }}
            value={priorityFilter}
            onChange={setPriorityFilter}
            allowClear
          >
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
          <Button icon={<CalendarOutlined />}>
            Schedule All Available
          </Button>
        </div>
      </Card>

      {/* Waitlist Table */}
      <Card title={`Waitlist (${filteredData.length} patients)`}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Add to Waitlist Modal */}
      <Modal
        title="Add Patient to Waitlist"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="patient"
              label="Patient Name"
              rules={[{ required: true, message: 'Please enter patient name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter patient name" />
            </Form.Item>
            
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
            </Form.Item>
            
            <Form.Item
              name="preferredDoctor"
              label="Preferred Doctor"
              rules={[{ required: true, message: 'Please select preferred doctor' }]}
            >
              <Select placeholder="Select doctor">
                <Option value="Dr. Sarah Wilson">Dr. Sarah Wilson</Option>
                <Option value="Dr. Michael Chen">Dr. Michael Chen</Option>
                <Option value="Dr. Jennifer Lee">Dr. Jennifer Lee</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="appointmentType"
              label="Appointment Type"
              rules={[{ required: true, message: 'Please select appointment type' }]}
            >
              <Select placeholder="Select type">
                <Option value="Consultation">Consultation</Option>
                <Option value="Check-up">Check-up</Option>
                <Option value="Treatment">Treatment</Option>
                <Option value="Follow-up">Follow-up</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true, message: 'Please select priority' }]}
            >
              <Select placeholder="Select priority">
                <Option value="High">High</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Low">Low</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="preferredTime"
              label="Preferred Time"
            >
              <Select placeholder="Select preferred time">
                <Option value="Morning">Morning (8AM - 12PM)</Option>
                <Option value="Afternoon">Afternoon (12PM - 5PM)</Option>
                <Option value="Evening">Evening (5PM - 8PM)</Option>
              </Select>
            </Form.Item>
          </div>
          
          <Form.Item
            name="reason"
            label="Reason for Visit"
            rules={[{ required: true, message: 'Please enter reason for visit' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter reason for the appointment" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffWaitlistPage;
