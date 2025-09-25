"use client";
import { Card, Button, List, Space, Typography, Tag, Select, Input, Badge, Row, Col, Avatar, Divider } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined, EyeOutlined, FilterOutlined, WarningOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

// Mock notifications data
const mockNotifications = [
  {
    id: 'N001',
    type: 'urgent',
    title: 'Emergency Patient Alert',
    message: 'Patient John Smith (PT001) requires immediate attention in Room 3',
    timestamp: '2025-09-23 09:15',
    read: false,
    priority: 'high',
    source: 'Emergency System',
    actions: ['View Patient', 'Notify Doctor']
  },
  {
    id: 'N002',
    type: 'appointment',
    title: 'Appointment Cancellation',
    message: 'Emily Davis cancelled her 2:30 PM appointment with Dr. Wilson',
    timestamp: '2025-09-23 08:45',
    read: false,
    priority: 'medium',
    source: 'Appointment System',
    actions: ['Reschedule', 'Update Waitlist']
  },
  {
    id: 'N003',
    type: 'system',
    title: 'Lab Results Available',
    message: '3 new lab results are ready for review and patient notification',
    timestamp: '2025-09-23 08:30',
    read: true,
    priority: 'medium',
    source: 'Laboratory System',
    actions: ['View Results', 'Contact Patients']
  },
  {
    id: 'N004',
    type: 'reminder',
    title: 'Daily Backup Reminder',
    message: 'Daily system backup scheduled for 11:00 PM tonight',
    timestamp: '2025-09-23 08:00',
    read: true,
    priority: 'low',
    source: 'System Admin',
    actions: ['View Schedule']
  },
  {
    id: 'N005',
    type: 'inventory',
    title: 'Low Inventory Alert',
    message: 'Surgical masks running low (5 boxes remaining)',
    timestamp: '2025-09-23 07:30',
    read: false,
    priority: 'medium',
    source: 'Inventory System',
    actions: ['Order Supplies', 'Check Stock']
  },
  {
    id: 'N006',
    type: 'staff',
    title: 'Staff Schedule Update',
    message: 'Dr. Chen will be 30 minutes late for morning appointments',
    timestamp: '2025-09-23 07:00',
    read: true,
    priority: 'high',
    source: 'Staff Scheduling',
    actions: ['Notify Patients', 'Reschedule']
  }
];

const StaffNotificationsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [readFilter, setReadFilter] = useState(null);

  const getNotificationIcon = (type) => {
    const icons = {
      'urgent': <WarningOutlined style={{ color: '#ff4d4f' }} />,
      'appointment': <BellOutlined style={{ color: '#1890ff' }} />,
      'system': <InfoCircleOutlined style={{ color: '#52c41a' }} />,
      'reminder': <CheckCircleOutlined style={{ color: '#faad14' }} />,
      'inventory': <WarningOutlined style={{ color: '#fa8c16' }} />,
      'staff': <BellOutlined style={{ color: '#722ed1' }} />
    };
    return icons[type] || <BellOutlined />;
  };

  const getNotificationColor = (type) => {
    const colors = {
      'urgent': 'red',
      'appointment': 'blue',
      'system': 'green',
      'reminder': 'orange',
      'inventory': 'purple',
      'staff': 'geekblue'
    };
    return colors[type] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'red',
      'medium': 'orange',
      'low': 'green'
    };
    return colors[priority] || 'default';
  };

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchText.toLowerCase()) ||
                         notification.source.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = !typeFilter || notification.type === typeFilter;
    const matchesPriority = !priorityFilter || notification.priority === priorityFilter;
    const matchesRead = readFilter === null || notification.read === (readFilter === 'read');
    return matchesSearch && matchesType && matchesPriority && matchesRead;
  });

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Title level={3}>Notifications</Title>
          <Badge count={unreadCount} style={{ backgroundColor: '#f5222d' }}>
            <BellOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          </Badge>
        </div>
        <Space>
          <Button icon={<CheckOutlined />}>
            Mark All Read
          </Button>
          <Button icon={<DeleteOutlined />}>
            Clear All
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-gray-500">High Priority</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-500">Medium Priority</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <div className="text-sm text-gray-500">Unread</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{mockNotifications.length - unreadCount}</div>
            <div className="text-sm text-gray-500">Read</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Search
              placeholder="Search notifications..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Type"
              style={{ width: '100%' }}
              value={typeFilter}
              onChange={setTypeFilter}
              allowClear
            >
              <Option value="urgent">Urgent</Option>
              <Option value="appointment">Appointment</Option>
              <Option value="system">System</Option>
              <Option value="reminder">Reminder</Option>
              <Option value="inventory">Inventory</Option>
              <Option value="staff">Staff</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Priority"
              style={{ width: '100%' }}
              value={priorityFilter}
              onChange={setPriorityFilter}
              allowClear
            >
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Status"
              style={{ width: '100%' }}
              value={readFilter}
              onChange={setReadFilter}
              allowClear
            >
              <Option value="unread">Unread</Option>
              <Option value="read">Read</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" icon={<FilterOutlined />}>
              Apply Filters
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Notifications List */}
      <Card title={`Notifications (${filteredNotifications.length})`}>
        <List
          dataSource={filteredNotifications}
          renderItem={(notification) => (
            <List.Item
              className={`${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
              actions={[
                <Button size="small" icon={<EyeOutlined />}>
                  View
                </Button>,
                <Button size="small" icon={<CheckOutlined />}>
                  Mark Read
                </Button>,
                <Button size="small" icon={<DeleteOutlined />} danger>
                  Delete
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={!notification.read}>
                    <Avatar icon={getNotificationIcon(notification.type)} />
                  </Badge>
                }
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${!notification.read ? 'text-black' : 'text-gray-600'}`}>
                        {notification.title}
                      </span>
                      <Tag color={getNotificationColor(notification.type)}>
                        {notification.type}
                      </Tag>
                      <Tag color={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Tag>
                    </div>
                    <Text type="secondary" className="text-sm">
                      {new Date(notification.timestamp).toLocaleString()}
                    </Text>
                  </div>
                }
                description={
                  <div className="space-y-2">
                    <Text className={!notification.read ? 'text-gray-800' : 'text-gray-600'}>
                      {notification.message}
                    </Text>
                    <div className="flex items-center justify-between">
                      <Text type="secondary" className="text-sm">
                        Source: {notification.source}
                      </Text>
                      <Space size="small">
                        {notification.actions.map((action, index) => (
                          <Button key={index} size="small" type="link">
                            {action}
                          </Button>
                        ))}
                      </Space>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} notifications`
          }}
        />
      </Card>
    </div>
  );
};

export default StaffNotificationsPage;
