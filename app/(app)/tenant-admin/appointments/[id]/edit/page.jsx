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
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const EditAppointmentPage = () => {
  const router = useRouter();
  const params = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState(null);

  // Mock data - in real app, this would come from API
  const [patients] = useState([
    { id: 'PT001', name: 'John Smith', phone: '+1 234-567-8901', email: 'john.smith@email.com' },
    { id: 'PT002', name: 'Emily Johnson', phone: '+1 234-567-8902', email: 'emily.johnson@email.com' },
    { id: 'PT003', name: 'Robert Davis', phone: '+1 234-567-8903', email: 'robert.davis@email.com' },
    { id: 'PT004', name: 'Lisa Garcia', phone: '+1 234-567-8904', email: 'lisa.garcia@email.com' },
    { id: 'PT005', name: 'Michael Chen', phone: '+1 234-567-8905', email: 'michael.chen@email.com' },
  ]);

  const [doctors] = useState([
    { id: 'DR001', name: 'Dr. Sarah Wilson', specialization: 'General Medicine' },
    { id: 'DR002', name: 'Dr. Michael Brown', specialization: 'Cardiology' },
    { id: 'DR003', name: 'Dr. Jessica Lee', specialization: 'Pediatrics' },
    { id: 'DR004', name: 'Dr. David Chen', specialization: 'Orthopedics' },
  ]);

  const appointmentTypes = [
    'Consultation',
    'Follow-up',
    'Check-up',
    'Treatment',
    'Emergency',
    'Surgery',
    'Therapy'
  ];

  const statusOptions = [
    'Pending',
    'Confirmed',
    'Completed',
    'Cancelled',
    'No Show'
  ];

  // Load appointment data
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockAppointment = {
          id: params.id,
          appointmentId: 'APT001',
          patientId: 'PT001',
          doctorId: 'DR001',
          appointmentDate: '2024-01-15',
          appointmentTime: '09:00 AM',
          duration: 30,
          type: 'Consultation',
          status: 'Confirmed',
          reason: 'Regular health checkup and blood pressure monitoring',
          notes: 'Patient reports feeling well. No major concerns. Regular checkup for monitoring.',
        };
        
        setAppointment(mockAppointment);
        
        // Set form values
        form.setFieldsValue({
          patientId: mockAppointment.patientId,
          doctorId: mockAppointment.doctorId,
          appointmentDate: dayjs(mockAppointment.appointmentDate),
          appointmentTime: dayjs(mockAppointment.appointmentTime, 'HH:mm A'),
          duration: mockAppointment.duration,
          type: mockAppointment.type,
          status: mockAppointment.status,
          reason: mockAppointment.reason,
          notes: mockAppointment.notes,
        });
      } catch (error) {
        message.error('Failed to load appointment details');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [params.id, form]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      // Format the data
      const appointmentData = {
        ...values,
        appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
        appointmentTime: values.appointmentTime.format('HH:mm A'),
        patientInfo: patients.find(p => p.id === values.patientId),
        doctorInfo: doctors.find(d => d.id === values.doctorId),
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };

      console.log('Updated Appointment Data:', appointmentData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('Appointment updated successfully!');
      router.push(`/tenant-admin/appointments/${params.id}`);
    } catch (error) {
      message.error('Failed to update appointment. Please try again.');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Disable past dates
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
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
            <p className="text-gray-500">Update appointment details - #{appointment?.appointmentId}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={24}>
            {/* Patient Information */}
            <Col span={24}>
              <Divider orientation="left">
                <Space>
                  <UserOutlined />
                  Patient Information
                </Space>
              </Divider>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="patientId"
                label="Select Patient"
                rules={[{ required: true, message: 'Please select a patient' }]}
              >
                <Select
                  placeholder="Search and select patient"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {patients.map(patient => (
                    <Option key={patient.id} value={patient.id}>
                      <div>
                        <div>{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.id} • {patient.phone}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="doctorId"
                label="Assign Doctor"
                rules={[{ required: true, message: 'Please select a doctor' }]}
              >
                <Select placeholder="Select doctor">
                  {doctors.map(doctor => (
                    <Option key={doctor.id} value={doctor.id}>
                      <div>
                        <div>{doctor.name}</div>
                        <div className="text-sm text-gray-500">{doctor.specialization}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

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

            <Col xs={24} md={12}>
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

            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  {statusOptions.map(status => (
                    <Option key={status} value={status}>
                      {status}
                    </Option>
                  ))}
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
              loading={saving}
            >
              Update Appointment
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EditAppointmentPage;
