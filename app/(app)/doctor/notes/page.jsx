"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  message,
  Avatar,
  Tooltip,
  Divider,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock patient notes data
const mockNotesData = [
  {
    key: '1',
    id: 'NOTE-001',
    patientId: 'PT001',
    patientName: 'John Smith',
    patientAvatar: null,
    date: '2024-01-15',
    time: '10:30 AM',
    type: 'Progress Note',
    category: 'Follow-up',
    title: 'Blood Pressure Check Follow-up',
    content: 'Patient reports feeling well. Blood pressure stable at 130/80. Continue current medication regimen. No adverse effects reported from Lisinopril. Patient understands importance of daily medication compliance.',
    tags: ['Hypertension', 'Medication Review'],
    priority: 'Normal',
    doctorName: 'Dr. Sarah Wilson',
    isEditable: true,
    createdAt: '2024-01-15 10:30 AM',
    updatedAt: '2024-01-15 10:30 AM'
  },
  {
    key: '2',
    id: 'NOTE-002',
    patientId: 'PT002',
    patientName: 'Emily Johnson',
    patientAvatar: null,
    date: '2024-01-14',
    time: '2:15 PM',
    type: 'Treatment Plan',
    category: 'Assessment',
    title: 'Diabetes Management Plan Update',
    content: 'Updated diabetes management plan. HbA1c levels improved from 8.2% to 7.1%. Patient demonstrates good understanding of carb counting. Increased metformin dosage to 1000mg twice daily.',
    tags: ['Diabetes', 'Treatment Plan', 'Medication Adjustment'],
    priority: 'High',
    doctorName: 'Dr. Sarah Wilson',
    isEditable: true,
    createdAt: '2024-01-14 2:15 PM',
    updatedAt: '2024-01-14 2:15 PM'
  },
  {
    key: '3',
    id: 'NOTE-003',
    patientId: 'PT003',
    patientName: 'Robert Davis',
    patientAvatar: null,
    date: '2024-01-13',
    time: '9:45 AM',
    type: 'Clinical Observation',
    category: 'Assessment',
    title: 'Physical Therapy Progress',
    content: 'Patient showing excellent progress in physical therapy. Range of motion improved by 30% since last visit. Reduced pain levels from 7/10 to 4/10. Continue current PT regimen for another 4 weeks.',
    tags: ['Physical Therapy', 'Recovery', 'Pain Management'],
    priority: 'Normal',
    doctorName: 'Dr. Sarah Wilson',
    isEditable: true,
    createdAt: '2024-01-13 9:45 AM',
    updatedAt: '2024-01-13 9:45 AM'
  },
  {
    key: '4',
    id: 'NOTE-004',
    patientId: 'PT001',
    patientName: 'John Smith',
    patientAvatar: null,
    date: '2024-01-10',
    time: '11:00 AM',
    type: 'Prescription',
    category: 'Medication',
    title: 'New Prescription - Metformin',
    content: 'Prescribed Metformin 500mg twice daily for blood sugar management. Patient educated on proper timing with meals and potential side effects. Follow-up in 2 weeks to assess tolerance.',
    tags: ['Prescription', 'Diabetes', 'Patient Education'],
    priority: 'High',
    doctorName: 'Dr. Sarah Wilson',
    isEditable: true,
    createdAt: '2024-01-10 11:00 AM',
    updatedAt: '2024-01-10 11:00 AM'
  },
  {
    key: '5',
    id: 'NOTE-005',
    patientId: 'PT004',
    patientName: 'Lisa Garcia',
    patientAvatar: null,
    date: '2024-01-12',
    time: '3:30 PM',
    type: 'Consultation Notes',
    category: 'Consultation',
    title: 'Migraine Consultation',
    content: 'Patient complains of frequent migraines (3-4 times per week). Triggers appear to be stress and lack of sleep. Recommended stress management techniques and sleep hygiene education. Prescribed Sumatriptan for acute episodes.',
    tags: ['Migraine', 'Consultation', 'Lifestyle Factors'],
    priority: 'Normal',
    doctorName: 'Dr. Sarah Wilson',
    isEditable: true,
    createdAt: '2024-01-12 3:30 PM',
    updatedAt: '2024-01-12 3:30 PM'
  }
];

