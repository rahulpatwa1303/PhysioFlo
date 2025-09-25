"use client";

import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Space, 
  Button,
  Statistic,
  Typography,
  Tabs,
  Modal,
  Form,
  Input,
  message,
  Dropdown,
  Popconfirm,
  Switch,
  InputNumber,
  ColorPicker,
  Drawer
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  PrinterOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  DashboardOutlined,
  AreaChartOutlined,
  DotChartOutlined,
  SettingOutlined,
  EyeOutlined,
  CopyOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

// Backend-ready dashboard configuration structure
// This will be loaded from: GET /api/dashboards or GET /api/reports/config
const defaultDashboardConfig = {
  dashboards: [
    {
      id: 'overview',
      name: 'Business Overview',
      description: 'Key business metrics and financial overview',
      icon: 'BarChartOutlined',
      permissions: ['admin', 'manager'], // Role-based access
      refreshInterval: 300, // Auto-refresh every 5 minutes
      widgets: [
        {
          id: 'revenue-kpi',
          type: 'kpi',
          title: 'Total Revenue',
          dataSource: 'revenue.total',
          apiEndpoint: '/api/analytics/revenue/total', // Direct API mapping
          format: 'currency',
          icon: 'DollarOutlined',
          color: '#1677ff',
          position: { row: 0, col: 0, span: 6 },
          filters: ['dateRange'], // Dynamic filters
          cacheDuration: 600 // Cache for 10 minutes
        },
        {
          id: 'patients-kpi',
          type: 'kpi',
          title: 'Total Patients',
          dataSource: 'patients.total',
          apiEndpoint: '/api/analytics/patients/count',
          format: 'number',
          icon: 'UserOutlined',
          color: '#52c41a',
          position: { row: 0, col: 1, span: 6 },
          filters: ['dateRange', 'status'],
          realTime: true // Real-time updates via WebSocket
        },
        {
          id: 'revenue-chart',
          type: 'chart',
          title: 'Revenue Trend',
          chartType: 'line',
          dataSource: 'revenue.monthly',
          apiEndpoint: '/api/analytics/revenue/trend',
          xAxis: 'month',
          yAxis: ['revenue', 'profit'],
          colors: ['#1677ff', '#52c41a'],
          position: { row: 1, col: 0, span: 12 },
          filters: ['dateRange', 'location'],
          drillDown: true, // Enable drill-down functionality
          export: ['pdf', 'excel', 'png'] // Export options
        },
        {
          id: 'service-pie',
          type: 'chart',
          title: 'Service Distribution',
          chartType: 'pie',
          dataSource: 'services.distribution',
          apiEndpoint: '/api/analytics/services/distribution',
          colors: ['#1677ff', '#52c41a', '#faad14', '#f759ab', '#13c2c2'],
          position: { row: 1, col: 1, span: 12 },
          interactive: true, // Click interactions
          filters: ['dateRange', 'department']
        }
      ]
    },
    {
      id: 'appointments',
      name: 'Appointments Analytics',
      description: 'Appointment trends and scheduling insights',
      icon: 'CalendarOutlined',
      permissions: ['admin', 'doctor', 'nurse'],
      widgets: [
        {
          id: 'daily-appointments',
          type: 'chart',
          title: 'Daily Appointment Trends',
          chartType: 'bar',
          dataSource: 'appointments.daily',
          apiEndpoint: '/api/analytics/appointments/daily',
          xAxis: 'day',
          yAxis: ['scheduled', 'completed', 'cancelled'],
          colors: ['#1677ff', '#52c41a', '#ff4d4f'],
          position: { row: 0, col: 0, span: 24 },
          filters: ['dateRange', 'doctor', 'department'],
          alerts: { // Auto-alerts for thresholds
            cancelationRate: { threshold: 20, type: 'warning' }
          }
        },
        {
          id: 'completion-rate',
          type: 'chart',
          title: 'Completion Rate Trend',
          chartType: 'line',
          dataSource: 'appointments.completion',
          apiEndpoint: '/api/analytics/appointments/completion',
          xAxis: 'week',
          yAxis: ['rate'],
          colors: ['#722ed1'],
          position: { row: 1, col: 0, span: 12 },
          targets: { rate: 95 }, // Performance targets
          filters: ['dateRange', 'doctor']
        }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Performance',
      description: 'Detailed financial analysis and billing insights',
      icon: 'DollarOutlined',
      permissions: ['admin', 'finance'],
      widgets: [
        {
          id: 'profit-margin',
          type: 'kpi',
          title: 'Profit Margin',
          dataSource: 'financial.profitMargin',
          apiEndpoint: '/api/analytics/financial/profit-margin',
          format: 'percentage',
          icon: 'DollarOutlined',
          color: '#52c41a',
          position: { row: 0, col: 0, span: 6 },
          benchmark: 65, // Industry benchmark
          filters: ['dateRange', 'location']
        },
        {
          id: 'financial-overview',
          type: 'chart',
          title: 'Financial Overview',
          chartType: 'bar',
          dataSource: 'financial.overview',
          apiEndpoint: '/api/analytics/financial/overview',
          xAxis: 'month',
          yAxis: ['revenue', 'expenses', 'profit'],
          colors: ['#1677ff', '#ff4d4f', '#52c41a'],
          position: { row: 1, col: 0, span: 24 },
          filters: ['dateRange', 'category'],
          predictions: true // AI-powered predictions
        }
      ]
    }
  ],
  // Global configuration
  metadata: {
    version: '2.0',
    createdBy: 'admin',
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
    },
    {
      id: 'location',
      type: 'select',
      label: 'Location',
      apiEndpoint: '/api/locations',
      multiple: true
    },
    {
      id: 'department',
      type: 'select',
      label: 'Department',
      apiEndpoint: '/api/departments'
    }
  ],
  themes: {
    default: 'light',
    available: ['light', 'dark', 'blue']
  }
};

