"use client";
import SimpleLayout from "../components/SimpleLayout";
import PageLoader from "../components/PageLoader";
import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Table, Tag, Button, Input, Space, Statistic, Select, DatePicker, message, Popconfirm, Avatar, Tooltip, Checkbox } from "antd";
import { SearchOutlined, DollarOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PaymentRecord {
  id: string;
  visit_date: string;
  fee: number;
  payment_status: string;
  status: string;
  consultation_type: string;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
}

interface PatientGroupData {
  patient_id: string;
  patient_name: string;
  patient_phone?: string;
  total_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  total_visits: number;
  unpaid_visits: number;
  partial_visits: number;
  paid_visits: number;
  visits: PaymentRecord[];
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [groupedPatients, setGroupedPatients] = useState<PatientGroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedVisits, setSelectedVisits] = useState<{ [patientId: string]: string[] }>({});
  
  // Summary stats
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalUnpaid: 0,
    totalPartial: 0,
    paidCount: 0,
    unpaidCount: 0,
    partialCount: 0
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await supabase.auth.getSession();
      setUserId(session.data.session?.user.id || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchPayments();
  }, [userId]);

  const fetchPayments = async () => {
    setLoading(true);
    
    let query = supabase
      .from("visits")
      .select("*, patient:patients(id, first_name, last_name, phone)")
      .eq("user_id", userId)
      .order("visit_date", { ascending: false });

    // Apply date range filter if selected
    if (dateRange && dateRange.length === 2) {
      query = query
        .gte("visit_date", dateRange[0].startOf('day').toISOString())
        .lte("visit_date", dateRange[1].endOf('day').toISOString());
    }

    const { data, error } = await query;

    if (error) {
      message.error("Failed to fetch payment records");
      setLoading(false);
      return;
    }

    const paymentData = data || [];
    setPayments(paymentData);
    
    // Group payments by patient
    const patientGroups = paymentData.reduce((acc, payment) => {
      const patientId = payment.patient.id;
      if (!acc[patientId]) {
        acc[patientId] = {
          patient_id: patientId,
          patient_name: `${payment.patient.first_name} ${payment.patient.last_name}`,
          patient_phone: payment.patient.phone,
          total_amount: 0,
          paid_amount: 0,
          outstanding_amount: 0,
          total_visits: 0,
          unpaid_visits: 0,
          partial_visits: 0,
          paid_visits: 0,
          visits: []
        };
      }
      
      const fee = Number(payment.fee) || 0;
      acc[patientId].total_amount += fee;
      acc[patientId].total_visits += 1;
      acc[patientId].visits.push(payment);
      
      if (payment.payment_status === 'PAID') {
        acc[patientId].paid_amount += fee;
        acc[patientId].paid_visits += 1;
      } else if (payment.payment_status === 'PARTIAL') {
        acc[patientId].partial_visits += 1;
        acc[patientId].outstanding_amount += fee; // Treat partial as outstanding for now
      } else {
        acc[patientId].unpaid_visits += 1;
        acc[patientId].outstanding_amount += fee;
      }
      
      return acc;
    }, {} as { [key: string]: PatientGroupData });
    
    const groupedData = Object.values(patientGroups) as PatientGroupData[];
    setGroupedPatients(groupedData);
    
    // Calculate stats
    const stats = paymentData.reduce((acc, payment) => {
      const fee = Number(payment.fee) || 0;
      
      if (payment.payment_status === 'PAID') {
        acc.totalPaid += fee;
        acc.paidCount += 1;
      } else if (payment.payment_status === 'PARTIAL') {
        acc.totalPartial += fee;
        acc.partialCount += 1;
      } else {
        acc.totalUnpaid += fee;
        acc.unpaidCount += 1;
      }
      
      return acc;
    }, {
      totalPaid: 0,
      totalUnpaid: 0,
      totalPartial: 0,
      paidCount: 0,
      unpaidCount: 0,
      partialCount: 0
    });
    
    setStats(stats);
    setLoading(false);
  };

  const updatePaymentStatus = async (visitId: string, newStatus: string) => {
    const { error } = await supabase
      .from("visits")
      .update({ payment_status: newStatus })
      .eq("id", visitId);

    if (error) {
      message.error("Failed to update payment status");
      return;
    }

    message.success("Payment status updated successfully");
    fetchPayments();
  };

  const markPatientPaid = async (patientId: string) => {
    const patient = groupedPatients.find(p => p.patient_id === patientId);
    if (!patient) return;

    const unpaidVisitIds = patient.visits
      .filter(visit => visit.payment_status !== 'PAID')
      .map(visit => visit.id);

    if (unpaidVisitIds.length === 0) {
      message.info("All visits for this patient are already paid");
      return;
    }

    const { error } = await supabase
      .from("visits")
      .update({ payment_status: 'PAID' })
      .in("id", unpaidVisitIds);

    if (error) {
      message.error("Failed to update payment status");
      return;
    }

    message.success(`Marked ${unpaidVisitIds.length} visits as paid for ${patient.patient_name}`);
    setSelectedVisits(prev => ({ ...prev, [patientId]: [] }));
    fetchPayments();
  };

  const markSelectedVisitsPaid = async (patientId: string) => {
    const selectedVisitIds = selectedVisits[patientId] || [];
    if (selectedVisitIds.length === 0) {
      message.warning("Please select visits to mark as paid");
      return;
    }

    const { error } = await supabase
      .from("visits")
      .update({ payment_status: 'PAID' })
      .in("id", selectedVisitIds);

    if (error) {
      message.error("Failed to update payment status");
      return;
    }

    message.success(`Marked ${selectedVisitIds.length} visits as paid`);
    setSelectedVisits(prev => ({ ...prev, [patientId]: [] }));
    fetchPayments();
  };

  const handleVisitSelection = (patientId: string, visitId: string, checked: boolean) => {
    setSelectedVisits(prev => {
      const currentSelection = prev[patientId] || [];
      if (checked) {
        return { ...prev, [patientId]: [...currentSelection, visitId] };
      } else {
        return { ...prev, [patientId]: currentSelection.filter(id => id !== visitId) };
      }
    });
  };

  const handlePatientSelectAll = (patientId: string, checked: boolean) => {
    const patient = groupedPatients.find(p => p.patient_id === patientId);
    if (!patient) return;

    if (checked) {
      const unpaidVisitIds = patient.visits
        .filter(visit => visit.payment_status !== 'PAID')
        .map(visit => visit.id);
      setSelectedVisits(prev => ({ ...prev, [patientId]: unpaidVisitIds }));
    } else {
      setSelectedVisits(prev => ({ ...prev, [patientId]: [] }));
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'green';
      case 'PARTIAL': return 'orange';
      case 'UNPAID': return 'red';
      default: return 'default';
    }
  };

  const getVisitStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      case 'SCHEDULED': return 'blue';
      default: return 'default';
    }
  };

  // Filter patients based on search and status
  const filteredPatients = groupedPatients.filter(patient => {
    const matchesSearch = search === "" || 
      patient.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      (patient.patient_phone && patient.patient_phone.includes(search));
    
    let matchesStatus = true;
    if (statusFilter === "PAID") {
      matchesStatus = patient.outstanding_amount === 0;
    } else if (statusFilter === "UNPAID") {
      matchesStatus = patient.outstanding_amount > 0;
    } else if (statusFilter === "PARTIAL") {
      matchesStatus = patient.partial_visits > 0;
    }
    
    return matchesSearch && matchesStatus;
  });

  // Desktop table columns for grouped patients
  const groupedColumns = [
    {
      title: "Patient",
      key: "patient",
      render: (_: any, record: PatientGroupData) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: record.outstanding_amount === 0 ? '#52c41a' :
                              record.partial_visits > 0 ? '#fa8c16' : '#ff4d4f'
            }}
          />
          <div>
            <Text strong style={{ fontSize: 16 }}>{record.patient_name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.patient_phone}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (amount: number) => (
        <Text strong style={{ color: '#6C63FF', fontSize: 14 }}>
          ₹{amount}
        </Text>
      ),
      sorter: (a: PatientGroupData, b: PatientGroupData) => a.total_amount - b.total_amount,
    },
    {
      title: "Outstanding",
      dataIndex: "outstanding_amount",
      render: (amount: number) => (
        <Text strong style={{ 
          color: amount === 0 ? '#52c41a' : '#ff4d4f', 
          fontSize: 14 
        }}>
          ₹{amount}
        </Text>
      ),
      sorter: (a: PatientGroupData, b: PatientGroupData) => a.outstanding_amount - b.outstanding_amount,
    },
    {
      title: "Visits",
      key: "visits",
      render: (_: any, record: PatientGroupData) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>
            Total: {record.total_visits}
          </Text>
          <Space size={4}>
            <Tag color="green" style={{ fontSize: 10, margin: 0 }}>
              Paid: {record.paid_visits}
            </Tag>
            <Tag color="red" style={{ fontSize: 10, margin: 0 }}>
              Unpaid: {record.unpaid_visits}
            </Tag>
            {record.partial_visits > 0 && (
              <Tag color="orange" style={{ fontSize: 10, margin: 0 }}>
                Partial: {record.partial_visits}
              </Tag>
            )}
          </Space>
        </Space>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: PatientGroupData) => {
        if (record.outstanding_amount === 0) {
          return <Tag color="green" icon={<CheckCircleOutlined />}>Fully Paid</Tag>;
        } else if (record.partial_visits > 0) {
          return <Tag color="orange" icon={<ClockCircleOutlined />}>Partially Paid</Tag>;
        } else {
          return <Tag color="red" icon={<CloseCircleOutlined />}>Outstanding</Tag>;
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: PatientGroupData) => (
        <Space>
          {record.outstanding_amount > 0 && (
            <Popconfirm
              title="Mark all unpaid visits as paid?"
              description={`This will mark ${record.unpaid_visits + record.partial_visits} visits as paid.`}
              onConfirm={() => markPatientPaid(record.patient_id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                type="primary" 
                size="small"
                icon={<CheckCircleOutlined />}
              >
                Mark All Paid
              </Button>
            </Popconfirm>
          )}
          {selectedVisits[record.patient_id]?.length > 0 && (
            <Button 
              type="default" 
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => markSelectedVisitsPaid(record.patient_id)}
            >
              Mark Selected Paid ({selectedVisits[record.patient_id].length})
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Visit detail columns for expanded rows
  const visitColumns = [
    {
      title: "Select",
      key: "select",
      width: 60,
      render: (_: any, record: PaymentRecord) => {
        const patientId = record.patient.id;
        const isSelected = selectedVisits[patientId]?.includes(record.id) || false;
        const isDisabled = record.payment_status === 'PAID';
        
        return (
          <Checkbox
            checked={isSelected}
            disabled={isDisabled}
            onChange={(e) => handleVisitSelection(patientId, record.id, e.target.checked)}
          />
        );
      },
    },
    {
      title: "Visit Date",
      dataIndex: "visit_date",
      render: (date: string) => dayjs(date).format("DD MMM YYYY, HH:mm"),
    },
    {
      title: "Consultation",
      dataIndex: "consultation_type",
      render: (type: string) => (
        <Tag color="blue" style={{ fontSize: 11 }}>{type || 'In-Person'}</Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "fee",
      render: (fee: number) => (
        <Text strong style={{ color: '#6C63FF', fontSize: 13 }}>
          ₹{fee}
        </Text>
      ),
    },
    {
      title: "Visit Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={getVisitStatusColor(status)} style={{ fontSize: 11 }}>{status}</Tag>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      render: (status: string) => (
        <Tag color={getPaymentStatusColor(status)} style={{ fontSize: 11 }}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: PaymentRecord) => (
        record.payment_status !== 'PAID' ? (
          <Select
            size="small"
            value={record.payment_status}
            onChange={(value) => updatePaymentStatus(record.id, value)}
            style={{ width: 80 }}
            options={[
              { value: 'UNPAID', label: 'Unpaid' },
              { value: 'PARTIAL', label: 'Partial' },
              { value: 'PAID', label: 'Paid' }
            ]}
          />
        ) : (
          <Tag color="green" icon={<CheckCircleOutlined />} style={{ fontSize: 10 }}>Paid</Tag>
        )
      ),
    },
  ];

  const expandedRowRender = (record: PatientGroupData) => {
    const patientId = record.patient_id;
    const selectedCount = selectedVisits[patientId]?.length || 0;
    const unpaidVisits = record.visits.filter(v => v.payment_status !== 'PAID');
    
    return (
      <div style={{ margin: '16px 0' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 12,
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          borderRadius: 6
        }}>
          <Space>
            <Checkbox
              checked={selectedCount === unpaidVisits.length && unpaidVisits.length > 0}
              indeterminate={selectedCount > 0 && selectedCount < unpaidVisits.length}
              onChange={(e) => handlePatientSelectAll(patientId, e.target.checked)}
              disabled={unpaidVisits.length === 0}
            >
              Select All Unpaid ({unpaidVisits.length})
            </Checkbox>
            {selectedCount > 0 && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {selectedCount} visits selected
              </Text>
            )}
          </Space>
          <Text strong style={{ color: '#6C63FF' }}>
            Visit Details for {record.patient_name}
          </Text>
        </div>
        <Table
          dataSource={record.visits}
          columns={visitColumns}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 600 }}
        />
      </div>
    );
  };

  // Mobile component
  const PatientCard = ({ patient }: { patient: PatientGroupData }) => {
    const isExpanded = expandedRows.includes(patient.patient_id);
    const selectedCount = selectedVisits[patient.patient_id]?.length || 0;
    
    return (
      <Card
        size="small"
        style={{
          marginBottom: 12,
          borderRadius: 12,
          border: `1px solid ${patient.outstanding_amount === 0 ? '#52c41a' : '#ff7875'}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Patient Header */}
        <div 
          style={{ 
            padding: 16, 
            cursor: 'pointer',
            borderBottom: isExpanded ? '1px solid #f0f0f0' : 'none'
          }}
          onClick={() => {
            if (isExpanded) {
              setExpandedRows(prev => prev.filter(id => id !== patient.patient_id));
            } else {
              setExpandedRows(prev => [...prev, patient.patient_id]);
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <Avatar 
                size={40} 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: patient.outstanding_amount === 0 ? '#52c41a' :
                                  patient.partial_visits > 0 ? '#fa8c16' : '#ff4d4f'
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text strong style={{ fontSize: 16 }}>
                  {patient.patient_name}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {patient.patient_phone} • {patient.total_visits} visits
                </Text>
                <br />
                <Space size={4}>
                  <Text style={{ fontSize: 14, fontWeight: 600, color: '#6C63FF' }}>
                    Total: ₹{patient.total_amount}
                  </Text>
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: 600, 
                    color: patient.outstanding_amount === 0 ? '#52c41a' : '#ff4d4f' 
                  }}>
                    Outstanding: ₹{patient.outstanding_amount}
                  </Text>
                </Space>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {isExpanded ? <DownOutlined style={{ fontSize: 12 }} /> : <RightOutlined style={{ fontSize: 12 }} />}
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Tag color="green" style={{ fontSize: '10px', margin: 0 }}>
                  Paid: {patient.paid_visits}
                </Tag>
                {patient.unpaid_visits > 0 && (
                  <Tag color="red" style={{ fontSize: '10px', margin: 0 }}>
                    Unpaid: {patient.unpaid_visits}
                  </Tag>
                )}
                {patient.partial_visits > 0 && (
                  <Tag color="orange" style={{ fontSize: '10px', margin: 0 }}>
                    Partial: {patient.partial_visits}
                  </Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Visit Details */}
        {isExpanded && (
          <div style={{ padding: 16, backgroundColor: '#fafafa' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 12
            }}>
              <Text strong style={{ color: '#6C63FF' }}>Visit Details</Text>
              {patient.outstanding_amount > 0 && (
                <Space size={8}>
                  {selectedCount > 0 && (
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => markSelectedVisitsPaid(patient.patient_id)}
                    >
                      Mark Selected Paid ({selectedCount})
                    </Button>
                  )}
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => markPatientPaid(patient.patient_id)}
                  >
                    Mark All Paid
                  </Button>
                </Space>
              )}
            </div>
            
            {patient.visits.map(visit => (
              <Card
                key={visit.id}
                size="small"
                style={{
                  marginBottom: 8,
                  borderRadius: 8,
                  border: `1px solid ${visit.payment_status === 'PAID' ? '#d9f7be' : '#ffccc7'}`,
                  backgroundColor: visit.payment_status === 'PAID' ? '#f6ffed' : '#fff2f0'
                }}
                bodyStyle={{ padding: 12 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    {visit.payment_status !== 'PAID' && (
                      <Checkbox
                        checked={selectedVisits[patient.patient_id]?.includes(visit.id) || false}
                        onChange={(e) => handleVisitSelection(patient.patient_id, visit.id, e.target.checked)}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ fontSize: 14 }}>
                        {dayjs(visit.visit_date).format('DD MMM YYYY, h:mm A')}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {visit.consultation_type || 'In-Person'}
                      </Text>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                    <Text strong style={{ color: '#6C63FF', fontSize: 14 }}>
                      ₹{visit.fee}
                    </Text>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <Tag color={getVisitStatusColor(visit.status)} style={{ fontSize: '10px', margin: 0 }}>
                        {visit.status}
                      </Tag>
                      <Tag color={getPaymentStatusColor(visit.payment_status)} style={{ fontSize: '10px', margin: 0 }}>
                        {visit.payment_status}
                      </Tag>
                    </div>
                    {visit.payment_status !== 'PAID' && (
                      <Select
                        size="small"
                        value={visit.payment_status}
                        onChange={(value) => updatePaymentStatus(visit.id, value)}
                        style={{ width: 80, fontSize: '12px' }}
                        options={[
                          { value: 'UNPAID', label: 'Unpaid' },
                          { value: 'PARTIAL', label: 'Partial' },
                          { value: 'PAID', label: 'Paid' }
                        ]}
                      />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    );
  };

  return (
    <SimpleLayout>
      <PageLoader loading={loading}>
        <div style={{ 
          padding: isMobile ? '12px 16px' : 24,
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 56px)'
        }}>
        <Title 
          level={2} 
          style={{ 
            color: "#6C63FF", 
            fontSize: isMobile ? '20px' : '24px',
            marginBottom: 24
          }}
        >
          Payment Tracking
        </Title>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} md={6}>
            <Card bodyStyle={{ padding: isMobile ? 12 : 16, textAlign: 'center' }} style={{ borderRadius: 12 }}>
              <Statistic
                title="Total Paid"
                value={stats.totalPaid}
                prefix="₹"
                valueStyle={{ color: '#52c41a', fontSize: isMobile ? '18px' : '20px' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {stats.paidCount} visits
              </Text>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card bodyStyle={{ padding: isMobile ? 12 : 16, textAlign: 'center' }} style={{ borderRadius: 12 }}>
              <Statistic
                title="Outstanding"
                value={stats.totalUnpaid}
                prefix="₹"
                valueStyle={{ color: '#ff4d4f', fontSize: isMobile ? '18px' : '20px' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {stats.unpaidCount} visits
              </Text>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card bodyStyle={{ padding: isMobile ? 12 : 16, textAlign: 'center' }} style={{ borderRadius: 12 }}>
              <Statistic
                title="Partial Paid"
                value={stats.totalPartial}
                prefix="₹"
                valueStyle={{ color: '#fa8c16', fontSize: isMobile ? '18px' : '20px' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {stats.partialCount} visits
              </Text>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card bodyStyle={{ padding: isMobile ? 12 : 16, textAlign: 'center' }} style={{ borderRadius: 12 }}>
              <Statistic
                title="Total Revenue"
                value={stats.totalPaid + stats.totalPartial + stats.totalUnpaid}
                prefix="₹"
                valueStyle={{ color: '#6C63FF', fontSize: isMobile ? '18px' : '20px' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                All visits
              </Text>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search by patient name or phone"
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Filter by payment status"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
                options={[
                  { value: 'all', label: 'All Patients' },
                  { value: 'PAID', label: 'Fully Paid' },
                  { value: 'UNPAID', label: 'Outstanding' },
                  { value: 'PARTIAL', label: 'Partially Paid' }
                ]}
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                style={{ width: '100%' }}
                placeholder={['Start Date', 'End Date']}
              />
            </Col>
          </Row>
        </Card>

        {/* Payment Records */}
        {isMobile ? (
          // Mobile Card View
          <div style={{
            height: 'calc(100vh - 420px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 32 }}>
                <Text>Loading payment records...</Text>
              </div>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <PatientCard key={patient.patient_id} patient={patient} />
              ))
            ) : (
              <Card style={{ textAlign: 'center', padding: 32 }}>
                <DollarOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                <Title level={4} type="secondary">No patients found</Title>
                <Text type="secondary">
                  {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Patients with visits will appear here'}
                </Text>
              </Card>
            )}
          </div>
        ) : (
          // Desktop Grouped Table View
          <Card style={{ borderRadius: 12 }}>
            <Table
              dataSource={filteredPatients}
              columns={groupedColumns}
              rowKey="patient_id"
              loading={loading}
              expandable={{
                expandedRowRender,
                expandRowByClick: false,
                expandIcon: ({ expanded, onExpand, record }) => (
                  expanded ? (
                    <DownOutlined onClick={e => onExpand(record, e)} />
                  ) : (
                    <RightOutlined onClick={e => onExpand(record, e)} />
                  )
                ),
              }}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} patients`
              }}
              scroll={{ x: 1000 }}
            />
          </Card>
        )}
        </div>
      </PageLoader>
    </SimpleLayout>
  );
}
