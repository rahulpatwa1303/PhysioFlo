"use client";

import { usePathname } from 'next/navigation';
import { Menu, Tooltip } from 'antd';
import Link from 'next/link';
import {
  AppstoreOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MessageOutlined,
  BarChartOutlined,
  DollarOutlined,
  StarOutlined,
} from '@ant-design/icons';

const DoctorSidebar = ({ collapsed = false }) => {
  const pathname = usePathname();

  const items = [
    { 
      key: '/doctor/dashboard', 
      icon: <AppstoreOutlined />, 
      label: collapsed ? null : <Link href="/doctor/dashboard">Dashboard</Link>,
      title: 'Dashboard'
    },
    { 
      key: '/doctor/patients', 
      icon: <UserOutlined />, 
      label: collapsed ? null : <Link href="/doctor/patients">My Patients</Link>,
      title: 'My Patients'
    },
    { 
      key: '/doctor/appointments', 
      icon: <CalendarOutlined />, 
      label: collapsed ? null : <Link href="/doctor/appointments">Appointments</Link>,
      title: 'Appointments'
    },
    { 
      key: '/doctor/billing', 
      icon: <DollarOutlined />, 
      label: collapsed ? null : <Link href="/doctor/billing">Billing Overview</Link>,
      title: 'Billing Overview (Read-only)'
    },
    { 
      key: '/doctor/notes', 
      icon: <FileTextOutlined />, 
      label: collapsed ? null : <Link href="/doctor/notes">Patient Notes</Link>,
      title: 'Patient Notes'
    },
    { 
      key: '/doctor/assessments', 
      icon: <StarOutlined />, 
      label: collapsed ? null : <Link href="/doctor/assessments">Assessments</Link>,
      title: 'Patient Assessments'
    },
    { 
      key: '/doctor/reports', 
      icon: <BarChartOutlined />, 
      label: collapsed ? null : <Link href="/doctor/reports">Reports</Link>,
      title: 'Reports'
    },
  ];

  const renderMenuItem = (item) => {
    if (collapsed) {
      return (
        <Tooltip title={item.title} placement="right" key={item.key}>
          <Link href={item.key}>
            {item.icon}
          </Link>
        </Tooltip>
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
          "Pre Clinic Dr."
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

export default DoctorSidebar;
