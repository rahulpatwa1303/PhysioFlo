"use client";

import { Card, List, Avatar, Tag, Button } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

// Dummy doctors data
const doctorsData = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    specialty: 'Cardiology',
    patients: 45,
    status: 'Available',
    phone: '+1 234-567-8901',
    email: 'sarah.wilson@preclinic.com',
  },
  {
    id: '2',
    name: 'Dr. Michael Brown',
    specialty: 'Neurology',
    patients: 38,
    status: 'Busy',
    phone: '+1 234-567-8902',
    email: 'michael.brown@preclinic.com',
  },
  {
    id: '3',
    name: 'Dr. Jessica Lee',
    specialty: 'Pediatrics',
    patients: 52,
    status: 'Available',
    phone: '+1 234-567-8903',
    email: 'jessica.lee@preclinic.com',
  },
  {
    id: '4',
    name: 'Dr. David Chen',
    specialty: 'Orthopedics',
    patients: 41,
    status: 'On Leave',
    phone: '+1 234-567-8904',
    email: 'david.chen@preclinic.com',
  },
];

const DoctorsList = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'green';
      case 'Busy':
        return 'orange';
      case 'On Leave':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Card title="Doctors List" className="shadow-sm h-full flex flex-col" bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <List
        dataSource={doctorsData}
        renderItem={(doctor) => (
          <List.Item
            actions={[
              <Button 
                type="text" 
                size="small"
                onClick={() => console.log('View doctor:', doctor.id)}
              >
                View Profile
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <div className="flex items-center justify-between">
                  <span className="truncate">{doctor.name}</span>
                  <Tag color={getStatusColor(doctor.status)}>
                    {doctor.status}
                  </Tag>
                </div>
              }
              description={
                <div className="space-y-1">
                  <div className="truncate">{doctor.specialty}</div>
                  <div className="text-sm text-gray-500">
                    {doctor.patients} patients assigned
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <PhoneOutlined /> <span className="truncate">{doctor.phone}</span>
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
        className="flex-1"
      />
    </Card>
  );
};

export default DoctorsList;
