"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Select,
  DatePicker,
  Space,
  Tag,
  Progress,
  Divider,
  Typography
} from 'antd';
import {
  ArrowLeftOutlined,
  DollarOutlined,
  FileTextOutlined,
  DownloadOutlined,
  PrinterOutlined,
  RiseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

const BillingReportsPage = () => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [reportType, setReportType] = useState('overview');

  // Mock analytics data
  const [analyticsData] = useState({
    totalRevenue: 15750.00,
    paidAmount: 12600.00,
    pendingAmount: 2820.00,
    overdueAmount: 330.00,
    totalInvoices: 45,
    paidInvoices: 32,
    pendingInvoices: 10,
    overdueInvoices: 3,
    averageInvoiceValue: 350.00,
    collectionRate: 80.0,
    monthlyGrowth: 12.5
  });

  // Mock monthly data for charts
  const [monthlyData] = useState([
    { month: 'Jan', revenue: 8500, invoices: 28, collected: 7200 },
    { month: 'Feb', revenue: 9200, invoices: 32, collected: 8100 },
    { month: 'Mar', revenue: 11500, invoices: 38, collected: 9800 },
    { month: 'Apr', revenue: 13200, invoices: 42, collected: 11200 },
    { month: 'May', revenue: 15750, invoices: 45, collected: 12600 }
  ]);

  // Mock top services data
  const [topServices] = useState([
    { service: 'Consultation', revenue: 6300.00, count: 21, percentage: 40.0 },
    { service: 'Treatment', revenue: 4725.00, count: 15, percentage: 30.0 },
    { service: 'Follow-up', revenue: 2362.50, count: 17, percentage: 15.0 },
    { service: 'Check-up', revenue: 1575.00, count: 12, percentage: 10.0 },
    { service: 'Emergency', revenue: 787.50, count: 3, percentage: 5.0 }
  ]);

  // Mock doctor performance data
  const [doctorPerformance] = useState([
    { 
      doctor: 'Dr. Sarah Wilson', 
      revenue: 5250.00, 
      invoices: 15, 
      collectionRate: 85.0,
      averageValue: 350.00
    },
    { 
      doctor: 'Dr. Michael Brown', 
      revenue: 4200.00, 
      invoices: 12, 
      collectionRate: 80.0,
      averageValue: 350.00
    },
    { 
      doctor: 'Dr. Jessica Lee', 
      revenue: 3675.00, 
      invoices: 10, 
      collectionRate: 75.0,
      averageValue: 367.50
    },
    { 
      doctor: 'Dr. David Chen', 
      revenue: 2625.00, 
      invoices: 8, 
      collectionRate: 70.0,
      averageValue: 328.13
    }
  ]);

  // Mock aging report data
  const [agingData] = useState([
    { range: '0-30 days', amount: 1500.00, count: 5, percentage: 53.2 },
    { range: '31-60 days', amount: 990.00, count: 3, percentage: 35.1 },
    { range: '61-90 days', amount: 330.00, count: 2, percentage: 11.7 },
    { range: '90+ days', amount: 0.00, count: 0, percentage: 0.0 }
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log('Exporting report...');
  };

  const handlePrint = () => {
    window.print();
  };

  // Table columns for different reports
  const topServicesColumns = [
    {
      title: 'Service Type',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (amount) => `$${amount.toFixed(2)}`,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => (
        <div>
          <Progress 
            percent={percentage} 
            size="small" 
            showInfo={false}
            strokeColor="#1677ff"
          />
          <span className="text-sm">{percentage}%</span>
        </div>
      ),
    },
  ];

  const doctorPerformanceColumns = [
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (amount) => `$${amount.toFixed(2)}`,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Invoices',
      dataIndex: 'invoices',
      key: 'invoices',
      sorter: (a, b) => a.invoices - b.invoices,
    },
    {
      title: 'Avg. Value',
      dataIndex: 'averageValue',
      key: 'averageValue',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Collection Rate',
      dataIndex: 'collectionRate',
      key: 'collectionRate',
      render: (rate) => (
        <div>
          <Progress 
            percent={rate} 
            size="small" 
            showInfo={false}
            strokeColor={rate >= 80 ? '#52c41a' : rate >= 70 ? '#faad14' : '#ff4d4f'}
          />
          <span className="text-sm">{rate}%</span>
        </div>
      ),
    },
  ];

  const agingColumns = [
    {
      title: 'Age Range',
      dataIndex: 'range',
      key: 'range',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => (
        <div>
          <Progress 
            percent={percentage} 
            size="small" 
            showInfo={false}
            strokeColor={percentage > 50 ? '#ff4d4f' : percentage > 30 ? '#faad14' : '#52c41a'}
          />
          <span className="text-sm">{percentage}%</span>
        </div>
      ),
    },
  ];

  const monthlyRevenueColumns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Invoices',
      dataIndex: 'invoices',
      key: 'invoices',
    },
    {
      title: 'Collected',
      dataIndex: 'collected',
      key: 'collected',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Collection Rate',
      key: 'collectionRate',
      render: (_, record) => {
        const rate = (record.collected / record.revenue) * 100;
        return (
          <div>
            <Progress 
              percent={rate} 
              size="small" 
              showInfo={false}
              strokeColor={rate >= 80 ? '#52c41a' : rate >= 70 ? '#faad14' : '#ff4d4f'}
            />
            <span className="text-sm">{rate.toFixed(1)}%</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Billing Reports</h1>
            <p className="text-gray-500">Financial analytics and performance metrics</p>
          </div>
        </div>
        
        <Space wrap>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="MMM DD, YYYY"
          />
          <Select
            value={reportType}
            onChange={setReportType}
            style={{ width: 150 }}
          >
            <Option value="overview">Overview</Option>
            <Option value="detailed">Detailed</Option>
            <Option value="comparison">Comparison</Option>
          </Select>
          <Button
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Space>
      </div>

      {/* Key Metrics */}
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={analyticsData.totalRevenue}
              precision={2}
              valueStyle={{ color: '#1677ff' }}
              prefix={<DollarOutlined />}
              suffix={
                <span className="text-xs text-green-600 ml-2">
                  <RiseOutlined /> +{analyticsData.monthlyGrowth}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Collected"
              value={analyticsData.paidAmount}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
              suffix={
                <div className="text-xs text-gray-500">
                  {analyticsData.collectionRate}% rate
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Pending"
              value={analyticsData.pendingAmount}
              precision={2}
              valueStyle={{ color: '#faad14' }}
              prefix={<DollarOutlined />}
              suffix={
                <div className="text-xs text-gray-500">
                  {analyticsData.pendingInvoices} invoices
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Overdue"
              value={analyticsData.overdueAmount}
              precision={2}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<DollarOutlined />}
              suffix={
                <div className="text-xs text-gray-500">
                  {analyticsData.overdueInvoices} invoices
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Metrics */}
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Invoices"
              value={analyticsData.totalInvoices}
              valueStyle={{ color: '#722ed1' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Avg Invoice Value"
              value={analyticsData.averageInvoiceValue}
              precision={2}
              valueStyle={{ color: '#13c2c2' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Collection Rate"
              value={analyticsData.collectionRate}
              precision={1}
              valueStyle={{ 
                color: analyticsData.collectionRate >= 80 ? '#52c41a' : 
                       analyticsData.collectionRate >= 70 ? '#faad14' : '#ff4d4f' 
              }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Monthly Growth"
              value={analyticsData.monthlyGrowth}
              precision={1}
              valueStyle={{ color: '#52c41a' }}
              prefix={<RiseOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Reports Tables */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Top Services by Revenue" className="shadow-sm">
            <Table
              dataSource={topServices}
              columns={topServicesColumns}
              rowKey="service"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Doctor Performance" className="shadow-sm">
            <Table
              dataSource={doctorPerformance}
              columns={doctorPerformanceColumns}
              rowKey="doctor"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Accounts Receivable Aging" className="shadow-sm">
            <Table
              dataSource={agingData}
              columns={agingColumns}
              rowKey="range"
              pagination={false}
              size="small"
            />
            <Divider />
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Outstanding:</span>
                <span className="font-medium">
                  ${ agingData.reduce((sum, item) => sum + item.amount, 0).toFixed(2) }
                </span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Monthly Revenue Trend" className="shadow-sm">
            <Table
              dataSource={monthlyData}
              columns={monthlyRevenueColumns}
              rowKey="month"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Summary Section */}
      <Card title="Executive Summary" className="shadow-sm">
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Title level={5}>Financial Performance</Title>
            <ul className="space-y-2 text-sm">
              <li>• Total revenue of ${analyticsData.totalRevenue.toFixed(2)} generated this period</li>
              <li>• Collection rate of {analyticsData.collectionRate}% indicates strong payment collection</li>
              <li>• Monthly growth of {analyticsData.monthlyGrowth}% shows positive business trajectory</li>
              <li>• Average invoice value of ${analyticsData.averageInvoiceValue.toFixed(2)} maintained</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Key Insights</Title>
            <ul className="space-y-2 text-sm">
              <li>• Consultation services generate the highest revenue (40% of total)</li>
              <li>• Dr. Sarah Wilson leads in revenue generation</li>
              <li>• Majority of outstanding payments are within 0-30 days range</li>
              <li>• Only ${analyticsData.overdueAmount.toFixed(2)} in overdue amounts</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BillingReportsPage;
