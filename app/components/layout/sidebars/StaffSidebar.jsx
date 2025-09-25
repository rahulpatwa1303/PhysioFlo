"use client";

import { usePathname } from 'next/navigation';
import { Menu, Tooltip } from 'antd';
import Link from 'next/link';
import {
  AppstoreOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  ScheduleOutlined,
  MessageOutlined,
  BellOutlined
} from '@ant-design/icons';

const StaffSidebar = ({ collapsed = false }) => {
  const pathname = usePathname();

  const items = [
    { 
      key: '/staff/dashboard', 
      icon: <AppstoreOutlined />, 
      label: collapsed ? null : <Link href="/staff/dashboard">Dashboard</Link>,
      title: 'Dashboard'
    },
    { 
      key: '/staff/patients', 
      icon: <UserOutlined />, 
      label: collapsed ? null : <Link href="/staff/patients">Patient Management</Link>,
      title: 'Patient Management'
    },
    { 
      key: '/staff/appointments', 
      icon: <CalendarOutlined />, 
      label: collapsed ? null : <Link href="/staff/appointments">Appointments</Link>,
      title: 'Appointment Management'
    },
    { 
      key: '/staff/schedule', 
      icon: <ScheduleOutlined />, 
      label: collapsed ? null : <Link href="/staff/schedule">Doctor Schedules</Link>,
      title: 'Doctor Schedules'
    },
    { 
      key: '/staff/waitlist', 
      icon: <ClockCircleOutlined />, 
      label: collapsed ? null : <Link href="/staff/waitlist">Waitlist</Link>,
      title: 'Patient Waitlist'
    },
    { 
      key: '/staff/calls', 
      icon: <PhoneOutlined />, 
      label: collapsed ? null : <Link href="/staff/calls">Patient Calls</Link>,
      title: 'Patient Communication'
    },
    { 
      key: '/staff/notifications', 
      icon: <BellOutlined />, 
      label: collapsed ? null : <Link href="/staff/notifications">Notifications</Link>,
      title: 'System Notifications'
    },
    { 
      key: '/staff/notes', 
      icon: <FileTextOutlined />, 
      label: collapsed ? null : <Link href="/staff/notes">Patient Notes</Link>,
      title: 'Patient Notes & Records'
    }
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
          "Pre Clinic Staff"
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

export default StaffSidebar;
