"use client";

import { useState, useEffect } from 'react';
import { Card, Button, Space, Statistic, Row, Col, Segmented } from 'antd';
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  CalendarOutlined, 
  UserOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import AppointmentsCalendarView from '@/app/components/appointments/AppointmentsCalendarView';

// Enhanced appointment data with doctor assignments (this would come from API in real app)
const mockAppointmentData = [
  { 
    key: '1',
    appointmentId: '1',
    appointmentDate: '2024-01-15',
    appointmentTime: '10:00 AM',
    patientName: 'John Smith',
    patientId: 'P001',
    doctorName: 'Dr. Sarah Wilson',
    doctorId: 'DR001',
    phone: '555-0101',
    type: 'Consultation',
    status: 'Confirmed',
    duration: 30,
    isMyAppointment: true
  },
  { 
    key: '2',
    appointmentId: '2',
    appointmentDate: '2024-01-15',
    appointmentTime: '2:00 PM',
    patientName: 'Emily Johnson',
    patientId: 'P002',
    doctorName: 'Dr. Sarah Wilson',
    doctorId: 'DR001',
    phone: '555-0102',
    type: 'Follow-up',
    status: 'Confirmed',
    duration: 15,
    isMyAppointment: true
  },
  { 
    key: '13',
    appointmentId: '13',
    appointmentDate: '2024-01-15',
    appointmentTime: '11:00 AM',
    patientName: 'Alice Brown',
    patientId: 'P013',
    doctorName: 'Dr. Mark Johnson',
    doctorId: 'DR002',
    phone: '555-0201',
    type: 'Therapy',
    status: 'Confirmed',
    duration: 45,
    isMyAppointment: false
  },
  { 
    key: '3',
    appointmentId: '3',
    appointmentDate: '2024-01-16',
    appointmentTime: '9:00 AM',
    patientName: 'Robert Davis',
    patientId: 'P003',
    doctorName: 'Dr. Sarah Wilson',
    doctorId: 'DR001',
    phone: '555-0103',
    type: 'Check-up',
    status: 'Confirmed',
    duration: 30,
    isMyAppointment: true
  },
  { 
    key: '4',
    appointmentId: '4',
    appointmentDate: '2024-01-16',
    appointmentTime: '11:00 AM',
    patientName: 'Sarah Wilson',
    patientId: 'P004',
    doctorName: 'Dr. Sarah Wilson',
    doctorId: 'DR001',
    phone: '555-0104',
    type: 'Urgent',
    status: 'Pending',
    duration: 30,
    isMyAppointment: true
  },
  { 
    key: '5',
    appointmentId: '5',
    appointmentDate: '2024-01-16',
    appointmentTime: '3:00 PM',
    patientName: 'Michael Brown',
    patientId: 'P005',
    doctorName: 'Dr. Sarah Wilson',
    doctorId: 'DR001',
    phone: '555-0105',
    type: 'Treatment',
    status: 'Confirmed',
    duration: 60,
    isMyAppointment: true
  },
  { 
    key: '14',
    appointmentId: '14',
    appointmentDate: '2024-01-16',
    appointmentTime: '1:00 PM',
    patientName: 'David Miller',
    patientId: 'P014',
    doctorName: 'Dr. Lisa Chen',
    doctorId: 'DR003',
    phone: '555-0202',
    type: 'Consultation',
    status: 'Pending',
    duration: 30,
    isMyAppointment: false
  },
  { 
    key: '15',
    appointmentId: '15',
    appointmentDate: '2024-01-16',
    appointmentTime: '4:00 PM',
    patientName: 'Karen White',
    patientId: 'P015',
    doctorName: 'Dr. Mark Johnson',
    doctorId: 'DR002',
    phone: '555-0203',
    type: 'Follow-up',
    status: 'Confirmed',
    duration: 20,
    isMyAppointment: false
  },
  { 
    key: '6',
    appointmentId: '6',
    appointmentDate: '2024-01-17',
    appointmentTime: '10:30 AM',
    patientName: 'Lisa Garcia',
    patientId: 'P006',
    doctorName: 'Dr. Sarah Wilson',
    doctorId: 'DR001',
    phone: '555-0106',
    type: 'Consultation',
    status: 'Confirmed',
    duration: 45,
    isMyAppointment: true
  },
  { 
    key: '16',
    appointmentId: '16',
    appointmentDate: '2024-01-17',
    appointmentTime: '2:30 PM',
    patientName: 'James Taylor',
    patientId: 'P016',
    doctorName: 'Dr. Lisa Chen',
    doctorId: 'DR003',
    phone: '555-0204',
    type: 'Check-up',
    status: 'Pending',
    duration: 30,
    isMyAppointment: false
  },
];

