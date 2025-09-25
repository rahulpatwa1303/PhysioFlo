export default function ClinicLayout({ children }) {
  return (
    <DashboardLayout sidebar={<ClinicSidebar />}>
      {children}
    </DashboardLayout>
  );
}