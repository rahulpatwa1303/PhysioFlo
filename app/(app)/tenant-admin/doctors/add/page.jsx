"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  InputNumber,
  TimePicker,
  Upload,
  Avatar
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  UploadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const AddDoctorPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const specialties = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Psychiatry',
    'Oncology',
    'Endocrinology',
    'Gastroenterology',
    'Pulmonology',
    'Nephrology',
    'Rheumatology',
    'Ophthalmology',
    'ENT',
    'General Medicine'
  ];

  const departments = [
    'Emergency',
    'ICU',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Psychiatry',
    'Oncology',
    'Endocrinology',
    'Gastroenterology',
    'Pulmonology',
    'Nephrology',
    'Rheumatology',
    'Ophthalmology',
    'ENT',
    'General Medicine',
    'Surgery',
    'Radiology',
    'Pathology'
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form Values:', values);
      message.success('Doctor added successfully!');
      router.push('/tenant-admin/doctors');
    } catch (error) {
      message.error('Failed to add doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
          size="large"
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add New Doctor</h1>
          <p className="text-gray-500">Create a new doctor profile</p>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          scrollToFirstError
        >
          <Row gutter={24}>
            {/* Profile Photo */}
            <Col span={24} className="mb-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar size={120} icon={<UserOutlined />} />
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>
                    Upload Photo
                  </Button>
                </Upload>
              </div>
            </Col>

            {/* Basic Information */}
            <Col span={24}>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter doctor name' }]}
              >
                <Input placeholder="Dr. John Doe" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input placeholder="doctor@preclinic.com" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="+1 234-567-8900" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
              >
                <Input type="date" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select placeholder="Select gender" size="large">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="nationality"
                label="Nationality"
              >
                <Input placeholder="American" size="large" />
              </Form.Item>
            </Col>

            {/* Professional Information */}
            <Col span={24} className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="specialty"
                label="Specialty"
                rules={[{ required: true, message: 'Please select specialty' }]}
              >
                <Select placeholder="Select specialty" size="large">
                  {specialties.map(specialty => (
                    <Option key={specialty} value={specialty}>{specialty}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select department' }]}
              >
                <Select placeholder="Select department" size="large">
                  {departments.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="qualification"
                label="Qualification"
                rules={[{ required: true, message: 'Please enter qualification' }]}
              >
                <Input placeholder="MD, MBBS, etc." size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="experience"
                label="Experience (Years)"
                rules={[{ required: true, message: 'Please enter experience' }]}
              >
                <InputNumber
                  min={0}
                  max={50}
                  placeholder="5"
                  size="large"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="licenseNumber"
                label="Medical License Number"
                rules={[{ required: true, message: 'Please enter license number' }]}
              >
                <Input placeholder="ML123456789" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="consultationFee"
                label="Consultation Fee ($)"
                rules={[{ required: true, message: 'Please enter consultation fee' }]}
              >
                <InputNumber
                  min={0}
                  placeholder="150"
                  size="large"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            {/* Schedule Information */}
            <Col span={24} className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Schedule Information</h3>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="workingDays"
                label="Working Days"
                rules={[{ required: true, message: 'Please select working days' }]}
              >
                <Select 
                  mode="multiple" 
                  placeholder="Select working days" 
                  size="large"
                >
                  <Option value="Monday">Monday</Option>
                  <Option value="Tuesday">Tuesday</Option>
                  <Option value="Wednesday">Wednesday</Option>
                  <Option value="Thursday">Thursday</Option>
                  <Option value="Friday">Friday</Option>
                  <Option value="Saturday">Saturday</Option>
                  <Option value="Sunday">Sunday</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="workingHours"
                label="Working Hours"
                rules={[{ required: true, message: 'Please select working hours' }]}
              >
                <TimePicker.RangePicker
                  format="HH:mm"
                  size="large"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            {/* Contact Information */}
            <Col span={24} className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            </Col>

            <Col span={24}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Enter complete address"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="emergencyContact"
                label="Emergency Contact"
              >
                <Input placeholder="+1 234-567-8900" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="Active"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select size="large">
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                  <Option value="On Leave">On Leave</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Additional Information */}
            <Col span={24} className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            </Col>

            <Col span={24}>
              <Form.Item
                name="bio"
                label="Biography"
              >
                <TextArea
                  rows={4}
                  placeholder="Brief description about the doctor..."
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="notes"
                label="Notes"
              >
                <TextArea
                  rows={3}
                  placeholder="Any additional notes..."
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <Button
              size="large"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              loading={loading}
            >
              Add Doctor
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddDoctorPage;
