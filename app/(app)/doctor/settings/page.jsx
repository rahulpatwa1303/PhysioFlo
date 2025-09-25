"use client";

import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Select, 
  Upload, 
  Avatar, 
  Divider,
  Typography,
  Tabs,
  TimePicker,
  InputNumber,
  notification,
  Tag
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  NotificationOutlined,
  CalendarOutlined,
  SettingOutlined,
  UploadOutlined,
  SaveOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Paragraph } = Typography;
const { RangePicker } = TimePicker;

const DoctorSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [scheduleForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock doctor data
  const [doctorData, setDoctorData] = useState({
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@preclinic.com',
    phone: '+1 (555) 987-6543',
    specialty: 'Internal Medicine',
    licenseNumber: 'MD123456',
    avatar: null,
    bio: 'Experienced internal medicine physician with over 10 years of practice.',
    timezone: 'America/New_York',
    language: 'en'
  });

  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    patientUpdates: true,
    systemAlerts: false,
    newPatientAlerts: true,
    cancelationAlerts: true
  });

  // Mock schedule settings
  const [scheduleSettings, setScheduleSettings] = useState({
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: [dayjs('09:00', 'HH:mm'), dayjs('17:00', 'HH:mm')],
    lunchBreak: [dayjs('12:00', 'HH:mm'), dayjs('13:00', 'HH:mm')],
    appointmentDuration: 30,
    bufferTime: 15,
    maxPatientsPerDay: 20,
    allowEmergencySlots: true,
    autoBreaks: false
  });

  useEffect(() => {
    // Initialize forms with current data
    profileForm.setFieldsValue(doctorData);
    notificationForm.setFieldsValue(notificationSettings);
    scheduleForm.setFieldsValue({
      ...scheduleSettings,
      workingHours: scheduleSettings.workingHours,
      lunchBreak: scheduleSettings.lunchBreak
    });
  }, [doctorData, notificationSettings, scheduleSettings]);

  const handleProfileSave = async (values) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDoctorData({ ...doctorData, ...values });
      notification.success({
        message: 'Profile Updated',
        description: 'Your profile has been updated successfully.'
      });
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySave = async (values) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      notification.success({
        message: 'Password Updated',
        description: 'Your password has been changed successfully.'
      });
      securityForm.resetFields();
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: 'Failed to update password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async (values) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotificationSettings({ ...notificationSettings, ...values });
      notification.success({
        message: 'Notifications Updated',
        description: 'Your notification preferences have been saved.'
      });
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: 'Failed to update notifications. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSave = async (values) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScheduleSettings({ ...scheduleSettings, ...values });
      notification.success({
        message: 'Schedule Updated',
        description: 'Your schedule preferences have been saved.'
      });
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: 'Failed to update schedule. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined />
          Profile
        </span>
      ),
      children: (
        <Card className="shadow-sm">
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleProfileSave}
            requiredMark={false}
          >
            <Row gutter={24}>
              {/* Profile Photo */}
              <Col span={24} className="mb-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar size={100} src={doctorData.avatar} icon={<UserOutlined />} />
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>
                      Change Photo
                    </Button>
                  </Upload>
                </div>
              </Col>

              {/* Basic Information */}
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter your phone' }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="specialty"
                  label="Specialty"
                  rules={[{ required: true, message: 'Please select specialty' }]}
                >
                  <Select size="large">
                    <Option value="Internal Medicine">Internal Medicine</Option>
                    <Option value="Cardiology">Cardiology</Option>
                    <Option value="Pediatrics">Pediatrics</Option>
                    <Option value="Dermatology">Dermatology</Option>
                    <Option value="Orthopedics">Orthopedics</Option>
                    <Option value="Neurology">Neurology</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="licenseNumber"
                  label="License Number"
                  rules={[{ required: true, message: 'Please enter license number' }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="bio"
                  label="Professional Bio"
                >
                  <Input.TextArea rows={4} placeholder="Brief description of your experience and expertise..." />
                </Form.Item>
              </Col>

              {/* Preferences */}
              <Col xs={24} md={6}>
                <Form.Item
                  name="timezone"
                  label="Timezone"
                  rules={[{ required: true, message: 'Please select timezone' }]}
                >
                  <Select size="large">
                    <Option value="America/New_York">Eastern Time</Option>
                    <Option value="America/Chicago">Central Time</Option>
                    <Option value="America/Denver">Mountain Time</Option>
                    <Option value="America/Los_Angeles">Pacific Time</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item
                  name="language"
                  label="Language"
                  rules={[{ required: true, message: 'Please select language' }]}
                >
                  <Select size="large">
                    <Option value="en">English</Option>
                    <Option value="es">Spanish</Option>
                    <Option value="fr">French</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Save Profile
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined />
          Security
        </span>
      ),
      children: (
        <Card className="shadow-sm">
          <Form
            form={securityForm}
            layout="vertical"
            onFinish={handleSecuritySave}
            requiredMark={false}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="currentPassword"
                  label="Current Password"
                  rules={[{ required: true, message: 'Please enter current password' }]}
                >
                  <Input.Password 
                    size="large"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
              </Col>

              <Col span={24} />

              <Col xs={24} md={12}>
                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    { required: true, message: 'Please enter new password' },
                    { min: 8, message: 'Password must be at least 8 characters' }
                  ]}
                >
                  <Input.Password 
                    size="large"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm New Password"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Please confirm your password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match'));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    size="large"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Update Password
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )
    },
    {
      key: 'notifications',
      label: (
        <span>
          <NotificationOutlined />
          Notifications
        </span>
      ),
      children: (
        <Card className="shadow-sm">
          <Form
            form={notificationForm}
            layout="vertical"
            onFinish={handleNotificationSave}
            requiredMark={false}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Title level={5}>Communication Preferences</Title>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-500">Receive notifications via email</div>
                    </div>
                    <Form.Item name="emailNotifications" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-gray-500">Receive notifications via SMS</div>
                    </div>
                    <Form.Item name="smsNotifications" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>
                </div>

                <Divider />

                <Title level={5}>Alert Types</Title>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Appointment Reminders</div>
                      <div className="text-sm text-gray-500">Get notified about upcoming appointments</div>
                    </div>
                    <Form.Item name="appointmentReminders" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Patient Updates</div>
                      <div className="text-sm text-gray-500">Updates from patients and medical records</div>
                    </div>
                    <Form.Item name="patientUpdates" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">System Alerts</div>
                      <div className="text-sm text-gray-500">Important system notifications</div>
                    </div>
                    <Form.Item name="systemAlerts" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">New Patient Alerts</div>
                      <div className="text-sm text-gray-500">Notifications when new patients are assigned</div>
                    </div>
                    <Form.Item name="newPatientAlerts" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Cancellation Alerts</div>
                      <div className="text-sm text-gray-500">Get notified when appointments are cancelled</div>
                    </div>
                    <Form.Item name="cancelationAlerts" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Save Preferences
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )
    },
    {
      key: 'schedule',
      label: (
        <span>
          <CalendarOutlined />
          Schedule
        </span>
      ),
      children: (
        <Card className="shadow-sm">
          <Form
            form={scheduleForm}
            layout="vertical"
            onFinish={handleScheduleSave}
            requiredMark={false}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Title level={5}>Working Days</Title>
                <Form.Item
                  name="workingDays"
                  rules={[{ required: true, message: 'Please select working days' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select working days"
                    size="large"
                    style={{ width: '100%' }}
                  >
                    <Option value="monday">Monday</Option>
                    <Option value="tuesday">Tuesday</Option>
                    <Option value="wednesday">Wednesday</Option>
                    <Option value="thursday">Thursday</Option>
                    <Option value="friday">Friday</Option>
                    <Option value="saturday">Saturday</Option>
                    <Option value="sunday">Sunday</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="workingHours"
                  label="Working Hours"
                  rules={[{ required: true, message: 'Please set working hours' }]}
                >
                  <RangePicker format="HH:mm" size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="lunchBreak"
                  label="Lunch Break"
                >
                  <RangePicker format="HH:mm" size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="appointmentDuration"
                  label="Default Appointment Duration (minutes)"
                  rules={[{ required: true, message: 'Please enter duration' }]}
                >
                  <InputNumber size="large" min={15} max={120} step={15} style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="bufferTime"
                  label="Buffer Time Between Appointments (minutes)"
                >
                  <InputNumber size="large" min={0} max={30} step={5} style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="maxPatientsPerDay"
                  label="Maximum Patients Per Day"
                >
                  <InputNumber size="large" min={1} max={50} style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Divider />
                <Title level={5}>Schedule Preferences</Title>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Allow Emergency Slots</div>
                      <div className="text-sm text-gray-500">Reserve slots for emergency appointments</div>
                    </div>
                    <Form.Item name="allowEmergencySlots" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Automatic Breaks</div>
                      <div className="text-sm text-gray-500">Automatically add breaks between appointments</div>
                    </div>
                    <Form.Item name="autoBreaks" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Save Schedule Settings
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your profile and practice preferences</p>
      </div>

      {/* Quick Stats */}
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {scheduleSettings.workingDays.length}
            </div>
            <div className="text-sm text-gray-500">Working Days</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {scheduleSettings.appointmentDuration}min
            </div>
            <div className="text-sm text-gray-500">Appointment Duration</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {scheduleSettings.maxPatientsPerDay}
            </div>
            <div className="text-sm text-gray-500">Max Patients/Day</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              <ClockCircleOutlined />
            </div>
            <div className="text-sm text-gray-500">
              {scheduleSettings.workingHours[0]?.format('HH:mm')} - {scheduleSettings.workingHours[1]?.format('HH:mm')}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabbed Content */}
      <Card className="shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Card>
    </div>
  );
};

export default DoctorSettingsPage;