// Mock data sources
const mockDataSources = {
  revenue: {
    total: 87650,
    monthly: [
      { month: 'Jan', revenue: 8500, profit: 5300, expenses: 3200 },
      { month: 'Feb', revenue: 9200, profit: 5800, expenses: 3400 },
      { month: 'Mar', revenue: 11500, profit: 7400, expenses: 4100 },
      { month: 'Apr', revenue: 13200, profit: 8400, expenses: 4800 },
      { month: 'May', revenue: 15750, profit: 10550, expenses: 5200 },
      { month: 'Jun', revenue: 17200, profit: 11600, expenses: 5600 }
    ]
  },
  patients: {
    total: 1247,
    monthly: [
      { month: 'Jan', newPatients: 65, totalPatients: 890 },
      { month: 'Feb', newPatients: 72, totalPatients: 962 },
      { month: 'Mar', newPatients: 89, totalPatients: 1051 },
      { month: 'Apr', newPatients: 95, totalPatients: 1146 },
      { month: 'May', newPatients: 108, totalPatients: 1254 },
      { month: 'Jun', newPatients: 115, totalPatients: 1369 }
    ]
  },
  services: {
    distribution: [
      { name: 'Consultation', value: 35, revenue: 6300 },
      { name: 'Treatment', value: 25, revenue: 4500 },
      { name: 'Surgery', value: 20, revenue: 3600 },
      { name: 'Follow-up', value: 15, revenue: 2700 },
      { name: 'Emergency', value: 5, revenue: 900 }
    ]
  },
  appointments: {
    daily: [
      { day: 'Monday', scheduled: 45, completed: 42, cancelled: 3 },
      { day: 'Tuesday', scheduled: 52, completed: 48, cancelled: 4 },
      { day: 'Wednesday', scheduled: 48, completed: 45, cancelled: 3 },
      { day: 'Thursday', scheduled: 41, completed: 38, cancelled: 3 },
      { day: 'Friday', scheduled: 38, completed: 35, cancelled: 3 },
      { day: 'Saturday', scheduled: 25, completed: 23, cancelled: 2 },
      { day: 'Sunday', scheduled: 15, completed: 14, cancelled: 1 }
    ],
    completion: [
      { week: 'Week 1', rate: 93.2 },
      { week: 'Week 2', rate: 92.8 },
      { week: 'Week 3', rate: 94.5 },
      { week: 'Week 4', rate: 91.7 }
    ]
  },
  financial: {
    profitMargin: 67.8,
    overview: [
      { month: 'Jan', revenue: 8500, expenses: 3200, profit: 5300 },
      { month: 'Feb', revenue: 9200, expenses: 3400, profit: 5800 },
      { month: 'Mar', revenue: 11500, expenses: 4100, profit: 7400 },
      { month: 'Apr', revenue: 13200, expenses: 4800, profit: 8400 },
      { month: 'May', revenue: 15750, expenses: 5200, profit: 10550 },
      { month: 'Jun', revenue: 17200, expenses: 5600, profit: 11600 }
    ]
  }
};