// Mock patients for quick note creation
const mockPatients = [
  { id: 'PT001', name: 'John Smith', avatar: null },
  { id: 'PT002', name: 'Emily Johnson', avatar: null },
  { id: 'PT003', name: 'Robert Davis', avatar: null },
  { id: 'PT004', name: 'Lisa Garcia', avatar: null },
  { id: 'PT005', name: 'Michael Chen', avatar: null }
];

const DoctorNotesPage = () => {
  const router = useRouter();
  const [notesData, setNotesData] = useState(mockNotesData);
  const [filteredData, setFilteredData] = useState(mockNotesData);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [dateRange, setDateRange] = useState([]);
  
  // Modal states
  const [addNoteModalVisible, setAddNoteModalVisible] = useState(false);
  const [viewNoteModalVisible, setViewNoteModalVisible] = useState(false);
  const [editNoteModalVisible, setEditNoteModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Filter data based on search criteria
  const handleFilterChange = () => {
    let filtered = [...notesData];

    if (searchText) {
      filtered = filtered.filter(note => 
        note.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        note.title.toLowerCase().includes(searchText.toLowerCase()) ||
        note.content.toLowerCase().includes(searchText.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (selectedType) {
      filtered = filtered.filter(note => note.type === selectedType);
    }

    if (selectedPatient) {
      filtered = filtered.filter(note => note.patientId === selectedPatient);
    }

    if (selectedPriority) {
      filtered = filtered.filter(note => note.priority === selectedPriority);
    }

    if (dateRange.length === 2) {
      filtered = filtered.filter(note => {
        const noteDate = dayjs(note.date);
        return noteDate.isAfter(dateRange[0].startOf('day')) && 
               noteDate.isBefore(dateRange[1].endOf('day'));
      });
    }

    setFilteredData(filtered);
  };

  // Apply filters whenever filter criteria change
  useState(() => {
    handleFilterChange();
  }, [searchText, selectedType, selectedPatient, selectedPriority, dateRange]);

  const clearFilters = () => {
    setSearchText('');
    setSelectedType('');
    setSelectedPatient('');
    setSelectedPriority('');
    setDateRange([]);
    setFilteredData(notesData);
  };

  const handleAddNote = () => {
    setAddNoteModalVisible(true);
    form.resetFields();
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setViewNoteModalVisible(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setEditNoteModalVisible(true);
    editForm.setFieldsValue({
      ...note,
      date: dayjs(note.date),
      tags: note.tags
    });
  };

  const handleViewPatient = (patientId) => {
    router.push(`/doctor/patients/${patientId}`);
  };

  const handleCreateNote = async (values) => {
    setLoading(true);
    try {
      const newNote = {
        key: `note-${Date.now()}`,
        id: `NOTE-${String(notesData.length + 1).padStart(3, '0')}`,
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: dayjs().format('h:mm A'),
        patientName: mockPatients.find(p => p.id === values.patientId)?.name || 'Unknown Patient',
        patientAvatar: null,
        doctorName: 'Dr. Sarah Wilson',
        isEditable: true,
        createdAt: dayjs().format('YYYY-MM-DD h:mm A'),
        updatedAt: dayjs().format('YYYY-MM-DD h:mm A')
      };

      const updatedNotes = [newNote, ...notesData];
      setNotesData(updatedNotes);
      setFilteredData(updatedNotes);
      setAddNoteModalVisible(false);
      message.success('Note created successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async (values) => {
    setLoading(true);
    try {
      const updatedNote = {
        ...selectedNote,
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        updatedAt: dayjs().format('YYYY-MM-DD h:mm A')
      };

      const updatedNotes = notesData.map(note => 
        note.key === selectedNote.key ? updatedNote : note
      );
      
      setNotesData(updatedNotes);
      setFilteredData(updatedNotes);
      setEditNoteModalVisible(false);
      message.success('Note updated successfully');
    } catch (error) {
      message.error('Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Normal': return 'blue';
      case 'Low': return 'green';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Progress Note': return 'blue';
      case 'Treatment Plan': return 'green';
      case 'Clinical Observation': return 'orange';
      case 'Prescription': return 'purple';
      case 'Consultation Notes': return 'cyan';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size="small" 
            src={record.patientAvatar} 
            icon={<UserOutlined />} 
          />
          <div>
            <div className="font-medium text-blue-600 cursor-pointer hover:underline"
                 onClick={() => handleViewPatient(record.patientId)}>
              {record.patientName}
            </div>
            <div className="text-xs text-gray-500">{record.patientId}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      width: 140,
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      render: (_, record) => (
        <div>
          <div className="font-medium">{dayjs(record.date).format('MMM DD, YYYY')}</div>
          <div className="text-xs text-gray-500">{record.time}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type) => (
        <Tag color={getTypeColor(type)} className="text-xs">
          {type}
        </Tag>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title) => (
        <span className="font-medium">{title}</span>
      ),
    },
    {
      title: 'Content Preview',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content) => (
        <span className="text-gray-600 text-sm">
          {content.length > 80 ? `${content.substring(0, 80)}...` : content}
        </span>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
      render: (priority) => (
        <Tag color={getPriorityColor(priority)} size="small">
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags) => (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map(tag => (
            <Tag key={tag} size="small" color="default">
              {tag}
            </Tag>
          ))}
          {tags.length > 2 && (
            <Tag size="small" color="default">
              +{tags.length - 2}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Note">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewNote(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Note">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditNote(record)}
              disabled={!record.isEditable}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patient Notes</h1>
          <p className="text-gray-500">Manage and track patient notes and observations</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddNote}
          size="large"
        >
          Add New Note
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Search notes, patients, content..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Note Type"
              value={selectedType}
              onChange={setSelectedType}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="Progress Note">Progress Note</Option>
              <Option value="Treatment Plan">Treatment Plan</Option>
              <Option value="Clinical Observation">Clinical Observation</Option>
              <Option value="Prescription">Prescription</Option>
              <Option value="Consultation Notes">Consultation Notes</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="Patient"
              value={selectedPatient}
              onChange={setSelectedPatient}
              allowClear
              style={{ width: '100%' }}
            >
              {mockPatients.map(patient => (
                <Option key={patient.id} value={patient.id}>
                  {patient.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} md={3}>
            <Select
              placeholder="Priority"
              value={selectedPriority}
              onChange={setSelectedPriority}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="High">High</Option>
              <Option value="Normal">Normal</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={5}>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8} md={2}>
            <Button 
              icon={<FilterOutlined />} 
              onClick={clearFilters}
              disabled={!searchText && !selectedType && !selectedPatient && !selectedPriority && dateRange.length === 0}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Notes Table */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} notes`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add Note Modal */}
      <Modal
        title="Create New Patient Note"
        open={addNoteModalVisible}
        onCancel={() => setAddNoteModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateNote}
          className="pt-4"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="patientId"
                label="Patient"
                rules={[{ required: true, message: 'Please select a patient' }]}
              >
                <Select placeholder="Select patient" showSearch>
                  {mockPatients.map(patient => (
                    <Option key={patient.id} value={patient.id}>
                      {patient.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
                initialValue={dayjs()}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="type"
                label="Note Type"
                rules={[{ required: true, message: 'Please select note type' }]}
              >
                <Select placeholder="Select note type">
                  <Option value="Progress Note">Progress Note</Option>
                  <Option value="Treatment Plan">Treatment Plan</Option>
                  <Option value="Clinical Observation">Clinical Observation</Option>
                  <Option value="Prescription">Prescription</Option>
                  <Option value="Consultation Notes">Consultation Notes</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="Follow-up">Follow-up</Option>
                  <Option value="Assessment">Assessment</Option>
                  <Option value="Consultation">Consultation</Option>
                  <Option value="Medication">Medication</Option>
                  <Option value="Treatment">Treatment</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="Note Title"
            rules={[{ required: true, message: 'Please enter note title' }]}
          >
            <Input placeholder="Brief descriptive title for the note" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Note Content"
            rules={[{ required: true, message: 'Please enter note content' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Detailed note content including observations, treatments, recommendations, etc."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="priority"
                label="Priority"
                initialValue="Normal"
              >
                <Select>
                  <Option value="Low">Low</Option>
                  <Option value="Normal">Normal</Option>
                  <Option value="High">High</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="tags"
                label="Tags"
              >
                <Select 
                  mode="tags" 
                  placeholder="Add relevant tags"
                  style={{ width: '100%' }}
                >
                  <Option value="Hypertension">Hypertension</Option>
                  <Option value="Diabetes">Diabetes</Option>
                  <Option value="Medication Review">Medication Review</Option>
                  <Option value="Physical Therapy">Physical Therapy</Option>
                  <Option value="Pain Management">Pain Management</Option>
                  <Option value="Follow-up">Follow-up</Option>
                  <Option value="Prescription">Prescription</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button onClick={() => setAddNoteModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Note
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Note Modal */}
      <Modal
        title="Patient Note Details"
        open={viewNoteModalVisible}
        onCancel={() => setViewNoteModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewNoteModalVisible(false)}>
            Close
          </Button>,
          selectedNote?.isEditable && (
            <Button 
              key="edit" 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => {
                setViewNoteModalVisible(false);
                handleEditNote(selectedNote);
              }}
            >
              Edit Note
            </Button>
          )
        ]}
        width={700}
      >
        {selectedNote && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar icon={<UserOutlined />} />
                <div>
                  <div className="font-semibold text-lg">{selectedNote.patientName}</div>
                  <div className="text-sm text-gray-500">{selectedNote.patientId}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {dayjs(selectedNote.date).format('MMMM D, YYYY')} at {selectedNote.time}
                </div>
                <div className="text-xs text-gray-400">
                  by {selectedNote.doctorName}
                </div>
              </div>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type:</span> 
                <Tag color={getTypeColor(selectedNote.type)} className="ml-2">
                  {selectedNote.type}
                </Tag>
              </div>
              <div>
                <span className="font-medium">Category:</span> {selectedNote.category}
              </div>
              <div>
                <span className="font-medium">Priority:</span> 
                <Tag color={getPriorityColor(selectedNote.priority)} className="ml-2">
                  {selectedNote.priority}
                </Tag>
              </div>
              <div>
                <span className="font-medium">Note ID:</span> {selectedNote.id}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-2">{selectedNote.title}</h4>
              <div className="bg-gray-50 p-4 rounded border">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNote.content}
                </p>
              </div>
            </div>

            {selectedNote.tags && selectedNote.tags.length > 0 && (
              <div>
                <span className="font-medium text-sm">Tags: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedNote.tags.map(tag => (
                    <Tag key={tag} size="small" color="default">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <Divider />

            <div className="text-xs text-gray-500 space-y-1">
              <div>Created: {selectedNote.createdAt}</div>
              <div>Last Updated: {selectedNote.updatedAt}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Note Modal */}
      <Modal
        title="Edit Patient Note"
        open={editNoteModalVisible}
        onCancel={() => setEditNoteModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateNote}
          className="pt-4"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="type"
                label="Note Type"
                rules={[{ required: true, message: 'Please select note type' }]}
              >
                <Select placeholder="Select note type">
                  <Option value="Progress Note">Progress Note</Option>
                  <Option value="Treatment Plan">Treatment Plan</Option>
                  <Option value="Clinical Observation">Clinical Observation</Option>
                  <Option value="Prescription">Prescription</Option>
                  <Option value="Consultation Notes">Consultation Notes</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="Follow-up">Follow-up</Option>
                  <Option value="Assessment">Assessment</Option>
                  <Option value="Consultation">Consultation</Option>
                  <Option value="Medication">Medication</Option>
                  <Option value="Treatment">Treatment</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="Note Title"
            rules={[{ required: true, message: 'Please enter note title' }]}
          >
            <Input placeholder="Brief descriptive title for the note" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Note Content"
            rules={[{ required: true, message: 'Please enter note content' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Detailed note content including observations, treatments, recommendations, etc."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="priority"
                label="Priority"
              >
                <Select>
                  <Option value="Low">Low</Option>
                  <Option value="Normal">Normal</Option>
                  <Option value="High">High</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="tags"
                label="Tags"
              >
                <Select 
                  mode="tags" 
                  placeholder="Add relevant tags"
                  style={{ width: '100%' }}
                >
                  <Option value="Hypertension">Hypertension</Option>
                  <Option value="Diabetes">Diabetes</Option>
                  <Option value="Medication Review">Medication Review</Option>
                  <Option value="Physical Therapy">Physical Therapy</Option>
                  <Option value="Pain Management">Pain Management</Option>
                  <Option value="Follow-up">Follow-up</Option>
                  <Option value="Prescription">Prescription</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button onClick={() => setEditNoteModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Note
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorNotesPage;
