"use client";

import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { HomeOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';

// Define your breadcrumb map here for all routes
const breadcrumbMap = {
  '/tenant-admin/dashboard': {
    title: (
      <span className="flex items-center">
        <HomeOutlined className="mr-1" /> Dashboard
      </span>
    ),
    href: '/tenant-admin/dashboard',
  },
  '/tenant-admin/patients': {
    title: 'All Patients',
    href: '/tenant-admin/patients',
  },
  '/tenant-admin/doctors': {
    title: 'Doctors',
    href: '/tenant-admin/doctors',
  },
  '/tenant-admin/billing': {
    title: 'Billing',
    href: '/tenant-admin/billing',
  },
  '/tenant-admin/billing/reports': {
    title: 'Reports',
    href: '/tenant-admin/billing/reports',
  },
  '/tenant-admin/billing/[id]': {
    title: 'Invoice Details',
    href: '',
  },
  '/tenant-admin/reports': {
    title: 'Reports',
    href: '/tenant-admin/reports',
  },
  '/tenant-admin/settings': {
    title: 'Settings',
    href: '/tenant-admin/settings',
  },
  '/doctor/dashboard': {
    title: (
      <span className="flex items-center">
        <HomeOutlined className="mr-1" /> Dashboard
      </span>
    ),
    href: '/doctor/dashboard',
  },
  '/doctor/appointments': {
    title: 'Appointments',
    href: '/doctor/appointments',
  },
  '/doctor/patients': {
    title: 'My Patients',
    href: '/doctor/patients',
  },
  // Add more as needed
};

function getBreadcrumbs(pathname) {
  // Split and build up the path
  const segments = pathname.split('/').filter(Boolean);
  let path = '';
  const crumbs = [];
  for (let i = 0; i < segments.length; i++) {
    path += '/' + segments[i];
    // Handle dynamic routes like [id]
    let key = path;
    if (segments[i].match(/^\d+$/) || segments[i].match(/^INV-/)) {
      key = path.replace(/\/[^/]+$/, '/[id]');
    }
    if (breadcrumbMap[key]) {
      const { title, href } = breadcrumbMap[key];
      crumbs.push({
        title,
        href: href && href !== pathname ? href : undefined,
      });
    }
  }
  return crumbs;
}

const AppBreadcrumb = () => {
  const pathname = usePathname();
  const items = getBreadcrumbs(pathname);
  return (
    <Breadcrumb
      items={items.map(item =>
        item.href ? { ...item, title: <Link href={item.href}>{item.title}</Link> } : item
      )}
    />
  );
};

export default AppBreadcrumb;
