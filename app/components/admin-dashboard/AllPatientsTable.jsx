"use client";

import { Table, Card, Button, Tag, Space } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';

// Dummy data for all patients
const patientsData = [
  {
    key: '1',
    name: 'John Smith',
    age: 45,
    phone: '+1 234-567-8901',
    lastVisit: '2024-01-15',
    doctor: 'Dr. Sarah Wilson',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Emily Johnson',
    age: 32,
    phone: '+1 234-567-8902',
    lastVisit: '2024-01-10',
    doctor: 'Dr. Michael Brown',
    status: 'Active',
  },
  {
    key: '3',
    name: 'Robert Davis',
    age: 58,
    phone: '+1 234-567-8903',
    lastVisit: '2023-12-20',
    doctor: 'Dr. Sarah Wilson',
    status: 'Inactive',
  },
];

const AllPatientsTable = () => {
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      sorter: (a, b) => new Date(a.lastVisit) - new Date(b.lastVisit),
    },
    {
      title: 'Assigned Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
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
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="All Patients" className="shadow-sm h-full flex flex-col" bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Table
        columns={columns}
        dataSource={patientsData}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          size: 'small',
        }}
        size="small"
        scroll={{ x: 600 }}
        className="flex-1"
      />
    </Card>
  );
};

export default AllPatientsTable;
