"use client";

import { Card, List, Avatar, Tag, Button } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';

// Dummy staff data
const staffData = [
  {
    id: '1',
    name: 'Alice Johnson',
    role: 'Nurse',
    department: 'General',
    shift: 'Morning',
    phone: '+1 234-567-9001',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Mark Thompson',
    role: 'Receptionist',
    department: 'Front Desk',
    shift: 'Full Day',
    phone: '+1 234-567-9002',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Sarah Martinez',
    role: 'Lab Technician',
    department: 'Laboratory',
    shift: 'Evening',
    phone: '+1 234-567-9003',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Robert Kim',
    role: 'Pharmacist',
    department: 'Pharmacy',
    shift: 'Morning',
    phone: '+1 234-567-9004',
    status: 'On Leave',
  },
];

const StaffList = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'On Leave':
        return 'orange';
      case 'Inactive':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Card title="Staff List" className="shadow-sm h-full flex flex-col" bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <List
        dataSource={staffData}
        renderItem={(staff) => (
          <List.Item
            actions={[
              <Button 
                type="text" 
                size="small"
                onClick={() => console.log('View staff:', staff.id)}
              >
                View
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <div className="flex items-center justify-between">
                  <span className="truncate">{staff.name}</span>
                  <Tag color={getStatusColor(staff.status)}>
                    {staff.status}
                  </Tag>
                </div>
              }
              description={
                <div className="space-y-1">
                  <div className="text-sm">
                    <strong>{staff.role}</strong> - {staff.department}
                  </div>
                  <div className="text-sm text-gray-500">
                    Shift: {staff.shift}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <PhoneOutlined /> <span className="truncate">{staff.phone}</span>
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

export default StaffList;
