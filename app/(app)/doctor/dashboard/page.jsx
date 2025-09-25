"use client";

import { useState, useEffect } from 'react';
import { Button, Row, Col, Card, Statistic, Typography, Space, Alert } from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import KpiCard from '@/app/components/KpiCard';
import MyPatientsTable from '@/app/components/doctor-dashboard/MyPatientsTable';
import DoctorCompactAppointments from '@/app/components/doctor-dashboard/DoctorCompactAppointments';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;

// Doctor-specific JSON-driven KPI configuration
const doctorKpiConfig = {
  kpis: [
    {
      id: 'my-patients',
      title: 'My Patients',
      value: 156,
      change: '+8%',
      changeType: 'increase',
      icon: 'UserOutlined',
      color: '#1677ff',
      apiEndpoint: '/api/doctor/patients/count',
      description: 'Total active patients under your care'
    },
    {
      id: 'todays-appointments',
      title: "Today's Appointments",
      value: 12,
      change: '+2',
      changeType: 'increase',
      icon: 'CalendarOutlined',
      color: '#52c41a',
      apiEndpoint: '/api/doctor/appointments/today',
      description: 'Scheduled appointments for today'
    },
    {
      id: 'completed-today',
      title: 'Completed Today',
      value: 8,
      change: '+25%',
      changeType: 'increase',
      icon: 'CheckCircleOutlined',
      color: '#722ed1',
      apiEndpoint: '/api/doctor/appointments/completed-today',
      description: 'Appointments completed today'
    },
    {
      id: 'pending-reviews',
      title: 'Pending Reviews',
      value: 3,
      change: '-1',
      changeType: 'decrease',
      icon: 'ExclamationCircleOutlined',
      color: '#fa8c16',
      apiEndpoint: '/api/doctor/reviews/pending',
      description: 'Patient assessments awaiting review'
    }
  ],
  widgets: [
    {
      id: 'weekly-stats',
      type: 'chart',
      title: 'Weekly Performance',
      chartType: 'line',
      apiEndpoint: '/api/doctor/analytics/weekly',
      height: 300
    },
    {
      id: 'patient-satisfaction',
      type: 'chart',
      title: 'Patient Satisfaction',
      chartType: 'gauge',
      apiEndpoint: '/api/doctor/satisfaction',
      height: 250
    }
  ]
};

// Mock data for charts
const weeklyPerformanceData = {
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  appointments: [8, 12, 10, 9, 15, 6, 4],
  completed: [8, 11, 9, 9, 14, 5, 4],
  patientRating: [4.8, 4.9, 4.7, 4.8, 4.9, 4.8, 4.9]
};

const DoctorDashboardPage = () => {
  const [kpiData, setKpiData] = useState(doctorKpiConfig.kpis);
  const [currentDoctor, setCurrentDoctor] = useState({
    name: 'Dr. Sarah Wilson',
    specialization: 'Cardiology',
    id: 'DR001'
  });

  // Simulate real-time KPI updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In real implementation, this would fetch from API
      // For demo, simulate small random changes
      setKpiData(prev => prev.map(kpi => ({
        ...kpi,
        // Simulate small fluctuations for demo
        value: kpi.id === 'pending-reviews' ? 
          Math.max(0, kpi.value + Math.floor(Math.random() * 3) - 1) : 
          kpi.value
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAddPatientNote = () => {
    console.log('Add patient note');
    // Navigate to add patient note page
  };

  const handleViewSchedule = () => {
    console.log('View full schedule');
    // Navigate to full schedule page
  };

  const handleCreateAssessment = () => {
    console.log('Create patient assessment');
    // Navigate to assessment creation
  };

  // Chart options
  const weeklyPerformanceOption = {
    title: {
      text: 'Weekly Performance Overview',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['Scheduled', 'Completed', 'Rating'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: weeklyPerformanceData.xAxis
    },
    yAxis: [
      {
        type: 'value',
        name: 'Appointments',
        position: 'left'
      },
      {
        type: 'value',
        name: 'Rating',
        position: 'right',
        min: 4,
        max: 5
      }
    ],
    series: [
      {
        name: 'Scheduled',
        type: 'bar',
        data: weeklyPerformanceData.appointments,
        itemStyle: { color: '#1677ff' }
      },
      {
        name: 'Completed',
        type: 'bar',
        data: weeklyPerformanceData.completed,
        itemStyle: { color: '#52c41a' }
      },
      {
        name: 'Rating',
        type: 'line',
        yAxisIndex: 1,
        data: weeklyPerformanceData.patientRating,
        itemStyle: { color: '#faad14' },
        lineStyle: { width: 3 }
      }
    ]
  };

  const satisfactionGaugeOption = {
    title: {
      text: 'Current Rating: 4.8/5.0',
      left: 'center',
      top: '75%',
      textStyle: { fontSize: 14 }
    },
    series: [
      {
        name: 'Patient Satisfaction',
        type: 'gauge',
        min: 0,
        max: 5,
        radius: '80%',
        startAngle: 180,
        endAngle: 0,
        data: [{ value: 4.8, name: 'Rating' }],
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          fontSize: 24,
          offsetCenter: [0, '40%']
        },
        axisLine: {
          lineStyle: {
            width: 15,
            color: [
              [0.6, '#ff6b6b'],
              [0.8, '#feca57'],
              [1, '#48dbfb']
            ]
          }
        }
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {currentDoctor.name}! Here's your activity summary for today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Button icon={<FileTextOutlined />} onClick={handleCreateAssessment}>
            Create Assessment
          </Button>
          <Button icon={<PlusOutlined />} onClick={handleAddPatientNote}>
            Add Patient Note
          </Button>
          <Button type="primary" icon={<CalendarOutlined />} onClick={handleViewSchedule}>
            View Full Schedule
          </Button>
        </div>
      </div>

      {/* Doctor Info Alert */}
      <Alert
        message={`${currentDoctor.name} - ${currentDoctor.specialization}`}
        description={`Doctor ID: ${currentDoctor.id} | Real-time dashboard with JSON-driven KPIs and analytics`}
        type="info"
        showIcon
        icon={<UserOutlined />}
      />

      {/* KPI Cards Section - JSON Driven */}
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

      {/* Performance Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Weekly Performance Overview" className="shadow-sm">
            <ReactECharts 
              option={weeklyPerformanceOption} 
              style={{ height: '350px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Patient Satisfaction" className="shadow-sm">
            <ReactECharts 
              option={satisfactionGaugeOption} 
              style={{ height: '350px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Doctor-specific Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* My Schedule */}
        <div>
          <DoctorCompactAppointments />
        </div>
        
        {/* My Patients Table */}
        <div>
          <MyPatientsTable />
        </div>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Button block icon={<UserOutlined />} size="large">
              View All Patients
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button block icon={<CalendarOutlined />} size="large">
              Manage Schedule
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button block icon={<FileTextOutlined />} size="large">
              Patient Notes
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button block icon={<BarChartOutlined />} size="large">
              View Reports
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DoctorDashboardPage;
