"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  Button,
  Row,
  Col,
  Tag,
  Descriptions,
  Skeleton,
  message,
  Space,
  Divider,
  Modal,
  Alert,
  Timeline
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { confirm } = Modal;

const DoctorAppointmentDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState(null);

  // Mock current doctor
  const [currentDoctor] = useState({ 
    id: 'DR001', 
    name: 'Dr. Sarah Wilson',
    specialization: 'General Medicine' 
  });

  // Simulate fetching appointment data
  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock appointment data
        const mockData = {
          id: params.id,
          appointmentDate: '2024-01-16',
          appointmentTime: '09:00 AM',
          patientName: 'Robert Davis',
          patientId: 'PT003',
          patientPhone: '+1 234-567-8903',
          patientEmail: 'robert.davis@email.com',
          patientAge: 45,
          patientGender: 'Male',
          doctorId: 'DR001',
          doctorName: 'Dr. Sarah Wilson',
          type: 'Check-up',
          status: 'Confirmed',
          duration: 30,
          reason: 'Regular check-up appointment',
          notes: 'Patient requested early morning slot. Regular follow-up for blood pressure monitoring.',
          priority: 'Normal',
          isMyAppointment: true,
          createdAt: '2024-01-10 14:30:00',
          updatedAt: '2024-01-12 09:15:00',
          // Mock appointment history
          history: [
            {
              action: 'Created',
              timestamp: '2024-01-10 14:30:00',
              by: 'Dr. Sarah Wilson',
              details: 'Appointment scheduled'
            },
            {
              action: 'Updated',
              timestamp: '2024-01-12 09:15:00',
              by: 'Dr. Sarah Wilson',
              details: 'Added patient notes'
            }
          ],
          // Mock patient medical info
          patientMedicalInfo: {
            lastVisit: '2023-11-15',
            bloodType: 'O+',
            allergies: 'None known',
            currentMedications: 'Lisinopril 10mg daily',
            medicalHistory: 'Hypertension, controlled'
          }
        };

        setAppointmentData(mockData);
        
      } catch (error) {
        message.error('Failed to load appointment data');
        console.error('Error fetching appointment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAppointmentData();
    }
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/doctor/appointments/edit/${params.id}`);
  };

  const handleComplete = () => {
    confirm({
      title: 'Mark Appointment as Completed',
      content: 'Are you sure you want to mark this appointment as completed?',
      onOk() {
        // Simulate API call
        message.success('Appointment marked as completed');
        setAppointmentData(prev => ({ ...prev, status: 'Completed' }));
      },
    });
  };

  const handleCancel = () => {
    confirm({
      title: 'Cancel Appointment',
      content: 'Are you sure you want to cancel this appointment? This action cannot be undone.',
      okType: 'danger',
      onOk() {
        // Simulate API call
        message.success('Appointment cancelled');
        setAppointmentData(prev => ({ ...prev, status: 'Cancelled' }));
      },
    });
  };

  const handleViewPatient = () => {
    router.push(`/doctor/patients/${appointmentData.patientId}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'green',
      'Pending': 'orange',
      'Completed': 'blue',
      'Cancelled': 'red',
      'No Show': 'volcano'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Normal': 'default',
      'High': 'orange',
      'Urgent': 'red'
    };
    return colors[priority] || 'default';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} size="large">
            Back
          </Button>
          <div>
            <Skeleton.Input style={{ width: 200 }} active />
            <div className="mt-2">
              <Skeleton.Input style={{ width: 300 }} active />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <Skeleton active paragraph={{ rows: 8 }} />
            </Card>
          </div>
          <div>
            <Card>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} size="large">
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Appointment Not Found</h1>
          </div>
        </div>
        <Alert
          type="error"
          message="Appointment not found"
          description="The appointment you're looking for doesn't exist or you don't have permission to view it."
        />
      </div>
    );
  }

  // Check if doctor can view this appointment
  const canView = appointmentData.isMyAppointment && appointmentData.doctorId === currentDoctor.id;

  if (!canView) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} size="large">
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Access Restricted</h1>
          </div>
        </div>
        <Alert
          type="warning"
          message="Cannot View Appointment"
          description="You can only view appointments for your own patients."
        />
      </div>
    );
  }

  const canModify = appointmentData.status === 'Confirmed' || appointmentData.status === 'Pending';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} size="large">
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Appointment Details</h1>
            <p className="text-gray-500">
              {appointmentData.patientName} • {dayjs(appointmentData.appointmentDate).format('MMMM D, YYYY')} at {appointmentData.appointmentTime}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {canModify && (
            <>
              <Button 
                icon={<EditOutlined />} 
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />}
                onClick={handleComplete}
              >
                Mark Complete
              </Button>
              <Button 
                danger 
                icon={<CloseCircleOutlined />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Information */}
          <Card title="Appointment Information" className="shadow-sm">
            <Descriptions column={2} size="middle">
              <Descriptions.Item label="Date">
                <Space>
                  <CalendarOutlined />
                  {dayjs(appointmentData.appointmentDate).format('MMMM D, YYYY')}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                <Space>
                  <ClockCircleOutlined />
                  {appointmentData.appointmentTime} ({appointmentData.duration} min)
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color="blue">{appointmentData.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(appointmentData.status)}>
                  {appointmentData.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={getPriorityColor(appointmentData.priority)}>
                  {appointmentData.priority}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Appointment ID">
                {appointmentData.id}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Reason for Visit</h4>
                <p className="text-gray-700">{appointmentData.reason}</p>
              </div>
              
              {appointmentData.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-gray-700">{appointmentData.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Patient Medical Information */}
          <Card title="Patient Medical Information" className="shadow-sm">
            <Descriptions column={2} size="middle">
              <Descriptions.Item label="Last Visit">
                {dayjs(appointmentData.patientMedicalInfo.lastVisit).format('MMMM D, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Blood Type">
                {appointmentData.patientMedicalInfo.bloodType}
              </Descriptions.Item>
              <Descriptions.Item label="Allergies">
                {appointmentData.patientMedicalInfo.allergies}
              </Descriptions.Item>
              <Descriptions.Item label="Current Medications">
                {appointmentData.patientMedicalInfo.currentMedications}
              </Descriptions.Item>
              <Descriptions.Item label="Medical History" span={2}>
                {appointmentData.patientMedicalInfo.medicalHistory}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Appointment History */}
          <Card title="Appointment History" className="shadow-sm">
            <Timeline>
              {appointmentData.history.map((item, index) => (
                <Timeline.Item 
                  key={index}
                  color={item.action === 'Created' ? 'green' : 'blue'}
                >
                  <div>
                    <div className="font-medium">{item.action}</div>
                    <div className="text-sm text-gray-500">
                      {dayjs(item.timestamp).format('MMMM D, YYYY [at] h:mm A')} by {item.by}
                    </div>
                    <div className="text-sm text-gray-600">{item.details}</div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Patient Information */}
          <Card title="Patient Information" className="shadow-sm">
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-2xl text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{appointmentData.patientName}</h3>
                <p className="text-gray-500">{appointmentData.patientAge} years old • {appointmentData.patientGender}</p>
              </div>
              
              <Divider />
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <PhoneOutlined className="text-gray-400" />
                  <span>{appointmentData.patientPhone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MailOutlined className="text-gray-400" />
                  <span>{appointmentData.patientEmail}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <InfoCircleOutlined className="text-gray-400" />
                  <span>Patient ID: {appointmentData.patientId}</span>
                </div>
              </div>
              
              <Divider />
              
              <Button 
                type="primary" 
                block 
                icon={<UserOutlined />}
                onClick={handleViewPatient}
              >
                View Full Patient Profile
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="shadow-sm">
            <div className="space-y-3">
              <Button 
                block 
                icon={<CalendarOutlined />}
                onClick={() => router.push(`/doctor/appointments/add?patientId=${appointmentData.patientId}`)}
              >
                Schedule Follow-up
              </Button>
              <Button 
                block 
                icon={<MedicineBoxOutlined />}
                onClick={() => router.push(`/doctor/patients/${appointmentData.patientId}/assessments/add`)}
              >
                Add Assessment
              </Button>
              <Button 
                block 
                icon={<InfoCircleOutlined />}
                onClick={() => message.info('Patient notes feature coming soon')}
              >
                View Patient Notes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointmentDetailsPage;
