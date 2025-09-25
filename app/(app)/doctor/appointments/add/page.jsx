"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Modal,
  Tabs
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const DoctorAddAppointmentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();
  const [newPatientForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');
  const [isNewPatientModalVisible, setIsNewPatientModalVisible] = useState(false);

  // Mock current doctor - in real app, this would come from auth context
  const [currentDoctor] = useState({ 
    id: 'DR001', 
    name: 'Dr. Sarah Wilson',
    specialization: 'General Medicine' 
  });

  // Mock personal patients assigned to this doctor
  const [existingPatients] = useState([
    { id: 'PT001', name: 'John Smith', phone: '+1 234-567-8901', email: 'john.smith@email.com', isMyPatient: true },
    { id: 'PT002', name: 'Emily Johnson', phone: '+1 234-567-8902', email: 'emily.johnson@email.com', isMyPatient: true },
    { id: 'PT003', name: 'Robert Davis', phone: '+1 234-567-8903', email: 'robert.davis@email.com', isMyPatient: true },
  ]);

  // Mock all hospital patients (for doctors to potentially add to their personal roster)
  const [hospitalPatients] = useState([
    { id: 'PT004', name: 'Lisa Garcia', phone: '+1 234-567-8904', email: 'lisa.garcia@email.com', isMyPatient: false },
    { id: 'PT005', name: 'Michael Chen', phone: '+1 234-567-8905', email: 'michael.chen@email.com', isMyPatient: false },
    { id: 'PT006', name: 'Sarah Brown', phone: '+1 234-567-8906', email: 'sarah.brown@email.com', isMyPatient: false },
    { id: 'PT007', name: 'David Wilson', phone: '+1 234-567-8907', email: 'david.wilson@email.com', isMyPatient: false },
  ]);

  const appointmentTypes = [
    'Consultation',
    'Follow-up',
    'Check-up',
    'Treatment',
    'Therapy',
    'Assessment'
  ];

  // Initialize form with URL parameters if any
  useEffect(() => {
    const date = searchParams.get('date');
    if (date) {
      form.setFieldsValue({
        appointmentDate: dayjs(date)
      });
    }
  }, [searchParams, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let selectedPatient;
      
      if (activeTab === 'existing') {
        selectedPatient = [...existingPatients, ...hospitalPatients].find(p => p.id === values.patientId);
      } else {
        // For new patient, we'll create a temporary patient record
        const newPatientValues = newPatientForm.getFieldsValue();
        selectedPatient = {
          id: `PT_NEW_${Date.now()}`,
          name: newPatientValues.name,
          phone: newPatientValues.phone,
          email: newPatientValues.email,
          dateOfBirth: newPatientValues.dateOfBirth?.format('YYYY-MM-DD'),
          gender: newPatientValues.gender,
          address: newPatientValues.address,
          emergencyContact: newPatientValues.emergencyContact,
          emergencyPhone: newPatientValues.emergencyPhone,
          isMyPatient: true,
          isNewPatient: true
        };
      }

      const appointmentData = {
        ...values,
        appointmentDate: values.appointmentDate?.format('YYYY-MM-DD'),
        appointmentTime: values.appointmentTime?.format('HH:mm A'),
        patientInfo: selectedPatient,
        doctorInfo: currentDoctor,
        doctorId: currentDoctor.id,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        status: 'Confirmed', // Doctor-created appointments are automatically confirmed
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        createdBy: 'doctor'
      };

      console.log('Doctor Appointment Data:', appointmentData);
      
      // If it's a hospital patient being onboarded, simulate adding them to doctor's patient list
      if (selectedPatient && !selectedPatient.isMyPatient && !selectedPatient.isNewPatient) {
        message.success(`Patient ${selectedPatient.name} has been added to your patient list and appointment scheduled!`);
      } else if (selectedPatient.isNewPatient) {
        message.success(`New patient ${selectedPatient.name} has been onboarded and appointment scheduled!`);
      } else {
        message.success('Appointment scheduled successfully!');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/doctor/appointments');
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

  const handleNewPatientSubmit = () => {
    newPatientForm.validateFields().then(() => {
      setIsNewPatientModalVisible(false);
      setActiveTab('new');
      message.success('New patient information saved. Please complete the appointment details.');
    }).catch(() => {
      message.error('Please fill in all required patient information.');
    });
  };

  // Disable past dates
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  // Generate time slots (8 AM to 6 PM, 30-minute intervals)
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

  const renderPatientSelection = () => {
    const tabItems = [
      {
        key: 'existing',
        label: 'My Personal Patients',
        children: (
          <Form.Item
            name="patientId"
            rules={[{ required: activeTab === 'existing', message: 'Please select a patient' }]}
          >
            <Select
              placeholder="Search and select from your personal patients"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {existingPatients.map(patient => (
                <Option key={patient.id} value={patient.id}>
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-500">{patient.phone} • Personal Patient</div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        )
      },
      {
        key: 'hospital',
        label: 'Hospital Patients',
        children: (
          <div className="space-y-4">
            <Alert
              type="info"
              message="Onboard Hospital Patients"
              description="Select a hospital patient to add them to your personal patient roster and schedule an appointment. This will make them your patient going forward."
              showIcon
            />
            <Form.Item
              name="patientId"
              rules={[{ required: activeTab === 'hospital', message: 'Please select a patient' }]}
            >
              <Select
                placeholder="Search hospital patients to add to your roster"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {hospitalPatients.map(patient => (
                  <Option key={patient.id} value={patient.id}>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.phone} • Hospital Patient</div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        )
      },
    //   {
    //     key: 'new',
    //     label: 'New Personal Patient',
    //     children: (
    //       <div className="space-y-4">
    //         <Alert
    //           type="success"
    //           message="Add New Personal Patient"
    //           description="Create a new patient profile for your personal roster and schedule their first appointment."
    //           showIcon
    //         />
    //         <Button
    //           type="dashed"
    //           icon={<PlusOutlined />}
    //           onClick={() => setIsNewPatientModalVisible(true)}
    //           className="w-full h-16"
    //         >
    //           <div>
    //             <div className="font-medium">Add New Patient Information</div>
    //             <div className="text-sm text-gray-500">Click to enter patient details</div>
    //           </div>
    //         </Button>
    //       </div>
    //     )
    //   }
    ];

    return (
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    );
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
            <p className="text-gray-500">Create an appointment for your patient</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            duration: 30,
            type: 'Consultation'
          }}
        >
          <Row gutter={24}>
            {/* Patient Selection */}
            <Col span={24}>
              <Divider orientation="left">
                <Space>
                  <UserOutlined />
                  Patient Selection
                </Space>
              </Divider>
            </Col>

            <Col span={24}>
              {renderPatientSelection()}
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
                name="priority"
                label="Priority"
              >
                <Select placeholder="Select priority (optional)">
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
              Schedule Appointment
            </Button>
          </div>
        </Form>
      </Card>

      {/* New Patient Modal */}
      <Modal
        title="Add New Patient"
        open={isNewPatientModalVisible}
        onCancel={() => setIsNewPatientModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsNewPatientModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleNewPatientSubmit}>
            Save Patient Info
          </Button>
        ]}
        width={600}
        destroyOnClose
      >
        <Form
          form={newPatientForm}
          layout="vertical"
          className="pt-4"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter patient name' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="+1 234-567-8900" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input placeholder="patient@email.com" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select date of birth' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="Select DOB"
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select placeholder="Select gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                  <Option value="Prefer not to say">Prefer not to say</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="address"
                label="Address"
              >
                <TextArea rows={2} placeholder="Enter address" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="emergencyContact"
                label="Emergency Contact Name"
              >
                <Input placeholder="Emergency contact name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="emergencyPhone"
                label="Emergency Contact Phone"
              >
                <Input placeholder="Emergency contact phone" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorAddAppointmentPage;
