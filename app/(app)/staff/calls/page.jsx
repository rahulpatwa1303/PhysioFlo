"use client";
import { Card, Button, Table, Space, Typography, Tag, Select, Input, Modal, Form, TimePicker, Row, Col } from 'antd';
import { PhoneOutlined, PlusOutlined, CheckOutlined, CloseOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

// Mock patient calls data
const mockCalls = [
  { 
    id: 'C001', 
    patient: 'John Smith', 
    phone: '+1 234-567-8901',
    callType: 'Follow-up',
    priority: 'High',
    reason: 'Post-surgery checkup call',
    scheduledTime: '2025-09-23 10:00',
    status: 'pending',
    assignedTo: 'Alice Johnson',
    notes: 'Patient had surgery last week, needs follow-up',
    lastAttempt: null,
    attempts: 0
  },
  { 
    id: 'C002', 
    patient: 'Emily Davis', 
    phone: '+1 234-567-8902',
    callType: 'Prescription',
    priority: 'Medium',
    reason: 'Prescription refill confirmation',
    scheduledTime: '2025-09-23 14:30',
    status: 'completed',
    assignedTo: 'Mark Thompson',
    notes: 'Prescription ready for pickup',
    lastAttempt: '2025-09-23 14:35',
    attempts: 1
  },
  { 
    id: 'C003', 
    patient: 'Robert Wilson', 
    phone: '+1 234-567-8903',
    callType: 'Test Results',
    priority: 'High',
    reason: 'Blood test results available',
    scheduledTime: '2025-09-23 09:15',
    status: 'no-answer',
    assignedTo: 'Sarah Martinez',
    notes: 'Lab results show abnormal values, urgent discussion needed',
    lastAttempt: '2025-09-23 09:20',
    attempts: 2
  },
  { 
    id: 'C004', 
    patient: 'Lisa Garcia', 
    phone: '+1 234-567-8904',
    callType: 'Appointment',
    priority: 'Low',
    reason: 'Appointment reminder',
    scheduledTime: '2025-09-23 16:00',
    status: 'pending',
    assignedTo: 'Alice Johnson',
    notes: 'Remind about tomorrow appointment',
    lastAttempt: null,
    attempts: 0
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
    title: 'Call Type', 
    dataIndex: 'callType', 
    key: 'callType',
    render: (type) => {
      const colors = {
        'Follow-up': 'blue',
        'Prescription': 'green',
        'Test Results': 'orange',
        'Appointment': 'purple'
      };
      return <Tag color={colors[type]}>{type}</Tag>;
    }
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
    title: 'Scheduled Time', 
    dataIndex: 'scheduledTime', 
    key: 'scheduledTime',
    render: (time) => new Date(time).toLocaleString()
  },
  { 
    title: 'Status', 
    dataIndex: 'status', 
    key: 'status',
    render: (status) => {
      const colors = {
        'pending': 'blue',
        'completed': 'green',
        'no-answer': 'red',
        'rescheduled': 'orange'
      };
      const labels = {
        'pending': 'Pending',
        'completed': 'Completed',
        'no-answer': 'No Answer',
        'rescheduled': 'Rescheduled'
      };
      return <Tag color={colors[status]}>{labels[status]}</Tag>;
    }
  },
  { 
    title: 'Attempts', 
    dataIndex: 'attempts', 
    key: 'attempts',
    align: 'center'
  },
  { 
    title: 'Assigned To', 
    dataIndex: 'assignedTo', 
    key: 'assignedTo' 
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<PhoneOutlined />} size="small" type="primary">
          Call Now
        </Button>
        <Button icon={<CheckOutlined />} size="small">
          Mark Complete
        </Button>
        <Button icon={<MessageOutlined />} size="small">
          Add Note
        </Button>
      </Space>
    )
  }
];

const StaffCallsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [form] = Form.useForm();

  const handleAddCall = () => {
    setIsModalVisible(true);
    setSelectedCall(null);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('Adding call:', values);
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedCall(null);
  };

  const filteredData = mockCalls.filter(item => {
    const matchesSearch = item.patient.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.phone.includes(searchText) ||
                         item.reason.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={3}>Patient Calls</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCall}>
          Schedule Call
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-500">Pending Calls</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">28</div>
            <div className="text-sm text-gray-500">Completed Today</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">5</div>
            <div className="text-sm text-gray-500">No Answer</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-500">High Priority</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Search
              placeholder="Search patients, phone, or reason"
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
              <Option value="pending">Pending</Option>
              <Option value="completed">Completed</Option>
              <Option value="no-answer">No Answer</Option>
              <Option value="rescheduled">Rescheduled</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Priority"
              style={{ width: '100%' }}
              value={priorityFilter}
              onChange={setPriorityFilter}
              allowClear
            >
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" icon={<PhoneOutlined />}>
              Call All Pending
            </Button>
          </Col>
          <Col span={4}>
            <Button icon={<CheckOutlined />}>
              Mark All Complete
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Calls Table */}
      <Card title={`Patient Calls (${filteredData.length} calls)`}>
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
                    <Text strong>Reason: </Text>
                    <Text>{record.reason}</Text>
                  </div>
                  <div>
                    <Text strong>Last Attempt: </Text>
                    <Text>{record.lastAttempt ? new Date(record.lastAttempt).toLocaleString() : 'None'}</Text>
                  </div>
                </div>
                <div className="mt-2">
                  <Text strong>Notes: </Text>
                  <Text>{record.notes}</Text>
                </div>
              </div>
            ),
          }}
        />
      </Card>

      {/* Schedule Call Modal */}
      <Modal
        title="Schedule Patient Call"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="patient"
                label="Patient Name"
                rules={[{ required: true, message: 'Please enter patient name' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Enter patient name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="callType"
                label="Call Type"
                rules={[{ required: true, message: 'Please select call type' }]}
              >
                <Select placeholder="Select type">
                  <Option value="Follow-up">Follow-up</Option>
                  <Option value="Prescription">Prescription</Option>
                  <Option value="Test Results">Test Results</Option>
                  <Option value="Appointment">Appointment Reminder</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
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
            </Col>
            <Col span={8}>
              <Form.Item
                name="assignedTo"
                label="Assign To"
                rules={[{ required: true, message: 'Please assign to staff' }]}
              >
                <Select placeholder="Select staff">
                  <Option value="Alice Johnson">Alice Johnson</Option>
                  <Option value="Mark Thompson">Mark Thompson</Option>
                  <Option value="Sarah Martinez">Sarah Martinez</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="reason"
            label="Reason for Call"
            rules={[{ required: true, message: 'Please enter reason for call' }]}
          >
            <Input placeholder="Enter reason for the call" />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Additional Notes"
          >
            <TextArea rows={3} placeholder="Enter any additional notes or instructions" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffCallsPage;
