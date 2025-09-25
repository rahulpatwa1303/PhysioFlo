"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Card, Select } from 'antd';
import { MailOutlined, KeyOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const router = useRouter();

  const handleSendOtp = async (values) => {
    console.log('Sending OTP to:', values.email);
    // --- Mock API Call ---
    // In a real app, you would call your backend to send the OTP
    message.success(`OTP sent to ${values.email}`);
    setOtpSent(true);
  };

  const handleLogin = (values) => {
    console.log('Verifying OTP:', values.otp, 'Role:', values.role);
    // --- Mock API Call & Logic ---
    // In a real app, you verify the OTP with your backend
    // For this dummy version, any 6-digit OTP is "valid"
    if (values.otp && values.otp.length === 6 && values.role) {
      message.success('Login Successful!');
      // Store user role in localStorage for demo purposes
      localStorage.setItem('userRole', values.role);
      // Redirect based on role
      if (values.role === 'doctor') {
        router.push('/doctor/dashboard');
      } else if (values.role === 'staff') {
        router.push('/staff/dashboard');
      } else if (values.role === 'tenant-admin') {
        router.push('/tenant-admin/dashboard');
      }
    } else {
      message.error('Please enter a valid 6-digit OTP and select a role.');
    }
  };

  const onFinish = (values) => {
    if (!otpSent) {
      handleSendOtp(values);
    } else {
      handleLogin(values);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Pre Clinic</h1>
          <p className="text-gray-500">
            {otpSent ? 'Enter the OTP and select your role' : 'Sign in to your account'}
          </p>
        </div>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          {!otpSent ? (
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="e.g., name@example.com" size="large" />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="otp"
                label="One-Time Password (OTP)"
                rules={[{ required: true, message: 'Please input the OTP!' }]}
              >
                <Input prefix={<KeyOutlined />} placeholder="6-digit code" size="large" maxLength={6} />
              </Form.Item>
              
              <Form.Item
                name="role"
                label="Select Role"
                rules={[{ required: true, message: 'Please select your role!' }]}
              >
                <Select placeholder="Choose your role" size="large">
                  <Option value="doctor">Doctor</Option>
                  <Option value="staff">Staff / Nurse</Option>
                  <Option value="tenant-admin">Tenant Admin</Option>
                </Select>
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {otpSent ? 'Verify & Login' : 'Send OTP'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;