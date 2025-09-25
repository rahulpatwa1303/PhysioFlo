"use client";

import { useState, useEffect } from 'react';
import { Button, Row, Col, Card, Statistic, Typography, Space, Alert, Tag, Badge } from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  TeamOutlined,
  BellOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import KpiCard from '@/app/components/KpiCard';

const { Title, Text } = Typography;

// Staff-specific KPI configuration
const staffKpiConfig = {
  kpis: [
    {
      id: 'total-patients',
      title: 'Total Patients',
      value: 1247,
      change: '+23 today',
      changeType: 'increase',
      icon: 'UserOutlined',
      color: '#1677ff',
      description: 'All registered patients in the system'
    },
    {
      id: 'todays-appointments',
      title: "Today's Appointments",
      value: 47,
      change: '+8 from yesterday',
      changeType: 'increase',
      icon: 'CalendarOutlined',
      color: '#52c41a',
      description: 'Scheduled appointments for today'
    },
    {
      id: 'pending-calls',
      title: 'Pending Patient Calls',
      value: 12,
      change: 'High priority: 3',
      changeType: 'warning',
      icon: 'PhoneOutlined',
      color: '#faad14',
      description: 'Patients needing callback or follow-up'
    },
    {
      id: 'waitlist',
      title: 'Patients in Waitlist',
      value: 28,
      change: '+5 this hour',
      changeType: 'increase',
      icon: 'ClockCircleOutlined',
      color: '#722ed1',
      description: 'Patients waiting for available slots'
    }
  ]
};

// Mock data for today's activities
const todaysActivities = [
  { time: '09:15', type: 'appointment', patient: 'John Smith', doctor: 'Dr. Wilson', status: 'completed' },
  { time: '09:30', type: 'call', patient: 'Mary Johnson', purpose: 'Prescription refill', status: 'pending' },
  { time: '10:00', type: 'appointment', patient: 'Robert Davis', doctor: 'Dr. Chen', status: 'in-progress' },
  { time: '10:15', type: 'registration', patient: 'Lisa Garcia', purpose: 'New patient intake', status: 'completed' },
  { time: '10:30', type: 'call', patient: 'Michael Brown', purpose: 'Test results', status: 'urgent' }
];

// Mock urgent notifications
const urgentNotifications = [
  { id: 1, type: 'appointment', message: 'Dr. Wilson running 15 mins late', priority: 'high', time: '2 mins ago' },
  { id: 2, type: 'patient', message: 'Emergency patient needs immediate attention', priority: 'urgent', time: '5 mins ago' },
  { id: 3, type: 'system', message: 'Lab results ready for 3 patients', priority: 'medium', time: '10 mins ago' },
];

const StaffDashboardPage = () => {
  const [kpiData, setKpiData] = useState(staffKpiConfig.kpis);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'appointment': return <CalendarOutlined />;
      case 'call': return <PhoneOutlined />;
      case 'registration': return <UserOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'processing';
      case 'pending': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'processing';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
          <p className="text-gray-500">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        
        <Space wrap>
          <Button 
            icon={<UserOutlined />} 
            onClick={() => console.log('Register new patient...')}
          >
            Register New Patient
          </Button>
          <Button 
            type="primary" 
            icon={<CalendarOutlined />} 
            onClick={() => console.log('Schedule appointment...')}
          >
            Schedule Appointment
          </Button>
        </Space>
      </div>

      {/* Urgent Notifications */}
      {urgentNotifications.filter(n => n.priority === 'urgent' || n.priority === 'high').length > 0 && (
        <Alert
          message="Urgent Notifications"
          description={
            <div className="space-y-2 mt-2">
              {urgentNotifications
                .filter(n => n.priority === 'urgent' || n.priority === 'high')
                .map(notification => (
                  <div key={notification.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center space-x-2">
                      <Badge status={getPriorityColor(notification.priority)} />
                      <span>{notification.message}</span>
                    </div>
                    <Text type="secondary" className="text-xs">{notification.time}</Text>
                  </div>
                ))}
            </div>
          }
          type="warning"
          showIcon
          icon={<BellOutlined />}
          closable
        />
      )}

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <KpiCard 
            key={kpi.id} 
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            changeType={kpi.changeType}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <Row gutter={[16, 16]}>
        {/* Today's Activity Timeline */}
        <Col xs={24} lg={14}>
          <Card title="Today's Activity Timeline" className="shadow-sm">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {todaysActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border-l-4 border-blue-200 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-600 min-w-[60px]">
                    {activity.time}
                  </div>
                  <div className="text-blue-500">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.patient}</div>
                    <div className="text-sm text-gray-500">
                      {activity.doctor && `with ${activity.doctor} • `}
                      {activity.purpose || 'Appointment'}
                    </div>
                  </div>
                  <Tag color={getActivityColor(activity.status)}>
                    {activity.status.replace('-', ' ')}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Quick Actions & Stats */}
        <Col xs={24} lg={10}>
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card title="Quick Actions" className="shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  size="large" 
                  icon={<UserOutlined />} 
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => console.log('Navigate to patients...')}
                >
                  <div>Manage</div>
                  <div>Patients</div>
                </Button>
                <Button 
                  size="large" 
                  icon={<CalendarOutlined />} 
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => console.log('Navigate to appointments...')}
                >
                  <div>Appointment</div>
                  <div>Schedule</div>
                </Button>
                <Button 
                  size="large" 
                  icon={<PhoneOutlined />} 
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => console.log('Navigate to calls...')}
                >
                  <div>Patient</div>
                  <div>Calls</div>
                </Button>
                <Button 
                  size="large" 
                  icon={<ClockCircleOutlined />} 
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => console.log('Navigate to waitlist...')}
                >
                  <div>Waitlist</div>
                  <div>Management</div>
                </Button>
              </div>
            </Card>

            {/* Doctor Status */}
            <Card title="Doctor Status" className="shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Dr. Sarah Wilson</span>
                  <Badge status="success" text="Available" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Dr. Michael Chen</span>
                  <Badge status="processing" text="With Patient" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Dr. Emily Johnson</span>
                  <Badge status="warning" text="Running Late" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Dr. Robert Davis</span>
                  <Badge status="default" text="Break" />
                </div>
              </div>
            </Card>

            {/* System Notifications */}
            <Card title="Recent Notifications" className="shadow-sm">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {urgentNotifications.map(notification => (
                  <div key={notification.id} className="flex items-start justify-between text-sm">
                    <div className="flex items-start space-x-2">
                      <Badge status={getPriorityColor(notification.priority)} />
                      <span className="flex-1">{notification.message}</span>
                    </div>
                    <Text type="secondary" className="text-xs">{notification.time}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StaffDashboardPage;
