import DashboardLayout from '@/app/components/layout/DashboardLayout';
import DoctorSidebar from '@/app/components/layout/sidebars/DoctorSidebar';

export default function DoctorLayout({ children }) {
  return (
    <DashboardLayout sidebar={<DoctorSidebar />}>
      {children}
    </DashboardLayout>
  );
}
