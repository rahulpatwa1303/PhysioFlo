"use client";

import { Button } from 'antd';
import { PlusOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import KpiCard from '@/app/components/KpiCard';
import AllPatientsTable from '@/app/components/admin-dashboard/AllPatientsTable';
import CompactAppointments from '@/app/components/admin-dashboard/CompactAppointments';
import DoctorsList from '@/app/components/admin-dashboard/DoctorsList';
import StaffList from '@/app/components/admin-dashboard/StaffList';

// --- Dummy Data for Admin Dashboard ---
const adminKpiData = [
    { title: "Total Patients", value: "1,204", change: "+12%", changeType: "increase" },
    { title: "Active Doctors", value: "18", change: "+2", changeType: "increase" },
    { title: "Today's Appointments", value: "45", change: "+8%", changeType: "increase" },
    { title: "Monthly Revenue", value: "$24,500", change: "+15%", changeType: "increase" },
];

const TenantAdminDashboardPage = () => {
    const handleAddDoctor = () => {
        console.log('Add new doctor');
        // Navigate to add doctor page
    };

    const handleAddStaff = () => {
        console.log('Add new staff');
        // Navigate to add staff page
    };

    const handleViewReports = () => {
        console.log('View detailed reports');
        // Navigate to reports page
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-500">Manage your clinic operations and staff efficiently.</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                    <Button icon={<TeamOutlined />} onClick={handleAddDoctor}>
                        Add Doctor
                    </Button>
                    <Button icon={<PlusOutlined />} onClick={handleAddStaff}>
                        Add Staff
                    </Button>
                    <Button type="primary" icon={<CalendarOutlined />} onClick={handleViewReports}>
                        View Reports
                    </Button>
                </div>
            </div>

            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {adminKpiData.map((kpi, index) => (
                    <KpiCard key={index} {...kpi} />
                ))}
            </div>

            {/* Admin Dashboard Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[500px]">
                {/* Appointments Overview */}
                <div className="xl:col-span-2">
                    <CompactAppointments />
                </div>
                
                {/* Doctors List */}
                <div>
                    <DoctorsList />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
                {/* All Patients Table */}
                <div>
                    <AllPatientsTable />
                </div>
                
                {/* Staff List */}
                <div>
                    <StaffList />
                </div>
            </div>
        </div>
    );
};

export default TenantAdminDashboardPage;
