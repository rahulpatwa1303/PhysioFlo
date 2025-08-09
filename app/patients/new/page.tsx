"use client";
import SimpleLayout from "../../components/SimpleLayout";
import { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, Typography, message, Row, Col, Divider } from "antd";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Options for Select components
const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
const durationOptions = [
  { label: "<1 week", value: "<1 week" },
  { label: "1-2 weeks", value: "1-2 weeks" },
  { label: "2-4 weeks", value: "2-4 weeks" },
  { label: "1-3 months", value: "1-3 months" },
  { label: ">3 months", value: ">3 months" },
  { label: "Chronic", value: "Chronic" },
];
const painLocationOptions = [
  { label: "Back", value: "Back" },
  { label: "Neck", value: "Neck" },
  { label: "Shoulder", value: "Shoulder" },
  { label: "Knee", value: "Knee" },
  { label: "Ankle", value: "Ankle" },
  { label: "Other", value: "Other" },
];

export default function AddPatientPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true); // <-- FIX: State to track initial user fetch
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const session = await supabase.auth.getSession();
      setUserId(session.data.session?.user.id || null);
      setInitializing(false); // <-- FIX: Mark initialization as complete
    };
    fetchUser();
  }, []);

  // Calculate age when Date of Birth changes
  const handleDobChange = (date: any) => {
    if (date) {
      const years = dayjs().diff(date, "year");
      form.setFieldsValue({ age: years });
    } else {
      // Clear age if DOB is cleared, allowing user to input it manually
      form.setFieldsValue({ age: undefined });
    }
    // Trigger validation for the age field since its requirement might have changed
    form.validateFields(["age"]);
  };

  // Reset custom pain location field when the main pain location changes
  const handlePainLocationChange = (value: string) => {
    if (value !== "Other") {
      form.setFieldsValue({ pain_location_custom: undefined });
    }
  };

  const handleFinish = async (values: any) => {
    if (initializing) {
        message.warning("Still loading user data. Please wait a moment.");
        return;
    }
    setLoading(true);
    try {
      const { date_of_birth, pain_location, pain_location_custom, ...rest } = values;
      const finalPainLocation = pain_location === "Other" ? pain_location_custom : pain_location;
      
      const { error } = await supabase.from("patients").insert([
        {
          ...rest,
          pain_location: finalPainLocation,
          date_of_birth: date_of_birth ? dayjs(date_of_birth).format("YYYY-MM-DD") : null,
          user_id: userId,
        },
      ]);
      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }
      message.success("Patient added successfully");
      router.push("/patients");
    } catch (err: any) {
      message.error(err.message || "An error occurred while adding the patient.");
    }
    setLoading(false);
  };

  return (
    <SimpleLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", marginTop:'1rem', padding: 24, height: 'calc(100vh - 80px)', overflow: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(108,99,255,0.08)' }}>
        <Typography.Title level={3} style={{ color: "#6C63FF" }}>Add Patient</Typography.Title>
        {/* FIX: Moved validateTrigger to the Form component for cleaner code */}
        <Form form={form} layout="vertical" onFinish={handleFinish} validateTrigger={["onChange", "onBlur"]}>
          <Divider orientation="left">Personal Information</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: "First name is required" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="last_name" label="Last Name">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Phone is required" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="address" label="Address" rules={[{ required: true, message: "Address is required" }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="date_of_birth" label="Date of Birth">
                <DatePicker style={{ width: "100%" }} onChange={handleDobChange} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Gender is required" }]}>
                <Select options={genderOptions} allowClear />
              </Form.Item>
            </Col>
            {/* FIX: This entire block is refactored for stability */}
            <Col xs={24} md={8}>
              <Form.Item noStyle dependencies={['date_of_birth']}>
                {({ getFieldValue }) => (
                  <Form.Item
                    name="age"
                    label="Age"
                    dependencies={['date_of_birth']}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!getFieldValue('date_of_birth') && !value) {
                            return Promise.reject(new Error('Age is required if DOB is not provided'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input
                      type="number"
                      min={0}
                      disabled={!!getFieldValue('date_of_birth')}
                      placeholder={getFieldValue('date_of_birth') ? "Calculated from DOB" : "Enter age"}
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="occupation" label="Occupation">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">Medical Information</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="chief_complaint" label="Chief Complaint" rules={[{ required: true, message: "Chief complaint is required" }]}>
                <Input />
              </Form.Item>
            </Col>
            {/* FIX: This block is refactored for stability and clarity */}
            <Col xs={24} md={12}>
              <Form.Item name="pain_location" label="Pain Location" rules={[{ required: true, message: "Pain location is required" }]}>
                <Select options={painLocationOptions} onChange={handlePainLocationChange} allowClear />
              </Form.Item>
              <Form.Item noStyle dependencies={['pain_location']}>
                {({ getFieldValue }) =>
                  getFieldValue('pain_location') === 'Other' ? (
                    <Form.Item
                      name="pain_location_custom"
                      label="Custom Pain Location"
                      rules={[{ required: true, message: "Please specify the other pain location" }]}
                    >
                      <Input />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="duration" label="Duration" rules={[{ required: true, message: "Duration is required" }]}> 
                <Select options={durationOptions} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="medical_history" label="Medical History">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="current_medications" label="Current Medications">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="allergies" label="Allergies">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">Notes</Divider>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            {/* FIX: Disabled prop added to prevent submission before user data is loaded */}
            <Button type="primary" htmlType="submit" loading={loading} disabled={initializing} style={{ minWidth: 120 }}>
              Add Patient
            </Button>
            <Button style={{ marginLeft: 16 }} onClick={() => router.push("/patients")}>Cancel</Button>
          </Form.Item>
        </Form>
      </div>
    </SimpleLayout>
  );
}