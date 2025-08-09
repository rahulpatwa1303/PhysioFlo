"use client";
import SimpleLayout from "../components/SimpleLayout";
import PageLoader from "../components/PageLoader";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table, Button, Select, DatePicker, Typography, Space, Tag, Input, Card, Row, Col, Avatar } from "antd";
import { PlusOutlined, UserOutlined, CalendarOutlined, EditOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const statusOptions = [
  { label: "Upcoming", value: "SCHEDULED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "All", value: "ALL" },
];

export default function VisitsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters from URL
  const status = searchParams.get("status") || "SCHEDULED";
  const patientId = searchParams.get("patient") || undefined;
  const dateRange = searchParams.get("dates")
    ? searchParams.get("dates")!.split(",").map(d => dayjs(d))
    : undefined;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update URL with filters
  const setFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`/visits?${params.toString()}`);
  };

  useEffect(() => {
    const fetchUserAndPatients = async () => {
      const session = await supabase.auth.getSession();
      const uid = session.data.session?.user.id || null;
      setUserId(uid);
      if (!uid) return;
      // Fetch patients for filter dropdown
      const { data: pats } = await supabase
        .from("patients")
        .select("id, first_name, last_name")
        .eq("user_id", uid);
      setPatients(pats || []);
    };
    fetchUserAndPatients();
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchVisits();
    // eslint-disable-next-line
  }, [userId, status, patientId, searchParams.get("dates")]);

  const fetchVisits = async () => {
    setLoading(true);
    let query = supabase
      .from("visits")
      .select("*, patient:patients(first_name, last_name)")
      .eq("user_id", userId);
    if (status && status !== "ALL") {
      query = query.eq("status", status);
      if (status === "SCHEDULED") {
        query = query.gte("visit_date", dayjs().startOf("day").toISOString());
      }
    }
    if (patientId) {
      query = query.eq("patient_id", patientId);
    }
    if (dateRange && dateRange.length === 2) {
      query = query.gte("visit_date", dateRange[0].startOf("day").toISOString());
      query = query.lte("visit_date", dateRange[1].endOf("day").toISOString());
    }
    query = query.order("visit_date", { ascending: true });
    const { data, error } = await query;
    setVisits(data || []);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      case 'SCHEDULED': return 'blue';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'green';
      case 'PARTIAL': return 'orange';
      case 'UNPAID': return 'red';
      default: return 'default';
    }
  };

  const VisitCard = ({ visit }: { visit: any }) => (
    <Card
      size="small"
      style={{
        marginBottom: 12,
        borderRadius: 12,
        border: `1px solid ${visit.status === 'SCHEDULED' ? '#1890ff' : visit.status === 'COMPLETED' ? '#52c41a' : '#ff4d4f'}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: visit.status === 'SCHEDULED' ? '#1890ff' : 
                              visit.status === 'COMPLETED' ? '#52c41a' : '#ff4d4f'
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text strong style={{ fontSize: 16 }}>
              {visit.patient?.first_name || ''} {visit.patient?.last_name || ''}
            </Text>
            <br />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <CalendarOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(visit.visit_date).format('DD MMM YYYY, h:mm A')}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Text style={{ fontSize: 14, fontWeight: 600, color: '#6C63FF' }}>
                ₹{visit.fee}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                • {visit.consultation_type || 'In-Person'}
              </Text>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Tag color={getStatusColor(visit.status)} style={{ fontSize: '10px', margin: 0 }}>
              {visit.status}
            </Tag>
            <Tag color={getPaymentStatusColor(visit.payment_status)} style={{ fontSize: '10px', margin: 0 }}>
              {visit.payment_status}
            </Tag>
          </div>
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => router.push(`/visits/${visit.id}/edit`)}
            style={{ fontSize: 12, height: 32 }}
          >
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <SimpleLayout>
      <PageLoader loading={loading}>
        <div style={{ 
          padding: isMobile ? '12px 16px' : 24,
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 56px)'
        }}>
        <Title 
          level={2} 
          style={{ 
            color: "#6C63FF", 
            fontSize: isMobile ? '20px' : '24px',
            marginBottom: 16
          }}
        >
          Visits
        </Title>
        
        {/* Filters */}
        <Card style={{ marginBottom: 16, borderRadius: 12 }}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={status}
                options={statusOptions}
                onChange={val => setFilter("status", val === "ALL" ? undefined : val)}
                style={{ width: '100%', height: isMobile ? 40 : 32 }}
                placeholder="Status"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                allowClear
                placeholder="Select Patient"
                value={patientId}
                options={patients.map((p: any) => ({ 
                  value: p.id, 
                  label: `${p.first_name} ${p.last_name || ""}` 
                }))}
                onChange={val => setFilter("patient", val)}
                style={{ width: '100%', height: isMobile ? 40 : 32 }}
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <DatePicker.RangePicker
                allowClear
                value={dateRange as any}
                onChange={dates => setFilter("dates", dates && dates.length === 2 ? `${dates[0]?.toISOString()},${dates[1]?.toISOString()}` : undefined)}
                style={{ width: '100%', height: isMobile ? 40 : 32 }}
                placeholder={['Start Date', 'End Date']}
              />
            </Col>
            <Col xs={24} sm={24} md={4}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => router.push("/visits/new")}
                style={{ 
                  width: '100%',
                  height: isMobile ? 40 : 32,
                  fontSize: isMobile ? '14px' : '13px'
                }}
              >
                Add Visit
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Visits Content */}
        {isMobile ? (
          // Mobile Card View
          <div style={{
            height: 'calc(100vh - 280px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 32 }}>
                <Text>Loading visits...</Text>
              </div>
            ) : visits.length > 0 ? (
              visits.map(visit => (
                <VisitCard key={visit.id} visit={visit} />
              ))
            ) : (
              <Card style={{ textAlign: 'center', padding: 32 }}>
                <CalendarOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                <Title level={4} type="secondary">No visits found</Title>
                <Text type="secondary">
                  {status !== 'ALL' || patientId || dateRange ? 'Try adjusting your filters' : 'Add your first visit to get started'}
                </Text>
              </Card>
            )}
          </div>
        ) : (
          // Desktop Table View
          <Card style={{ borderRadius: 12 }}>
            <Table
              dataSource={visits}
              rowKey="id"
              loading={loading}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} visits`
              }}
              scroll={{ x: 800 }}
              columns={[
                {
                  title: "Date",
                  dataIndex: "visit_date",
                  render: (date: string) => dayjs(date).format("DD MMM YYYY, HH:mm"),
                  sorter: (a: any, b: any) => dayjs(a.visit_date).unix() - dayjs(b.visit_date).unix(),
                },
                {
                  title: "Patient",
                  dataIndex: ["patient", "first_name"],
                  render: (_: any, record: any) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor: '#6C63FF' }} />
                      <Text strong>{record.patient?.first_name || ""} {record.patient?.last_name || ""}</Text>
                    </div>
                  ),
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (status: string) => (
                    <Tag color={getStatusColor(status)}>{status}</Tag>
                  ),
                },
                {
                  title: "Fee",
                  dataIndex: "fee",
                  render: (fee: number) => (
                    <Text strong style={{ color: '#6C63FF' }}>₹{fee}</Text>
                  ),
                  sorter: (a: any, b: any) => a.fee - b.fee,
                },
                {
                  title: "Payment",
                  dataIndex: "payment_status",
                  render: (status: string) => (
                    <Tag color={getPaymentStatusColor(status)}>{status}</Tag>
                  ),
                },
                {
                  title: "Consultation",
                  dataIndex: "consultation_type",
                  render: (type: string) => (
                    <Tag color="blue">{type || 'In-Person'}</Tag>
                  ),
                },
                {
                  title: "Actions",
                  key: "actions",
                  render: (_: any, record: any) => (
                    <Space>
                      <Button 
                        size="small" 
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/visits/${record.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        )}
        </div>
      </PageLoader>
    </SimpleLayout>
  );
}
