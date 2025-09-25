import DashboardLayout from '@/app/components/layout/DashboardLayout';
import AdminSidebar from '@/app/components/layout/sidebars/AdminSidebar';

export default function TenantAdminLayout({ children }) {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      {children}
    </DashboardLayout>
  );
}
