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

const statusOptions = [
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];
const paymentStatusOptions = [
  { label: "Unpaid", value: "UNPAID" },
  { label: "Paid", value: "PAID" },
];

export default function EditVisitPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [visit, setVisit] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();
  const params = useParams();
  const visitId = params?.id as string;

  useEffect(() => {
    if (!visitId) {
      setNotFound(true);
      return;
    }
    const fetchData = async () => {
      const session = await supabase.auth.getSession();
      const uid = session.data.session?.user.id || null;
      if (!uid) {
        message.error("You must be logged in to edit visits.");
        setNotFound(true);
        setLoading(false);
        return;
      }
      // Fetch patients for dropdown
      const { data: pats } = await supabase
        .from("patients")
        .select("id, first_name, last_name")
        .eq("user_id", uid);
      setPatients(pats || []);
      // Fetch visit
      const { data, error } = await supabase
        .from("visits")
        .select("*")
        .eq("id", visitId)
        .eq("user_id", uid)
        .single();
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setVisit({
        ...data,
        visit_date: data.visit_date ? dayjs(data.visit_date) : null,
      });
      setLoading(false);
    };
    fetchData();
  }, [visitId]);

  const handleFinish = async (values: any) => {
    setSaving(true);
    try {
      const { visit_date, ...rest } = values;
      const { error } = await supabase.from("visits").update({
        ...rest,
        visit_date: visit_date ? dayjs(visit_date).toISOString() : null,
        updated_at: new Date().toISOString(),
      }).eq("id", visitId);
      if (error) throw error;
      message.success("Visit updated successfully");
      router.push("/visits");
    } catch (err: any) {
      message.error(err.message || "An error occurred while updating the visit.");
    }
    setSaving(false);
  };

  if (loading) {
    return <SimpleLayout><div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div></SimpleLayout>;
  }
  if (notFound || !visit) {
    return <SimpleLayout><div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography.Text type="danger">Visit not found or you do not have access.</Typography.Text></div></SimpleLayout>;
  }

  return (
    <SimpleLayout>
      <div style={{ maxWidth: 700, margin: "0 auto", marginTop:'1rem', padding: 24, height: 'calc(100vh - 80px)', overflow: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(108,99,255,0.08)' }}>
        <Typography.Title level={3} style={{ color: "#6C63FF" }}>Edit Visit</Typography.Title>
        <Form
          key={visitId}
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={visit}
          validateTrigger={["onChange", "onBlur"]}
        >
          <Divider orientation="left">Visit Details</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="patient_id" label="Patient" rules={[{ required: true, message: "Patient is required" }]}> 
                <Select
                  showSearch
                  placeholder="Select patient"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                  }
                  options={patients.map((p: any) => ({ value: p.id, label: `${p.first_name} ${p.last_name || ""}` }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="visit_date" label="Date & Time" rules={[{ required: true, message: "Date & time is required" }]}> 
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="fee" label="Fee" rules={[{ required: true, message: "Fee is required" }]}> 
                <Input type="number" min={0} prefix="₹" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status is required" }]}> 
                <Select options={statusOptions} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="payment_status" label="Payment Status" rules={[{ required: true, message: "Payment status is required" }]}> 
                <Select options={paymentStatusOptions} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item name="notes" label="Notes"> <Input.TextArea rows={3} /> </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} style={{ minWidth: 120 }}>
              Update Visit
            </Button>
            <Button style={{ marginLeft: 16 }} onClick={() => router.push("/visits")}>Cancel</Button>
          </Form.Item>
        </Form>
      </div>
    </SimpleLayout>
  );
}
