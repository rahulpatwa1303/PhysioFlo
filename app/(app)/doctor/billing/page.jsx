"use client";

import { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Row, 
  Col, 
  Statistic, 
  Tag, 
  Typography, 
  Space, 
  Alert, 
  Tabs, 
  DatePicker,
  Select,
  Input,
  Tooltip,
  Modal,
  Descriptions,
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EyeOutlined, 
  DollarOutlined, 
  CalendarOutlined, 
  UserOutlined,
  FileTextOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

// Mock billing data for doctor view (read-only)
const mockBillingData = [
  {
    id: 'INV-001',
    patientName: 'John Smith',
    patientId: 'P001',
    date: '2024-01-15',
    appointmentType: 'Consultation',
    amount: 150.00,
    status: 'paid',
    paymentMethod: 'Insurance',
    billedBy: 'Dr. Sarah Wilson',
    notes: 'Initial consultation for chest pain'
  },
  {
    id: 'INV-002',
    patientName: 'Emily Johnson',
    patientId: 'P002',
    date: '2024-01-15',
    appointmentType: 'Follow-up',
    amount: 100.00,
    status: 'pending',
    paymentMethod: 'Cash',
    billedBy: 'Dr. Sarah Wilson',
    notes: 'Follow-up examination'
  },
  {
    id: 'INV-003',
    patientName: 'Robert Davis',
    patientId: 'P003',
    date: '2024-01-16',
    appointmentType: 'Check-up',
    amount: 120.00,
    status: 'paid',
    paymentMethod: 'Credit Card',
    billedBy: 'Dr. Sarah Wilson',
    notes: 'Annual health check-up'
  },
  {
    id: 'INV-004',
    patientName: 'Sarah Wilson',
    patientId: 'P004',
    date: '2024-01-16',
    appointmentType: 'Urgent Care',
    amount: 200.00,
    status: 'overdue',
    paymentMethod: 'Insurance',
    billedBy: 'Dr. Sarah Wilson',
    notes: 'Emergency consultation'
  },
  {
    id: 'INV-005',
    patientName: 'Michael Brown',
    patientId: 'P005',
    date: '2024-01-16',
    appointmentType: 'Treatment',
    amount: 180.00,
    status: 'paid',
    paymentMethod: 'Insurance',
    billedBy: 'Dr. Sarah Wilson',
    notes: 'Physical therapy session'
  },
  {
    id: 'INV-006',
    patientName: 'Lisa Garcia',
    patientId: 'P006',
    date: '2024-01-17',
    appointmentType: 'Consultation',
    amount: 150.00,
    status: 'draft',
    paymentMethod: 'Cash',
    billedBy: 'Dr. Sarah Wilson',
    notes: 'Initial consultation - neurological symptoms'
  }
];

const DoctorBillingPage = () => {
  const [filteredData, setFilteredData] = useState(mockBillingData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentTab, setCurrentTab] = useState('overview');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state management
  const encodeUrlState = (state) => {
    try {
      return btoa(JSON.stringify(state));
    } catch (error) {
      return '';
    }
  };

  const decodeUrlState = (encoded) => {
    try {
      return encoded ? JSON.parse(atob(encoded)) : {};
    } catch (error) {
      return {};
    }
  };

  const updateUrl = (tab, status = statusFilter, search = searchText, dates = dateRange) => {
    const params = new URLSearchParams();
    const state = { tab, status, search, dates: dates.map(d => d?.format?.('YYYY-MM-DD')) };
    params.set('s', encodeUrlState(state));
    router.replace(`${window.location.pathname}?${params.toString()}`, { shallow: true });
  };

  // Initialize from URL
  useEffect(() => {
    const stateParam = searchParams.get('s');
    if (stateParam) {
      const state = decodeUrlState(stateParam);
      if (state.tab) setCurrentTab(state.tab);
      if (state.status) setStatusFilter(state.status);
      if (state.search) setSearchText(state.search);
      if (state.dates && state.dates.length === 2) {
        setDateRange([dayjs(state.dates[0]), dayjs(state.dates[1])]);
      }
    }
  }, [searchParams]);

  // Filter data based on current filters
  useEffect(() => {
    let filtered = [...mockBillingData];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Date range filter
    if (dateRange.length === 2) {
      filtered = filtered.filter(item => {
        const itemDate = dayjs(item.date);
        return itemDate.isAfter(dateRange[0].subtract(1, 'day')) && 
               itemDate.isBefore(dateRange[1].add(1, 'day'));
      });
    }

    // Search filter
    if (searchText) {
      filtered = filtered.filter(item =>
        item.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id.toLowerCase().includes(searchText.toLowerCase()) ||
        item.appointmentType.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [statusFilter, dateRange, searchText]);

  // Handle view bill details
  const handleViewBill = (record) => {
    setSelectedBill(record);
    setDetailModalVisible(true);
  };

  // Handle filter changes
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    updateUrl(currentTab, value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates || []);
    updateUrl(currentTab, statusFilter, searchText, dates || []);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    updateUrl(currentTab, statusFilter, value);
  };

  const handleTabChange = (key) => {
    setCurrentTab(key);
    updateUrl(key);
  };

  // Get status tag color
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'orange';
      case 'overdue': return 'red';
      case 'draft': return 'blue';
      default: return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircleOutlined />;
      case 'pending': return <InfoCircleOutlined />;
      case 'overdue': return <ExclamationCircleOutlined />;
      case 'draft': return <FileTextOutlined />;
      default: return null;
    }
  };

  // Calculate statistics
  const stats = {
    total: filteredData.reduce((sum, item) => sum + item.amount, 0),
    paid: filteredData.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0),
    pending: filteredData.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0),
    overdue: filteredData.filter(item => item.status === 'overdue').reduce((sum, item) => sum + item.amount, 0),
    count: filteredData.length,
    paidCount: filteredData.filter(item => item.status === 'paid').length,
    pendingCount: filteredData.filter(item => item.status === 'pending').length,
    overdueCount: filteredData.filter(item => item.status === 'overdue').length
  };

  // Table columns
  const columns = [
    {
      title: 'Bill ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'left',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      width: 200,
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.patientId}</div>
        </div>
      )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (text) => dayjs(text).format('MMM D, YYYY'),
      sorter: (a, b) => dayjs(a.date).diff(dayjs(b.date))
    },
    {
      title: 'Service',
      dataIndex: 'appointmentType',
      key: 'appointmentType',
      width: 150
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => (
        <Text strong>${amount.toFixed(2)}</Text>
      ),
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag 
          color={getStatusColor(status)} 
          icon={getStatusIcon(status)}
        >
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Pending', value: 'pending' },
        { text: 'Overdue', value: 'overdue' },
        { text: 'Draft', value: 'draft' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="View Bill Details">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewBill(record)}
          >
            View
          </Button>
        </Tooltip>
      )
    }
  ];

  const overviewContent = (
    <div className="space-y-6">
      {/* Statistics */}
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic
              title="Total Revenue"
              value={stats.total}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#1677ff' }}
            />
            <Text type="secondary">{stats.count} bills</Text>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic
              title="Paid"
              value={stats.paid}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary">{stats.paidCount} bills</Text>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary">{stats.pendingCount} bills</Text>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic
              title="Overdue"
              value={stats.overdue}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <Text type="secondary">{stats.overdueCount} bills</Text>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card title="Filters" className="shadow-sm">
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <label className="block text-sm font-medium mb-2">Date Range:</label>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <label className="block text-sm font-medium mb-2">Status:</label>
            <Select
              value={statusFilter}
              onChange={handleStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">All Status</Option>
              <Option value="paid">Paid</Option>
              <Option value="pending">Pending</Option>
              <Option value="overdue">Overdue</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <label className="block text-sm font-medium mb-2">Search:</label>
            <Search
              placeholder="Search by patient, bill ID, or service"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Bills Table */}
      <Card title="My Bills" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} bills`
          }}
        />
      </Card>
    </div>
  );

  const summaryContent = (
    <div className="space-y-6">
      <Card title="Monthly Summary" className="shadow-sm">
        <Row gutter={16}>
          <Col span={24}>
            <Text type="secondary">
              This section would contain detailed monthly breakdowns, charts, and analytics for billing performance.
              Currently showing overview data for demonstration.
            </Text>
          </Col>
        </Row>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center space-x-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
            className="mb-2 md:mb-0"
          >
            Back to Dashboard
          </Button>
          <div>
            <Title level={2} className="mb-0">My Billing Overview</Title>
            <Text type="secondary">View billing information for your patients (Read-only access)</Text>
          </div>
        </div>
      </div>

      {/* Read-only Notice */}
      <Alert
        message="Read-Only Access"
        description="You can view billing information but cannot create, edit, or delete bills. For billing changes, please contact the administration."
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        closable
      />

      {/* Main Content */}
      <Card className="shadow-sm">
        <Tabs
          activeKey={currentTab}
          onChange={handleTabChange}
          items={[
            {
              key: 'overview',
              label: (
                <span>
                  <DollarOutlined />
                  Overview
                </span>
              ),
              children: overviewContent
            },
            {
              key: 'summary',
              label: (
                <span>
                  <CalendarOutlined />
                  Summary
                </span>
              ),
              children: summaryContent
            }
          ]}
        />
      </Card>

      {/* Bill Detail Modal */}
      <Modal
        title={`Bill Details - ${selectedBill?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedBill && (
          <div className="space-y-4">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Bill ID" span={2}>
                <Text strong>{selectedBill.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Patient">
                {selectedBill.patientName}
              </Descriptions.Item>
              <Descriptions.Item label="Patient ID">
                {selectedBill.patientId}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {dayjs(selectedBill.date).format('MMMM D, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Service Type">
                {selectedBill.appointmentType}
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                <Text strong style={{ fontSize: '16px' }}>
                  ${selectedBill.amount.toFixed(2)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag 
                  color={getStatusColor(selectedBill.status)} 
                  icon={getStatusIcon(selectedBill.status)}
                >
                  {selectedBill.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method" span={2}>
                {selectedBill.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Billed By" span={2}>
                {selectedBill.billedBy}
              </Descriptions.Item>
              <Descriptions.Item label="Notes" span={2}>
                {selectedBill.notes || 'No notes available'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Alert
              message="Read-Only View"
              description="You can view this bill information but cannot make changes. For any billing adjustments, please contact the billing department."
              type="warning"
              showIcon
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorBillingPage;