const DoctorAppointmentsView = () => {
  const [appointmentFilter, setAppointmentFilter] = useState('my'); // 'my' or 'all'
  const [currentDoctor] = useState({ id: 'DR001', name: 'Dr. Sarah Wilson' });
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const router = useRouter();
  const searchParams = useSearchParams();

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
  const updateUrl = (date, filter = appointmentFilter) => {
    const params = new URLSearchParams();
    const state = { date, filter };
    params.set('s', encodeUrlState(state));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { shallow: true });
  };

  // Initialize state from URL on component mount
  useEffect(() => {
    const stateParam = searchParams.get('s');
    if (stateParam) {
      const state = decodeUrlState(stateParam);
      if (state.date) {
        setCurrentDate(state.date);
      }
      if (state.filter) {
        setAppointmentFilter(state.filter);
      }
    }
  }, [searchParams]);

  // Handle filter change
  const handleFilterChange = (value) => {
    setAppointmentFilter(value);
    updateUrl(currentDate, value);
  };

  // Handle date change from calendar
  const handleDateChange = (date) => {
    setCurrentDate(date);
    updateUrl(date);
  };

  // Calculate statistics based on filter
  const getFilteredAppointments = () => {
    if (appointmentFilter === 'my') {
      return mockAppointmentData.filter(apt => apt.isMyAppointment);
    }
    return mockAppointmentData;
  };

  const filteredAppointments = getFilteredAppointments();
  const todayAppointments = filteredAppointments.filter(apt => 
    apt.appointmentDate === dayjs().format('YYYY-MM-DD')
  ).length;
  const urgentAppointments = filteredAppointments.filter(apt => 
    apt.type === 'Urgent' || apt.status === 'Pending'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
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
            <h1 className="text-2xl font-bold">My Appointments</h1>
            <p className="text-gray-500">
              {appointmentFilter === 'my' ? 'Manage your appointment schedule' : 'View all clinic appointments'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => router.push('/doctor/appointments/add')}
          >
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <FilterOutlined />
            <span className="text-sm font-medium">Filter:</span>
            <Segmented
              options={[
                { label: 'My Appointments', value: 'my', icon: <UserOutlined /> },
                { label: 'All Appointments', value: 'all', icon: <CalendarOutlined /> },
              ]}
              value={appointmentFilter}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={appointmentFilter === 'my' ? "My Total" : "All Total"}
              value={filteredAppointments.length}
              valueStyle={{ color: '#1677ff' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Today"
              value={todayAppointments}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Urgent/Pending"
              value={urgentAppointments}
              valueStyle={{ color: '#ff4d4f' }}
              suffix={appointmentFilter === 'all' ? '(All)' : '(Mine)'}
            />
          </Card>
        </Col>
      </Row>

      {/* Calendar View using shared component */}
      <AppointmentsCalendarView 
        appointments={mockAppointmentData} 
        currentDate={currentDate}
        onDateChange={handleDateChange}
        userRole="doctor"
        currentDoctorId={currentDoctor.id}
        appointmentFilter={appointmentFilter}
      />
    </div>
  );
};

export default DoctorAppointmentsView;
