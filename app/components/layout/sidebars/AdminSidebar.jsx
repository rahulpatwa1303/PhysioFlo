"use client";

import { usePathname } from 'next/navigation';
import { Menu, Tooltip } from 'antd';
import Link from 'next/link';
import {
  AppstoreOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const AdminSidebar = ({ collapsed = false }) => {
  const pathname = usePathname();

  const items = [
    { 
      key: '/tenant-admin/dashboard', 
      icon: <AppstoreOutlined />, 
      label: collapsed ? null : <Link href="/tenant-admin/dashboard">Dashboard</Link>,
      title: 'Dashboard'
    },
    { 
      key: '/tenant-admin/patients', 
      icon: <UserOutlined />, 
      label: collapsed ? null : <Link href="/tenant-admin/patients">All Patients</Link>,
      title: 'All Patients'
    },
    { 
      key: '/tenant-admin/doctors', 
      icon: <TeamOutlined />, 
      label: collapsed ? null : <Link href="/tenant-admin/doctors">Doctors</Link>,
      title: 'Doctors'
    },
    { 
      key: '/tenant-admin/appointments', 
      icon: <CalendarOutlined />, 
      label: collapsed ? null : <Link href="/tenant-admin/appointments">Appointments</Link>,
      title: 'Appointments'
    },
    { 
      key: '/tenant-admin/billing', 
      icon: <DollarCircleOutlined />, 
      label: collapsed ? null : <Link href="/tenant-admin/billing">Billing</Link>,
      title: 'Billing'
    },
    { 
      key: '/tenant-admin/reports', 
      icon: <BarChartOutlined />, 
      label: collapsed ? null : <Link href="/tenant-admin/reports">Reports</Link>,
      title: 'Reports'
    },
  ];

  const renderMenuItem = (item) => {
    if (collapsed) {
      return (
          <Link href={item.key}>
            {item.icon}
          </Link>
      );
    }
    
    return {
      ...item,
      label: item.label
    };
  };

  const menuItems = collapsed 
    ? items.map(item => ({
        key: item.key,
        icon: renderMenuItem(item),
        title: item.title
      }))
    : items;

  return (
    <div className='bg-gray-900'>
      <div className={`h-16 flex items-center justify-center text-white text-xl font-bold bg-gray-900 ${
        collapsed ? 'px-2' : 'px-4'
      }`}>
        {collapsed ? (
          <span className="text-lg">PC</span>
        ) : (
          "Pre Clinic Admin"
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        inlineCollapsed={collapsed}
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default AdminSidebar;
