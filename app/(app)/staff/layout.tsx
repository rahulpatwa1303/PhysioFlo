"use client";

import DashboardLayout from '@/app/components/layout/DashboardLayout';
import StaffSidebar from '@/app/components/layout/sidebars/StaffSidebar';

interface StaffLayoutProps {
  children: React.ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  return (
    <DashboardLayout sidebar={<StaffSidebar />}>
      {children}
    </DashboardLayout>
  );
}
