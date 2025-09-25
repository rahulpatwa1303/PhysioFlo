"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  Button,
  Space,
  Tag,
  Descriptions,
  Divider,
  Row,
  Col,
  Avatar,
  Timeline,
  message,
  Popconfirm,
  Modal
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const AppointmentDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock appointment data - in real app, this would come from API
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockAppointment = {
          id: params.id,
          appointmentId: 'APT001',
          patientName: 'John Smith',
          patientId: 'PT001',
          patientPhone: '+1 234-567-8901',
          patientEmail: 'john.smith@email.com',
          patientAge: 35,
          patientGender: 'Male',
          doctorName: 'Dr. Sarah Wilson',
          doctorId: 'DR001',
          doctorSpecialization: 'General Medicine',
          appointmentDate: '2024-01-15',
          appointmentTime: '09:00 AM',
          duration: 30,
          type: 'Consultation',
          status: 'Confirmed',
          reason: 'Regular health checkup and blood pressure monitoring',
          notes: 'Patient reports feeling well. No major concerns. Regular checkup for monitoring.',
          createdAt: '2024-01-10 14:30:00',
          updatedAt: '2024-01-12 16:45:00',
          history: [
            {
              action: 'Appointment Created',
              timestamp: '2024-01-10 14:30:00',
              user: 'Admin Staff',
              status: 'created'
            },
            {
              action: 'Appointment Confirmed',
              timestamp: '2024-01-12 16:45:00',
              user: 'Dr. Sarah Wilson',
              status: 'confirmed'
            }
          ]
        };
        
        setAppointment(mockAppointment);
      } catch (error) {
        message.error('Failed to load appointment details');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/tenant-admin/appointments/${params.id}/edit`);
  };

  const handleCancel = () => {
    Modal.confirm({
      title: 'Cancel Appointment',
      content: 'Are you sure you want to cancel this appointment? This action cannot be undone.',
      okText: 'Yes, Cancel',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          message.success('Appointment cancelled successfully');
          router.push('/tenant-admin/appointments');
        } catch (error) {
          message.error('Failed to cancel appointment');
        }
      }
    });
  };

  const handleComplete = () => {
    Modal.confirm({
      title: 'Mark as Completed',
      content: 'Mark this appointment as completed?',
      okText: 'Yes, Complete',
      cancelText: 'No',
      onOk: async () => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          setAppointment(prev => ({ ...prev, status: 'Completed' }));
          message.success('Appointment marked as completed');
        } catch (error) {
          message.error('Failed to update appointment');
        }
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'green',
      'Pending': 'orange',
      'Completed': 'blue',
      'Cancelled': 'red',
      'No Show': 'gray'
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Consultation': 'blue',
      'Follow-up': 'green',
      'Check-up': 'orange',
      'Treatment': 'purple',
      'Emergency': 'red'
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading appointment details...</div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center">
        <h2>Appointment not found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Appointment Details</h1>
            <p className="text-gray-500">#{appointment.appointmentId}</p>
          </div>
        </div>
        
        <Space wrap>
          {appointment.status === 'Confirmed' && (
            <Button
              icon={<CheckCircleOutlined />}
              onClick={handleComplete}
            >
              Mark Complete
            </Button>
          )}
          <Button
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Space>
      </div>

      <Row gutter={24}>
        {/* Main Details */}
        <Col xs={24} lg={16} className="space-y-6">
          {/* Appointment Overview */}
          <Card title="Appointment Overview" className="shadow-sm">
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="Date">
                <Space>
                  <CalendarOutlined />
                  {dayjs(appointment.appointmentDate).format('MMMM D, YYYY')}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                <Space>
                  <ClockCircleOutlined />
                  {appointment.appointmentTime} ({appointment.duration} min)
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={getTypeColor(appointment.type)}>
                  {appointment.type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Reason" span={2}>
                {appointment.reason}
              </Descriptions.Item>
              {appointment.notes && (
                <Descriptions.Item label="Notes" span={2}>
                  <div className="p-3 bg-gray-50 rounded">
                    {appointment.notes}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Patient Information */}
          <Card title="Patient Information" className="shadow-sm">
            <div className="flex items-start space-x-4">
              <Avatar size={64} icon={<UserOutlined />} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{appointment.patientName}</h3>
                <Descriptions column={{ xs: 1, sm: 2 }}>
                  <Descriptions.Item label="Patient ID">
                    {appointment.patientId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Age">
                    {appointment.patientAge} years
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">
                    {appointment.patientGender}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <Space>
                      <PhoneOutlined />
                      {appointment.patientPhone}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email" span={2}>
                    <Space>
                      <MailOutlined />
                      {appointment.patientEmail}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Card>

          {/* Doctor Information */}
          <Card title="Doctor Information" className="shadow-sm">
            <div className="flex items-start space-x-4">
              <Avatar size={64} icon={<MedicineBoxOutlined />} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{appointment.doctorName}</h3>
                <Descriptions column={{ xs: 1, sm: 2 }}>
                  <Descriptions.Item label="Doctor ID">
                    {appointment.doctorId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Specialization">
                    {appointment.doctorSpecialization}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8} className="space-y-6">
          {/* Quick Actions */}
          <Card title="Quick Actions" className="shadow-sm">
            <Space direction="vertical" className="w-full">
              <Button block onClick={handleEdit}>
                Edit Appointment
              </Button>
              <Button block onClick={() => message.info('Sending reminder...')}>
                Send Reminder
              </Button>
              <Button block onClick={() => message.info('Generating report...')}>
                Generate Report
              </Button>
              <Button block onClick={() => message.info('Viewing history...')}>
                View Patient History
              </Button>
            </Space>
          </Card>

          {/* Appointment History */}
          <Card title="Activity History" className="shadow-sm">
            <Timeline
              items={appointment.history.map(item => ({
                color: item.status === 'created' ? 'blue' : 'green',
                children: (
                  <div>
                    <div className="font-medium">{item.action}</div>
                    <div className="text-sm text-gray-500">
                      By {item.user}
                    </div>
                    <div className="text-xs text-gray-400">
                      {dayjs(item.timestamp).format('MMM D, YYYY HH:mm')}
                    </div>
                  </div>
                )
              }))}
            />
          </Card>

          {/* Metadata */}
          <Card title="Metadata" className="shadow-sm">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Created">
                {dayjs(appointment.createdAt).format('MMM D, YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {dayjs(appointment.updatedAt).format('MMM D, YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AppointmentDetailsPage;
