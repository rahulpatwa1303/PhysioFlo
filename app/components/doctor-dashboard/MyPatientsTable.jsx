"use client";

import { Table, Card, Button, Tag, Space } from 'antd';
import { EyeOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons';

// Dummy data for doctor's patients
const myPatientsData = [
  {
    key: '1',
    name: 'John Smith',
    age: 45,
    phone: '+1 234-567-8901',
    lastVisit: '2024-01-15',
    condition: 'Hypertension',
    status: 'Active',
    nextAppointment: '2024-01-22',
  },
  {
    key: '2',
    name: 'Emily Johnson',
    age: 32,
    phone: '+1 234-567-8902',
    lastVisit: '2024-01-10',
    condition: 'Diabetes',
    status: 'Active',
    nextAppointment: '2024-01-18',
  },
  {
    key: '3',
    name: 'Robert Davis',
    age: 58,
    phone: '+1 234-567-8903',
    lastVisit: '2023-12-20',
    condition: 'Arthritis',
    status: 'Follow-up Required',
    nextAppointment: null,
  },
  {
    key: '4',
    name: 'Lisa Garcia',
    age: 41,
    phone: '+1 234-567-8904',
    lastVisit: '2024-01-12',
    condition: 'Migraine',
    status: 'Active',
    nextAppointment: '2024-01-25',
  },
];

const MyPatientsTable = () => {
  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      width: 80,
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      sorter: (a, b) => new Date(a.lastVisit) - new Date(b.lastVisit),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'Follow-up Required') color = 'orange';
        if (status === 'Critical') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Next Appointment',
      dataIndex: 'nextAppointment',
      key: 'nextAppointment',
      render: (date) => date || 'Not scheduled',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => console.log('View patient:', record.key)}
          >
            View
          </Button>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => console.log('Edit patient:', record.key)}
          >
            Notes
          </Button>
          <Button 
            type="text" 
            icon={<MessageOutlined />} 
            size="small"
            onClick={() => console.log('Message patient:', record.key)}
          >
            Message
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="My Patients" className="shadow-sm h-full flex flex-col" bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Table
        columns={columns}
        dataSource={myPatientsData}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          size: 'small',
        }}
        size="small"
        scroll={{ x: 800 }}
        className="flex-1"
      />
    </Card>
  );
};

export default MyPatientsTable;
