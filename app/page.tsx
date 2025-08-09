"use client";
import { useState } from "react";
import { Card, Form, Input, Button, Typography, message, Layout, Space } from "antd";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const { Content } = Layout;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (values: { email: string }) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email: values.email });
    setLoading(false);
    if (error) {
      message.error(error.message);
    } else {
      setEmail(values.email);
      setOtpSent(true);
      message.success("OTP sent! Check your email for the code.");
    }
  };

  const handleVerifyOtp = async (values: { otp: string }) => {
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: values.otp,
      type: "email",
    });
    setVerifying(false);
    if (error) {
      message.error(error.message);
    } else {
      message.success("Login successful!");
      router.push("/dashboard");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#F7F8FA" }}>
      <Content style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Space direction="vertical" size="large" style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center" }}>
            <Typography.Title level={2} style={{ color: "#6C63FF", marginBottom: 8 }}>
              PhysioFlow
            </Typography.Title>
            <Typography.Text type="secondary">
              Modern Practice Management
            </Typography.Text>
          </div>
          
          <Card style={{ width: "100%", boxShadow: "0 4px 24px rgba(108,99,255,0.08)", borderRadius: 16 }}>
            <Typography.Title level={3} style={{ textAlign: "center", color: "#6C63FF", marginBottom: 24 }}>
              Login
            </Typography.Title>
            <Typography.Paragraph style={{ textAlign: "center", color: "#666", marginBottom: 24 }}>
              Enter your email to receive a one-time login code.
            </Typography.Paragraph>
            
            {!otpSent ? (
              <Form form={form} layout="vertical" onFinish={handleSendOtp}>
                <Form.Item 
                  name="email" 
                  label="Email" 
                  rules={[
                    { required: true, message: "Please enter your email" }, 
                    { type: "email", message: "Invalid email" }
                  ]}
                > 
                  <Input placeholder="you@example.com" size="large" autoFocus />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                    Send OTP
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <>
                <Typography.Paragraph style={{ color: "#6C63FF", textAlign: "center", marginBottom: 24 }}>
                  Please check your email ({email}) for the login code.
                </Typography.Paragraph>
                <Form form={otpForm} layout="vertical" onFinish={handleVerifyOtp}>
                  <Form.Item 
                    name="otp" 
                    label="OTP Code" 
                    rules={[{ required: true, message: "Please enter the code from your email" }]}
                  > 
                    <Input placeholder="Enter code" size="large" maxLength={6} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block loading={verifying}>
                      Verify & Login
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type="link" block onClick={() => setOtpSent(false)}>
                      Back to email entry
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
          </Card>
        </Space>
      </Content>
    </Layout>
  );
}
