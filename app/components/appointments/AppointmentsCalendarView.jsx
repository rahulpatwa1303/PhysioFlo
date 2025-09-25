"use client";

import { useState, useEffect } from 'react';
import { Calendar, Badge, Button, Modal, Card, Statistic, Row, Col, Tag, Space, message } from 'antd';
import { PlusOutlined, UserOutlined, ClockCircleOutlined, PhoneOutlined, HomeOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const AppointmentsCalendarView = ({ 
  appointments = [], 
  currentDate, 
  onDateChange, 
  userRole = 'admin',
  currentDoctorId = null,
  appointmentFilter = 'all' // 'my', 'all' - only relevant for doctors
}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarValue, setCalendarValue] = useState(dayjs());
  const [blockTimeModalVisible, setBlockTimeModalVisible] = useState(false);
  const router = useRouter();

  // Initialize calendar value from props or default to today
  useEffect(() => {
    if (currentDate) {
      const dateValue = dayjs(currentDate);
      setCalendarValue(dateValue);
      setSelectedDate(dateValue);
    }
  }, [currentDate]);

  // Filter appointments based on role and current doctor
  const getFilteredAppointments = (appointments) => {
    if (userRole === 'doctor' && appointmentFilter === 'my' && currentDoctorId) {
      return appointments.filter(apt => 
        apt.doctorId === currentDoctorId || 
        apt.assignedDoctorId === currentDoctorId ||
        apt.isMyAppointment === true
      );
    }
    return appointments;
  };

  // Group appointments by date
  const appointmentsByDate = getFilteredAppointments(appointments).reduce((acc, appointment) => {
    const date = appointment.appointmentDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {});

  // Get appointments for a specific date
  const getListData = (value) => {
    const dateKey = value.format('YYYY-MM-DD');
    const dateAppointments = appointmentsByDate[dateKey] || [];
    
    return dateAppointments.map(appointment => ({
      type: getStatusBadgeType(appointment.status),
      content: `${appointment.appointmentTime} - ${appointment.patientName}`,
      appointment: appointment
    }));
  };

  // Get badge type based on appointment status
  const getStatusBadgeType = (status) => {
    const statusMap = {
      'Confirmed': 'success',
      'Pending': 'processing',
      'Completed': 'default',
      'Cancelled': 'error',
      'No Show': 'warning'
    };
    return statusMap[status] || 'default';
  };

  // Render date cell with appointments
  const dateCellRender = (value) => {
    const listData = getListData(value);
    
    if (listData.length === 0) return null;

    return (
      <ul className="events p-0 m-0 list-none">
        {listData.slice(0, 2).map((item, index) => (
          <li key={index} className="mb-1">
            <Badge 
              status={item.type} 
              text={
                <span className="text-xs truncate block">
                  {item.content}
                </span>
              }
            />
          </li>
        ))}
        {listData.length > 2 && (
          <li className="text-xs text-gray-500">
            +{listData.length - 2} more
          </li>
        )}
      </ul>
    );
  };

  // Handle date selection
  const onSelect = (value) => {
    setSelectedDate(value);
    const appointments = getListData(value).map(item => item.appointment);
    setSelectedAppointments(appointments);
    if (appointments.length > 0) {
      setModalVisible(true);
    }
  };

  // Handle calendar value change (navigation)
  const onCalendarChange = (value) => {
    setCalendarValue(value);
    // Notify parent component about date change for URL persistence
    if (onDateChange) {
      onDateChange(value.format('YYYY-MM-DD'));
    }
  };

  // Go to today
  const goToToday = () => {
    const today = dayjs();
    setCalendarValue(today);
    setSelectedDate(today);
    // Notify parent component
    if (onDateChange) {
      onDateChange(today.format('YYYY-MM-DD'));
    }
  };

  // Handle appointment actions
  const handleEditAppointment = (appointment) => {
    // Use the appointment id/key, fallback to other identifier
    const appointmentId = appointment.key || appointment.id || appointment.appointmentId;
    
    if (userRole === 'doctor') {
      // Doctors can only edit their own appointments - redirect to doctor routes
      router.push(`/doctor/appointments/edit/${appointmentId}`);
    } else {
      // Admin can edit any appointment
      router.push(`/tenant-admin/appointments/${appointmentId}/edit`);
    }
  };

  const handleViewAppointment = (appointment) => {
    // Use the appointment id/key, fallback to other identifier
    const appointmentId = appointment.key || appointment.id || appointment.appointmentId;
    
    if (userRole === 'doctor') {
      // For doctors, check if it's their appointment
      if (appointment.doctorId === currentDoctorId || appointment.isMyAppointment) {
        // Navigate to doctor appointment details page
        router.push(`/doctor/appointments/${appointmentId}`);
      } else {
        // Show limited info modal for other doctors' appointments
        Modal.info({
          title: 'Appointment Details (View Only)',
          width: 600,
          content: (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Patient:</strong> {appointment.patientName}</div>
                <div><strong>Date:</strong> {dayjs(appointment.appointmentDate).format('MMMM D, YYYY')}</div>
                <div><strong>Time:</strong> {appointment.appointmentTime}</div>
                <div><strong>Duration:</strong> {appointment.duration} minutes</div>
                <div><strong>Type:</strong> {appointment.type}</div>
                <div><strong>Status:</strong> {appointment.status}</div>
                <div><strong>Doctor:</strong> {appointment.doctorName}</div>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This appointment belongs to another doctor. You have view-only access.
                </p>
              </div>
            </div>
          )
        });
      }
    } else {
      // Admin can view full appointment details page
      router.push(`/tenant-admin/appointments/${appointmentId}`);
    }
  };

  const handleAddAppointment = () => {
    if (userRole === 'doctor') {
      // Doctors create appointments through their interface
      router.push(`/doctor/appointments/add?date=${selectedDate.format('YYYY-MM-DD')}`);
    } else {
      // Admin creates appointments through admin interface
      router.push(`/tenant-admin/appointments/add?date=${selectedDate.format('YYYY-MM-DD')}`);
    }
  };

  const handleBlockTimeSlot = () => {
    setBlockTimeModalVisible(true);
  };

  const handleConfirmBlockTimeSlot = () => {
    // In a real implementation, this would make an API call to block the time slot
    message.success(`Time slot blocked for ${selectedDate.format('MMMM D, YYYY')}`);
    setBlockTimeModalVisible(false);
    setModalVisible(false);
    
    // Optionally refresh appointments data
    // if (onRefresh) onRefresh();
  };

  // Calculate statistics
  const filteredAppointments = getFilteredAppointments(appointments);
  const totalAppointments = filteredAppointments.length;
  const todayAppointments = getListData(dayjs()).length;
  const confirmedAppointments = filteredAppointments.filter(apt => apt.status === 'Confirmed').length;
  const pendingAppointments = filteredAppointments.filter(apt => apt.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total"
              value={totalAppointments}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Today"
              value={todayAppointments}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Confirmed"
              value={confirmedAppointments}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Pending"
              value={pendingAppointments}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Calendar */}
      <Card 
        className="shadow-sm"
        title={
          <div className="flex justify-between items-center">
            <span>Appointments Calendar</span>
            <Button 
              type="primary" 
              icon={<HomeOutlined />} 
              onClick={goToToday}
              size="small"
            >
              Today
            </Button>
          </div>
        }
      >
        <Calendar
          dateCellRender={dateCellRender}
          onSelect={onSelect}
          onChange={onCalendarChange}
          value={calendarValue}
          mode="month"
          className="appointment-calendar"
        />
      </Card>

      {/* Appointment Details Modal */}
      <Modal
        title={`Appointments for ${selectedDate.format('MMMM D, YYYY')}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          <Button key="block" onClick={handleBlockTimeSlot}>
            Block Time Slot
          </Button>,
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAddAppointment}>
            Add Appointment
          </Button>
        ]}
        width={700}
      >
        <div className="space-y-4">
          {selectedAppointments.map((appointment) => {
            // Use appointment id/key, fallback to other identifier
            const appointmentKey = appointment.key || appointment.id || appointment.appointmentId || `apt-${Date.now()}-${Math.random()}`;
            
            return (
              <Card key={appointmentKey} size="small" className="border-l-4 border-l-blue-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <UserOutlined className="text-blue-500" />
                      <span className="font-semibold text-lg">{appointment.patientName}</span>
                      <Tag color={getStatusBadgeType(appointment.status) === 'success' ? 'green' : 
                                 getStatusBadgeType(appointment.status) === 'processing' ? 'orange' :
                                 getStatusBadgeType(appointment.status) === 'error' ? 'red' : 'default'}>
                        {appointment.status}
                      </Tag>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ClockCircleOutlined />
                        <span>{appointment.appointmentTime} ({appointment.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserOutlined />
                        <span>{appointment.doctorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneOutlined />
                        <span>{appointment.phone}</span>
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {appointment.type}
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {userRole === 'admin' && (
                      <Button 
                        size="small" 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button 
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewAppointment(appointment)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
          
          {selectedAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No appointments scheduled for this date.
            </div>
          )}
        </div>
      </Modal>

      {/* Block Time Slot Modal */}
      <Modal
        title="Block Time Slot"
        open={blockTimeModalVisible}
        onCancel={() => setBlockTimeModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setBlockTimeModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmBlockTimeSlot}>
            Block Time Slot
          </Button>
        ]}
        width={500}
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <h4 className="font-medium text-blue-900 mb-2">Selected Date</h4>
            <p className="text-blue-700">{selectedDate.format('MMMM D, YYYY')}</p>
          </div>
          
          <div className="space-y-3">
            <p>You are about to block this time slot:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>This will prevent new appointments from being scheduled for this date</li>
              <li>Existing appointments will not be affected</li>
              <li>You can unblock this time slot later if needed</li>
              {userRole === 'doctor' && (
                <li>This will only block your personal time slots</li>
              )}
            </ul>
          </div>
          
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Time slot blocking is {userRole === 'doctor' ? 'specific to your schedule' : 'clinic-wide'}.
            </p>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .appointment-calendar .ant-picker-calendar-date-content {
          height: 60px;
          overflow: hidden;
        }
        
        .appointment-calendar .events {
          padding: 0;
          margin: 0;
          list-style: none;
        }
        
        .appointment-calendar .events li {
          margin-bottom: 2px;
          font-size: 11px;
          line-height: 1.2;
        }
        
        .appointment-calendar .ant-badge-status-text {
          font-size: 11px;
          line-height: 1.2;
        }

        .appointment-calendar .ant-picker-calendar-date-content:hover {
          background-color: #f0f0f0;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .appointment-calendar .ant-picker-calendar-date-content {
            height: 40px;
          }
          
          .appointment-calendar .events li {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default AppointmentsCalendarView;
