"use client";

import { Card, Tag, Button, Avatar, Segmented } from 'antd';
import { UserOutlined, ClockCircleOutlined, CalendarOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Dummy data for today's and tomorrow's appointments
const todaysAppointments = [
  {
    id: '1',
    time: '09:00 AM',
    patient: 'John Smith',
    type: 'Consultation',
    status: 'Confirmed',
    doctor: 'Dr. Sarah Wilson',
  },
  {
    id: '2',
    time: '10:30 AM',
    patient: 'Emily Johnson',
    type: 'Follow-up',
    status: 'Confirmed',
    doctor: 'Dr. Michael Brown',
  },
  {
    id: '3',
    time: '02:00 PM',
    patient: 'Robert Davis',
    type: 'Check-up',
    status: 'Pending',
    doctor: 'Dr. Sarah Wilson',
  },
];

const tomorrowsAppointments = [
  {
    id: '4',
    time: '11:00 AM',
    patient: 'Lisa Garcia',
    type: 'Treatment',
    status: 'Confirmed',
    doctor: 'Dr. Jessica Lee',
  },
  {
    id: '5',
    time: '03:30 PM',
    patient: 'Michael Brown',
    type: 'Consultation',
    status: 'Confirmed',
    doctor: 'Dr. David Chen',
  },
];

const CompactAppointments = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('today');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'green';
      case 'Pending':
        return 'orange';
      case 'Cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Consultation':
        return 'blue';
      case 'Follow-up':
        return 'green';
      case 'Check-up':
        return 'orange';
      case 'Treatment':
        return 'purple';
      default:
        return 'default';
    }
  };

  const handleViewMore = () => {
    router.push('/tenant-admin/appointments');
  };

  const renderAppointmentsList = (appointments, emptyMessage) => {
    if (appointments.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <CalendarOutlined className="text-2xl mb-2" />
          <div>{emptyMessage}</div>
        </div>
      );
    }

    return (
      <div className="space-y-2 sm:space-y-3">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="flex items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Avatar icon={<UserOutlined />} size="small" className="flex-shrink-0 mt-1 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">{appointment.patient}</div>
                <div className="text-xs text-gray-500 flex items-center space-x-1 sm:space-x-2 mt-1">
                  <ClockCircleOutlined />
                  <span>{appointment.time}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="truncate hidden sm:inline">{appointment.doctor}</span>
                </div>
                {/* Doctor name for mobile - separate line */}
                <div className="text-xs text-gray-400 truncate sm:hidden mt-1">
                  {appointment.doctor}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 flex-shrink-0 ml-2">
              <Tag color={getTypeColor(appointment.type)} size="small" className="text-xs">
                {appointment.type}
              </Tag>
              <Tag color={getStatusColor(appointment.status)} size="small" className="text-xs">
                {appointment.status}
              </Tag>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card 
      title="Appointments Overview" 
      className="shadow-sm h-full flex flex-col"
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      extra={
        <Button 
          type="text" 
          icon={<ArrowRightOutlined />}
          onClick={handleViewMore}
          className="text-blue-600 hidden sm:flex"
          size="small"
        >
          View All
        </Button>
      }
    >
      <div className="flex flex-col h-full">
        {/* Segmented Control Tabs */}
        <div className="mb-4">
          <Segmented
            options={[
              { label: `Today (${todaysAppointments.length})`, value: 'today' },
              { label: `Tomorrow (${tomorrowsAppointments.length})`, value: 'tomorrow' },
            ]}
            value={selectedTab}
            onChange={setSelectedTab}
            block
            className="custom-segmented"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0">
          {selectedTab === 'today' && renderAppointmentsList(
            todaysAppointments.slice(0, 4), 
            "No appointments scheduled for today"
          )}
          {selectedTab === 'tomorrow' && renderAppointmentsList(
            tomorrowsAppointments.slice(0, 4), 
            "No appointments scheduled for tomorrow"
          )}
        </div>

        {/* View More Button */}
        <div className="pt-3 border-t mt-4">
          <Button 
            block 
            icon={<CalendarOutlined />} 
            onClick={handleViewMore}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            size="small"
          >
            <span className="hidden sm:inline">View Full Calendar</span>
            <span className="sm:hidden">View Calendar</span>
          </Button>
        </div>
      </div>

      <style jsx global>{`
        .custom-segmented .ant-segmented-item {
          padding: 8px 16px;
          font-size: 13px;
        }
        .custom-segmented .ant-segmented-item-selected {
          background: #1677ff;
          color: white;
        }
      `}</style>
    </Card>
  );
};

export default CompactAppointments;
