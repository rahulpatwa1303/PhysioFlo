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
  Timeline,
  Progress
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  StarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

const DoctorProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Mock doctor data
  const [doctorData, setDoctorData] = useState({
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@preclinic.com',
    phone: '+1 (555) 987-6543',
    specialty: 'Internal Medicine',
    licenseNumber: 'MD123456',
    joinDate: '2022-03-15',
    lastLogin: '2024-09-18 07:45:00',
    avatar: null,
    address: '456 Medical Plaza, Healthcare City, HC 67890',
    status: 'Active',
    experience: '12 years',
    education: 'MD from Harvard Medical School',
    certifications: ['Board Certified Internal Medicine', 'Advanced Cardiac Life Support', 'Basic Life Support'],
    languages: ['English', 'Spanish'],
    bio: 'Experienced internal medicine physician with over 10 years of practice. Specialized in preventive care and chronic disease management.'
  });

  // Mock performance stats
  const [stats, setStats] = useState({
    totalPatients: 145,
    appointmentsThisMonth: 87,
    patientSatisfaction: 4.8,
    appointmentCompletionRate: 95.2
  });

  // Mock recent activities
  const [recentActivities, setRecentActivities] = useState([
    {
      time: '2024-09-18 09:30',
      action: 'Completed appointment with John Smith',
      status: 'completed'
    },
    {
      time: '2024-09-18 08:15',
      action: 'Updated patient notes for Emily Johnson',
      status: 'completed'
    },
    {
      time: '2024-09-17 16:45',
      action: 'Scheduled follow-up appointment for Robert Davis',
      status: 'completed'
    },
    {
      time: '2024-09-17 14:30',
      action: 'Reviewed lab results for Lisa Garcia',
      status: 'completed'
    }
  ]);

  // Mock upcoming appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { time: '10:00 AM', patient: 'Michael Chen', type: 'Consultation' },
    { time: '11:30 AM', patient: 'Amanda Rodriguez', type: 'Follow-up' },
    { time: '02:00 PM', patient: 'David Thompson', type: 'Check-up' },
    { time: '03:30 PM', patient: 'Jennifer Lee', type: 'Treatment' }
  ]);

  const handleEditProfile = () => {
    router.push('/doctor/settings');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'on leave': return 'orange';
      default: return 'blue';
    }
  };

  const getSatisfactionColor = (rating) => {
    if (rating >= 4.5) return '#52c41a';
    if (rating >= 4.0) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-500">View and manage your professional profile</p>
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
              src={doctorData.avatar}
              icon={<UserOutlined />}
              className="mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{doctorData.name}</h2>
            <p className="text-gray-600 mb-2">{doctorData.specialty}</p>
            <Tag color={getStatusColor(doctorData.status)} className="mb-4">
              {doctorData.status}
            </Tag>
            
            <div className="flex justify-center items-center space-x-1 mb-4">
              <StarOutlined style={{ color: '#faad14' }} />
              <span className="font-medium">{stats.patientSatisfaction}</span>
              <span className="text-gray-500">/5.0</span>
            </div>
            
            <Divider />
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-2">
                <MailOutlined className="text-gray-500" />
                <span className="text-sm">{doctorData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneOutlined className="text-gray-500" />
                <span className="text-sm">{doctorData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MedicineBoxOutlined className="text-gray-500" />
                <span className="text-sm">{doctorData.licenseNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarOutlined className="text-gray-500" />
                <span className="text-sm">Joined {doctorData.joinDate}</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Details & Stats */}
        <Col xs={24} lg={16}>
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card title="Performance Overview" className="shadow-sm">
              <Row gutter={16}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Patients"
                    value={stats.totalPatients}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1677ff' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="This Month"
                    value={stats.appointmentsThisMonth}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Patient Satisfaction</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold" style={{ color: getSatisfactionColor(stats.patientSatisfaction) }}>
                        {stats.patientSatisfaction}
                      </div>
                      <StarOutlined style={{ color: '#faad14' }} />
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Completion Rate</div>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {stats.appointmentCompletionRate}%
                    </div>
                    <Progress 
                      percent={stats.appointmentCompletionRate} 
                      size="small" 
                      showInfo={false}
                      strokeColor="#52c41a"
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Profile Details */}
            <Card title="Professional Details" className="shadow-sm">
              <Descriptions column={{ xs: 1, sm: 2 }} bordered>
                <Descriptions.Item label="Full Name">
                  {doctorData.name}
                </Descriptions.Item>
                <Descriptions.Item label="Specialty">
                  {doctorData.specialty}
                </Descriptions.Item>
                <Descriptions.Item label="License Number">
                  {doctorData.licenseNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Experience">
                  {doctorData.experience}
                </Descriptions.Item>
                <Descriptions.Item label="Education" span={2}>
                  {doctorData.education}
                </Descriptions.Item>
                <Descriptions.Item label="Languages" span={2}>
                  <Space wrap>
                    {doctorData.languages.map((lang, index) => (
                      <Tag key={index} color="blue">{lang}</Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Certifications" span={2}>
                  <Space wrap>
                    {doctorData.certifications.map((cert, index) => (
                      <Tag key={index} color="green">{cert}</Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Bio" span={2}>
                  {doctorData.bio}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* Today's Schedule */}
        <Col xs={24} lg={12}>
          <Card title="Today's Schedule" className="shadow-sm">
            <div className="space-y-3">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{appointment.patient}</div>
                    <div className="text-sm text-gray-500">{appointment.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-blue-600">{appointment.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card title="Recent Activities" className="shadow-sm">
            <Timeline
              items={recentActivities.map((activity, index) => ({
                key: index,
                dot: <ClockCircleOutlined className="text-blue-500" />,
                children: (
                  <div>
                    <div className="font-medium text-sm">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

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
              icon={<CalendarOutlined />}
              onClick={() => router.push('/doctor/appointments')}
              size="large"
              block
            >
              View Schedule
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              type="default"
              icon={<UserOutlined />}
              onClick={() => router.push('/doctor/patients')}
              size="large"
              block
            >
              My Patients
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              type="default"
              icon={<FileTextOutlined />}
              onClick={() => router.push('/doctor/reports')}
              size="large"
              block
            >
              View Reports
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DoctorProfilePage;
