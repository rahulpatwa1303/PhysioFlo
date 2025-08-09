"use client";
import SimpleLayout from "../components/SimpleLayout";
import PageLoader from "../components/PageLoader";
import { useEffect, useState } from "react";
import { Table, Button, Input, Typography, message, Space, Popconfirm, Card, Row, Col, Avatar, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await supabase.auth.getSession();
      setUserId(session.data.session?.user.id || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchPatients();
    // eslint-disable-next-line
  }, [userId]);

  const fetchPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      message.error("Failed to fetch patients");
    } else {
      setPatients(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (record: any) => {
    router.push(`/patients/${record.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("patients").delete().eq("id", id);
    if (error) {
      message.error("Failed to delete patient");
    } else {
      message.success("Patient deleted");
      fetchPatients();
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.first_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.last_name && p.last_name.toLowerCase().includes(search.toLowerCase())) ||
      (p.phone && p.phone.includes(search))
  );

  const PatientCard = ({ patient }: { patient: any }) => (
    <Card
      size="small"
      style={{
        marginBottom: 12,
        borderRadius: 12,
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#6C63FF' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Typography.Text strong style={{ fontSize: 16 }}>
              {patient.first_name} {patient.last_name || ''}
            </Typography.Text>
            <br />
            {patient.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <PhoneOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {patient.phone}
                </Typography.Text>
              </div>
            )}
            {patient.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <HomeOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {patient.address}
                </Typography.Text>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(patient)}
            style={{ fontSize: 12, height: 32 }}
          >
            Edit
          </Button>
          <Popconfirm title="Delete this patient?" onConfirm={() => handleDelete(patient.id)}>
            <Button 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
              style={{ fontSize: 12, height: 32 }}
            >
              Delete
            </Button>
          </Popconfirm>
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
        <Typography.Title 
          level={2} 
          style={{ 
            color: "#6C63FF", 
            fontSize: isMobile ? '20px' : '24px',
            marginBottom: 16
          }}
        >
          Patients
        </Typography.Title>
        
        <Card style={{ marginBottom: 16, borderRadius: 12 }}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} sm={16} md={18}>
              <Input.Search
                placeholder="Search by name or phone"
                allowClear
                size={isMobile ? "large" : "middle"}
                style={{ 
                  width: '100%',
                  fontSize: isMobile ? '16px' : '14px'
                }}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onSearch={value => setSearch(value)}
              />
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => router.push("/patients/new")}
                size={isMobile ? "large" : "middle"}
                style={{
                  width: '100%',
                  fontSize: isMobile ? '14px' : '13px'
                }}
                block
              >
                Add Patient
              </Button>
            </Col>
          </Row>
        </Card>

        {isMobile ? (
          // Mobile Card View
          <div style={{
            height: 'calc(100vh - 280px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 32 }}>
                <Typography.Text>Loading patients...</Typography.Text>
              </div>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <PatientCard key={patient.id} patient={patient} />
              ))
            ) : (
              <Card style={{ textAlign: 'center', padding: 32 }}>
                <UserOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                <Typography.Title level={4} type="secondary">No patients found</Typography.Title>
                <Typography.Text type="secondary">
                  {search ? 'Try adjusting your search terms' : 'Add your first patient to get started'}
                </Typography.Text>
              </Card>
            )}
          </div>
        ) : (
          // Desktop Table View
          <div style={{ 
            background: '#fff', 
            borderRadius: 12, 
            boxShadow: '0 2px 12px rgba(108,99,255,0.08)', 
            padding: 8 
          }}>
            <Table
              dataSource={filteredPatients}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              style={{ background: '#fff', borderRadius: 12 }}
              columns={[
                { title: "First Name", dataIndex: "first_name" },
                { title: "Last Name", dataIndex: "last_name" },
                { title: "Phone", dataIndex: "phone" },
                { title: "Address", dataIndex: "address" },
                {
                  title: "Actions",
                  key: "actions",
                  render: (_: any, record: any) => (
                    <Space>
                      <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                      <Popconfirm title="Delete this patient?" onConfirm={() => handleDelete(record.id)}>
                        <Button icon={<DeleteOutlined />} danger />
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
            />
          </div>
        )}
        </div>
      </PageLoader>
    </SimpleLayout>
  );
}
