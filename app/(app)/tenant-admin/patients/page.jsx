"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Tag,
  Space,
  message,
  Popconfirm,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined
} from '@ant-design/icons';
import SearchableTable from '@/app/components/common/SearchableTable';

const PatientsPage = () => {
  const router = useRouter();

  const [patientsData] = useState([
    {
      key: '1',
      id: 'PT001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      phone: '+1 234-567-8901',
      email: 'john.smith@email.com',
      address: '123 Main St, New York, NY 10001',
      lastVisit: '2024-01-15',
      doctor: 'Dr. Sarah Wilson',
      status: 'Active',
      medicalHistory: 'Hypertension, Diabetes',
      dateJoined: '2023-06-15',
    },
    {
      key: '2',
      id: 'PT002',
      name: 'Emily Johnson',
      age: 32,
      gender: 'Female',
      phone: '+1 234-567-8902',
      email: 'emily.johnson@email.com',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      lastVisit: '2024-01-10',
      doctor: 'Dr. Michael Brown',
      status: 'Active',
      medicalHistory: 'Asthma',
      dateJoined: '2023-08-22',
    },
    {
      key: '3',
      id: 'PT003',
      name: 'Robert Davis',
      age: 58,
      gender: 'Male',
      phone: '+1 234-567-8903',
      email: 'robert.davis@email.com',
      address: '789 Pine St, Chicago, IL 60601',
      lastVisit: '2023-12-20',
      doctor: 'Dr. Sarah Wilson',
      status: 'Inactive',
      medicalHistory: 'Arthritis, High Cholesterol',
      dateJoined: '2022-11-10',
    },
    {
      key: '4',
      id: 'PT004',
      name: 'Lisa Garcia',
      age: 41,
      gender: 'Female',
      phone: '+1 234-567-8904',
      email: 'lisa.garcia@email.com',
      address: '321 Elm Dr, Miami, FL 33101',
      lastVisit: '2024-01-12',
      doctor: 'Dr. Jessica Lee',
      status: 'Active',
      medicalHistory: 'Migraine',
      dateJoined: '2023-03-05',
    },
    {
      key: '5',
      id: 'PT005',
      name: 'Michael Chen',
      age: 29,
      gender: 'Male',
      phone: '+1 234-567-8905',
      email: 'michael.chen@email.com',
      address: '654 Maple Rd, Seattle, WA 98101',
      lastVisit: '2024-01-08',
      doctor: 'Dr. David Chen',
      status: 'Active',
      medicalHistory: 'None',
      dateJoined: '2023-09-18',
    },
  ]);

  const columns = [
    {
      title: 'Patient ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <div className="font-medium text-gray-900">{text}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Age/Gender',
      key: 'ageGender',
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.age} years</div>
          <div className="text-sm text-gray-500">{record.gender}</div>
        </div>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      width: 120,
      sorter: (a, b) => new Date(a.lastVisit) - new Date(b.lastVisit),
    },
    {
      title: 'Assigned Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewPatient(record.key)}
            />
          </Tooltip>
          <Tooltip title="Edit Patient">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditPatient(record.key)}
            />
          </Tooltip>
          <Tooltip title="Delete Patient">
            <Popconfirm
              title="Delete Patient"
              description="Are you sure you want to delete this patient?"
              onConfirm={() => handleDelete(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
      ]
    },
    {
      key: 'gender',
      label: 'Gender',
      options: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
      ]
    },
    {
      key: 'doctor',
      label: 'Assigned Doctor',
      options: [
        { label: 'Dr. Sarah Wilson', value: 'Dr. Sarah Wilson' },
        { label: 'Dr. Michael Brown', value: 'Dr. Michael Brown' },
        { label: 'Dr. Jessica Lee', value: 'Dr. Jessica Lee' },
        { label: 'Dr. David Chen', value: 'Dr. David Chen' }
      ]
    }
  ];

  const searchFields = ['name', 'id', 'email', 'phone'];

  // Navigation handlers
  const handleAddPatient = () => {
    router.push('/tenant-admin/patients/add');
  };

  const handleViewPatient = (patientId) => {
    router.push(`/tenant-admin/patients/${patientId}`);
  };

  const handleEditPatient = (patientId) => {
    router.push(`/tenant-admin/patients/${patientId}/edit`);
  };

  const handleDelete = (patientId) => {
    message.success('Patient deleted successfully');
  };

  const handleExport = () => {
    message.info('Export functionality would be implemented here');
  };

  const headerActions = (
    <Space>
      <Button
        icon={<ExportOutlined />}
        onClick={handleExport}
      >
        Export
      </Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddPatient}
      >
        Add New Patient
      </Button>
    </Space>
  );

  return (
    <SearchableTable
      title="Patients Management"
      subtitle="Manage all patient records and information"
      data={patientsData}
      columns={columns}
      filters={filters}
      searchFields={searchFields}
      searchPlaceholder="Search patients by name, ID, phone, or email..."
      headerActions={headerActions}
      rowKey="key"
      scroll={{ x: 1200 }}
    />
  );
};

export default PatientsPage;