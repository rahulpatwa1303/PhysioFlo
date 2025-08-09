"use client";
import { useEffect, useState } from "react";
import { Layout, Menu, Typography, Card, Row, Col, Statistic, Button, Space } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  LogoutOutlined,
  MedicineBoxOutlined
} from "@ant-design/icons";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push("/");
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          router.push("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/patients",
      icon: <TeamOutlined />,
      label: "Patients",
    },
    {
      key: "/visits",
      icon: <MedicineBoxOutlined />,
      label: "Visits",
    },
    {
      key: "/schedule",
      icon: <CalendarOutlined />,
      label: "Schedule",
    },
    {
      key: "/payments",
      icon: <DollarOutlined />,
      label: "Payments",
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} style={{ background: "#fff" }}>
        <div style={{ padding: "16px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
          <Title level={4} style={{ color: "#6C63FF", margin: 0 }}>
            PhysioFlow
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={["/dashboard"]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{ border: "none" }}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          background: "#fff", 
          padding: "0 24px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
        }}>
          <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
          <Space>
            <Text>{user.email}</Text>
            <Button icon={<LogoutOutlined />} onClick={handleSignOut}>
              Logout
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: "24px", background: "#f5f5f5" }}>
          <div style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}>
            <Title level={2} style={{ marginBottom: "24px" }}>
              Welcome to PhysioFlow
            </Title>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total Patients"
                    value={156}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Today's Appointments"
                    value={8}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="This Month's Revenue"
                    value={45200}
                    prefix={<DollarOutlined />}
                    precision={0}
                    valueStyle={{ color: "#cf1322" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Pending Visits"
                    value={12}
                    prefix={<MedicineBoxOutlined />}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ marginTop: "32px" }}>
              <Title level={3}>Quick Actions</Title>
              <Space wrap>
                <Button type="primary" icon={<TeamOutlined />} onClick={() => router.push("/patients/new")}>
                  Add New Patient
                </Button>
                <Button icon={<MedicineBoxOutlined />} onClick={() => router.push("/visits/new")}>
                  Record Visit
                </Button>
                <Button icon={<CalendarOutlined />} onClick={() => router.push("/schedule")}>
                  View Schedule
                </Button>
                <Button icon={<DollarOutlined />} onClick={() => router.push("/payments")}>
                  Manage Payments
                </Button>
              </Space>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
