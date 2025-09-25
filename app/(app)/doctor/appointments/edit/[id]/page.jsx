"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Card,
  Space,
  InputNumber,
  message,
  Row,
  Col,
  Divider,
  Alert,
  Tag,
  Skeleton
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const DoctorEditAppointmentPage = () => {
  const router = useRouter();
  const params = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState(null);

  // Mock current doctor
  const [currentDoctor] = useState({ 
    id: 'DR001', 
    name: 'Dr. Sarah Wilson',
    specialization: 'General Medicine' 
  });

  const appointmentTypes = [
    'Consultation',
    'Follow-up',
    'Check-up',
    'Treatment',
    'Therapy',
    'Assessment'
  ];

  const statusOptions = [
    'Confirmed',
    'Completed',
    'Cancelled',
    'No Show'
  ];

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
          doctorId: 'DR001',
          doctorName: 'Dr. Sarah Wilson',
          type: 'Check-up',
          status: 'Confirmed',
          duration: 30,
          reason: 'Regular check-up appointment',
          notes: 'Patient requested early morning slot',
          priority: 'Normal',
          isMyAppointment: true, // This doctor's appointment
          createdAt: '2024-01-10 14:30:00'
        };

        setAppointmentData(mockData);
        
        // Pre-fill form with existing data
        form.setFieldsValue({
          appointmentDate: dayjs(mockData.appointmentDate),
          appointmentTime: dayjs(mockData.appointmentTime, 'HH:mm A'),
          type: mockData.type,
          status: mockData.status,
          duration: mockData.duration,
          reason: mockData.reason,
          notes: mockData.notes,
          priority: mockData.priority
        });
        
      } catch (error) {
        message.error('Failed to load appointment data');
        console.error('Error fetching appointment:', error);
      } finally {
        setDataLoading(false);
      }
    };

    if (params.id) {
      fetchAppointmentData();
    }
  }, [params.id, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updatedAppointmentData = {
        ...appointmentData,
        ...values,
        appointmentDate: values.appointmentDate?.format('YYYY-MM-DD'),
        appointmentTime: values.appointmentTime?.format('HH:mm A'),
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updatedBy: 'doctor'
      };

      console.log('Updated Appointment Data:', updatedAppointmentData);
      
      message.success('Appointment updated successfully!');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/doctor/appointments');
    } catch (error) {
      message.error('Failed to update appointment. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Disable past dates
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  if (dataLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
            Back
          </Button>
          <div>
            <Skeleton.Input style={{ width: 200 }} active />
            <div className="mt-2">
              <Skeleton.Input style={{ width: 300 }} active />
            </div>
          </div>
        </div>
        <Card>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Appointment Not Found</h1>
          </div>
        </div>
        <Alert
          type="error"
          message="Appointment not found"
          description="The appointment you're looking for doesn't exist or you don't have permission to edit it."
        />
      </div>
    );
  }

  // Check if doctor can edit this appointment
  const canEdit = appointmentData.isMyAppointment && appointmentData.doctorId === currentDoctor.id;

  if (!canEdit) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Access Restricted</h1>
          </div>
        </div>
        <Alert
          type="warning"
          message="Cannot Edit Appointment"
          description="You can only edit appointments for your own patients."
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleCancel}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Appointment</h1>
            <p className="text-gray-500">Modify appointment details for {appointmentData.patientName}</p>
          </div>
        </div>
      </div>

      {/* Patient Info Card */}
      <Card title="Patient Information" className="shadow-sm">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Patient Name</div>
              <div className="font-medium">{appointmentData.patientName}</div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Phone</div>
              <div className="font-medium">{appointmentData.patientPhone}</div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{appointmentData.patientEmail}</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Edit Form */}
      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={24}>
            {/* Appointment Details */}
            <Col span={24}>
              <Divider orientation="left">
                <Space>
                  <CalendarOutlined />
                  Appointment Details
                </Space>
              </Divider>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="appointmentDate"
                label="Date"
                rules={[{ required: true, message: 'Please select appointment date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={disabledDate}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="appointmentTime"
                label="Time"
                rules={[{ required: true, message: 'Please select appointment time' }]}
              >
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm A"
                  minuteStep={30}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="duration"
                label="Duration (minutes)"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <InputNumber
                  min={15}
                  max={180}
                  step={15}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="type"
                label="Appointment Type"
                rules={[{ required: true, message: 'Please select appointment type' }]}
              >
                <Select placeholder="Select appointment type">
                  {appointmentTypes.map(type => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  {statusOptions.map(status => (
                    <Option key={status} value={status}>
                      <Tag color={
                        status === 'Confirmed' ? 'green' :
                        status === 'Completed' ? 'blue' :
                        status === 'Cancelled' ? 'red' :
                        status === 'No Show' ? 'orange' : 'default'
                      }>
                        {status}
                      </Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="priority"
                label="Priority"
              >
                <Select placeholder="Select priority">
                  <Option value="Normal">Normal</Option>
                  <Option value="High">High</Option>
                  <Option value="Urgent">Urgent</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Additional Information */}
            <Col span={24}>
              <Divider orientation="left">
                <Space>
                  <MedicineBoxOutlined />
                  Additional Information
                </Space>
              </Divider>
            </Col>

            <Col span={24}>
              <Form.Item
                name="reason"
                label="Reason for Visit"
                rules={[{ required: true, message: 'Please enter the reason for visit' }]}
              >
                <Input placeholder="Brief description of the reason for this appointment" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="notes"
                label="Notes"
              >
                <TextArea
                  rows={4}
                  placeholder="Add any special notes or instructions for this appointment..."
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button size="large" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
            >
              Update Appointment
            </Button>
          </div>
        </Form>
      </Card>

      {/* Appointment History */}
      <Card title="Appointment History" className="shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <InfoCircleOutlined className="text-blue-500" />
            <span className="text-gray-500">Created:</span>
            <span>{dayjs(appointmentData.createdAt).format('MMMM D, YYYY [at] h:mm A')}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <InfoCircleOutlined className="text-green-500" />
            <span className="text-gray-500">Current Status:</span>
            <Tag color={
              appointmentData.status === 'Confirmed' ? 'green' :
              appointmentData.status === 'Completed' ? 'blue' :
              appointmentData.status === 'Cancelled' ? 'red' :
              appointmentData.status === 'No Show' ? 'orange' : 'default'
            }>
              {appointmentData.status}
            </Tag>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DoctorEditAppointmentPage;
