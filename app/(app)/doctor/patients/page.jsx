"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, 
  Tag, 
  Space, 
  Card,
  message,
  Tooltip,
  Avatar,
  Dropdown,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Rate,
  Typography
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined,
  PlusOutlined,
  PhoneOutlined,
  MessageOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  StarOutlined,
  DownOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import SearchableTable from '@/app/components/common/SearchableTable';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const DoctorPatientsPage = () => {
  const router = useRouter();
  const [assessmentModalVisible, setAssessmentModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [assessmentForm] = Form.useForm();
  
  const [patientsData, setPatientsData] = useState([
    {
      key: '1',
      id: 'PT001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      phone: '+1 234-567-8901',
      email: 'john.smith@email.com',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-22',
      condition: 'Hypertension, Diabetes',
      status: 'Active',
      urgency: 'Normal',
      lastAssessment: '2024-01-10',
      assessmentScore: 8,
      assessmentsCount: 5
    },
    {
      key: '2',
      id: 'PT002',
      name: 'Emily Johnson',
      age: 32,
      gender: 'Female',
      phone: '+1 234-567-8902',
      email: 'emily.johnson@email.com',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-18',
      condition: 'Asthma',
      status: 'Active',
      urgency: 'Normal',
      lastAssessment: '2024-01-08',
      assessmentScore: 9,
      assessmentsCount: 3
    },
    {
      key: '3',
      id: 'PT003',
      name: 'Robert Davis',
      age: 58,
      gender: 'Male',
      phone: '+1 234-567-8903',
      email: 'robert.davis@email.com',
      lastVisit: '2023-12-20',
      nextAppointment: null,
      condition: 'Arthritis, High Cholesterol',
      status: 'Follow-up Required',
      urgency: 'High',
      lastAssessment: '2023-12-15',
      assessmentScore: 6,
      assessmentsCount: 8
    },
    {
      key: '4',
      id: 'PT004',
      name: 'Lisa Garcia',
      age: 41,
      gender: 'Female',
      phone: '+1 234-567-8904',
      email: 'lisa.garcia@email.com',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-01-25',
      condition: 'Migraine',
      status: 'Active',
      urgency: 'Normal',
      lastAssessment: null,
      assessmentScore: null,
      assessmentsCount: 0
    },
  ]);

  // Navigation handlers
  const handleViewPatient = (patientId) => {
    router.push(`/doctor/patients/${patientId}`);
  };

  const handleAddNote = (patientId) => {
    router.push(`/doctor/patients/${patientId}/notes/add`);
  };

  const handleScheduleAppointment = (patientId) => {
    router.push(`/doctor/appointments/new?patientId=${patientId}`);
  };

  const handleCall = (phone) => {
    message.info(`Calling ${phone}...`);
  };

  const handleMessage = (patientId) => {
    router.push(`/doctor/messages?patientId=${patientId}`);
  };

  // Assessment handlers
  const handleCreateAssessment = (patient) => {
    setSelectedPatient(patient);
    setAssessmentModalVisible(true);
    assessmentForm.resetFields();
  };

  const handleViewAssessments = (patientId) => {
    router.push(`/doctor/patients/${patientId}/assessments`);
  };

  const handleAssessmentSubmit = async (values) => {
    try {
      // In real implementation, this would make an API call
      console.log('Creating assessment:', {
        patientId: selectedPatient.id,
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        doctorId: 'DR001' // Current doctor
      });

      // Update local data for demo
      setPatientsData(prev => prev.map(patient => 
        patient.key === selectedPatient.key 
          ? {
              ...patient,
              lastAssessment: dayjs().format('YYYY-MM-DD'),
              assessmentScore: values.overallScore,
              assessmentsCount: patient.assessmentsCount + 1
            }
          : patient
      ));

      message.success('Assessment created successfully!');
      setAssessmentModalVisible(false);
      setSelectedPatient(null);
    } catch (error) {
      message.error('Failed to create assessment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Follow-up Required':
        return 'orange';
      case 'Inactive':
        return 'red';
      default:
        return 'default';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Normal':
        return 'green';
      default:
        return 'default';
    }
  };

  const getAssessmentScoreColor = (score) => {
    if (!score) return 'default';
    if (score >= 8) return 'green';
    if (score >= 6) return 'orange';
    return 'red';
  };

  // Patient action dropdown menu
  const getPatientActionMenu = (record) => ({
    items: [
      {
        key: 'view',
        label: 'View Details',
        icon: <EyeOutlined />,
        onClick: () => handleViewPatient(record.key)
      },
      {
        key: 'assessment',
        label: 'Create Assessment',
        icon: <FileTextOutlined />,
        onClick: () => handleCreateAssessment(record)
      },
      {
        key: 'view-assessments',
        label: 'View Assessments',
        icon: <StarOutlined />,
        onClick: () => handleViewAssessments(record.key),
        disabled: record.assessmentsCount === 0
      },
      { type: 'divider' },
      {
        key: 'appointment',
        label: 'Schedule Appointment',
        icon: <CalendarOutlined />,
        onClick: () => handleScheduleAppointment(record.key)
      },
      {
        key: 'note',
        label: 'Add Note',
        icon: <EditOutlined />,
        onClick: () => handleAddNote(record.key)
      },
      { type: 'divider' },
      {
        key: 'call',
        label: 'Call Patient',
        icon: <PhoneOutlined />,
        onClick: () => handleCall(record.phone)
      },
      {
        key: 'message',
        label: 'Send Message',
        icon: <MessageOutlined />,
        onClick: () => handleMessage(record.key)
      }
    ]
  });

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">ID: {record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Age/Gender',
      key: 'ageGender',
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.age} years</div>
          <div className="text-sm text-gray-500">{record.gender}</div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 140,
      render: (_, record) => (
        <div>
          <div className="text-sm">{record.phone}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      width: 200,
      render: (condition) => (
        <div className="text-sm">{condition}</div>
      ),
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      width: 120,
      sorter: (a, b) => new Date(a.lastVisit) - new Date(b.lastVisit),
    },
    {
      title: 'Assessment',
      key: 'assessment',
      width: 150,
      render: (_, record) => (
        <div className="space-y-1">
          {record.lastAssessment ? (
            <>
              <div className="flex items-center space-x-2">
                <Tag color={getAssessmentScoreColor(record.assessmentScore)}>
                  Score: {record.assessmentScore}/10
                </Tag>
              </div>
              <div className="text-xs text-gray-500">
                Last: {record.lastAssessment}
              </div>
              <div className="text-xs text-gray-500">
                Total: {record.assessmentsCount}
              </div>
            </>
          ) : (
            <Tag color="default">No assessments</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status, record) => (
        <div>
          <Tag color={getStatusColor(status)}>{status}</Tag>
          {record.urgency === 'High' && (
            <Tag color={getUrgencyColor(record.urgency)} size="small">
              Urgent
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Quick Actions">
            <Dropdown menu={getPatientActionMenu(record)} trigger={['click']}>
              <Button size="small">
                Actions <DownOutlined />
              </Button>
            </Dropdown>
          </Tooltip>
          <Tooltip title="Create Assessment">
            <Button 
              type="primary" 
              icon={<FileTextOutlined />} 
              size="small"
              onClick={() => handleCreateAssessment(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Follow-up Required', value: 'Follow-up Required' },
        { label: 'Inactive', value: 'Inactive' }
      ]
    },
    {
      key: 'urgency',
      label: 'Urgency',
      options: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Normal', value: 'Normal' }
      ]
    },
    {
      key: 'gender',
      label: 'Gender',
      options: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
      ]
    },
    {
      key: 'assessmentStatus',
      label: 'Assessment Status',
      options: [
        { label: 'Has Assessments', value: 'has' },
        { label: 'No Assessments', value: 'none' }
      ]
    }
  ];

  const searchFields = ['name', 'id', 'condition', 'email'];

  const headerActions = (
    <Space>
      <Button 
        icon={<FileTextOutlined />}
        onClick={() => router.push('/doctor/assessments')}
      >
        View All Assessments
      </Button>
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={() => router.push('/doctor/patients/add')}
      >
        Add Personal Patient
      </Button>
    </Space>
  );

  // Quick stats section
  const quickStats = (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
      <Card className="text-center">
        <div className="text-2xl font-bold text-blue-600">
          {patientsData.length}
        </div>
        <div className="text-gray-500">Total Patients</div>
      </Card>
      <Card className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {patientsData.filter(p => p.status === 'Active').length}
        </div>
        <div className="text-gray-500">Active</div>
      </Card>
      <Card className="text-center">
        <div className="text-2xl font-bold text-orange-600">
          {patientsData.filter(p => p.status === 'Follow-up Required').length}
        </div>
        <div className="text-gray-500">Need Follow-up</div>
      </Card>
      <Card className="text-center">
        <div className="text-2xl font-bold text-red-600">
          {patientsData.filter(p => p.urgency === 'High').length}
        </div>
        <div className="text-gray-500">Urgent</div>
      </Card>
      <Card className="text-center">
        <div className="text-2xl font-bold text-purple-600">
          {patientsData.reduce((sum, p) => sum + p.assessmentsCount, 0)}
        </div>
        <div className="text-gray-500">Total Assessments</div>
      </Card>
    </div>
  );

  return (
    <div>
      {quickStats}
      <SearchableTable
        title="My Personal Patients"
        subtitle="Manage your assigned patients and personal patient roster. Add new personal patients to expand your practice."
        data={patientsData}
        columns={columns}
        filters={filters}
        searchFields={searchFields}
        searchPlaceholder="Search by name, ID, condition, or email..."
        headerActions={headerActions}
        rowKey="key"
        scroll={{ x: 1400 }}
      />

      {/* Assessment Creation Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <FileTextOutlined />
            <span>Create Patient Assessment</span>
          </div>
        }
        open={assessmentModalVisible}
        onCancel={() => {
          setAssessmentModalVisible(false);
          setSelectedPatient(null);
        }}
        footer={null}
        width={700}
      >
        {selectedPatient && (
          <div className="space-y-4">
            <Card className="bg-blue-50">
              <div className="flex items-center space-x-3">
                <Avatar icon={<UserOutlined />} />
                <div>
                  <Title level={5} className="mb-0">{selectedPatient.name}</Title>
                  <Text type="secondary">
                    {selectedPatient.age} years • {selectedPatient.gender} • ID: {selectedPatient.id}
                  </Text>
                </div>
              </div>
            </Card>

            <Form
              form={assessmentForm}
              layout="vertical"
              onFinish={handleAssessmentSubmit}
              initialValues={{
                date: dayjs(),
                assessmentType: 'routine'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="date"
                  label="Assessment Date"
                  rules={[{ required: true, message: 'Please select date' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="assessmentType"
                  label="Assessment Type"
                  rules={[{ required: true, message: 'Please select type' }]}
                >
                  <Select>
                    <Option value="routine">Routine Check-up</Option>
                    <Option value="followup">Follow-up</Option>
                    <Option value="urgent">Urgent Assessment</Option>
                    <Option value="consultation">Consultation</Option>
                    <Option value="therapy">Therapy Session</Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                name="symptoms"
                label="Current Symptoms"
                rules={[{ required: true, message: 'Please describe symptoms' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Describe patient's current symptoms and concerns..."
                />
              </Form.Item>

              <Form.Item
                name="diagnosis"
                label="Assessment/Diagnosis"
                rules={[{ required: true, message: 'Please provide assessment' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Provide your professional assessment and diagnosis..."
                />
              </Form.Item>

              <Form.Item
                name="treatment"
                label="Treatment Plan"
                rules={[{ required: true, message: 'Please provide treatment plan' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Outline the recommended treatment plan..."
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="overallScore"
                  label="Overall Health Score (1-10)"
                  rules={[{ required: true, message: 'Please provide a score' }]}
                >
                  <Rate count={10} />
                </Form.Item>

                <Form.Item
                  name="followUpDate"
                  label="Next Follow-up Date"
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    disabledDate={(current) => current && current < dayjs().endOf('day')}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="notes"
                label="Additional Notes"
              >
                <TextArea 
                  rows={2} 
                  placeholder="Any additional notes or observations..."
                />
              </Form.Item>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  onClick={() => {
                    setAssessmentModalVisible(false);
                    setSelectedPatient(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" icon={<FileTextOutlined />}>
                  Create Assessment
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorPatientsPage;
