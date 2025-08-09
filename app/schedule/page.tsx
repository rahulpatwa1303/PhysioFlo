"use client";
import SimpleLayout from "../components/SimpleLayout";
import PageLoader from "../components/PageLoader";
import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Avatar, Button, Badge, Tag, Space, Divider, Calendar, Modal, DatePicker, Form, Select, message, Tooltip, List, Spin, Input } from "antd";
import { PlusOutlined, UserOutlined, CalendarOutlined, ClockCircleOutlined, EditOutlined } from "@ant-design/icons";
import { createClient } from "@supabase/supabase-js";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Appointment {
  id: string;
  visit_date: string;
  patient: {
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  status: string;
  consultation_type: string;
  fee: number;
}

interface DoctorInfo {
  name: string;
  email: string;
  specialization: string;
  experience: string;
  phone?: string;
  clinic?: string;
  qualifications?: string;
  avatar?: string;
}

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allUpcomingAppointments, setAllUpcomingAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null);
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo>({
    name: "Doctor",
    email: "",
    specialization: "Physiotherapist",
    experience: "PhysioFlow Practitioner",
    phone: "",
    clinic: "",
    qualifications: "",
    avatar: undefined
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
    const initUser = async () => {
      const session = await supabase.auth.getSession();
      const uid = session.data.session?.user.id || null;
      const userEmail = session.data.session?.user.email || "";
      
      setUserId(uid);
      
      // Load doctor profile
      if (userEmail && uid) {
        await loadDoctorProfile(uid, userEmail);
      }
      
      if (uid) {
        await Promise.all([fetchAppointments(uid), fetchPatients(uid), fetchUpcomingAppointments(uid, 0)]);
      }
      setLoading(false);
    };
    initUser();
  }, []);

  const fetchAppointments = async (uid: string) => {
    // Fetch appointments for the next 7 days
    const startDate = dayjs().startOf('day');
    const endDate = dayjs().add(7, 'days').endOf('day');
    
    const { data, error } = await supabase
      .from("visits")
      .select("*, patient:patients(first_name, last_name)")
      .eq("user_id", uid)
      .gte("visit_date", startDate.toISOString())
      .lte("visit_date", endDate.toISOString())
      .order("visit_date", { ascending: true });

    if (error) {
      message.error("Failed to fetch appointments");
      return;
    }

    setAppointments(data || []);
  };

  const fetchPatients = async (uid: string) => {
    const { data, error } = await supabase
      .from("patients")
      .select("id, first_name, last_name")
      .eq("user_id", uid);

    if (error) {
      message.error("Failed to fetch patients");
      return;
    }

    setPatients(data || []);
  };

  const fetchUpcomingAppointments = async (uid: string, page: number = 0, append: boolean = false) => {
    const limit = 10;
    const offset = page * limit;
    const startDate = dayjs().startOf('day');
    const endDate = dayjs().add(30, 'days').endOf('day');
    
    const { data, error } = await supabase
      .from("visits")
      .select("*, patient:patients(first_name, last_name)")
      .eq("user_id", uid)
      .gte("visit_date", startDate.toISOString())
      .lte("visit_date", endDate.toISOString())
      .order("visit_date", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      message.error("Failed to fetch upcoming appointments");
      return;
    }

    if (append) {
      setAllUpcomingAppointments(prev => [...prev, ...(data || [])]);
    } else {
      setAllUpcomingAppointments(data || []);
    }

    setHasMore((data || []).length === limit);
    setCurrentPage(page);
  };

  const getAppointmentsForDate = (date: Dayjs) => {
    // Check both the 7-day appointments (for calendar dots) and all upcoming appointments
    const allAppointments = [...appointments, ...allUpcomingAppointments];
    const uniqueAppointments = allAppointments.filter((apt, index, self) => 
      index === self.findIndex((a) => a.id === apt.id)
    );
    
    return uniqueAppointments.filter(apt => 
      dayjs(apt.visit_date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  };

  const scrollToSelectedDate = (selectedDate: Dayjs) => {
    if (!scrollContainerRef || allUpcomingAppointments.length === 0) return;

    const targetDateStr = selectedDate.format('YYYY-MM-DD');
    
    // Try to find the element with the target date
    const targetElement = scrollContainerRef.querySelector(`[data-date="${targetDateStr}"]`);
    
    if (targetElement) {
      // Scroll to the specific element
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } else {
      // Fallback: Find the first appointment on or after the selected date
      const targetIndex = allUpcomingAppointments.findIndex(apt => {
        const aptDate = dayjs(apt.visit_date).format('YYYY-MM-DD');
        return aptDate >= targetDateStr;
      });

      if (targetIndex !== -1) {
        // Calculate approximate scroll position
        // Each appointment card is approximately 80px height (including margins)
        const cardHeight = 80;
        const scrollPosition = targetIndex * cardHeight;
        
        scrollContainerRef.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    // Scroll to the selected date in the appointments list
    setTimeout(() => scrollToSelectedDate(date), 200);
  };

  const loadMoreAppointments = async () => {
    if (!userId || !hasMore || loadingMore) return;
    
    setLoadingMore(true);
    await fetchUpcomingAppointments(userId, currentPage + 1, true);
    setLoadingMore(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loadingMore) {
      loadMoreAppointments();
    }
  };

  const todayAppointments = getAppointmentsForDate(dayjs());
  const tomorrowAppointments = getAppointmentsForDate(dayjs().add(1, 'day'));
  const dayAfterAppointments = getAppointmentsForDate(dayjs().add(2, 'day'));

  const getDayLabel = (dayOffset: number) => {
    const date = dayjs().add(dayOffset, 'day');
    if (dayOffset === 0) return "Today";
    if (dayOffset === 1) return "Tomorrow";
    return date.format('dddd');
  };

  const getDayDate = (dayOffset: number) => {
    return dayjs().add(dayOffset, 'day').format('DD MMM');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      case 'SCHEDULED': return 'blue';
      default: return 'default';
    }
  };

  const getConsultationColor = (type: string) => {
    switch (type) {
      case 'Video Consultation': return '#52c41a';
      case 'In-Person': return '#1890ff';
      default: return '#722ed1';
    }
  };

  const handleAddAppointment = async (values: any) => {
    if (!userId) return;

    const appointmentData = {
      user_id: userId,
      patient_id: values.patient_id,
      visit_date: values.date.format('YYYY-MM-DD HH:mm:ss'),
      status: 'SCHEDULED',
      consultation_type: values.consultation_type || 'In-Person',
      fee: values.fee || 0,
      payment_status: 'UNPAID'
    };

    const { error } = await supabase
      .from("visits")
      .insert([appointmentData]);

    if (error) {
      message.error("Failed to create appointment");
      return;
    }

    message.success("Appointment created successfully");
    setIsModalVisible(false);
    form.resetFields();
    await Promise.all([
      fetchAppointments(userId),
      fetchUpcomingAppointments(userId, 0)
    ]);
  };

  const handleProfileEdit = () => {
    profileForm.setFieldsValue(doctorInfo);
    setIsProfileModalVisible(true);
  };

  const handleProfileUpdate = async (values: any) => {
    if (!userId) return;

    // Save doctor profile to localStorage (you can extend this to save to Supabase)
    const updatedProfile = {
      ...doctorInfo,
      ...values
    };
    
    setDoctorInfo(updatedProfile);
    localStorage.setItem(`doctorProfile_${userId}`, JSON.stringify(updatedProfile));
    
    message.success("Profile updated successfully");
    setIsProfileModalVisible(false);
    profileForm.resetFields();
  };

  const loadDoctorProfile = async (uid: string, userEmail: string) => {
    // Try to load saved profile from localStorage
    const savedProfile = localStorage.getItem(`doctorProfile_${uid}`);
    
    if (savedProfile) {
      setDoctorInfo(JSON.parse(savedProfile));
    } else {
      // Set default doctor info from user session
      const defaultProfile = {
        name: userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: userEmail,
        specialization: "Physiotherapist",
        experience: "PhysioFlow Practitioner",
        phone: "",
        clinic: "",
        qualifications: ""
      };
      setDoctorInfo(defaultProfile);
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card 
      size="small" 
      style={{ 
        marginBottom: 12, 
        borderRadius: 12,
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#6C63FF' }}
          />
          <div>
            <Text strong>
              {appointment.patient.first_name} {appointment.patient.last_name}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(appointment.visit_date).format('h:mm A')} • {appointment.consultation_type || 'In-Person'}
            </Text>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Tag 
            color={getConsultationColor(appointment.consultation_type)}
            style={{ marginBottom: 4 }}
          >
            {appointment.consultation_type || 'In-Person'}
          </Tag>
          <br />
          <Tag color={getStatusColor(appointment.status)}>
            {appointment.status}
          </Tag>
        </div>
      </div>
    </Card>
  );

  const DaySection = ({ dayOffset, appointments }: { dayOffset: number, appointments: Appointment[] }) => (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{getDayLabel(dayOffset)}</span>
          <Text type="secondary">{getDayDate(dayOffset)}</Text>
        </div>
      }
      style={{ 
        marginBottom: 24,
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(108,99,255,0.1)'
      }}
      headStyle={{ 
        backgroundColor: dayOffset === 0 ? '#6C63FF' : '#f8f9fa',
        color: dayOffset === 0 ? 'white' : 'inherit',
        borderRadius: '16px 16px 0 0'
      }}
    >
      {appointments.length > 0 ? (
        appointments.map(apt => (
          <AppointmentCard key={apt.id} appointment={apt} />
        ))
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: 24, 
          color: '#8c8c8c',
          backgroundColor: '#fafafa',
          borderRadius: 8
        }}>
          <CalendarOutlined style={{ fontSize: 24, marginBottom: 8 }} />
          <br />
          No appointments scheduled
        </div>
      )}
    </Card>
  );

  const cellRender = (current: Dayjs) => {
    const dayAppointments = getAppointmentsForDate(current);
    const hasAppointments = dayAppointments.length > 0;
    
    const tooltipContent = hasAppointments ? (
      <div>
        {dayAppointments.map((apt, idx) => (
          <div key={idx} style={{ marginBottom: 4, fontSize: 12 }}>
            <strong>{dayjs(apt.visit_date).format('HH:mm')}</strong> - {apt.patient.first_name} {apt.patient.last_name}
            <br />
            <span style={{ color: '#8c8c8c' }}>
              {apt.consultation_type || 'In-Person'} • {apt.status}
            </span>
          </div>
        ))}
      </div>
    ) : null;

    return (
      <Tooltip title={tooltipContent} placement="top">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          cursor: hasAppointments ? 'pointer' : 'default',
          gap: 2
        }}>
          {/* Always render a dot but make it transparent if no appointments */}
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#6C63FF',
              opacity: hasAppointments ? 1 : 0,
            }}
          />
          {/* Show additional dots and counter only if there are appointments */}
          {hasAppointments && dayAppointments.slice(1, 3).map((_, idx) => (
            <div
              key={idx + 1}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#6C63FF',
              }}
            />
          ))}
          {hasAppointments && dayAppointments.length > 3 && (
            <div style={{
              fontSize: 8,
              color: '#6C63FF',
              fontWeight: 'bold',
              marginLeft: 2
            }}>
              +{dayAppointments.length - 3}
            </div>
          )}
        </div>
      </Tooltip>
    );
  };

  return (
    <SimpleLayout>
      <PageLoader loading={loading}>
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#f5f5f5', 
          minHeight: 'calc(100vh - 56px)',
          height: isMobile ? 'fit-content' : 'auto',
          overflow: isMobile ? 'hidden' : 'auto'
        }}>
        <Row gutter={[16, 16]} style={{ height: '100%' }}>
          {/* Left Side - Doctor Profile & Quick Actions */}
          <Col xs={24} md={24} lg={8} xl={8}>
            {/* Doctor Profile Card */}
            <Card 
              style={{ 
                marginBottom: 16,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #6C63FF 0%, #5A52E8 100%)',
                border: 'none',
                color: 'white'
              }}
              bodyStyle={{ padding: '20px 16px' }}
              extra={
                <Button 
                  type="text" 
                  icon={<EditOutlined />}
                  onClick={handleProfileEdit}
                  style={{ 
                    color: 'white',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }}
                  size="small"
                />
              }
            >
              <div style={{ textAlign: 'center' }}>
                <Avatar 
                  size={64} 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 12 }}
                />
                <Title level={4} style={{ color: 'white', margin: 0, marginBottom: 4, fontSize: '18px' }}>
                  {doctorInfo.name}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>
                  {doctorInfo.email}
                </Text>
                <br />
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                  {doctorInfo.specialization}
                </Text>
                <br />
                {doctorInfo.clinic && (
                  <>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                      {doctorInfo.clinic}
                    </Text>
                    <br />
                  </>
                )}
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                  {doctorInfo.experience}
                </Text>
                {doctorInfo.phone && (
                  <>
                    <br />
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                      📞 {doctorInfo.phone}
                    </Text>
                  </>
                )}
              </div>
              <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '16px 0' }} />
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  type="default" 
                  size="middle" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalVisible(true)}
                  style={{ 
                    width: '100%', 
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    color: '#6C63FF',
                    border: 'none',
                    fontWeight: 500,
                    fontSize: '14px'
                  }}
                >
                  Schedule Appointment
                </Button>
                <Button 
                  type="default" 
                  size="middle" 
                  icon={<CalendarOutlined />}
                  style={{ 
                    width: '100%', 
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontSize: '14px'
                  }}
                >
                  View All Appointments
                </Button>
              </Space>
            </Card>

            {/* Quick Stats */}
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <Card bodyStyle={{ padding: 12, textAlign: 'center' }} style={{ borderRadius: 10 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>Today</Text>
                  <br />
                  <Title level={3} style={{ margin: 0, color: '#6C63FF', fontSize: '20px' }}>
                    {todayAppointments.length}
                  </Title>
                </Card>
              </Col>
              <Col span={8}>
                <Card bodyStyle={{ padding: 12, textAlign: 'center' }} style={{ borderRadius: 10 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>Tomorrow</Text>
                  <br />
                  <Title level={3} style={{ margin: 0, color: '#52c41a', fontSize: '20px' }}>
                    {tomorrowAppointments.length}
                  </Title>
                </Card>
              </Col>
              <Col span={8}>
                <Card bodyStyle={{ padding: 12, textAlign: 'center' }} style={{ borderRadius: 10 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>This Week</Text>
                  <br />
                  <Title level={3} style={{ margin: 0, color: '#722ed1', fontSize: '20px' }}>
                    {appointments.length}
                  </Title>
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Center - All Upcoming Appointments */}
          <Col xs={24} md={24} lg={10} xl={10}>
            <Title level={4} style={{ color: '#6C63FF', marginBottom: 16, fontSize: '18px' }}>
              Upcoming Appointments (30 Days)
            </Title>
            
            <div 
              ref={setScrollContainerRef}
              className={isMobile ? 'mobile-scroll-container' : ''}
              style={{ 
                height: isMobile ? 'calc(100vh - 320px)' : 'calc(100vh - 220px)', 
                maxHeight: isMobile ? '55vh' : '70vh',
                overflowY: 'auto',
                paddingRight: 4,
                WebkitOverflowScrolling: 'touch'
              }}
              onScroll={handleScroll}
            >
              <List
                dataSource={allUpcomingAppointments}
                loading={loading}
                renderItem={(appointment: Appointment) => {
                  const appointmentDate = dayjs(appointment.visit_date);
                  const isToday = appointmentDate.isSame(dayjs(), 'day');
                  const isTomorrow = appointmentDate.isSame(dayjs().add(1, 'day'), 'day');
                  
                  let dateLabel = appointmentDate.format('ddd, MMM DD');
                  if (isToday) dateLabel = `Today, ${appointmentDate.format('MMM DD')}`;
                  if (isTomorrow) dateLabel = `Tomorrow, ${appointmentDate.format('MMM DD')}`;

                  return (
                    <List.Item 
                      style={{ padding: 0, marginBottom: 12 }}
                      id={`appointment-${appointmentDate.format('YYYY-MM-DD')}`}
                      data-date={appointmentDate.format('YYYY-MM-DD')}
                    >
                      <Card 
                        size="small" 
                        style={{ 
                          width: '100%',
                          borderRadius: 10,
                          border: isToday ? '2px solid #6C63FF' : 
                                 appointmentDate.isSame(selectedDate, 'day') ? '2px solid #52c41a' :
                                 '1px solid #f0f0f0',
                          boxShadow: isToday ? '0 4px 12px rgba(108,99,255,0.15)' : 
                                    appointmentDate.isSame(selectedDate, 'day') ? '0 4px 12px rgba(82,196,26,0.15)' :
                                    '0 2px 8px rgba(0,0,0,0.06)',
                          backgroundColor: appointmentDate.isSame(selectedDate, 'day') ? '#f6ffed' : 'white'
                        }}
                        bodyStyle={{ padding: 12 }}
                      >
                        <div style={{ marginBottom: 6 }}>
                          <Text 
                            style={{ 
                              fontSize: 11, 
                              color: isToday ? '#6C63FF' : 
                                     appointmentDate.isSame(selectedDate, 'day') ? '#52c41a' : 
                                     '#8c8c8c',
                              fontWeight: isToday || appointmentDate.isSame(selectedDate, 'day') ? 600 : 400
                            }}
                          >
                            {dateLabel}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Avatar 
                              size={36} 
                              icon={<UserOutlined />} 
                              style={{ 
                                backgroundColor: isToday ? '#6C63FF' : 
                                               appointmentDate.isSame(selectedDate, 'day') ? '#52c41a' : 
                                               '#8c8c8c' 
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Text strong style={{ fontSize: 14 }}>
                                {appointment.patient.first_name} {appointment.patient.last_name}
                              </Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                {appointmentDate.format('h:mm A')} • {appointment.consultation_type || 'In-Person'}
                              </Text>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <Tag 
                              color={getConsultationColor(appointment.consultation_type)}
                              style={{ marginBottom: 3, fontSize: '10px', padding: '2px 6px' }}
                            >
                              {appointment.consultation_type || 'In-Person'}
                            </Tag>
                            <br />
                            <Tag color={getStatusColor(appointment.status)} style={{ fontSize: '10px', padding: '2px 6px' }}>
                              {appointment.status}
                            </Tag>
                          </div>
                        </div>
                      </Card>
                    </List.Item>
                  );
                }}
                loadMore={
                  hasMore ? (
                    <div style={{ textAlign: 'center', marginTop: 12 }}>
                      <Button 
                        onClick={loadMoreAppointments} 
                        loading={loadingMore}
                        style={{ borderRadius: 6, fontSize: '12px', height: '32px' }}
                        size="small"
                      >
                        Load More
                      </Button>
                    </div>
                  ) : allUpcomingAppointments.length > 0 ? (
                    <div style={{ textAlign: 'center', marginTop: 12, color: '#8c8c8c' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>No more appointments to load</Text>
                    </div>
                  ) : null
                }
              />
              
              {loadingMore && (
                <div style={{ textAlign: 'center', padding: 12 }}>
                  <Spin size="small" />
                </div>
              )}
              
              {allUpcomingAppointments.length === 0 && !loading && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: 32, 
                  color: '#8c8c8c',
                  backgroundColor: '#fafafa',
                  borderRadius: 10
                }}>
                  <CalendarOutlined style={{ fontSize: 36, marginBottom: 12 }} />
                  <br />
                  <Title level={5} style={{ color: '#8c8c8c', fontSize: '16px' }}>No upcoming appointments</Title>
                  <Text style={{ fontSize: '12px' }}>Schedule your first appointment to get started</Text>
                </div>
              )}
            </div>
          </Col>

          {/* Right Side - Calendar */}
          <Col xs={24} md={24} lg={6} xl={6}>
            <Card 
              title="Calendar View"
              style={{ 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(108,99,255,0.1)',
                marginBottom: isMobile ? 20 : 0
              }}
              headStyle={{ 
                backgroundColor: '#f8f9fa',
                borderRadius: '12px 12px 0 0',
                fontSize: '14px'
              }}
            >
              <Calendar 
                fullscreen={false}
                value={selectedDate}
                onSelect={handleDateSelect}
                cellRender={cellRender}
              />
            </Card>
          </Col>
        </Row>

        {/* Add Appointment Modal */}
        <Modal
          title="Schedule New Appointment"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={'95%'}
          style={{ 
            top: 20,
            maxWidth: 600
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddAppointment}
            style={{ marginTop: 16 }}
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="patient_id"
                  label="Patient"
                  rules={[{ required: true, message: 'Please select a patient' }]}
                >
                  <Select
                    placeholder="Select patient"
                    options={patients.map(p => ({
                      value: p.id,
                      label: `${p.first_name} ${p.last_name}`
                    }))}
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="consultation_type"
                  label="Consultation Type"
                  initialValue="In-Person"
                >
                  <Select
                    options={[
                      { value: 'In-Person', label: 'In-Person' },
                      { value: 'Video Consultation', label: 'Video Consultation' },
                      { value: 'Phone Consultation', label: 'Phone Consultation' }
                    ]}
                    size="middle"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="date"
                  label="Date & Time"
                  rules={[{ required: true, message: 'Please select date and time' }]}
                >
                  <DatePicker 
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    style={{ width: '100%' }}
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="fee"
                  label="Fee (₹)"
                  initialValue={500}
                >
                  <Select
                    options={[
                      { value: 300, label: '₹300' },
                      { value: 500, label: '₹500' },
                      { value: 700, label: '₹700' },
                      { value: 1000, label: '₹1000' }
                    ]}
                    size="middle"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => setIsModalVisible(false)} size="middle">
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" size="middle">
                  Schedule Appointment
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Profile Modal */}
        <Modal
          title="Edit Doctor Profile"
          open={isProfileModalVisible}
          onCancel={() => setIsProfileModalVisible(false)}
          footer={null}
          width={'95%'}
          style={{ 
            top: 20,
            maxWidth: 600
          }}
        >
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleProfileUpdate}
            style={{ marginTop: 16 }}
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input placeholder="Dr. John Smith" size="middle" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="specialization"
                  label="Specialization"
                  rules={[{ required: true, message: 'Please enter your specialization' }]}
                >
                  <Input placeholder="Physiotherapist" size="middle" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                >
                  <Input placeholder="+91 9876543210" size="middle" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="clinic"
                  label="Clinic/Hospital Name"
                >
                  <Input placeholder="ABC Physiotherapy Clinic" size="middle" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="experience"
                  label="Experience/Title"
                >
                  <Input placeholder="5+ Years Experience" size="middle" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="qualifications"
                  label="Qualifications"
                >
                  <Input placeholder="BPT, MPT" size="middle" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => setIsProfileModalVisible(false)} size="middle">
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" size="middle">
                  Update Profile
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
        </div>
      </PageLoader>
    </SimpleLayout>
  );
}
