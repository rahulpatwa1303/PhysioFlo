"use client";

import { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  DatePicker, 
  Space, 
  Button,
  Statistic,
  Typography,
  Alert
} from 'antd';
import {
  BarChartOutlined,
  DownloadOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  LineChartOutlined,
  PlusOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const DoctorReportsPage = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(3, 'month'),
    dayjs()
  ]);

  // Simplified mock data for demo
  const patientStats = {
    totalPatients: 145,
    monthlyAppointments: 87,
    completionRate: 95.2,
    avgRating: 4.8
  };

  const monthlyData = [
    { month: 'Jan', appointments: 22, patients: 18, rating: 4.6 },
    { month: 'Feb', appointments: 28, patients: 24, rating: 4.7 },
    { month: 'Mar', appointments: 31, patients: 28, rating: 4.8 },
    { month: 'Apr', appointments: 29, patients: 26, rating: 4.9 }
  ];

  const chartOption = {
    title: { text: 'Monthly Performance', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { top: 30 },
    xAxis: {
      type: 'category',
      data: monthlyData.map(item => item.month)
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Appointments',
        type: 'bar',
        data: monthlyData.map(item => item.appointments),
        itemStyle: { color: '#1677ff' }
      },
      {
        name: 'Patients',
        type: 'line',
        data: monthlyData.map(item => item.patients),
        itemStyle: { color: '#52c41a' }
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Reports & Analytics</h1>
          <p className="text-gray-500">Personal performance metrics and patient insights</p>
        </div>
        
        <Space wrap>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="MMM DD, YYYY"
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={() => console.log('Export doctor reports...')}
          >
            Export
          </Button>
        </Space>
      </div>

      {/* Notice about JSON-driven dashboards */}
      <Alert
        message="JSON-Driven Dashboard System"
        description="The reporting system now supports fully customizable, JSON-driven dashboards. Administrators can create, edit, and configure multiple dashboard views with different widget types including KPIs, charts, and custom visualizations. This same system can be extended for doctor-specific dashboards."
        type="info"
        showIcon
        icon={<SettingOutlined />}
        action={
          <Button size="small" type="primary">
            <a href="/tenant-admin/reports" target="_blank" rel="noopener noreferrer">
              View Admin Dashboard System
            </a>
          </Button>
        }
      />

      {/* Key Metrics */}
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="My Patients"
              value={patientStats.totalPatients}
              valueStyle={{ color: '#1677ff' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="This Month"
              value={patientStats.monthlyAppointments}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={patientStats.completionRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Avg Rating"
              value={patientStats.avgRating}
              precision={1}
              suffix="/5"
              valueStyle={{ color: '#faad14' }}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Chart */}
      <Card title="Performance Overview" className="shadow-sm">
        <ReactECharts 
          option={chartOption} 
          style={{ height: '400px' }}
        />
      </Card>

      {/* Implementation Note */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="text-center">
          <Title level={4} className="text-blue-800">Doctor Dashboard Implementation</Title>
          <Text className="text-blue-600">
            This doctor reports page can be enhanced with the same JSON-driven dashboard system implemented 
            for admin reports. The system supports creating custom dashboards with configurable widgets, 
            chart types, data sources, and layout options. Each doctor could have personalized dashboard 
            configurations saved to their profile.
          </Text>
          <br />
          <br />
          <Space>
            <Button type="primary" icon={<SettingOutlined />}>
              Configure My Dashboard
            </Button>
            <Button icon={<PlusOutlined />}>
              Add Custom Widget
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default DoctorReportsPage;
