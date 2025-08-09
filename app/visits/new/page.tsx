"use client";
import SimpleLayout from "../../components/SimpleLayout";
import { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, Typography, message, Row, Col, Divider, Radio } from "antd";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const frequencyOptions = [
  { label: "Daily", value: "daily" },
  { label: "Alternate Days", value: "alternate" },
  { label: "Custom", value: "custom" },
];

export default function AddVisitPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [visitType, setVisitType] = useState<'continue' | 'package'>('continue');
  const [customDays, setCustomDays] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndPatients = async () => {
      const session = await supabase.auth.getSession();
      const uid = session.data.session?.user.id || null;
      setUserId(uid);
      if (!uid) return;
      const { data: pats } = await supabase
        .from("patients")
        .select("id, first_name, last_name")
        .eq("user_id", uid);
      setPatients(pats || []);
    };
    fetchUserAndPatients();
  }, []);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const { visit_date, number_of_sessions, frequency, notes, fee, patient_id } = values;
      let visitsToInsert = [];
      if (visitType === 'package') {
        const sessions = Number(number_of_sessions);
        let dates: string[] = [];
        if (frequency === "daily") {
          for (let i = 0; i < sessions; i++) {
            dates.push(dayjs(visit_date).add(i, "day").toISOString());
          }
        } else if (frequency === "alternate") {
          for (let i = 0; i < sessions; i++) {
            dates.push(dayjs(visit_date).add(i * 2, "day").toISOString());
          }
        } else if (frequency === "custom" && customDays) {
          const offsets = customDays.split(",").map(d => Number(d.trim())).filter(d => !isNaN(d));
          dates = offsets.map(offset => dayjs(visit_date).add(offset, "day").toISOString());
        }
        visitsToInsert = dates.map(date => ({
          patient_id,
          visit_date: date,
          fee,
          status: "SCHEDULED",
          payment_status: "UNPAID",
          notes,
          user_id: userId,
        }));
      } else {
        visitsToInsert = [{
          patient_id,
          visit_date: visit_date ? dayjs(visit_date).toISOString() : null,
          fee,
          status: "SCHEDULED",
          payment_status: "UNPAID",
          notes,
          user_id: userId,
        }];
      }
      const { error } = await supabase.from("visits").insert(visitsToInsert);
      if (error) throw error;
      message.success(visitType === 'package' ? "Package visits added" : "Visit added");
      router.push("/visits");
    } catch (err: any) {
      message.error(err.message || "Error adding visit");
    }
    setLoading(false);
  };

  return (
    <SimpleLayout>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(108,99,255,0.08)' }}>
        <Typography.Title level={3} style={{ color: "#6C63FF" }}>Add Visit</Typography.Title>
        <Form form={form} layout="vertical" onFinish={handleFinish} validateTrigger={["onChange", "onBlur"]}>
          <Divider orientation="left">Visit Type</Divider>
          <Form.Item>
            <Radio.Group value={visitType} onChange={e => setVisitType(e.target.value)}>
              <Radio.Button value="continue">Continue Visit</Radio.Button>
              <Radio.Button value="package">Create Package</Radio.Button>
            </Radio.Group>
          </Form.Item>
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
              <Form.Item name="visit_date" label={visitType === 'package' ? "Start Date" : "Date & Time"} rules={[{ required: true, message: visitType === 'package' ? "Start date is required" : "Date & time is required" }]}> 
                <DatePicker showTime={visitType !== 'package'} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          {visitType === 'package' && (
            <>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="number_of_sessions" label="Number of Sessions" rules={[{ required: true, message: "Number of sessions is required" }]}> 
                    <Input type="number" min={1} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="frequency" label="Frequency" rules={[{ required: true, message: "Frequency is required" }]}> 
                    <Select options={frequencyOptions} onChange={val => { if (val !== "custom") setCustomDays(""); }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Custom Days (comma-separated)" style={{ marginBottom: 0 }}>
                    <Input
                      value={customDays}
                      onChange={e => setCustomDays(e.target.value)}
                      disabled={form.getFieldValue("frequency") !== "custom"}
                      placeholder="e.g. 0,2,4,7"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="fee" label="Fee" rules={[{ required: true, message: "Fee is required" }]}> 
                <Input type="number" min={0} prefix="₹" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item name="notes" label="Notes"> <Input.TextArea rows={3} /> </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ minWidth: 120 }}>
              {visitType === 'package' ? "Add Package" : "Add Visit"}
            </Button>
            <Button style={{ marginLeft: 16 }} onClick={() => router.push("/visits")}>Cancel</Button>
          </Form.Item>
        </Form>
      </div>
    </SimpleLayout>
  );
}
