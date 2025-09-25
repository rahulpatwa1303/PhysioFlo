"use client";
import { Card, Button, Table, Space, Typography, Tag, Select, DatePicker, Row, Col } from 'antd';
import { CalendarOutlined, EyeOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

// Mock doctor schedule data
const mockSchedules = [
  { 
    id: 'DR001', 
    doctor: 'Dr. Sarah Wilson', 
    specialty: 'General Medicine',
    date: '2025-09-23',
    timeSlots: [
      { time: '09:00-09:30', status: 'booked', patient: 'John Smith' },
      { time: '09:30-10:00', status: 'available', patient: null },
      { time: '10:00-10:30', status: 'booked', patient: 'Emily Johnson' },
      { time: '10:30-11:00', status: 'break', patient: null },
      { time: '11:00-11:30', status: 'available', patient: null },
      { time: '11:30-12:00', status: 'booked', patient: 'Robert Davis' }
    ],
    totalSlots: 6,
    bookedSlots: 3,
    availableSlots: 2
  },
  { 
    id: 'DR002', 
    doctor: 'Dr. Michael Chen', 
    specialty: 'Cardiology',
    date: '2025-09-23',
    timeSlots: [
      { time: '14:00-14:30', status: 'booked', patient: 'Lisa Garcia' },
      { time: '14:30-15:00', status: 'booked', patient: 'Mark Johnson' },
      { time: '15:00-15:30', status: 'available', patient: null },
      { time: '15:30-16:00', status: 'available', patient: null },
      { time: '16:00-16:30', status: 'break', patient: null }
    ],
    totalSlots: 5,
    bookedSlots: 2,
    availableSlots: 2
  },
  { 
    id: 'DR003', 
    doctor: 'Dr. Jennifer Lee', 
    specialty: 'Pediatrics',
    date: '2025-09-23',
    timeSlots: [
      { time: '08:00-08:30', status: 'booked', patient: 'Tommy Wilson' },
      { time: '08:30-09:00', status: 'available', patient: null },
      { time: '09:00-09:30', status: 'booked', patient: 'Sarah Martinez' },
      { time: '09:30-10:00', status: 'booked', patient: 'Alex Brown' }
    ],
    totalSlots: 4,
    bookedSlots: 3,
    availableSlots: 1
  }
];

const doctorColumns = [
  { 
    title: 'Doctor', 
    dataIndex: 'doctor', 
    key: 'doctor',
    render: (text, record) => (
      <div>
        <div className="font-medium">{text}</div>
        <div className="text-sm text-gray-500">{record.specialty}</div>
      </div>
    )
  },
  { 
    title: 'Date', 
    dataIndex: 'date', 
    key: 'date' 
  },
  { 
    title: 'Total Slots', 
    dataIndex: 'totalSlots', 
    key: 'totalSlots',
    align: 'center'
  },
  { 
    title: 'Booked', 
    dataIndex: 'bookedSlots', 
    key: 'bookedSlots',
    align: 'center',
    render: (count) => <Tag color="blue">{count}</Tag>
  },
  { 
    title: 'Available', 
    dataIndex: 'availableSlots', 
    key: 'availableSlots',
    align: 'center',
    render: (count) => <Tag color="green">{count}</Tag>
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<EyeOutlined />} size="small">View Schedule</Button>
        <Button icon={<CalendarOutlined />} size="small">Manage Slots</Button>
      </Space>
    )
  }
];

const StaffSchedulePage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'blue';
      case 'available': return 'green';
      case 'break': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'booked': return 'Booked';
      case 'available': return 'Available';
      case 'break': return 'Break';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={3}>Doctor Schedules</Title>
        <Button type="primary" icon={<CalendarOutlined />}>Create Schedule</Button>
      </div>

      {/* Filters */}
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Select
              placeholder="Select Doctor"
              style={{ width: '100%' }}
              value={selectedDoctor}
              onChange={setSelectedDoctor}
              allowClear
            >
              <Option value="DR001">Dr. Sarah Wilson</Option>
              <Option value="DR002">Dr. Michael Chen</Option>
              <Option value="DR003">Dr. Jennifer Lee</Option>
            </Select>
          </Col>
          <Col span={8}>
            <DatePicker
              placeholder="Select Date"
              style={{ width: '100%' }}
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </Col>
          <Col span={8}>
            <Button type="primary" icon={<CalendarOutlined />}>
              View Calendar
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Doctor Schedules Table */}
      <Card title="Today's Doctor Schedules">
        <Table 
          columns={doctorColumns} 
          dataSource={mockSchedules} 
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Detailed Schedule View */}
      {selectedDoctor && (
        <Card title={`Detailed Schedule - ${mockSchedules.find(d => d.id === selectedDoctor)?.doctor}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSchedules
              .find(d => d.id === selectedDoctor)
              ?.timeSlots.map((slot, index) => (
                <Card key={index} size="small" className="border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium flex items-center">
                        <ClockCircleOutlined className="mr-2" />
                        {slot.time}
                      </div>
                      {slot.patient && (
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <UserOutlined className="mr-2" />
                          {slot.patient}
                        </div>
                      )}
                    </div>
                    <Tag color={getStatusColor(slot.status)}>
                      {getStatusText(slot.status)}
                    </Tag>
                  </div>
                </Card>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StaffSchedulePage;
