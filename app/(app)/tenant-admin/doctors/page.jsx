"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Tag,
  Space,
  message,
  Popconfirm,
  Tooltip,
  Avatar
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import SearchableTable from '@/app/components/common/SearchableTable';

const DoctorsPage = () => {
  const router = useRouter();

  const [doctorsData, setDoctorsData] = useState([
    {
      key: '1',
      id: 'DR001',
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@preclinic.com',
      phone: '+1 234-567-8901',
      specialty: 'Cardiology',
      experience: '12 years',
      qualification: 'MD, FACC',
      department: 'Cardiology',
      status: 'Active',
      patients: 45,
      joinDate: '2020-03-15',
      schedule: 'Mon-Fri, 9:00 AM - 5:00 PM',
      consultationFee: '$150',
      address: '123 Medical Center Dr, New York, NY 10001'
    },
    {
      key: '2',
      id: 'DR002',
      name: 'Dr. Michael Brown',
      email: 'michael.brown@preclinic.com',
      phone: '+1 234-567-8902',
      specialty: 'Neurology',
      experience: '8 years',
      qualification: 'MD, MS Neurology',
      department: 'Neurology',
      status: 'Active',
      patients: 38,
      joinDate: '2021-06-20',
      schedule: 'Mon-Fri, 10:00 AM - 6:00 PM',
      consultationFee: '$175',
      address: '456 Brain Center Ave, Los Angeles, CA 90210'
    },
    {
      key: '3',
      id: 'DR003',
      name: 'Dr. Jessica Lee',
      email: 'jessica.lee@preclinic.com',
      phone: '+1 234-567-8903',
      specialty: 'Pediatrics',
      experience: '15 years',
      qualification: 'MD, DCH',
      department: 'Pediatrics',
      status: 'Active',
      patients: 52,
      joinDate: '2018-09-10',
      schedule: 'Mon-Sat, 8:00 AM - 4:00 PM',
      consultationFee: '$120',
      address: '789 Children Hospital Rd, Chicago, IL 60601'
    },
    {
      key: '4',
      id: 'DR004',
      name: 'Dr. David Chen',
      email: 'david.chen@preclinic.com',
      phone: '+1 234-567-8904',
      specialty: 'Orthopedics',
      experience: '10 years',
      qualification: 'MD, MS Ortho',
      department: 'Orthopedics',
      status: 'On Leave',
      patients: 41,
      joinDate: '2019-11-05',
      schedule: 'Mon-Fri, 9:00 AM - 5:00 PM',
      consultationFee: '$160',
      address: '321 Bone Care Center, Miami, FL 33101'
    },
    {
      key: '5',
      id: 'DR005',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@preclinic.com',
      phone: '+1 234-567-8905',
      specialty: 'Dermatology',
      experience: '6 years',
      qualification: 'MD, DVD',
      department: 'Dermatology',
      status: 'Active',
      patients: 29,
      joinDate: '2022-01-12',
      schedule: 'Tue-Sat, 10:00 AM - 6:00 PM',
      consultationFee: '$140',
      address: '654 Skin Care Clinic, Seattle, WA 98101'
    }
  ]);

  const columns = [
    {
      title: 'Doctor',
      key: 'doctor',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserOutlined />} size="large" />
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{record.id}</div>
            <div className="text-sm text-blue-600">{record.specialty}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact Info',
      key: 'contact',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <MailOutlined className="mr-2 text-gray-400" />
            {record.email}
          </div>
          <div className="flex items-center text-sm">
            <PhoneOutlined className="mr-2 text-gray-400" />
            {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      width: 120,
      sorter: (a, b) => {
        const aYears = parseInt(a.experience);
        const bYears = parseInt(b.experience);
        return aYears - bYears;
      },
    },
    {
      title: 'Qualification',
      dataIndex: 'qualification',
      key: 'qualification',
      width: 150,
    },
    {
      title: 'Patients',
      dataIndex: 'patients',
      key: 'patients',
      width: 100,
      sorter: (a, b) => a.patients - b.patients,
      render: (patients) => (
        <span className="font-medium">{patients}</span>
      ),
    },
    {
      title: 'Fee',
      dataIndex: 'consultationFee',
      key: 'consultationFee',
      width: 100,
      sorter: (a, b) => {
        const aFee = parseInt(a.consultationFee.replace('$', ''));
        const bFee = parseInt(b.consultationFee.replace('$', ''));
        return aFee - bFee;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        let color = 'green';
        if (status === 'On Leave') color = 'orange';
        if (status === 'Inactive') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
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
              onClick={() => handleViewDoctor(record.key)}
            />
          </Tooltip>
          <Tooltip title="Edit Doctor">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditDoctor(record.key)}
            />
          </Tooltip>
          <Tooltip title="Delete Doctor">
            <Popconfirm
              title="Delete Doctor"
              description="Are you sure you want to delete this doctor? This action cannot be undone."
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
        { label: 'On Leave', value: 'On Leave' },
        { label: 'Inactive', value: 'Inactive' }
      ]
    },
    {
      key: 'specialty',
      label: 'Specialty',
      options: [
        { label: 'Cardiology', value: 'Cardiology' },
        { label: 'Neurology', value: 'Neurology' },
        { label: 'Pediatrics', value: 'Pediatrics' },
        { label: 'Orthopedics', value: 'Orthopedics' },
        { label: 'Dermatology', value: 'Dermatology' }
      ]
    },
    {
      key: 'department',
      label: 'Department',
      options: [
        { label: 'Cardiology', value: 'Cardiology' },
        { label: 'Neurology', value: 'Neurology' },
        { label: 'Pediatrics', value: 'Pediatrics' },
        { label: 'Orthopedics', value: 'Orthopedics' },
        { label: 'Dermatology', value: 'Dermatology' }
      ]
    }
  ];

  const searchFields = ['name', 'id', 'email', 'phone', 'specialty', 'qualification'];

  // Navigation handlers
  const handleAddDoctor = () => {
    router.push('/tenant-admin/doctors/add');
  };

  const handleViewDoctor = (doctorId) => {
    router.push(`/tenant-admin/doctors/view/${doctorId}`);
  };

  const handleEditDoctor = (doctorId) => {
    router.push(`/tenant-admin/doctors/${doctorId}/edit`);
  };

  const handleDelete = (doctorId) => {
    setDoctorsData(prev => prev.filter(doctor => doctor.key !== doctorId));
    message.success('Doctor deleted successfully');
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
        onClick={handleAddDoctor}
      >
        Add New Doctor
      </Button>
    </Space>
  );

  return (
    <SearchableTable
      title="Doctors Management"
      subtitle="Manage doctor profiles, schedules, and information"
      data={doctorsData}
      columns={columns}
      filters={filters}
      searchFields={searchFields}
      searchPlaceholder="Search doctors by name, ID, specialty, qualification..."
      headerActions={headerActions}
      rowKey="key"
      scroll={{ x: 1400 }}
    />
  );
};

export default DoctorsPage;
