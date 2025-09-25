"use client";

import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  DatePicker, 
  Space, 
  Button,
  Statistic,
  Typography,
  Alert,
  Tabs,
  Modal,
  Form,
  Input,
  Select,
  message,
  Drawer,
  Tag,
  Tooltip,
  Dropdown,
  Popconfirm
} from 'antd';
import {
  BarChartOutlined,
  DownloadOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  LineChartOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ReloadOutlined,
  CopyOutlined,
  FileTextOutlined,
  StarOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  DotChartOutlined,
  DashboardOutlined,
  FilterOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Doctor-specific JSON-driven dashboard configuration
const doctorDashboardConfig = {
  dashboards: [
    {
      id: 'performance',
      name: 'My Performance',
      description: 'Personal performance metrics and patient outcomes',
      icon: 'TrophyOutlined',
      permissions: ['doctor'],
      refreshInterval: 300,
      widgets: [
        {
          id: 'my-patients-kpi',
          type: 'kpi',
          title: 'Total Patients',
          dataSource: 'doctor.patients.total',
          apiEndpoint: '/api/doctor/patients/count',
          format: 'number',
          icon: 'UserOutlined',
          color: '#1677ff',
          position: { row: 0, col: 0, span: 6 },
          filters: ['dateRange']
        },
        {
          id: 'appointments-kpi',
          type: 'kpi',
          title: 'This Month',
          dataSource: 'doctor.appointments.monthly',
          apiEndpoint: '/api/doctor/appointments/monthly',
          format: 'number',
          icon: 'CalendarOutlined',
          color: '#52c41a',
          position: { row: 0, col: 1, span: 6 },
          filters: ['dateRange']
        },
        {
          id: 'completion-rate-kpi',
          type: 'kpi',
          title: 'Completion Rate',
          dataSource: 'doctor.appointments.completionRate',
          apiEndpoint: '/api/doctor/appointments/completion-rate',
          format: 'percentage',
          icon: 'CheckCircleOutlined',
          color: '#722ed1',
          position: { row: 0, col: 2, span: 6 },
          filters: ['dateRange']
        },
        {
          id: 'rating-kpi',
          type: 'kpi',
          title: 'Avg Rating',
          dataSource: 'doctor.rating.average',
          apiEndpoint: '/api/doctor/rating/average',
          format: 'rating',
          icon: 'StarOutlined',
          color: '#faad14',
          position: { row: 0, col: 3, span: 6 },
          filters: ['dateRange']
        },
        {
          id: 'monthly-performance',
          type: 'chart',
          title: 'Monthly Performance Overview',
          chartType: 'bar',
          dataSource: 'doctor.performance.monthly',
          apiEndpoint: '/api/doctor/performance/monthly',
          xAxis: 'month',
          yAxis: ['appointments', 'completed'],
          colors: ['#1677ff', '#52c41a'],
          position: { row: 1, col: 0, span: 16 },
          filters: ['dateRange']
        },
        {
          id: 'patient-satisfaction',
          type: 'chart',
          title: 'Patient Satisfaction',
          chartType: 'line',
          dataSource: 'doctor.satisfaction.trend',
          apiEndpoint: '/api/doctor/satisfaction/trend',
          xAxis: 'month',
          yAxis: ['rating'],
          colors: ['#faad14'],
          position: { row: 1, col: 1, span: 8 },
          filters: ['dateRange']
        }
      ]
    },
    {
      id: 'assessments',
      name: 'Assessment Analytics',
      description: 'Patient assessment insights and outcomes',
      icon: 'FileTextOutlined',
      permissions: ['doctor'],
      widgets: [
        {
          id: 'total-assessments-kpi',
          type: 'kpi',
          title: 'Total Assessments',
          dataSource: 'doctor.assessments.total',
          apiEndpoint: '/api/doctor/assessments/count',
          format: 'number',
          icon: 'FileTextOutlined',
          color: '#1677ff',
          position: { row: 0, col: 0, span: 6 }
        },
        {
          id: 'avg-score-kpi',
          type: 'kpi',
          title: 'Avg Score',
          dataSource: 'doctor.assessments.averageScore',
          apiEndpoint: '/api/doctor/assessments/average-score',
          format: 'score',
          icon: 'TrophyOutlined',
          color: '#722ed1',
          position: { row: 0, col: 1, span: 6 }
        },
        {
          id: 'overdue-followups-kpi',
          type: 'kpi',
          title: 'Overdue Follow-ups',
          dataSource: 'doctor.assessments.overdueFollowups',
          apiEndpoint: '/api/doctor/assessments/overdue-followups',
          format: 'number',
          icon: 'ClockCircleOutlined',
          color: '#ff4d4f',
          position: { row: 0, col: 2, span: 6 }
        },
        {
          id: 'completed-assessments-kpi',
          type: 'kpi',
          title: 'Completed',
          dataSource: 'doctor.assessments.completed',
          apiEndpoint: '/api/doctor/assessments/completed',
          format: 'number',
          icon: 'CheckCircleOutlined',
          color: '#52c41a',
          position: { row: 0, col: 3, span: 6 }
        },
        {
          id: 'assessment-scores',
          type: 'chart',
          title: 'Assessment Score Distribution',
          chartType: 'pie',
          dataSource: 'doctor.assessments.scoreDistribution',
          apiEndpoint: '/api/doctor/assessments/score-distribution',
          colors: ['#52c41a', '#faad14', '#ff4d4f'],
          position: { row: 1, col: 0, span: 12 }
        },
        {
          id: 'assessment-types',
          type: 'chart',
          title: 'Assessment Types Trend',
          chartType: 'area',
          dataSource: 'doctor.assessments.typesTrend',
          apiEndpoint: '/api/doctor/assessments/types-trend',
          xAxis: 'month',
          yAxis: ['routine', 'followup', 'urgent'],
          colors: ['#1677ff', '#52c41a', '#ff4d4f'],
          position: { row: 1, col: 1, span: 12 }
        }
      ]
    },
    {
      id: 'patients',
      name: 'Patient Insights',
      description: 'Patient demographics and health trends',
      icon: 'HeartOutlined',
      permissions: ['doctor'],
      widgets: [
        {
          id: 'patient-demographics',
          type: 'chart',
          title: 'Patient Age Demographics',
          chartType: 'bar',
          dataSource: 'doctor.patients.demographics',
          apiEndpoint: '/api/doctor/patients/demographics',
          xAxis: 'ageGroup',
          yAxis: ['count'],
          colors: ['#1677ff'],
          position: { row: 0, col: 0, span: 12 }
        },
        {
          id: 'health-conditions',
          type: 'chart',
          title: 'Common Health Conditions',
          chartType: 'pie',
          dataSource: 'doctor.patients.conditions',
          apiEndpoint: '/api/doctor/patients/conditions',
          colors: ['#1677ff', '#52c41a', '#faad14', '#722ed1', '#13c2c2'],
          position: { row: 0, col: 1, span: 12 }
        },
        {
          id: 'patient-outcomes',
          type: 'chart',
          title: 'Patient Health Outcomes',
          chartType: 'line',
          dataSource: 'doctor.patients.outcomes',
          apiEndpoint: '/api/doctor/patients/outcomes',
          xAxis: 'month',
          yAxis: ['improved', 'stable', 'declined'],
          colors: ['#52c41a', '#faad14', '#ff4d4f'],
          position: { row: 1, col: 0, span: 24 }
        }
      ]
    }
  ],
  metadata: {
    version: '1.0',
    createdBy: 'doctor',
    lastModified: '2024-01-15T10:30:00Z',
    environment: 'production'
  },
  globalFilters: [
    {
      id: 'dateRange',
      type: 'dateRange',
      label: 'Date Range',
      defaultValue: 'last30days',
      required: true
    }
  ]
};

// Mock data sources for doctor reports
const mockDoctorDataSources = {
  doctor: {
    patients: {
      total: 156,
      demographics: [
        { ageGroup: '0-18', count: 25 },
        { ageGroup: '19-35', count: 45 },
        { ageGroup: '36-50', count: 38 },
        { ageGroup: '51-65', count: 32 },
        { ageGroup: '65+', count: 16 }
      ],
      conditions: [
        { name: 'Hypertension', value: 35 },
        { name: 'Diabetes', value: 28 },
        { name: 'Asthma', value: 22 },
        { name: 'Arthritis', value: 18 },
        { name: 'Other', value: 53 }
      ],
      outcomes: [
        { month: 'Jan', improved: 8, stable: 12, declined: 2 },
        { month: 'Feb', improved: 12, stable: 14, declined: 1 },
        { month: 'Mar', improved: 15, stable: 10, declined: 3 },
        { month: 'Apr', improved: 18, stable: 8, declined: 2 }
      ]
    },
    appointments: {
      monthly: 87,
      completionRate: 95.2
    },
    rating: {
      average: 4.8
    },
    performance: {
      monthly: [
        { month: 'Jan', appointments: 22, completed: 21 },
        { month: 'Feb', appointments: 28, completed: 26 },
        { month: 'Mar', appointments: 31, completed: 30 },
        { month: 'Apr', appointments: 29, completed: 28 }
      ]
    },
    satisfaction: {
      trend: [
        { month: 'Jan', rating: 4.6 },
        { month: 'Feb', rating: 4.7 },
        { month: 'Mar', rating: 4.8 },
        { month: 'Apr', rating: 4.9 }
      ]
    },
    assessments: {
      total: 45,
      completed: 38,
      averageScore: 7.2,
      overdueFollowups: 3,
      scoreDistribution: [
        { name: 'Excellent (8-10)', value: 18 },
        { name: 'Good (6-7)', value: 20 },
        { name: 'Poor (1-5)', value: 7 }
      ],
      typesTrend: [
        { month: 'Jan', routine: 8, followup: 5, urgent: 2 },
        { month: 'Feb', routine: 12, followup: 7, urgent: 1 },
        { month: 'Mar', routine: 10, followup: 8, urgent: 3 },
        { month: 'Apr', routine: 8, followup: 6, urgent: 1 }
      ]
    }
  }
};

const DoctorReportsPage = () => {
  const [dashboardConfig, setDashboardConfig] = useState(doctorDashboardConfig);
  const [activeDashboard, setActiveDashboard] = useState('performance');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState(null);
  const [editingWidget, setEditingWidget] = useState(null);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [dataCache, setDataCache] = useState(new Map());
  const [loadingStates, setLoadingStates] = useState(new Map());

  // Global filters state
  const [currentFilters, setCurrentFilters] = useState({
    dateRange: [dayjs().subtract(6, 'month'), dayjs()]
  });

  const [dashboardForm] = Form.useForm();
  const [widgetForm] = Form.useForm();

  // Mock current doctor
  const [currentDoctor] = useState({ 
    id: 'DR001', 
    name: 'Dr. Sarah Wilson',
    specialization: 'General Medicine' 
  });

  // Chart type options
  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: <BarChartOutlined /> },
    { value: 'line', label: 'Line Chart', icon: <LineChartOutlined /> },
    { value: 'pie', label: 'Pie Chart', icon: <PieChartOutlined /> },
    { value: 'area', label: 'Area Chart', icon: <AreaChartOutlined /> }
  ];

  const iconOptions = [
    { value: 'UserOutlined', label: 'User' },
    { value: 'CalendarOutlined', label: 'Calendar' },
    { value: 'FileTextOutlined', label: 'File Text' },
    { value: 'TrophyOutlined', label: 'Trophy' },
    { value: 'StarOutlined', label: 'Star' },
    { value: 'HeartOutlined', label: 'Heart' },
    { value: 'CheckCircleOutlined', label: 'Check Circle' },
    { value: 'ClockCircleOutlined', label: 'Clock' }
  ];

  // Data fetching functions
  const getDataFromSourceSync = (dataSourcePath) => {
    const keys = dataSourcePath.split('.');
    let data = mockDoctorDataSources;
    for (const key of keys) {
      data = data[key];
      if (!data) return null;
    }
    return data;
  };

  const getDataFromSource = async (dataSourcePath, widget, forceRefresh = false) => {
    const cacheKey = `${dataSourcePath}_${JSON.stringify(currentFilters)}`;
    const cachedData = dataCache.get(cacheKey);
    
    if (!forceRefresh && cachedData) {
      return cachedData.data;
    }

    setLoadingStates(prev => new Map(prev.set(widget?.id || dataSourcePath, true)));

    try {
      let data;
      if (widget?.apiEndpoint) {
        // Real API call would go here
        // For now, simulate API delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        data = getDataFromSourceSync(dataSourcePath);
      } else {
        data = getDataFromSourceSync(dataSourcePath);
      }

      setDataCache(prev => new Map(prev.set(cacheKey, {
        data,
        timestamp: Date.now()
      })));

      return data;
    } catch (error) {
      console.error(`Error fetching data for ${dataSourcePath}:`, error);
      message.error(`Failed to load data for ${widget?.title || dataSourcePath}`);
      return null;
    } finally {
      setLoadingStates(prev => {
        const newMap = new Map(prev);
        newMap.delete(widget?.id || dataSourcePath);
        return newMap;
      });
    }
  };

  // Format value based on format type
  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      case 'number':
        return value.toLocaleString();
      case 'rating':
        return `${value}/5`;
      case 'score':
        return `${value}/10`;
      default:
        return value;
    }
  };

  // Generate chart options based on widget config
  const generateChartOption = (widget) => {
    const data = getDataFromSourceSync(widget.dataSource);
    if (!data) return {};

    const baseOption = {
      title: { text: widget.title, left: 'center' },
      tooltip: { trigger: widget.chartType === 'pie' ? 'item' : 'axis' },
      legend: { top: 30 },
      responsive: true
    };

    switch (widget.chartType) {
      case 'bar':
      case 'line':
        return {
          ...baseOption,
          xAxis: {
            type: 'category',
            data: data.map(item => item[widget.xAxis])
          },
          yAxis: { type: 'value' },
          series: widget.yAxis.map((key, index) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            type: widget.chartType,
            data: data.map(item => item[key]),
            itemStyle: { color: widget.colors[index] || '#1677ff' }
          }))
        };

      case 'pie':
        return {
          ...baseOption,
          series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            data: data.map((item, index) => ({
              value: item.value,
              name: item.name,
              itemStyle: { color: widget.colors[index] || '#1677ff' }
            }))
          }]
        };

      case 'area':
        return {
          ...baseOption,
          xAxis: {
            type: 'category',
            data: data.map(item => item[widget.xAxis])
          },
          yAxis: { type: 'value' },
          series: widget.yAxis.map((key, index) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            type: 'line',
            data: data.map(item => item[key]),
            areaStyle: { opacity: 0.3 },
            itemStyle: { color: widget.colors[index] || '#1677ff' }
          }))
        };

      default:
        return baseOption;
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setCurrentFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setDataCache(new Map());
  };

  // Dashboard actions
  const handleCreateDashboard = () => {
    setEditingDashboard(null);
    dashboardForm.resetFields();
    setIsConfigModalOpen(true);
  };

  const handleEditDashboard = (dashboard) => {
    setEditingDashboard(dashboard);
    dashboardForm.setFieldsValue(dashboard);
    setIsConfigModalOpen(true);
  };

  const handleDeleteDashboard = (dashboardId) => {
    const newConfig = {
      ...dashboardConfig,
      dashboards: dashboardConfig.dashboards.filter(d => d.id !== dashboardId)
    };
    setDashboardConfig(newConfig);
    if (activeDashboard === dashboardId) {
      setActiveDashboard(newConfig.dashboards[0]?.id || '');
    }
    message.success('Dashboard deleted successfully');
  };

  const handleSaveDashboard = async (values) => {
    try {
      const newDashboard = {
        id: editingDashboard?.id || `dashboard-${Date.now()}`,
        name: values.name,
        description: values.description,
        icon: values.icon,
        permissions: ['doctor'],
        widgets: editingDashboard?.widgets || []
      };

      let newDashboards;
      if (editingDashboard) {
        newDashboards = dashboardConfig.dashboards.map(d => 
          d.id === editingDashboard.id ? newDashboard : d
        );
      } else {
        newDashboards = [...dashboardConfig.dashboards, newDashboard];
      }

      setDashboardConfig({
        ...dashboardConfig,
        dashboards: newDashboards
      });

      setIsConfigModalOpen(false);
      message.success(`Dashboard ${editingDashboard ? 'updated' : 'created'} successfully`);
    } catch (error) {
      message.error('Failed to save dashboard');
    }
  };

  // Widget actions
  const handleCreateWidget = () => {
    setEditingWidget(null);
    widgetForm.resetFields();
    setIsWidgetModalOpen(true);
  };

  const handleEditWidget = (widget) => {
    setEditingWidget(widget);
    widgetForm.setFieldsValue({
      ...widget,
      yAxis: widget.yAxis?.join(','),
      colors: widget.colors?.join(',')
    });
    setIsWidgetModalOpen(true);
  };

  const handleDeleteWidget = (widgetId) => {
    const currentDashboard = dashboardConfig.dashboards.find(d => d.id === activeDashboard);
    const updatedWidgets = currentDashboard.widgets.filter(w => w.id !== widgetId);
    
    const updatedDashboards = dashboardConfig.dashboards.map(d => 
      d.id === activeDashboard 
        ? { ...d, widgets: updatedWidgets }
        : d
    );

    setDashboardConfig({
      ...dashboardConfig,
      dashboards: updatedDashboards
    });

    message.success('Widget deleted successfully');
  };

  const handleSaveWidget = async (values) => {
    try {
      const newWidget = {
        id: editingWidget?.id || `widget-${Date.now()}`,
        type: values.type,
        title: values.title,
        chartType: values.chartType,
        dataSource: values.dataSource,
        xAxis: values.xAxis,
        yAxis: values.yAxis?.split(',').map(s => s.trim()),
        colors: values.colors?.split(',').map(s => s.trim()),
        format: values.format,
        icon: values.icon,
        color: values.color,
        position: editingWidget?.position || { row: 0, col: 0, span: 12 }
      };

      const currentDashboard = dashboardConfig.dashboards.find(d => d.id === activeDashboard);
      let updatedWidgets;
      
      if (editingWidget) {
        updatedWidgets = currentDashboard.widgets.map(w => 
          w.id === editingWidget.id ? newWidget : w
        );
      } else {
        updatedWidgets = [...currentDashboard.widgets, newWidget];
      }

      const updatedDashboards = dashboardConfig.dashboards.map(d => 
        d.id === activeDashboard 
          ? { ...d, widgets: updatedWidgets }
          : d
      );

      setDashboardConfig({
        ...dashboardConfig,
        dashboards: updatedDashboards
      });

      setIsWidgetModalOpen(false);
      message.success(`Widget ${editingWidget ? 'updated' : 'created'} successfully`);
    } catch (error) {
      message.error('Failed to save widget');
    }
  };

  // Render widget based on type
  const renderWidget = (widget) => {
    const isLoading = loadingStates.get(widget.id);
    
    switch (widget.type) {
      case 'kpi':
        const kpiValue = getDataFromSourceSync(widget.dataSource);
        return (
          <Card key={widget.id} className="h-full" loading={isLoading}>
            <Statistic
              title={widget.title}
              value={kpiValue}
              formatter={(value) => formatValue(value, widget.format)}
              valueStyle={{ color: widget.color }}
              prefix={getIconComponent(widget.icon)}
            />
          </Card>
        );

      case 'chart':
        const chartOption = generateChartOption(widget);
        return (
          <Card 
            key={widget.id} 
            title={widget.title}
            className="h-full"
            loading={isLoading}
            extra={
              <Space>
                <Dropdown
                  menu={{
                    items: [
                      { key: 'refresh', icon: <ReloadOutlined />, label: 'Refresh', onClick: () => getDataFromSource(widget.dataSource, widget, true) },
                      { key: 'edit', icon: <EditOutlined />, label: 'Edit Widget', onClick: () => handleEditWidget(widget) },
                      { key: 'delete', icon: <DeleteOutlined />, label: 'Delete Widget', onClick: () => handleDeleteWidget(widget.id) }
                    ]
                  }}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </Space>
            }
          >
            <ReactECharts 
              option={chartOption} 
              style={{ height: '300px' }}
            />
          </Card>
        );

      default:
        return null;
    }
  };

  // Helper function to get icon component
  const getIconComponent = (iconName) => {
    const iconMap = {
      UserOutlined: <UserOutlined />,
      CalendarOutlined: <CalendarOutlined />,
      FileTextOutlined: <FileTextOutlined />,
      TrophyOutlined: <TrophyOutlined />,
      StarOutlined: <StarOutlined />,
      HeartOutlined: <HeartOutlined />,
      CheckCircleOutlined: <CheckCircleOutlined />,
      ClockCircleOutlined: <ClockCircleOutlined />,
      DollarOutlined: <DollarOutlined />,
      BarChartOutlined: <BarChartOutlined />
    };
    return iconMap[iconName] || <BarChartOutlined />;
  };

  // Get current dashboard
  const currentDashboard = dashboardConfig.dashboards.find(d => d.id === activeDashboard);

  // Generate tab items
  const tabItems = dashboardConfig.dashboards.map(dashboard => ({
    key: dashboard.id,
    label: (
      <span>
        {getIconComponent(dashboard.icon)}
        {dashboard.name}
      </span>
    ),
    children: (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Text type="secondary">{dashboard.description}</Text>
          </div>
          <Space>
            <Button 
              icon={<PlusOutlined />} 
              onClick={handleCreateWidget}
            >
              Add Widget
            </Button>
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleEditDashboard(dashboard)}
            >
              Edit Dashboard
            </Button>
            <Popconfirm
              title="Delete Dashboard"
              description="Are you sure you want to delete this dashboard?"
              onConfirm={() => handleDeleteDashboard(dashboard.id)}
            >
              <Button 
                icon={<DeleteOutlined />}
                danger
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </div>

        <Row gutter={[16, 16]}>
          {dashboard.widgets.map(widget => (
            <Col 
              key={widget.id}
              xs={24} 
              sm={12} 
              lg={widget.position?.span || 12}
            >
              {renderWidget(widget)}
            </Col>
          ))}
          
          {dashboard.widgets.length === 0 && (
            <Col span={24}>
              <Card className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <DashboardOutlined style={{ fontSize: '48px' }} />
                </div>
                <Title level={4} type="secondary">No widgets yet</Title>
                <Text type="secondary">Add your first widget to get started</Text>
                <br />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  className="mt-4"
                  onClick={handleCreateWidget}
                >
                  Add Widget
                </Button>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    )
  }));

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Analytics & Reports</h1>
          <p className="text-gray-500">Comprehensive analytics and performance insights powered by JSON-driven dashboards</p>
        </div>
        
        <Space wrap>
          <RangePicker
            value={currentFilters.dateRange}
            onChange={(dates) => handleFilterChange('dateRange', dates)}
            format="MMM DD, YYYY"
            placeholder={['Start Date', 'End Date']}
          />
          <Button
            icon={<ReloadOutlined />}
            type={autoRefreshEnabled ? 'primary' : 'default'}
            onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
          >
            Auto-Refresh
          </Button>
          <Button
            icon={<SettingOutlined />}
            onClick={() => setConfigDrawerOpen(true)}
          >
            Configure
          </Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={handleCreateDashboard}
          >
            New Dashboard
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => console.log('Export doctor reports...', dashboardConfig)}
          >
            Export
          </Button>
        </Space>
      </div>

      {/* Enhanced Info Alert */}
      <Alert
        message="Advanced Doctor Analytics Dashboard"
        description={
          <div>
            <p>This is a fully functional JSON-driven dashboard system specifically designed for doctors. Features include:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Real-time KPIs:</strong> Patient counts, completion rates, ratings, and assessment metrics</li>
              <li><strong>Interactive Charts:</strong> Performance trends, satisfaction metrics, and patient insights</li>
              <li><strong>Customizable Widgets:</strong> Add, edit, and configure dashboard components</li>
              <li><strong>Multiple Dashboard Views:</strong> Performance, assessments, and patient insights</li>
              <li><strong>Data Integration Ready:</strong> Built with API endpoints for real backend integration</li>
              <li><strong>Role-based Access:</strong> Doctor-specific permissions and data filtering</li>
            </ul>
          </div>
        }
        type="info"
        showIcon
        icon={<DashboardOutlined />}
        action={
          <Button size="small" onClick={() => setConfigDrawerOpen(true)}>
            Explore Configuration
          </Button>
        }
      />

      {/* Dashboard Tabs */}
      <Card className="shadow-sm">
        <Tabs
          activeKey={activeDashboard}
          onChange={setActiveDashboard}
          items={tabItems}
          size="large"
          type="editable-card"
          hideAdd
        />
      </Card>

      {/* Dashboard Configuration Modal */}
      <Modal
        title={`${editingDashboard ? 'Edit' : 'Create'} Dashboard`}
        open={isConfigModalOpen}
        onCancel={() => setIsConfigModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={dashboardForm}
          layout="vertical"
          onFinish={handleSaveDashboard}
        >
          <Form.Item
            name="name"
            label="Dashboard Name"
            rules={[{ required: true, message: 'Please enter dashboard name' }]}
          >
            <Input placeholder="Enter dashboard name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={3} placeholder="Enter dashboard description" />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Icon"
            rules={[{ required: true, message: 'Please select an icon' }]}
          >
            <Select placeholder="Select icon">
              {iconOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsConfigModalOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingDashboard ? 'Update' : 'Create'} Dashboard
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Widget Configuration Modal */}
      <Modal
        title={`${editingWidget ? 'Edit' : 'Create'} Widget`}
        open={isWidgetModalOpen}
        onCancel={() => setIsWidgetModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form
          form={widgetForm}
          layout="vertical"
          onFinish={handleSaveWidget}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Widget Title"
                rules={[{ required: true, message: 'Please enter widget title' }]}
              >
                <Input placeholder="Enter widget title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Widget Type"
                rules={[{ required: true, message: 'Please select widget type' }]}
              >
                <Select placeholder="Select widget type">
                  <Option value="kpi">KPI Card</Option>
                  <Option value="chart">Chart</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="dataSource"
            label="Data Source"
            rules={[{ required: true, message: 'Please enter data source path' }]}
          >
            <Input placeholder="e.g., doctor.patients.total or doctor.performance.monthly" />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
            {({ getFieldValue }) => {
              const widgetType = getFieldValue('type');
              
              if (widgetType === 'chart') {
                return (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="chartType"
                          label="Chart Type"
                          rules={[{ required: true, message: 'Please select chart type' }]}
                        >
                          <Select placeholder="Select chart type">
                            {chartTypes.map(type => (
                              <Option key={type.value} value={type.value}>
                                {type.icon} {type.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="xAxis"
                          label="X-Axis Field"
                          rules={[{ required: true, message: 'Please enter X-axis field' }]}
                        >
                          <Input placeholder="e.g., month, day" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="yAxis"
                      label="Y-Axis Fields (comma separated)"
                      rules={[{ required: true, message: 'Please enter Y-axis fields' }]}
                    >
                      <Input placeholder="e.g., appointments, completed, rating" />
                    </Form.Item>

                    <Form.Item
                      name="colors"
                      label="Colors (comma separated)"
                    >
                      <Input placeholder="e.g., #1677ff, #52c41a, #faad14" />
                    </Form.Item>
                  </>
                );
              }

              if (widgetType === 'kpi') {
                return (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="format"
                          label="Value Format"
                          rules={[{ required: true, message: 'Please select format' }]}
                        >
                          <Select placeholder="Select format">
                            <Option value="number">Number</Option>
                            <Option value="currency">Currency</Option>
                            <Option value="percentage">Percentage</Option>
                            <Option value="rating">Rating</Option>
                            <Option value="score">Score</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="icon"
                          label="Icon"
                        >
                          <Select placeholder="Select icon">
                            {iconOptions.map(option => (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="color"
                      label="Color"
                    >
                      <Input placeholder="#1677ff" />
                    </Form.Item>
                  </>
                );
              }

              return null;
            }}
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsWidgetModalOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingWidget ? 'Update' : 'Create'} Widget
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Configuration Drawer */}
      <Drawer
        title="Doctor Dashboard Configuration"
        placement="right"
        size="large"
        open={configDrawerOpen}
        onClose={() => setConfigDrawerOpen(false)}
      >
        <div className="space-y-6">
          <div>
            <Title level={4}>Dashboard System Features</Title>
            <Text type="secondary">
              Advanced analytics platform designed specifically for healthcare professionals
            </Text>
            
            <div className="mt-4 space-y-3">
              <div className="p-4 border rounded-lg">
                <Text strong>Doctor-Specific Analytics</Text>
                <div className="mt-2 space-y-2">
                  <div>• Personal patient statistics and outcomes</div>
                  <div>• Assessment scoring and trend analysis</div>
                  <div>• Patient satisfaction and rating metrics</div>
                  <div>• Appointment completion and performance data</div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <Text strong>API Integration Ready</Text>
                <div className="mt-2 text-sm">
                  <div>• <code>GET /api/doctor/patients/count</code> - Total patient count</div>
                  <div>• <code>GET /api/doctor/appointments/monthly</code> - Monthly appointments</div>
                  <div>• <code>GET /api/doctor/assessments/count</code> - Assessment statistics</div>
                  <div>• <code>GET /api/doctor/performance/monthly</code> - Performance metrics</div>
                  <div>• <code>GET /api/doctor/satisfaction/trend</code> - Patient satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Title level={4}>JSON Configuration</Title>
            <Text type="secondary">
              Export, import, or modify dashboard configurations
            </Text>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(dashboardConfig, null, 2)}
            </pre>
          </div>

          <div className="space-y-3">
            <div>
              <Text strong>Export Configuration</Text>
              <div className="mt-2">
                <Space>
                  <Button 
                    icon={<CopyOutlined />}
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(dashboardConfig, null, 2));
                      message.success('Configuration copied to clipboard');
                    }}
                  >
                    Copy JSON
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />}
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(dashboardConfig, null, 2)], 
                        { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `doctor-dashboard-config-${dayjs().format('YYYY-MM-DD')}.json`;
                      a.click();
                    }}
                  >
                    Download JSON
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DoctorReportsPage;
