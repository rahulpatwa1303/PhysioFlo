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
  Checkbox,
  InputNumber,
  notification
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  NotificationOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  UploadOutlined,
  SaveOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Paragraph } = Typography;
const { RangePicker } = TimePicker;

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [systemForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'John Admin',
    email: 'admin@preclinic.com',
    phone: '+1 (555) 123-4567',
    position: 'System Administrator',
    avatar: null,
    timezone: 'America/New_York',
    language: 'en',
    dateFormat: 'MM/DD/YYYY'
  });

  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    systemAlerts: true,
    billingAlerts: true,
    reportAlerts: false,
    weeklyDigest: true
  });

  // Mock system settings
  const [systemSettings, setSystemSettings] = useState({
    clinicName: 'Pre Clinic Healthcare',
    clinicAddress: '123 Healthcare Ave, Medical City, MC 12345',
    clinicPhone: '+1 (555) 123-4567',
    clinicEmail: 'info@preclinic.com',
    workingHours: [dayjs('09:00', 'HH:mm'), dayjs('17:00', 'HH:mm')],
    appointmentDuration: 30,
    maxAdvanceBooking: 90,
    autoConfirmAppointments: false,
    allowOnlineBooking: true,
    requireInsurance: true
  });

  useEffect(() => {
    // Initialize forms with current data
    profileForm.setFieldsValue(userData);
    notificationForm.setFieldsValue(notificationSettings);
    systemForm.setFieldsValue({
      ...systemSettings,
      workingHours: systemSettings.workingHours
    });
  }, [userData, notificationSettings, systemSettings]);

  const handleProfileSave = async (values) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserData({ ...userData, ...values });
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

  const handleSystemSave = async (values) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSystemSettings({ ...systemSettings, ...values });
      notification.success({
        message: 'System Settings Updated',
        description: 'System settings have been saved successfully.'
      });
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: 'Failed to update system settings. Please try again.'
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
                  <Avatar size={100} src={userData.avatar} icon={<UserOutlined />} />
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
                  name="position"
                  label="Position"
                >
                  <Input size="large" />
                </Form.Item>
              </Col>

              {/* Preferences */}
              <Col xs={24} md={8}>
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

              <Col xs={24} md={8}>
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

              <Col xs={24} md={8}>
                <Form.Item
                  name="dateFormat"
                  label="Date Format"
                  rules={[{ required: true, message: 'Please select date format' }]}
                >
                  <Select size="large">
                    <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                    <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                    <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
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
                <Divider />
                <Title level={5}>Two-Factor Authentication</Title>
                <Paragraph type="secondary">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </Paragraph>
                <Button type="default" icon={<SecurityScanOutlined />}>
                  Enable 2FA
                </Button>
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
                      <div className="font-medium">System Alerts</div>
                      <div className="text-sm text-gray-500">Important system notifications</div>
                    </div>
                    <Form.Item name="systemAlerts" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Billing Alerts</div>
                      <div className="text-sm text-gray-500">Payment and billing notifications</div>
                    </div>
                    <Form.Item name="billingAlerts" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Report Alerts</div>
                      <div className="text-sm text-gray-500">New reports and analytics</div>
                    </div>
                    <Form.Item name="reportAlerts" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Weekly Digest</div>
                      <div className="text-sm text-gray-500">Summary of weekly activities</div>
                    </div>
                    <Form.Item name="weeklyDigest" valuePropName="checked" className="mb-0">
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
      key: 'system',
      label: (
        <span>
          <SettingOutlined />
          System
        </span>
      ),
      children: (
        <Card className="shadow-sm">
          <Form
            form={systemForm}
            layout="vertical"
            onFinish={handleSystemSave}
            requiredMark={false}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Title level={5}>Clinic Information</Title>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="clinicName"
                  label="Clinic Name"
                  rules={[{ required: true, message: 'Please enter clinic name' }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="clinicPhone"
                  label="Clinic Phone"
                  rules={[{ required: true, message: 'Please enter clinic phone' }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="clinicAddress"
                  label="Clinic Address"
                  rules={[{ required: true, message: 'Please enter clinic address' }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="clinicEmail"
                  label="Clinic Email"
                  rules={[
                    { required: true, message: 'Please enter clinic email' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Divider />
                <Title level={5}>Appointment Settings</Title>
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

              <Col xs={24} md={6}>
                <Form.Item
                  name="appointmentDuration"
                  label="Default Duration (minutes)"
                  rules={[{ required: true, message: 'Please enter duration' }]}
                >
                  <InputNumber size="large" min={15} max={120} step={15} style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item
                  name="maxAdvanceBooking"
                  label="Max Advance Booking (days)"
                  rules={[{ required: true, message: 'Please enter max days' }]}
                >
                  <InputNumber size="large" min={1} max={365} style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Auto-confirm Appointments</div>
                      <div className="text-sm text-gray-500">Automatically confirm new appointments</div>
                    </div>
                    <Form.Item name="autoConfirmAppointments" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Allow Online Booking</div>
                      <div className="text-sm text-gray-500">Enable patient online appointment booking</div>
                    </div>
                    <Form.Item name="allowOnlineBooking" valuePropName="checked" className="mb-0">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Require Insurance Information</div>
                      <div className="text-sm text-gray-500">Make insurance details mandatory</div>
                    </div>
                    <Form.Item name="requireInsurance" valuePropName="checked" className="mb-0">
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
                    Save System Settings
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
        <p className="text-gray-500">Manage your account and system preferences</p>
      </div>

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

export default AdminSettingsPage;
