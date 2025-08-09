"use client";
import { useEffect, useState } from "react";
import { Layout, Menu, Typography, Button, Space } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  LogoutOutlined,
  MedicineBoxOutlined
} from "@ant-design/icons";
import { createClient } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SimpleLayoutProps {
  children: React.ReactNode;
}

export default function SimpleLayout({ children }: SimpleLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
          selectedKeys={[pathname]}
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
          <Title level={4} style={{ margin: 0 }}>
            {pathname === "/dashboard" ? "Dashboard" : 
             pathname === "/patients" ? "Patients" :
             pathname === "/visits" ? "Visits" :
             pathname === "/schedule" ? "Schedule" :
             pathname === "/payments" ? "Payments" : "PhysioFlow"}
          </Title>
          <Space>
            <Text>{user.email}</Text>
            <Button icon={<LogoutOutlined />} onClick={handleSignOut}>
              Logout
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: "24px", background: "#f5f5f5" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
