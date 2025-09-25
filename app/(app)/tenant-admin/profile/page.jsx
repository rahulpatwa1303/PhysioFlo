"use client";

import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Avatar, 
  Button, 
  Descriptions, 
  Tag, 
  Space,
  Statistic,
  Typography,
  Divider,
  Timeline
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

const AdminProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Mock admin data
  const [adminData, setAdminData] = useState({
    name: 'John Admin',
    email: 'admin@preclinic.com',
    phone: '+1 (555) 123-4567',
    position: 'System Administrator',
    joinDate: '2023-01-15',
    lastLogin: '2024-09-18 08:30:00',
    avatar: null,
    address: '123 Admin St, Medical City, MC 12345',
    status: 'Active',
    permissions: ['Full Access', 'User Management', 'System Configuration', 'Reports Access'],
    timezone: 'America/New_York',
    language: 'English'
  });

  // Mock stats
  const [stats, setStats] = useState({
    totalDoctors: 25,
    totalPatients: 1250,
    totalAppointments: 3400,
    systemUptime: 99.8
  });

  // Mock recent activities
  const [recentActivities, setRecentActivities] = useState([
    {
      time: '2024-09-18 09:15',
      action: 'Updated system settings',
      status: 'completed'
    },
    {
      time: '2024-09-18 08:45',
      action: 'Added new doctor - Dr. Michael Johnson',
      status: 'completed'
    },
    {
      time: '2024-09-17 16:30',
      action: 'Generated monthly billing report',
      status: 'completed'
    },
    {
      time: '2024-09-17 14:20',
      action: 'Updated user permissions for Dr. Sarah Wilson',
      status: 'completed'
    }
  ]);

  const handleEditProfile = () => {
    router.push('/tenant-admin/settings');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-500">View and manage your profile information</p>
        </div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={handleEditProfile}
          size="large"
        >
          Edit Profile
        </Button>
      </div>

      {/* Profile Overview */}
      <Row gutter={24}>
        {/* Profile Card */}
        <Col xs={24} lg={8}>
          <Card className="text-center shadow-sm">
            <Avatar
              size={120}
              src={adminData.avatar}
              icon={<UserOutlined />}
              className="mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{adminData.name}</h2>
            <p className="text-gray-600 mb-2">{adminData.position}</p>
            <Tag color={getStatusColor(adminData.status)} className="mb-4">
              {adminData.status}
            </Tag>
            
            <Divider />
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-2">
                <MailOutlined className="text-gray-500" />
                <span className="text-sm">{adminData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneOutlined className="text-gray-500" />
                <span className="text-sm">{adminData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <EnvironmentOutlined className="text-gray-500" />
                <span className="text-sm">{adminData.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarOutlined className="text-gray-500" />
                <span className="text-sm">Joined {adminData.joinDate}</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Details & Stats */}
        <Col xs={24} lg={16}>
          <div className="space-y-6">
            {/* System Stats */}
            <Card title="System Overview" className="shadow-sm">
              <Row gutter={16}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Doctors"
                    value={stats.totalDoctors}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#1677ff' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Patients"
                    value={stats.totalPatients}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Appointments"
                    value={stats.totalAppointments}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="System Uptime"
                    value={stats.systemUptime}
                    suffix="%"
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#13c2c2' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Profile Details */}
            <Card title="Profile Details" className="shadow-sm">
              <Descriptions column={{ xs: 1, sm: 2 }} bordered>
                <Descriptions.Item label="Full Name">
                  {adminData.name}
                </Descriptions.Item>
                <Descriptions.Item label="Position">
                  {adminData.position}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {adminData.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {adminData.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Join Date">
                  {adminData.joinDate}
                </Descriptions.Item>
                <Descriptions.Item label="Last Login">
                  {adminData.lastLogin}
                </Descriptions.Item>
                <Descriptions.Item label="Timezone">
                  {adminData.timezone}
                </Descriptions.Item>
                <Descriptions.Item label="Language">
                  {adminData.language}
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {adminData.address}
                </Descriptions.Item>
                <Descriptions.Item label="Permissions" span={2}>
                  <Space wrap>
                    {adminData.permissions.map((permission, index) => (
                      <Tag key={index} color="blue">{permission}</Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Card title="Recent Activities" className="shadow-sm">
        <Timeline
          items={recentActivities.map((activity, index) => ({
            key: index,
            dot: <ClockCircleOutlined className="text-blue-500" />,
            children: (
              <div>
                <div className="font-medium">{activity.action}</div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            )
          }))}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="shadow-sm">
        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={handleEditProfile}
              size="large"
              block
            >
              Edit Profile
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              type="default"
              icon={<FileTextOutlined />}
              onClick={() => router.push('/tenant-admin/reports')}
              size="large"
              block
            >
              View Reports
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              type="default"
              icon={<TeamOutlined />}
              onClick={() => router.push('/tenant-admin/doctors')}
              size="large"
              block
            >
              Manage Doctors
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              type="default"
              icon={<UserOutlined />}
              onClick={() => router.push('/tenant-admin/patients')}
              size="large"
              block
            >
              View Patients
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AdminProfilePage;
