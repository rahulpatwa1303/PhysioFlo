"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Tag,
  Space,
  message,
  Popconfirm,
  Tooltip,
  Tabs
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  TableOutlined,
  ExportOutlined
} from '@ant-design/icons';
import SearchableTable from '@/app/components/common/SearchableTable';
import AppointmentsCalendarView from '@/app/components/appointments/AppointmentsCalendarView';

const AppointmentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('table');
  const [currentDate, setCurrentDate] = useState(null);

  // URL state management utilities
  const encodeUrlState = (state) => {
    try {
      return btoa(JSON.stringify(state));
    } catch (error) {
      console.error('Error encoding URL state:', error);
      return '';
    }
  };

  const decodeUrlState = (encoded) => {
    try {
      return encoded ? JSON.parse(atob(encoded)) : {};
    } catch (error) {
      console.error('Error decoding URL state:', error);
      return {};
    }
  };

  // Update URL with current state
  const updateUrl = (view, date = null) => {
    const params = new URLSearchParams();
    
    // Always set view
    if (view) {
      const viewState = { view };
      params.set('v', encodeUrlState(viewState));
    }

    // Only set date if in calendar view
    if (view === 'calendar' && date) {
      const dateState = { date: date };
      params.set('d', encodeUrlState(dateState));
    }
    // Note: date param is automatically not set when not in calendar view

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { shallow: true });
  };

  // Initialize state from URL on component mount
  useEffect(() => {
    const viewParam = searchParams.get('v');
    const dateParam = searchParams.get('d');
    
    if (viewParam) {
      const viewState = decodeUrlState(viewParam);
      if (viewState.view && ['table', 'calendar'].includes(viewState.view)) {
        setActiveTab(viewState.view);
      }
    }

    if (dateParam) {
      const dateState = decodeUrlState(dateParam);
      if (dateState.date) {
        setCurrentDate(dateState.date);
      }
    }
  }, [searchParams]);

  // Handle tab change
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    
    // If switching to calendar view and we have a current date, include it
    // If switching to table view, don't include date
    updateUrl(newTab, newTab === 'calendar' ? currentDate : null);
  };

  // Handle date change in calendar view
  const handleDateChange = (date) => {
    setCurrentDate(date);
    if (activeTab === 'calendar') {
      updateUrl('calendar', date);
    }
  };

  const [appointmentsData] = useState([
    {
      key: '1',
      id: 'APT001',
      patientName: 'John Smith',
      patientId: 'PT001',
      doctorName: 'Dr. Sarah Wilson',
      doctorId: 'DR001',
      appointmentDate: '2024-01-15',
      appointmentTime: '09:00 AM',
      duration: 30,
      type: 'Consultation',
      status: 'Confirmed',
      notes: 'Regular checkup',
      phone: '+1 234-567-8901',
      email: 'john.smith@email.com',
      createdAt: '2024-01-10',
    },
    {
      key: '2',
      id: 'APT002',
      patientName: 'Emily Johnson',
      patientId: 'PT002',
      doctorName: 'Dr. Michael Brown',
      doctorId: 'DR002',
      appointmentDate: '2024-01-15',
      appointmentTime: '10:30 AM',
      duration: 45,
      type: 'Follow-up',
      status: 'Confirmed',
      notes: 'Post-treatment follow-up',
      phone: '+1 234-567-8902',
      email: 'emily.johnson@email.com',
      createdAt: '2024-01-11',
    },
    {
      key: '3',
      id: 'APT003',
      patientName: 'Robert Davis',
      patientId: 'PT003',
      doctorName: 'Dr. Sarah Wilson',
      doctorId: 'DR001',
      appointmentDate: '2024-01-16',
      appointmentTime: '02:00 PM',
      duration: 60,
      type: 'Treatment',
      status: 'Pending',
      notes: 'Physical therapy session',
      phone: '+1 234-567-8903',
      email: 'robert.davis@email.com',
      createdAt: '2024-01-12',
    },
    {
      key: '4',
      id: 'APT004',
      patientName: 'Lisa Garcia',
      patientId: 'PT004',
      doctorName: 'Dr. Jessica Lee',
      doctorId: 'DR003',
      appointmentDate: '2024-01-16',
      appointmentTime: '11:00 AM',
      duration: 30,
      type: 'Check-up',
      status: 'Completed',
      notes: 'Annual health screening',
      phone: '+1 234-567-8904',
      email: 'lisa.garcia@email.com',
      createdAt: '2024-01-13',
    },
    {
      key: '5',
      id: 'APT005',
      patientName: 'Michael Chen',
      patientId: 'PT005',
      doctorName: 'Dr. David Chen',
      doctorId: 'DR004',
      appointmentDate: '2024-01-17',
      appointmentTime: '03:30 PM',
      duration: 30,
      type: 'Consultation',
      status: 'Cancelled',
      notes: 'Patient requested cancellation',
      phone: '+1 234-567-8905',
      email: 'michael.chen@email.com',
      createdAt: '2024-01-14',
    },
  ]);

  const columns = [
    {
      title: 'Appointment ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Patient',
      key: 'patient',
      width: 200,
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">{record.patientName}</div>
          <div className="text-sm text-gray-500">{record.patientId}</div>
        </div>
      ),
    },
    {
      title: 'Doctor',
      key: 'doctor',
      width: 180,
      sorter: (a, b) => a.doctorName.localeCompare(b.doctorName),
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">{record.doctorName}</div>
          <div className="text-sm text-gray-500">{record.doctorId}</div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      width: 150,
      sorter: (a, b) => new Date(`${a.appointmentDate} ${a.appointmentTime}`) - new Date(`${b.appointmentDate} ${b.appointmentTime}`),
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.appointmentDate}</div>
          <div className="text-sm text-gray-500">{record.appointmentTime}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        const colors = {
          'Consultation': 'blue',
          'Follow-up': 'green',
          'Check-up': 'orange',
          'Treatment': 'purple',
          'Emergency': 'red'
        };
        return (
          <Tag color={colors[type] || 'default'}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration) => `${duration} min`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const colors = {
          'Confirmed': 'green',
          'Pending': 'orange',
          'Completed': 'blue',
          'Cancelled': 'red',
          'No Show': 'gray'
        };
        return (
          <Tag color={colors[status] || 'default'}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewAppointment(record.key)}
            />
          </Tooltip>
          <Tooltip title="Edit Appointment">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditAppointment(record.key)}
            />
          </Tooltip>
          <Tooltip title="Cancel Appointment">
            <Popconfirm
              title="Cancel Appointment"
              description="Are you sure you want to cancel this appointment?"
              onConfirm={() => handleCancelAppointment(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Confirmed', value: 'Confirmed' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' },
        { label: 'No Show', value: 'No Show' }
      ]
    },
    {
      key: 'type',
      label: 'Type',
      options: [
        { label: 'Consultation', value: 'Consultation' },
        { label: 'Follow-up', value: 'Follow-up' },
        { label: 'Check-up', value: 'Check-up' },
        { label: 'Treatment', value: 'Treatment' },
        { label: 'Emergency', value: 'Emergency' }
      ]
    },
    {
      key: 'doctorName',
      label: 'Doctor',
      options: [
        { label: 'Dr. Sarah Wilson', value: 'Dr. Sarah Wilson' },
        { label: 'Dr. Michael Brown', value: 'Dr. Michael Brown' },
        { label: 'Dr. Jessica Lee', value: 'Dr. Jessica Lee' },
        { label: 'Dr. David Chen', value: 'Dr. David Chen' }
      ]
    }
  ];

  const searchFields = ['patientName', 'doctorName', 'id', 'patientId', 'phone'];

  // Navigation handlers
  const handleScheduleAppointment = () => {
    router.push('/tenant-admin/appointments/add');
  };

  const handleViewAppointment = (appointmentId) => {
    router.push(`/tenant-admin/appointments/${appointmentId}`);
  };

  const handleEditAppointment = (appointmentId) => {
    router.push(`/tenant-admin/appointments/${appointmentId}/edit`);
  };

  const handleCancelAppointment = (appointmentId) => {
    message.success('Appointment cancelled successfully');
  };

  const handleExport = () => {
    message.info('Export functionality would be implemented here');
  };

  const headerActions = (
    <Space>
      <Button
        icon={<ExportOutlined />}
        onClick={handleExport}
      >
        Export
      </Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleScheduleAppointment}
      >
        Schedule Appointment
      </Button>
    </Space>
  );

  const tabItems = [
    {
      key: 'table',
      label: (
        <span>
          <TableOutlined />
          Table View
        </span>
      ),
      children: (
        <SearchableTable
          data={appointmentsData}
          columns={columns}
          filters={filters}
          searchFields={searchFields}
          searchPlaceholder="Search appointments by patient, doctor, ID, or phone..."
          rowKey="key"
          scroll={{ x: 1400 }}
        />
      ),
    },
    {
      key: 'calendar',
      label: (
        <span>
          <CalendarOutlined />
          Calendar View
        </span>
      ),
      children: <AppointmentsCalendarView 
        appointments={appointmentsData} 
        currentDate={currentDate}
        onDateChange={handleDateChange}
        userRole="admin"
      />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Appointments Management</h1>
          <p className="text-gray-500">Manage all clinic appointments and schedules</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {headerActions}
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        size="large"
      />
    </div>
  );
};

export default AppointmentsPage;
