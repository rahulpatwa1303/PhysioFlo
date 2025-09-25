"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Checkbox,
  Alert
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  SyncOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const AddAppointmentPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState('weekly');
  const [previewDates, setPreviewDates] = useState([]);

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

  // Generate preview dates for recurring appointments
  const generatePreviewDates = (startDate, recurringType, occurrences, endDate) => {
    if (!startDate) return [];
    
    const dates = [];
    const startTime = form.getFieldValue('appointmentTime');
    let currentDate = dayjs(startDate);
    
    // If we have a start time, apply it to the date
    if (startTime) {
      currentDate = currentDate
        .hour(startTime.hour())
        .minute(startTime.minute())
        .second(0);
    }
    
    const maxDate = endDate ? dayjs(endDate) : null;
    const maxOccurrences = occurrences || 10;
    
    for (let i = 0; i < maxOccurrences; i++) {
      if (maxDate && currentDate.isAfter(maxDate)) break;
      
      dates.push(currentDate.format('YYYY-MM-DD HH:mm'));
      
      switch (recurringType) {
        case 'daily':
          currentDate = currentDate.add(1, 'day');
          break;
        case 'weekly':
          currentDate = currentDate.add(1, 'week');
          break;
        case 'biweekly':
          currentDate = currentDate.add(2, 'weeks');
          break;
        case 'monthly':
          currentDate = currentDate.add(1, 'month');
          break;
        default:
          break;
      }
    }
    
    return dates;
  };

  // Update preview when form values change
  const updatePreview = () => {
    if (!isRecurring) {
      setPreviewDates([]);
      return;
    }
    
    const formValues = form.getFieldsValue();
    const dates = generatePreviewDates(
      formValues.appointmentDate,
      formValues.recurringType || recurringType,
      formValues.occurrences,
      formValues.endDate
    );
    setPreviewDates(dates);
  };

  const handleFormChange = () => {
    if (isRecurring) {
      setTimeout(updatePreview, 100); // Small delay to ensure form values are updated
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isRecurring) {
        // Handle recurring appointments
        const recurringDates = generatePreviewDates(
          values.appointmentDate,
          values.recurringType,
          values.occurrences,
          values.endDate
        );

        const appointmentSeries = recurringDates.map((dateTime, index) => ({
          ...values,
          appointmentDate: dayjs(dateTime).format('YYYY-MM-DD'),
          appointmentTime: dayjs(dateTime).format('HH:mm A'),
          patientInfo: patients.find(p => p.id === values.patientId),
          doctorInfo: doctors.find(d => d.id === values.doctorId),
          seriesId: `series_${Date.now()}`, // Unique series identifier
          seriesIndex: index + 1,
          totalInSeries: recurringDates.length,
          isRecurring: true,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }));

        console.log('Recurring Appointments Series:', appointmentSeries);
        message.success(`${appointmentSeries.length} recurring appointments scheduled successfully!`);
      } else {
        // Handle single appointment
        const appointmentData = {
          ...values,
          appointmentDate: values.appointmentDate?.format('YYYY-MM-DD'),
          appointmentTime: values.appointmentTime?.format('HH:mm A'),
          patientInfo: patients.find(p => p.id === values.patientId),
          doctorInfo: doctors.find(d => d.id === values.doctorId),
          isRecurring: false,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };

        console.log('Single Appointment Data:', appointmentData);
        message.success('Appointment scheduled successfully!');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/tenant-admin/appointments');
    } catch (error) {
      message.error('Failed to schedule appointment. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = dayjs().hour(hour).minute(minute).second(0);
        slots.push({
          value: time.format('HH:mm'),
          label: time.format('hh:mm A')
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Disable past dates
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

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
            <h1 className="text-2xl font-bold">Schedule New Appointment</h1>
            <p className="text-gray-500">Create a new appointment for a patient</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
          initialValues={{
            status: 'Pending',
            duration: 30,
            type: 'Consultation'
          }}
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

            {/* Recurring Appointment Options */}
            <Col span={24}>
              <Divider orientation="left">
                <Space>
                  <SyncOutlined />
                  Recurring Appointment
                </Space>
              </Divider>
            </Col>

            <Col span={24}>
              <Form.Item>
                <Checkbox 
                  checked={isRecurring}
                  onChange={(e) => {
                    setIsRecurring(e.target.checked);
                    if (!e.target.checked) {
                      setPreviewDates([]);
                      form.setFieldsValue({
                        recurringType: undefined,
                        occurrences: undefined,
                        endDate: undefined
                      });
                    }
                  }}
                >
                  Make this a recurring appointment
                </Checkbox>
              </Form.Item>
            </Col>

            {isRecurring && (
              <>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="recurringType"
                    label="Repeat"
                    rules={[{ required: isRecurring, message: 'Please select repeat frequency' }]}
                  >
                    <Select 
                      placeholder="Select frequency"
                      onChange={(value) => {
                        setRecurringType(value);
                        handleFormChange();
                      }}
                    >
                      <Option value="daily">Daily</Option>
                      <Option value="weekly">Weekly</Option>
                      <Option value="biweekly">Every 2 weeks</Option>
                      <Option value="monthly">Monthly</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="occurrences"
                    label="Number of Appointments"
                    rules={[{ required: false }]}
                  >
                    <InputNumber
                      min={1}
                      max={50}
                      placeholder="e.g., 10"
                      style={{ width: '100%' }}
                      onChange={handleFormChange}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="endDate"
                    label="End Date (Optional)"
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      disabledDate={(current) => {
                        const startDate = form.getFieldValue('appointmentDate');
                        return current && (current < dayjs().startOf('day') || (startDate && current <= startDate));
                      }}
                      format="YYYY-MM-DD"
                      onChange={handleFormChange}
                    />
                  </Form.Item>
                </Col>

                {previewDates.length > 0 && (
                  <Col span={24}>
                    <Alert
                      type="info"
                      message={`Preview: ${previewDates.length} appointments will be created`}
                      description={
                        <div className="mt-2">
                          <div className="text-sm font-medium mb-2">Appointment dates:</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                            {previewDates.slice(0, 12).map((date, index) => (
                              <div key={index} className="text-xs bg-blue-50 px-2 py-1 rounded">
                                {dayjs(date).format('MMM DD, YYYY HH:mm A')}
                              </div>
                            ))}
                            {previewDates.length > 12 && (
                              <div className="text-xs text-gray-500 px-2 py-1">
                                +{previewDates.length - 12} more...
                              </div>
                            )}
                          </div>
                        </div>
                      }
                      showIcon
                    />
                  </Col>
                )}
              </>
            )}

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
                name="notes"
                label="Notes"
              >
                <TextArea
                  rows={4}
                  placeholder="Add any special notes or instructions for this appointment..."
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="reason"
                label="Reason for Visit"
              >
                <Input placeholder="Brief description of the reason for this appointment" />
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
              Schedule Appointment
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddAppointmentPage;
