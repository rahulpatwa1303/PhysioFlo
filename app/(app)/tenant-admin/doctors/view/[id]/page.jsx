"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  Button,
  Row,
  Col,
  Avatar,
  Tag,
  Descriptions,
  Skeleton,
  message,
  Space,
  Divider,
  Modal,
  Table
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
  DollarOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { confirm } = Modal;

const ViewDoctorPage = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);

  // Simulate fetching doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data based on ID
        const mockData = {
          id: params.id,
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@preclinic.com',
          phone: '+1 234-567-8901',
          dateOfBirth: '1985-03-15',
          gender: 'Female',
          nationality: 'American',
          specialty: 'Cardiology',
          department: 'Cardiology',
          qualification: 'MD, FACC',
          experience: 8,
          licenseNumber: 'ML123456789',
          consultationFee: 200,
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: '09:00 - 17:00',
          address: '123 Medical Center Dr, Suite 400, City, State 12345',
          emergencyContact: '+1 234-567-8902',
          status: 'Active',
          bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 8 years of experience in treating cardiovascular diseases. She specializes in interventional cardiology and has performed thousands of successful procedures.',
          notes: 'Excellent patient care record. Fluent in English and Spanish.',
          avatar: null,
          joinedDate: '2020-01-15',
          totalPatients: 1250,
          totalAppointments: 2840,
          rating: 4.8,
          reviews: 245
        };

        // Mock recent appointments
        const mockAppointments = [
          {
            id: 1,
            patientName: 'John Smith',
            date: '2024-01-15',
            time: '10:00 AM',
            type: 'Consultation',
            status: 'Completed'
          },
          {
            id: 2,
            patientName: 'Emma Davis',
            date: '2024-01-15',
            time: '11:30 AM',
            type: 'Follow-up',
            status: 'Completed'
          },
          {
            id: 3,
            patientName: 'Michael Brown',
            date: '2024-01-16',
            time: '09:00 AM',
            type: 'Consultation',
            status: 'Scheduled'
          },
          {
            id: 4,
            patientName: 'Sarah Wilson',
            date: '2024-01-16',
            time: '02:00 PM',
            type: 'Emergency',
            status: 'Scheduled'
          }
        ];

        setDoctorData(mockData);
        setRecentAppointments(mockAppointments);
      } catch (error) {
        message.error('Failed to load doctor data');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDoctorData();
    }
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/tenant-admin/doctors/edit/${params.id}`);
  };

  const handleDelete = () => {
    confirm({
      title: 'Are you sure you want to delete this doctor?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. All associated data will be permanently deleted.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        // Simulate delete
        message.success('Doctor deleted successfully');
        router.push('/tenant-admin/doctors');
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Inactive': return 'red';
      case 'On Leave': return 'orange';
      default: return 'default';
    }
  };

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'green';
      case 'Scheduled': return 'blue';
      case 'Cancelled': return 'red';
      default: return 'default';
    }
  };

  const appointmentColumns = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getAppointmentStatusColor(status)}>{status}</Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} size="large">
            Back
          </Button>
          <div>
            <Skeleton.Input style={{ width: 200 }} active />
            <Skeleton.Input style={{ width: 150, marginTop: 8 }} active />
          </div>
        </div>
        <Card>
          <Skeleton active paragraph={{ rows: 15 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            size="large"
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Doctor Details</h1>
            <p className="text-gray-500">View doctor profile information</p>
          </div>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
            size="large"
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            size="large"
          >
            Delete
          </Button>
        </Space>
      </div>

      <Row gutter={24}>
        {/* Doctor Profile Card */}
        <Col xs={24} lg={8}>
          <Card className="text-center">
            <Avatar
              size={120}
              src={doctorData?.avatar}
              icon={<UserOutlined />}
              className="mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{doctorData?.name}</h2>
            <p className="text-gray-600 mb-2">{doctorData?.specialty}</p>
            <Tag color={getStatusColor(doctorData?.status)} className="mb-4">
              {doctorData?.status}
            </Tag>
            
            <Divider />
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-2">
                <PhoneOutlined className="text-gray-500" />
                <span>{doctorData?.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MailOutlined className="text-gray-500" />
                <span>{doctorData?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarOutlined className="text-gray-500" />
                <span>Consultation: ${doctorData?.consultationFee}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockCircleOutlined className="text-gray-500" />
                <span>{doctorData?.workingHours}</span>
              </div>
            </div>

            <Divider />

            {/* Quick Stats */}
            <Row gutter={16}>
              <Col span={8} className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {doctorData?.totalPatients}
                </div>
                <div className="text-xs text-gray-500">Patients</div>
              </Col>
              <Col span={8} className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {doctorData?.totalAppointments}
                </div>
                <div className="text-xs text-gray-500">Appointments</div>
              </Col>
              <Col span={8} className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {doctorData?.rating}/5
                </div>
                <div className="text-xs text-gray-500">Rating</div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Doctor Details */}
        <Col xs={24} lg={16}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card title="Basic Information">
              <Descriptions column={{ xs: 1, sm: 2 }} size="small">
                <Descriptions.Item label="Full Name">
                  {doctorData?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Gender">
                  {doctorData?.gender}
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  {dayjs(doctorData?.dateOfBirth).format('MMM DD, YYYY')} 
                  ({dayjs().diff(dayjs(doctorData?.dateOfBirth), 'year')} years old)
                </Descriptions.Item>
                <Descriptions.Item label="Nationality">
                  {doctorData?.nationality}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {doctorData?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {doctorData?.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Emergency Contact">
                  {doctorData?.emergencyContact}
                </Descriptions.Item>
                <Descriptions.Item label="Joined Date">
                  {dayjs(doctorData?.joinedDate).format('MMM DD, YYYY')}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Professional Information */}
            <Card title="Professional Information">
              <Descriptions column={{ xs: 1, sm: 2 }} size="small">
                <Descriptions.Item label="Specialty">
                  {doctorData?.specialty}
                </Descriptions.Item>
                <Descriptions.Item label="Department">
                  {doctorData?.department}
                </Descriptions.Item>
                <Descriptions.Item label="Qualification">
                  {doctorData?.qualification}
                </Descriptions.Item>
                <Descriptions.Item label="Experience">
                  {doctorData?.experience} years
                </Descriptions.Item>
                <Descriptions.Item label="License Number">
                  {doctorData?.licenseNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Consultation Fee">
                  ${doctorData?.consultationFee}
                </Descriptions.Item>
                <Descriptions.Item label="Working Days" span={2}>
                  {doctorData?.workingDays?.join(', ')}
                </Descriptions.Item>
                <Descriptions.Item label="Working Hours">
                  {doctorData?.workingHours}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(doctorData?.status)}>
                    {doctorData?.status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Address */}
            <Card title="Contact Information">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Address">
                  {doctorData?.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Biography */}
            {doctorData?.bio && (
              <Card title="Biography">
                <p className="text-gray-700">{doctorData?.bio}</p>
              </Card>
            )}

            {/* Notes */}
            {doctorData?.notes && (
              <Card title="Notes">
                <p className="text-gray-700">{doctorData?.notes}</p>
              </Card>
            )}

            {/* Recent Appointments */}
            <Card title="Recent Appointments">
              <Table
                columns={appointmentColumns}
                dataSource={recentAppointments}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: true }}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ViewDoctorPage;
