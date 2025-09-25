"use client";

import React from 'react';
import { Layout, Button, Dropdown, Avatar, Drawer } from 'antd';
import { 
  LogoutOutlined, 
  UserOutlined, 
  SettingOutlined, 
  MenuOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined 
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children, sidebar }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(false); // Don't use collapsed state on mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const handleMenuClick = ({ key }) => {
    const userRole = localStorage.getItem('userRole');
    
    switch (key) {
      case 'profile':
        if (userRole === 'doctor') {
          router.push('/doctor/profile');
        } else if (userRole === 'tenant-admin') {
          router.push('/tenant-admin/profile');
        }
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Clone sidebar with collapsed prop for desktop
  const sidebarWithProps = sidebar && React.cloneElement(sidebar, { 
    collapsed: !isMobile ? collapsed : false 
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          bodyStyle={{ padding: 0 }}
          width={256}
          className="mobile-drawer"
        >
          {sidebar}
        </Drawer>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          width={256}
          collapsedWidth={80}
          collapsed={collapsed}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
          }}
          theme="dark"
          trigger={null}
        >
          {sidebarWithProps}
        </Sider>
      )}

      {/* Main Layout */}
      <Layout 
        style={{ 
          marginLeft: isMobile ? 0 : collapsed ? 80 : 256,
          transition: 'margin-left 0.2s'
        }}
      >
        {/* Header */}
        <Header 
          style={{ 
            padding: '0 16px', 
            background: '#fff', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            position: 'sticky',
            top: 0,
            zIndex: 999,
          }}
        >
          {/* Left side - Hamburger Menu */}
          <div className="flex items-center">
            <Button
              type="text"
              icon={
                isMobile ? (
                  <MenuOutlined />
                ) : collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={isMobile ? toggleMobileDrawer : toggleCollapsed}
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="hamburger-btn"
            />
          </div>
          
          {/* Right side - User Menu */}
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            placement="bottomRight"
          >
            <div className="flex items-center cursor-pointer hover:bg-gray-50 px-2 sm:px-3 py-2 rounded-lg transition-colors">
              <Avatar icon={<UserOutlined />} className="mr-0 sm:mr-2" size="small" />
              <span className="text-gray-700 text-sm hidden sm:inline">Dr. John Doe</span>
            </div>
          </Dropdown>
        </Header>

        {/* Content */}
        <Content style={{ margin: '16px', background: '#f0f2f5' }}>
          <div style={{ 
            padding: '16px', 
            background: '#fff', 
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)'
          }}>
            {children}
          </div>
        </Content>
      </Layout>

      <style jsx global>{`
        .hamburger-btn:hover {
          background-color: #f0f0f0 !important;
        }

        .mobile-drawer .ant-drawer-body {
          padding: 0;
          background: #101828;
        }

        @media (max-width: 768px) {
          .ant-layout-content {
            margin: 8px !important;
          }
          
          .ant-layout-content > div {
            padding: 12px !important;
            min-height: calc(100vh - 96px) !important;
          }
        }

        @media (max-width: 480px) {
          .ant-layout-content {
            margin: 4px !important;
          }
          
          .ant-layout-content > div {
            padding: 8px !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default DashboardLayout;