const ReportsPage = () => {
  const [dashboardConfig, setDashboardConfig] = useState(defaultDashboardConfig);
  const [activeDashboard, setActiveDashboard] = useState('overview');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState(null);
  const [editingWidget, setEditingWidget] = useState(null);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  
  // Global filters state
  const [currentFilters, setCurrentFilters] = useState({
    dateRange: [dayjs().subtract(6, 'month'), dayjs()],
    location: null,
    department: null
  });
  
  // Auto-refresh functionality
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);
  
  const [dashboardForm] = Form.useForm();
  const [widgetForm] = Form.useForm();

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefreshEnabled) {
      const currentDashboard = dashboardConfig.dashboards.find(d => d.id === activeDashboard);
      const interval = (currentDashboard?.refreshInterval || 300) * 1000; // Convert to milliseconds
      
      const intervalId = setInterval(() => {
        // Refresh all widgets in current dashboard
        currentDashboard?.widgets.forEach(widget => {
          if (widget.realTime || widget.refreshInterval) {
            getDataFromSource(widget.dataSource, widget, true); // Force refresh
          }
        });
      }, interval);
      
      setRefreshInterval(intervalId);
      
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [activeDashboard, autoRefreshEnabled, dashboardConfig]);

  // Load dashboard configuration from backend
  useEffect(() => {
    const loadDashboardConfig = async () => {
      try {
        // In real implementation, load from API:
        // const response = await fetch('/api/dashboards/config');
        // const config = await response.json();
        // setDashboardConfig(config);
        
        // For now, using default config
        setDashboardConfig(defaultDashboardConfig);
      } catch (error) {
        console.error('Failed to load dashboard configuration:', error);
        message.error('Failed to load dashboard configuration');
      }
    };

    loadDashboardConfig();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setCurrentFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    
    // Clear cache when filters change
    setDataCache(new Map());
  };
  // Chart type options
  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: <BarChartOutlined /> },
    { value: 'line', label: 'Line Chart', icon: <LineChartOutlined /> },
    { value: 'pie', label: 'Pie Chart', icon: <PieChartOutlined /> },
    { value: 'area', label: 'Area Chart', icon: <AreaChartOutlined /> },
    { value: 'scatter', label: 'Scatter Plot', icon: <DotChartOutlined /> }
  ];

  const iconOptions = [
    { value: 'BarChartOutlined', label: 'Bar Chart' },
    { value: 'CalendarOutlined', label: 'Calendar' },
    { value: 'DollarOutlined', label: 'Dollar' },
    { value: 'UserOutlined', label: 'User' },
    { value: 'MedicineBoxOutlined', label: 'Medicine Box' }
  ];

  // Backend-ready data fetching with caching and API integration
  const [dataCache, setDataCache] = useState(new Map());
  const [loadingStates, setLoadingStates] = useState(new Map());

  // Enhanced data fetching function that supports both mock and real APIs
  const getDataFromSource = async (dataSourcePath, widget, forceRefresh = false) => {
    const cacheKey = `${dataSourcePath}_${JSON.stringify(currentFilters)}`;
    
    // Check cache first (unless force refresh)
    if (!forceRefresh && dataCache.has(cacheKey)) {
      const cachedData = dataCache.get(cacheKey);
      const now = Date.now();
      const cacheAge = now - cachedData.timestamp;
      const maxAge = (widget?.cacheDuration || 300) * 1000; // Default 5 minutes
      
      if (cacheAge < maxAge) {
        return cachedData.data;
      }
    }

    // Set loading state
    setLoadingStates(prev => new Map(prev.set(widget?.id || dataSourcePath, true)));

    try {
      let data;
      
      if (widget?.apiEndpoint) {
        // Real API call
        const params = new URLSearchParams();
        
        // Add global filters to API call
        if (currentFilters.dateRange) {
          params.append('startDate', currentFilters.dateRange[0].format('YYYY-MM-DD'));
          params.append('endDate', currentFilters.dateRange[1].format('YYYY-MM-DD'));
        }
        
        // Add widget-specific filters
        widget.filters?.forEach(filterKey => {
          if (currentFilters[filterKey]) {
            params.append(filterKey, currentFilters[filterKey]);
          }
        });

        const response = await fetch(`${widget.apiEndpoint}?${params}`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        data = await response.json();
      } else {
        // Fallback to mock data (for development)
        const keys = dataSourcePath.split('.');
        data = mockDataSources;
        for (const key of keys) {
          data = data[key];
          if (!data) return null;
        }
      }

      // Cache the result
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
      // Clear loading state
      setLoadingStates(prev => {
        const newMap = new Map(prev);
        newMap.delete(widget?.id || dataSourcePath);
        return newMap;
      });
    }
  };

  // Enhanced sync version for immediate rendering (uses cache)
  const getDataFromSourceSync = (dataSourcePath) => {
    const cacheKey = `${dataSourcePath}_${JSON.stringify(currentFilters)}`;
    const cachedData = dataCache.get(cacheKey);
    
    if (cachedData) {
      return cachedData.data;
    }

    // Fallback to mock data for immediate rendering
    const keys = dataSourcePath.split('.');
    let data = mockDataSources;
    for (const key of keys) {
      data = data[key];
      if (!data) return null;
    }
    return data;
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

  // Handle dashboard actions
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

  // Handle widget actions
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

  // Render widget based on type with loading states
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
              prefix={widget.icon === 'DollarOutlined' ? <DollarOutlined /> : <UserOutlined />}
            />
            {widget.benchmark && (
              <div className="mt-2 text-sm text-gray-500">
                Target: {formatValue(widget.benchmark, widget.format)}
              </div>
            )}
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
                {widget.export && (
                  <Dropdown
                    menu={{
                      items: [
                        { key: 'png', label: 'Export as PNG' },
                        { key: 'pdf', label: 'Export as PDF' },
                        { key: 'excel', label: 'Export as Excel' }
                      ]
                    }}
                  >
                    <Button type="text" icon={<DownloadOutlined />} />
                  </Dropdown>
                )}
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
            {widget.targets && (
              <div className="mt-2 text-sm text-gray-500">
                {Object.entries(widget.targets).map(([key, value]) => (
                  <span key={key}>Target {key}: {value}% </span>
                ))}
              </div>
            )}
          </Card>
        );

      default:
        return null;
    }
  };

  // Get current dashboard
  const currentDashboard = dashboardConfig.dashboards.find(d => d.id === activeDashboard);

  // Generate tab items
  const tabItems = dashboardConfig.dashboards.map(dashboard => ({
    key: dashboard.id,
    label: (
      <span>
        {dashboard.icon === 'BarChartOutlined' && <BarChartOutlined />}
        {dashboard.icon === 'CalendarOutlined' && <CalendarOutlined />}
        {dashboard.icon === 'DollarOutlined' && <DollarOutlined />}
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
      {/* Header with Global Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Interactive Reports & Analytics</h1>
          <p className="text-gray-500">JSON-driven customizable dashboards and reports</p>
        </div>
        
        <Space wrap>
          {/* Global Date Range Filter */}
          <RangePicker
            value={currentFilters.dateRange}
            onChange={(dates) => handleFilterChange('dateRange', dates)}
            format="MMM DD, YYYY"
            placeholder={['Start Date', 'End Date']}
          />
          
          {/* Additional Global Filters */}
          <Select
            placeholder="Location"
            style={{ width: 150 }}
            value={currentFilters.location}
            onChange={(value) => handleFilterChange('location', value)}
            allowClear
          >
            <Option value="main">Main Clinic</Option>
            <Option value="branch1">Branch 1</Option>
            <Option value="branch2">Branch 2</Option>
          </Select>
          
          <Select
            placeholder="Department"
            style={{ width: 150 }}
            value={currentFilters.department}
            onChange={(value) => handleFilterChange('department', value)}
            allowClear
          >
            <Option value="cardiology">Cardiology</Option>
            <Option value="neurology">Neurology</Option>
            <Option value="pediatrics">Pediatrics</Option>
          </Select>
          
          {/* Auto-refresh toggle */}
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
            onClick={() => console.log('Export dashboard config...', dashboardConfig)}
          >
            Export Config
          </Button>
        </Space>
      </div>

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
            <Input placeholder="e.g., revenue.total or appointments.daily" />
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
                      <Input placeholder="e.g., revenue, profit, expenses" />
                    </Form.Item>

                    <Form.Item
                      name="colors"
                      label="Colors (comma separated)"
                    >
                      <Input placeholder="e.g., #1677ff, #52c41a, #ff4d4f" />
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

      {/* Enhanced Configuration Drawer */}
      <Drawer
        title="Dashboard Configuration & Backend Integration"
        placement="right"
        size="large"
        open={configDrawerOpen}
        onClose={() => setConfigDrawerOpen(false)}
      >
        <div className="space-y-6">
          {/* Backend Configuration Section */}
          <div>
            <Title level={4}>Backend Integration</Title>
            <Text type="secondary">
              Configure how dashboards connect to your backend APIs
            </Text>
            
            <div className="mt-4 space-y-3">
              <div className="p-4 border rounded-lg">
                <Text strong>API Configuration</Text>
                <div className="mt-2 space-y-2">
                  <div>Base URL: <code>/api/analytics</code></div>
                  <div>Authentication: JWT Bearer Token</div>
                  <div>Cache Duration: 5-10 minutes per widget</div>
                  <div>Real-time Updates: WebSocket enabled</div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <Text strong>Expected API Endpoints</Text>
                <div className="mt-2 text-sm">
                  <div>• <code>GET /api/analytics/revenue/total</code> - Total revenue KPI</div>
                  <div>• <code>GET /api/analytics/patients/count</code> - Patient count</div>
                  <div>• <code>GET /api/analytics/appointments/daily</code> - Daily appointment trends</div>
                  <div>• <code>GET /api/dashboards/config</code> - Dashboard configuration</div>
                  <div>• <code>POST /api/dashboards/config</code> - Save configuration</div>
                </div>
              </div>
            </div>
          </div>

          {/* JSON Configuration Section */}
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

          {/* Action Buttons */}
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
                      a.download = `dashboard-config-${dayjs().format('YYYY-MM-DD')}.json`;
                      a.click();
                    }}
                  >
                    Download JSON
                  </Button>
                </Space>
              </div>
            </div>

            <div>
              <Text strong>Import Configuration</Text>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const config = JSON.parse(event.target.result);
                          setDashboardConfig(config);
                          message.success('Configuration imported successfully');
                        } catch (error) {
                          message.error('Invalid JSON configuration file');
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div>
              <Text strong>Backend Sync</Text>
              <div className="mt-2">
                <Space>
                  <Button 
                    type="primary"
                    onClick={() => {
                      // In real implementation:
                      // await fetch('/api/dashboards/config', {
                      //   method: 'POST',
                      //   headers: { 'Content-Type': 'application/json' },
                      //   body: JSON.stringify(dashboardConfig)
                      // });
                      message.success('Configuration saved to backend');
                    }}
                  >
                    Save to Backend
                  </Button>
                  <Button 
                    onClick={() => {
                      // In real implementation:
                      // const response = await fetch('/api/dashboards/config');
                      // const config = await response.json();
                      // setDashboardConfig(config);
                      message.success('Configuration loaded from backend');
                    }}
                  >
                    Load from Backend
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

export default ReportsPage;
