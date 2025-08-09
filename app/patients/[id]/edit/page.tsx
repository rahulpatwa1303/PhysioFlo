"use client";
import SimpleLayout from "../../../components/SimpleLayout";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Form, Input, Button, DatePicker, Select, Typography, message, Row, Col, Divider, Spin } from "antd";
import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Options (no changes here) ---
const genderOptions = [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }, { label: "Other", value: "Other" }];
const durationOptions = [{ label: "<1 week", value: "<1 week" }, { label: "1-2 weeks", value: "1-2 weeks" }, { label: "2-4 weeks", value: "2-4 weeks" }, { label: "1-3 months", value: "1-3 months" }, { label: ">3 months", value: ">3 months" }, { label: "Chronic", value: "Chronic" }];
const painLocationOptions = [{ label: "Back", value: "Back" }, { label: "Neck", value: "Neck" }, { label: "Shoulder", value: "Shoulder" }, { label: "Knee", value: "Knee" }, { label: "Ankle", value: "Ankle" }, { label: "Other", value: "Other" }];

export default function EditPatientPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [patient, setPatient] = useState<any>(null); // This will hold the data for initialValues
    const [notFound, setNotFound] = useState(false);
    const router = useRouter();
    const params = useParams();
    const patientId = params?.id as string;

    useEffect(() => {
        if (!patientId) {
            setNotFound(true);
            return;
        }

        const fetchUserAndPatient = async () => {
            setLoading(true);
            const session = await supabase.auth.getSession();
            const uid = session.data.session?.user.id || null;

            if (!uid) {
                message.error("You must be logged in to edit patients.");
                setLoading(false);
                setNotFound(true);
                return;
            }

            const { data, error } = await supabase
                .from("patients")
                .select("*")
                .eq("id", patientId)
                .eq("user_id", uid)
                .single();

            if (error || !data) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            // FIX: Process the data here and store it in state for the form's initialValues
            const processedData = {
                ...data,
                date_of_birth: data.date_of_birth ? dayjs(data.date_of_birth) : null,
                pain_location: painLocationOptions.some(opt => opt.value === data.pain_location) ? data.pain_location : "Other",
                pain_location_custom: painLocationOptions.some(opt => opt.value === data.pain_location) ? undefined : data.pain_location,
            };

            setPatient(processedData);
            setLoading(false);
        };

        fetchUserAndPatient();
    }, [patientId]); // Dependency array is correct

    const handleDobChange = (date: any) => {
        if (date) {
            form.setFieldsValue({ age: dayjs().diff(date, "year") });
        } else {
            form.setFieldsValue({ age: undefined });
        }
        form.validateFields(["age"]);
    };

    const handlePainLocationChange = (value: string) => {
        if (value !== "Other") {
            form.setFieldsValue({ pain_location_custom: undefined });
        }
    };

    const handleFinish = async (values: any) => {
        setSaving(true);
        try {
            const { date_of_birth, pain_location, pain_location_custom, ...rest } = values;
            const finalPainLocation = pain_location === "Other" ? pain_location_custom : pain_location;

            const { error } = await supabase.from("patients").update({
                ...rest,
                pain_location: finalPainLocation,
                date_of_birth: date_of_birth ? dayjs(date_of_birth).format("YYYY-MM-DD") : null,
                updated_at: new Date().toISOString(),
            }).eq("id", patientId);

            if (error) {
                console.error("Supabase Error:", error);
                throw error;
            }
            message.success("Patient updated successfully");
            router.push("/patients");
        } catch (err: any) {
            message.error(err.message || "An error occurred while updating the patient.");
        }
        setSaving(false);
    };

    if (loading) {
        return <SimpleLayout><div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div></SimpleLayout>;
    }

    if (notFound || !patient) {
        return <SimpleLayout><div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography.Text type="danger">Patient not found or you do not have access.</Typography.Text></div></SimpleLayout>;
    }

    return (
        <SimpleLayout>
            <div style={{ maxWidth: 900, margin: "0 auto", marginTop: '1rem', padding: 24, height: 'calc(100vh - 80px)', overflow: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(108,99,255,0.08)' }}>
                <Typography.Title level={3} style={{ color: "#6C63FF" }}>Edit Patient: {patient.first_name}</Typography.Title>
                {/* FIX: Use `key` and `initialValues` props for reliable data population */}
                <Form
                    key={patientId}
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={patient}
                    validateTrigger={["onChange", "onBlur"]}
                >
                    {/* --- ALL Form.Item sections remain exactly the same --- */}
                    <Divider orientation="left">Personal Information</Divider>
                    <Row gutter={16}>
                        <Col xs={24} md={12}><Form.Item name="first_name" label="First Name" rules={[{ required: true }]}><Input /></Form.Item></Col>
                        <Col xs={24} md={12}><Form.Item name="last_name" label="Last Name"><Input /></Form.Item></Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} md={12}><Form.Item name="phone" label="Phone" rules={[{ required: true }]}><Input /></Form.Item></Col>
                        <Col xs={24} md={12}><Form.Item name="address" label="Address" rules={[{ required: true }]}><Input /></Form.Item></Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} md={8}><Form.Item name="date_of_birth" label="Date of Birth"><DatePicker style={{ width: "100%" }} onChange={handleDobChange} allowClear /></Form.Item></Col>
                        <Col xs={24} md={8}><Form.Item name="gender" label="Gender" rules={[{ required: true }]}><Select options={genderOptions} allowClear /></Form.Item></Col>
                        <Col xs={24} md={8}>
                            <Form.Item noStyle dependencies={['date_of_birth']}>{({ getFieldValue }) => (
                                <Form.Item name="age" label="Age" rules={[({ getFieldValue }) => ({ validator(_, value) { if (!getFieldValue('date_of_birth') && !value) { return Promise.reject(new Error('Age is required if DOB is not provided')); } return Promise.resolve(); } })]}><Input type="number" min={0} disabled={!!getFieldValue('date_of_birth')} placeholder={getFieldValue('date_of_birth') ? "Calculated" : "Enter age"} /></Form.Item>
                            )}</Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} md={12}><Form.Item name="occupation" label="Occupation"><Input /></Form.Item></Col>
                    </Row>
                    <Divider orientation="left">Medical Information</Divider>
                    <Row gutter={16}>
                        <Col xs={24} md={12}><Form.Item name="chief_complaint" label="Chief Complaint" rules={[{ required: true }]}><Input /></Form.Item></Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="pain_location" label="Pain Location" rules={[{ required: true }]}><Select options={painLocationOptions} onChange={handlePainLocationChange} allowClear /></Form.Item>
                            <Form.Item noStyle dependencies={['pain_location']}>{({ getFieldValue }) => getFieldValue('pain_location') === 'Other' ? (<Form.Item name="pain_location_custom" label="Custom Pain Location" rules={[{ required: true, message: "Please specify" }]}><Input /></Form.Item>) : null}</Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} md={12}><Form.Item name="duration" label="Duration" rules={[{ required: true }]}><Select options={durationOptions} allowClear /></Form.Item></Col>
                        <Col xs={24} md={12}><Form.Item name="medical_history" label="Medical History"><Input.TextArea rows={2} /></Form.Item></Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} md={12}><Form.Item name="current_medications" label="Current Medications"><Input.TextArea rows={2} /></Form.Item></Col>
                        <Col xs={24} md={12}><Form.Item name="allergies" label="Allergies"><Input.TextArea rows={2} /></Form.Item></Col>
                    </Row>
                    <Divider orientation="left">Notes</Divider>
                    <Row gutter={16}>
                        <Col xs={24}><Form.Item name="notes" label="Notes"><Input.TextArea rows={3} /></Form.Item></Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={saving} style={{ minWidth: 120 }}>Update Patient</Button>
                        <Button style={{ marginLeft: 16 }} onClick={() => router.push("/patients")}>Cancel</Button>
                    </Form.Item>
                </Form>
            </div>
        </SimpleLayout>
    );
}