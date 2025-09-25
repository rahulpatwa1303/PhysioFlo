"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Tag, 
  Avatar, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Rate, 
  message,
  Tooltip,
  Typography,
  Divider,
  Alert,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  SearchOutlined
} from '@ant-design/icons';
import SearchableTable from '@/app/components/common/SearchableTable';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

// Mock assessment data
const mockAssessmentsData = [
  {
    key: '1',
    id: 'ASS-001',
    patientId: 'PT001',
    patientName: 'John Smith',
    patientAge: 45,
    patientGender: 'Male',
    assessmentDate: '2024-01-15',
    assessmentType: 'routine',
    symptoms: 'Patient reports occasional chest discomfort and fatigue. Blood pressure readings have been elevated recently.',
    diagnosis: 'Hypertension Stage 1. Patient shows signs of stress-related cardiovascular strain. Recommend lifestyle modifications.',
    treatment: 'Prescribed ACE inhibitor (Lisinopril 10mg daily). Dietary counseling scheduled. Regular exercise program recommended.',
    overallScore: 7,
    followUpDate: '2024-02-15',
    notes: 'Patient is compliant with medication. Monitor blood pressure weekly.',
    status: 'Completed',
    priority: 'Normal',
    createdBy: 'Dr. Sarah Wilson',
    createdAt: '2024-01-15 10:30:00',
    lastModified: '2024-01-15 10:30:00'
  },
  {
    key: '2',
    id: 'ASS-002',
    patientId: 'PT002',
    patientName: 'Emily Johnson',
    patientAge: 32,
    patientGender: 'Female',
    assessmentDate: '2024-01-14',
    assessmentType: 'followup',
    symptoms: 'Improved asthma control since last visit. Occasional wheezing during exercise but overall respiratory function stable.',
    diagnosis: 'Asthma - well controlled. Exercise-induced bronchospasm managed effectively with current medication regimen.',
    treatment: 'Continue current inhaler therapy. Pre-exercise bronchodilator use before strenuous activities. Peak flow monitoring.',
    overallScore: 9,
    followUpDate: '2024-04-14',
    notes: 'Excellent patient compliance. Peak flow readings consistently in green zone.',
    status: 'Completed',
    priority: 'Normal',
    createdBy: 'Dr. Sarah Wilson',
    createdAt: '2024-01-14 14:15:00',
    lastModified: '2024-01-14 14:15:00'
  },
  {
    key: '3',
    id: 'ASS-003',
    patientId: 'PT003',
    patientName: 'Robert Davis',
    patientAge: 58,
    patientGender: 'Male',
    assessmentDate: '2024-01-13',
    assessmentType: 'urgent',
    symptoms: 'Severe joint pain and stiffness in knees and hips. Limited mobility affecting daily activities. Pain level 8/10.',
    diagnosis: 'Osteoarthritis progression. Inflammatory markers elevated. Consider advanced treatment options.',
    treatment: 'Increased anti-inflammatory medication. Physical therapy referral. Hyaluronic acid injection scheduled.',
    overallScore: 4,
    followUpDate: '2024-01-27',
    notes: 'Patient experiencing significant pain impact on quality of life. Monitor closely for treatment response.',
    status: 'Active',
    priority: 'High',
    createdBy: 'Dr. Sarah Wilson',
    createdAt: '2024-01-13 09:45:00',
    lastModified: '2024-01-13 11:20:00'
  },
  {
    key: '4',
    id: 'ASS-004',
    patientId: 'PT004',
    patientName: 'Lisa Garcia',
    patientAge: 41,
    patientGender: 'Female',
    assessmentDate: '2024-01-12',
    assessmentType: 'consultation',
    symptoms: 'Frequent migraines (3-4 times per week). Triggers include stress, bright lights, and lack of sleep.',
    diagnosis: 'Chronic migraine disorder. Stress and lifestyle factors contributing significantly to frequency.',
    treatment: 'Prophylactic medication initiated (Topiramate). Stress management counseling. Sleep hygiene education.',
    overallScore: 6,
    followUpDate: '2024-02-12',
    notes: 'Patient willing to make lifestyle changes. Headache diary initiated to track triggers.',
    status: 'Completed',
    priority: 'Normal',
    createdBy: 'Dr. Sarah Wilson',
    createdAt: '2024-01-12 15:30:00',
    lastModified: '2024-01-12 15:30:00'
  },
  {
    key: '5',
    id: 'ASS-005',
    patientId: 'PT001',
    patientName: 'John Smith',
    patientAge: 45,
    patientGender: 'Male',
    assessmentDate: '2024-01-08',
    assessmentType: 'routine',
    symptoms: 'Regular diabetes check-up. Blood glucose levels well controlled with current medication.',
    diagnosis: 'Type 2 Diabetes Mellitus - well controlled. HbA1c within target range (6.8%).',
    treatment: 'Continue current metformin therapy. Dietary compliance excellent. Annual eye exam scheduled.',
    overallScore: 8,
    followUpDate: '2024-04-08',
    notes: 'Patient demonstrates excellent self-management skills. Continue current treatment plan.',
    status: 'Completed',
    priority: 'Normal',
    createdBy: 'Dr. Sarah Wilson',
    createdAt: '2024-01-08 11:00:00',
    lastModified: '2024-01-08 11:00:00'
  }
];

const DoctorAssessmentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [assessmentModalVisible, setAssessmentModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [assessmentsData, setAssessmentsData] = useState(mockAssessmentsData);

  // Mock current doctor
  const [currentDoctor] = useState({ 
    id: 'DR001', 
    name: 'Dr. Sarah Wilson',
    specialization: 'General Medicine' 
  });

  // Mock patients for new assessment
  const [patientsData] = useState([
    { id: 'PT001', name: 'John Smith', age: 45, gender: 'Male' },
    { id: 'PT002', name: 'Emily Johnson', age: 32, gender: 'Female' },
    { id: 'PT003', name: 'Robert Davis', age: 58, gender: 'Male' },
    { id: 'PT004', name: 'Lisa Garcia', age: 41, gender: 'Female' }
  ]);

  // Initialize from URL params
  useEffect(() => {
    const patientId = searchParams.get('patientId');
    if (patientId) {
      handleCreateAssessment(patientId);
    }
  }, [searchParams]);

  // Handlers
  const handleCreateAssessment = (patientId = null) => {
    setSelectedAssessment(null);
    setAssessmentModalVisible(true);
    form.resetFields();
    
    if (patientId) {
      const patient = patientsData.find(p => p.id === patientId);
      if (patient) {
        form.setFieldsValue({
          patientId: patient.id,
          assessmentDate: dayjs(),
          assessmentType: 'routine'
        });
      }
    } else {
      form.setFieldsValue({
        assessmentDate: dayjs(),
        assessmentType: 'routine'
      });
    }
  };

  const handleViewAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setViewModalVisible(true);
  };

  const handleEditAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setAssessmentModalVisible(true);
    form.setFieldsValue({
      ...assessment,
      assessmentDate: dayjs(assessment.assessmentDate),
      followUpDate: assessment.followUpDate ? dayjs(assessment.followUpDate) : null
    });
  };

  const handleAssessmentSubmit = async (values) => {
    setLoading(true);
    try {
      const selectedPatient = patientsData.find(p => p.id === values.patientId);
      
      const assessmentData = {
        key: selectedAssessment ? selectedAssessment.key : `${Date.now()}`,
        id: selectedAssessment ? selectedAssessment.id : `ASS-${String(assessmentsData.length + 1).padStart(3, '0')}`,
        patientId: values.patientId,
        patientName: selectedPatient.name,
        patientAge: selectedPatient.age,
        patientGender: selectedPatient.gender,
        assessmentDate: values.assessmentDate.format('YYYY-MM-DD'),
        assessmentType: values.assessmentType,
        symptoms: values.symptoms,
        diagnosis: values.diagnosis,
        treatment: values.treatment,
        overallScore: values.overallScore,
        followUpDate: values.followUpDate?.format('YYYY-MM-DD') || null,
        notes: values.notes || '',
        status: values.status || 'Active',
        priority: values.priority || 'Normal',
        createdBy: currentDoctor.name,
        createdAt: selectedAssessment ? selectedAssessment.createdAt : dayjs().format('YYYY-MM-DD HH:mm:ss'),
        lastModified: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };

      if (selectedAssessment) {
        // Update existing
        setAssessmentsData(prev => prev.map(item => 
          item.key === selectedAssessment.key ? assessmentData : item
        ));
        message.success('Assessment updated successfully!');
      } else {
        // Create new
        setAssessmentsData(prev => [assessmentData, ...prev]);
        message.success('Assessment created successfully!');
      }

      setAssessmentModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save assessment');
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Assessment ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => <Text strong>{id}</Text>
    },
    {
      title: 'Patient',
      key: 'patient',
      width: 180,
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div className="font-medium">{record.patientName}</div>
            <div className="text-xs text-gray-500">
              {record.patientAge}y • {record.patientGender} • ID: {record.patientId}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Date',
      dataIndex: 'assessmentDate',
      key: 'date',
      width: 110,
      sorter: (a, b) => new Date(a.assessmentDate) - new Date(b.assessmentDate),
      render: (date) => dayjs(date).format('MMM DD, YYYY')
    },
    {
      title: 'Type',
      dataIndex: 'assessmentType',
      key: 'type',
      width: 120,
      render: (type) => {
        const typeColors = {
          routine: 'blue',
          followup: 'green',
          urgent: 'red',
          consultation: 'orange',
          therapy: 'purple'
        };
        const typeLabels = {
          routine: 'Routine',
          followup: 'Follow-up',
          urgent: 'Urgent',
          consultation: 'Consultation',
          therapy: 'Therapy'
        };
        return <Tag color={typeColors[type]}>{typeLabels[type]}</Tag>;
      }
    },
    {
      title: 'Score',
      dataIndex: 'overallScore',
      key: 'score',
      width: 100,
      sorter: (a, b) => a.overallScore - b.overallScore,
      render: (score) => {
        const getScoreColor = (score) => {
          if (score >= 8) return 'green';
          if (score >= 6) return 'orange';
          return 'red';
        };
        return (
          <div className="flex items-center space-x-1">
            <Tag color={getScoreColor(score)}>{score}/10</Tag>
            <Rate disabled value={score} count={5} style={{ fontSize: 12 }} />
          </div>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusColors = {
          Active: 'processing',
          Completed: 'success',
          'Follow-up Required': 'warning',
          Cancelled: 'error'
        };
        return <Tag color={statusColors[status]}>{status}</Tag>;
      }
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => {
        const priorityColors = {
          High: 'red',
          Medium: 'orange',
          Normal: 'green'
        };
        return <Tag color={priorityColors[priority]} size="small">{priority}</Tag>;
      }
    },
    {
      title: 'Follow-up',
      dataIndex: 'followUpDate',
      key: 'followUp',
      width: 120,
      render: (date) => (
        date ? (
          <div className="text-sm">
            <div>{dayjs(date).format('MMM DD, YYYY')}</div>
            <div className={`text-xs ${dayjs(date).isBefore(dayjs()) ? 'text-red-500' : 'text-gray-500'}`}>
              {dayjs(date).isBefore(dayjs()) ? 'Overdue' : `${dayjs(date).diff(dayjs(), 'days')} days`}
            </div>
          </div>
        ) : (
          <Text type="secondary">Not set</Text>
        )
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              size="small" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewAssessment(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Assessment">
            <Button 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => handleEditAssessment(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Filters and search
  const filters = [
    {
      key: 'assessmentType',
      label: 'Type',
      options: [
        { label: 'Routine', value: 'routine' },
        { label: 'Follow-up', value: 'followup' },
        { label: 'Urgent', value: 'urgent' },
        { label: 'Consultation', value: 'consultation' },
        { label: 'Therapy', value: 'therapy' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Follow-up Required', value: 'Follow-up Required' }
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Normal', value: 'Normal' }
      ]
    }
  ];

  const searchFields = ['id', 'patientName', 'diagnosis', 'symptoms'];

  // Statistics
  const totalAssessments = assessmentsData.length;
  const completedAssessments = assessmentsData.filter(a => a.status === 'Completed').length;
  const averageScore = assessmentsData.reduce((acc, curr) => acc + curr.overallScore, 0) / totalAssessments;
  const overdueFollowUps = assessmentsData.filter(a => 
    a.followUpDate && dayjs(a.followUpDate).isBefore(dayjs()) && a.status !== 'Completed'
  ).length;

  const headerActions = (
    <Space>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => handleCreateAssessment()}
      >
        Create Assessment
      </Button>
    </Space>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patient Assessments</h1>
          <p className="text-gray-500">Create and manage comprehensive patient assessments and evaluations</p>
        </div>
        {headerActions}
      </div>

      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Assessments"
              value={totalAssessments}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Completed"
              value={completedAssessments}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Avg Score"
              value={averageScore}
              precision={1}
              suffix="/10"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Overdue Follow-ups"
              value={overdueFollowUps}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: overdueFollowUps > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Overdue Follow-ups Alert */}
      {overdueFollowUps > 0 && (
        <Alert
          message={`${overdueFollowUps} Follow-up${overdueFollowUps > 1 ? 's' : ''} Overdue`}
          description="Some patients have overdue follow-up appointments. Please review and schedule necessary appointments."
          type="warning"
          showIcon
          closable
        />
      )}

      {/* Assessments Table */}
      <SearchableTable
        title="All Assessments"
        subtitle="Comprehensive list of patient assessments and evaluations"
        data={assessmentsData}
        columns={columns}
        filters={filters}
        searchFields={searchFields}
        searchPlaceholder="Search by assessment ID, patient name, diagnosis, or symptoms..."
        rowKey="key"
        scroll={{ x: 1200 }}
      />

      {/* Create/Edit Assessment Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <FileTextOutlined />
            <span>{selectedAssessment ? 'Edit Assessment' : 'Create New Assessment'}</span>
          </div>
        }
        open={assessmentModalVisible}
        onCancel={() => {
          setAssessmentModalVisible(false);
          setSelectedAssessment(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAssessmentSubmit}
          initialValues={{
            assessmentDate: dayjs(),
            assessmentType: 'routine',
            status: 'Active',
            priority: 'Normal'
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="patientId"
                label="Patient"
                rules={[{ required: true, message: 'Please select a patient' }]}
              >
                <Select
                  placeholder="Select patient"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {patientsData.map(patient => (
                    <Option key={patient.id} value={patient.id}>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500">
                          {patient.age}y • {patient.gender} • ID: {patient.id}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="assessmentDate"
                label="Assessment Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
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
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="Active">Active</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Follow-up Required">Follow-up Required</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <Select>
                  <Option value="High">High</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Normal">Normal</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

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

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="overallScore"
                label="Overall Health Score (1-10)"
                rules={[{ required: true, message: 'Please provide a score' }]}
              >
                <Rate count={10} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="followUpDate"
                label="Next Follow-up Date"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  disabledDate={(current) => current && current < dayjs().endOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

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
                setSelectedAssessment(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<FileTextOutlined />}
            >
              {selectedAssessment ? 'Update Assessment' : 'Create Assessment'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Assessment Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <EyeOutlined />
            <span>Assessment Details</span>
          </div>
        }
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedAssessment(null);
        }}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => {
              setViewModalVisible(false);
              handleEditAssessment(selectedAssessment);
            }}
          >
            Edit Assessment
          </Button>
        ]}
        width={700}
      >
        {selectedAssessment && (
          <div className="space-y-4">
            {/* Patient Info Header */}
            <Card className="bg-blue-50">
              <div className="flex items-center space-x-3">
                <Avatar size={48} icon={<UserOutlined />} />
                <div>
                  <Title level={5} className="mb-0">{selectedAssessment.patientName}</Title>
                  <Text type="secondary">
                    {selectedAssessment.patientAge} years • {selectedAssessment.patientGender} • ID: {selectedAssessment.patientId}
                  </Text>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm text-gray-500">Assessment ID</div>
                  <Text strong>{selectedAssessment.id}</Text>
                </div>
              </div>
            </Card>

            {/* Assessment Details */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Card title="Assessment Information" size="small">
                  <div className="space-y-2">
                    <div><strong>Date:</strong> {dayjs(selectedAssessment.assessmentDate).format('MMMM D, YYYY')}</div>
                    <div><strong>Type:</strong> <Tag color="blue">{selectedAssessment.assessmentType}</Tag></div>
                    <div><strong>Status:</strong> <Tag color="green">{selectedAssessment.status}</Tag></div>
                    <div><strong>Priority:</strong> <Tag color="orange">{selectedAssessment.priority}</Tag></div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card title="Scoring & Follow-up" size="small">
                  <div className="space-y-2">
                    <div>
                      <strong>Overall Score:</strong> 
                      <div className="mt-1">
                        <Rate disabled value={selectedAssessment.overallScore} count={10} style={{ fontSize: 14 }} />
                        <span className="ml-2">{selectedAssessment.overallScore}/10</span>
                      </div>
                    </div>
                    <div>
                      <strong>Follow-up Date:</strong> 
                      {selectedAssessment.followUpDate ? (
                        <div className={`mt-1 ${dayjs(selectedAssessment.followUpDate).isBefore(dayjs()) ? 'text-red-500' : ''}`}>
                          {dayjs(selectedAssessment.followUpDate).format('MMMM D, YYYY')}
                          {dayjs(selectedAssessment.followUpDate).isBefore(dayjs()) && (
                            <Tag color="red" size="small" className="ml-2">Overdue</Tag>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500"> Not set</span>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Clinical Details */}
            <Card title="Clinical Assessment" size="small">
              <div className="space-y-4">
                <div>
                  <strong>Symptoms:</strong>
                  <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                    {selectedAssessment.symptoms}
                  </div>
                </div>
                
                <div>
                  <strong>Diagnosis:</strong>
                  <div className="mt-1 p-3 bg-blue-50 rounded text-sm">
                    {selectedAssessment.diagnosis}
                  </div>
                </div>
                
                <div>
                  <strong>Treatment Plan:</strong>
                  <div className="mt-1 p-3 bg-green-50 rounded text-sm">
                    {selectedAssessment.treatment}
                  </div>
                </div>
                
                {selectedAssessment.notes && (
                  <div>
                    <strong>Additional Notes:</strong>
                    <div className="mt-1 p-3 bg-yellow-50 rounded text-sm">
                      {selectedAssessment.notes}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Metadata */}
            <Card title="Assessment Metadata" size="small">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Created by:</strong> {selectedAssessment.createdBy}</div>
                <div><strong>Created:</strong> {selectedAssessment.createdAt}</div>
                <div><strong>Last Modified:</strong> {selectedAssessment.lastModified}</div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorAssessmentsPage;
