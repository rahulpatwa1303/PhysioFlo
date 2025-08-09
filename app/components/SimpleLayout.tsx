"use client";
import { useEffect, useState } from "react";
import { Layout, Menu, Typography, Button, Space, Drawer } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleMenuClick = (key: string) => {
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
    router.push(key);
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
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider 
          width={240} 
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          style={{ 
            background: "#fff", 
            boxShadow: "2px 0 8px rgba(0,0,0,0.15)"
          }}
        >
          <div style={{ 
            padding: collapsed ? "16px 8px" : "16px", 
            textAlign: "center", 
            borderBottom: "1px solid #f0f0f0" 
          }}>
            {!collapsed ? (
              <Title level={4} style={{ color: "#6C63FF", margin: 0 }}>
                PhysioFlow
              </Title>
            ) : (
              <div style={{ 
                width: 32, 
                height: 32, 
                background: "#6C63FF", 
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto"
              }}>
                <Text style={{ color: "white", fontWeight: "bold" }}>P</Text>
              </div>
            )}
          </div>
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            onClick={({ key }) => router.push(key)}
            style={{ border: "none", marginTop: "16px" }}
          />
        </Sider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        title={
          <Title level={4} style={{ color: "#6C63FF", margin: 0 }}>
            PhysioFlow
          </Title>
        }
        placement="left"
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible}
        width={240}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ border: "none" }}
        />
      </Drawer>

      <Layout>
        <Header style={{ 
          background: "#fff", 
          padding: "0 24px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          position: "relative",
          zIndex: 99
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={
                isMobile ? <MenuOutlined /> : 
                collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
              onClick={() => {
                if (isMobile) {
                  setMobileDrawerVisible(true);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <Title level={4} style={{ margin: 0, marginLeft: isMobile ? 8 : 0 }}>
              {pathname === "/dashboard" ? "Dashboard" : 
               pathname === "/patients" ? "Patients" :
               pathname === "/visits" ? "Visits" :
               pathname === "/schedule" ? "Schedule" :
               pathname === "/payments" ? "Payments" : "PhysioFlow"}
            </Title>
          </div>
          <Space>
            {!isMobile && <Text>{user.email}</Text>}
            <Button 
              icon={<LogoutOutlined />} 
              onClick={handleSignOut}
              type={isMobile ? "text" : "default"}
            >
              {!isMobile && "Logout"}
            </Button>
          </Space>
        </Header>

        <Content style={{ 
          padding: isMobile ? "16px" : "24px", 
          background: "#f5f5f5",
          height: "calc(100vh - 64px)",
          overflow: "auto"
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
