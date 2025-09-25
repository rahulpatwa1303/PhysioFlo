"use client";

import { Card, List, Avatar, Tag, Button, Space } from 'antd';
import { UserOutlined, ClockCircleOutlined, PhoneOutlined } from '@ant-design/icons';

// Dummy data for today's appointments
const todaysAppointments = [
  {
    id: '1',
    time: '09:00 AM',
    patient: 'John Smith',
    phone: '+1 234-567-8901',
    type: 'Consultation',
    status: 'Confirmed',
    duration: '30 mins',
  },
  {
    id: '2',
    time: '10:30 AM',
    patient: 'Emily Johnson',
    phone: '+1 234-567-8902',
    type: 'Follow-up',
    status: 'Confirmed',
    duration: '15 mins',
  },
  {
    id: '3',
    time: '11:15 AM',
    patient: 'Robert Davis',
    phone: '+1 234-567-8903',
    type: 'Check-up',
    status: 'Pending',
    duration: '45 mins',
  },
  {
    id: '4',
    time: '02:00 PM',
    patient: 'Lisa Garcia',
    phone: '+1 234-567-8904',
    type: 'Consultation',
    status: 'Confirmed',
    duration: '30 mins',
  },
  {
    id: '5',
    time: '03:30 PM',
    patient: 'Michael Brown',
    phone: '+1 234-567-8905',
    type: 'Treatment',
    status: 'Confirmed',
    duration: '60 mins',
  },
];

const TodaysAppointments = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'green';
      case 'Pending':
        return 'orange';
      case 'Cancelled':
        return 'red';
      case 'Completed':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Consultation':
        return 'blue';
      case 'Follow-up':
        return 'green';
      case 'Check-up':
        return 'orange';
      case 'Treatment':
        return 'purple';
      default:
        return 'default';
    }
  };

  return (
    <Card title="Today's Appointments" className="shadow-sm">
      <List
        dataSource={todaysAppointments}
        renderItem={(appointment) => (
          <List.Item
            actions={[
              <Button 
                type="text" 
                size="small"
                onClick={() => console.log('Start consultation:', appointment.id)}
              >
                Start
              </Button>,
              <Button 
                type="text" 
                size="small"
                onClick={() => console.log('View details:', appointment.id)}
              >
                Details
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{appointment.patient}</span>
                  <div className="flex items-center space-x-2">
                    <Tag color={getTypeColor(appointment.type)}>
                      {appointment.type}
                    </Tag>
                    <Tag color={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Tag>
                  </div>
                </div>
              }
              description={
                <div className="space-y-1">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <ClockCircleOutlined className="mr-1" />
                      {appointment.time} ({appointment.duration})
                    </span>
                    <span className="flex items-center">
                      <PhoneOutlined className="mr-1" />
                      {appointment.phone}
                    </span>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
        pagination={{
          pageSize: 4,
          size: 'small',
          showSizeChanger: false,
        }}
      />
    </Card>
  );
};

export default TodaysAppointments;
