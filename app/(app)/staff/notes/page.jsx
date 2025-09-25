"use client";
import { Card, Button, Table, Space, Typography, Tag, Select, Input, Modal, Form, Row, Col, Drawer } from 'antd';
import { FileTextOutlined, PlusOutlined, EyeOutlined, EditOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

// Mock patient notes data
const mockNotes = [
  {
    id: 'N001',
    patient: 'John Smith',
    patientId: 'PT001',
    doctor: 'Dr. Sarah Wilson',
    noteType: 'Consultation',
    title: 'Post-surgery follow-up',
    content: 'Patient recovering well from appendectomy. No signs of infection. Recommended bed rest for another week.',
    tags: ['Surgery', 'Recovery', 'Follow-up'],
    createdDate: '2025-09-20',
    lastModified: '2025-09-20',
    priority: 'High',
    status: 'Active',
    attachments: 2
  },
  {
    id: 'N002',
    patient: 'Emily Johnson',
    patientId: 'PT002',
    doctor: 'Dr. Michael Chen',
    noteType: 'Treatment',
    title: 'Cardiac assessment results',
    content: 'ECG shows normal rhythm. Blood pressure within normal range. Continue current medication.',
    tags: ['Cardiology', 'Assessment', 'Medication'],
    createdDate: '2025-09-21',
    lastModified: '2025-09-21',
    priority: 'Medium',
    status: 'Active',
    attachments: 1
  },
  {
    id: 'N003',
    patient: 'Robert Davis',
    patientId: 'PT003',
    doctor: 'Dr. Jennifer Lee',
    noteType: 'Diagnosis',
    title: 'Diabetes management plan',
    content: 'Patient diagnosed with Type 2 diabetes. Prescribed metformin 500mg twice daily. Diet consultation scheduled.',
    tags: ['Diabetes', 'Medication', 'Diet'],
    createdDate: '2025-09-19',
    lastModified: '2025-09-22',
    priority: 'High',
    status: 'Active',
    attachments: 0
  },
  {
    id: 'N004',
    patient: 'Lisa Garcia',
    patientId: 'PT004',
    doctor: 'Dr. Sarah Wilson',
    noteType: 'Lab Results',
    title: 'Blood work analysis',
    content: 'Complete blood count within normal limits. Cholesterol slightly elevated. Recommend dietary changes.',
    tags: ['Lab Results', 'Cholesterol', 'Diet'],
    createdDate: '2025-09-18',
    lastModified: '2025-09-18',
    priority: 'Medium',
    status: 'Completed',
    attachments: 3
  }
];

const columns = [
  {
    title: 'Patient',
    dataIndex: 'patient',
    key: 'patient',
    render: (text, record) => (
      <div>
        <div className="font-medium">{text}</div>
        <div className="text-sm text-gray-500">{record.patientId}</div>
      </div>
    )
  },
  {
    title: 'Note Title',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => (
      <div>
        <div className="font-medium">{text}</div>
        <div className="text-sm text-gray-500">{record.noteType}</div>
      </div>
    )
  },
  {
    title: 'Doctor',
    dataIndex: 'doctor',
    key: 'doctor'
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    render: (priority) => {
      const color = priority === 'High' ? 'red' : priority === 'Medium' ? 'orange' : 'green';
      return <Tag color={color}>{priority}</Tag>;
    }
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const color = status === 'Active' ? 'green' : 'blue';
      return <Tag color={color}>{status}</Tag>;
    }
  },
  {
    title: 'Created Date',
    dataIndex: 'createdDate',
    key: 'createdDate',
    render: (date) => new Date(date).toLocaleDateString()
  },
  {
    title: 'Attachments',
    dataIndex: 'attachments',
    key: 'attachments',
    align: 'center',
    render: (count) => count > 0 ? <Tag>{count}</Tag> : '-'
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<EyeOutlined />} size="small" type="primary">
          View
        </Button>
        <Button icon={<EditOutlined />} size="small">
          Edit
        </Button>
      </Space>
    )
  }
];

const StaffNotesPage = () => {
  const [searchText, setSearchText] = useState('');
  const [doctorFilter, setDoctorFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddNote = () => {
    setIsModalVisible(true);
    setSelectedNote(null);
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setDrawerVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('Adding note:', values);
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedNote(null);
  };

  const filteredData = mockNotes.filter(note => {
    const matchesSearch = note.patient.toLowerCase().includes(searchText.toLowerCase()) ||
                         note.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchText.toLowerCase()) ||
                         note.patientId.toLowerCase().includes(searchText.toLowerCase());
    const matchesDoctor = !doctorFilter || note.doctor === doctorFilter;
    const matchesType = !typeFilter || note.noteType === typeFilter;
    const matchesStatus = !statusFilter || note.status === statusFilter;
    return matchesSearch && matchesDoctor && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={3}>Patient Notes & Records</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNote}>
          Add Note
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">142</div>
            <div className="text-sm text-gray-500">Total Notes</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">38</div>
            <div className="text-sm text-gray-500">This Week</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">15</div>
            <div className="text-sm text-gray-500">High Priority</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">89</div>
            <div className="text-sm text-gray-500">With Attachments</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Search
              placeholder="Search notes, patients, or content..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Doctor"
              style={{ width: '100%' }}
              value={doctorFilter}
              onChange={setDoctorFilter}
              allowClear
            >
              <Option value="Dr. Sarah Wilson">Dr. Sarah Wilson</Option>
              <Option value="Dr. Michael Chen">Dr. Michael Chen</Option>
              <Option value="Dr. Jennifer Lee">Dr. Jennifer Lee</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Type"
              style={{ width: '100%' }}
              value={typeFilter}
              onChange={setTypeFilter}
              allowClear
            >
              <Option value="Consultation">Consultation</Option>
              <Option value="Treatment">Treatment</Option>
              <Option value="Diagnosis">Diagnosis</Option>
              <Option value="Lab Results">Lab Results</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by Status"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
            >
              <Option value="Active">Active</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Archived">Archived</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary">
              Export Notes
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Notes Table */}
      <Card title={`Patient Notes (${filteredData.length} notes)`}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onDoubleClick: () => handleViewNote(record)
          })}
        />
      </Card>

      {/* Add Note Modal */}
      <Modal
        title="Add Patient Note"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="patient"
                label="Patient"
                rules={[{ required: true, message: 'Please select patient' }]}
              >
                <Select placeholder="Select patient">
                  <Option value="PT001">John Smith (PT001)</Option>
                  <Option value="PT002">Emily Johnson (PT002)</Option>
                  <Option value="PT003">Robert Davis (PT003)</Option>
                  <Option value="PT004">Lisa Garcia (PT004)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="doctor"
                label="Doctor"
                rules={[{ required: true, message: 'Please select doctor' }]}
              >
                <Select placeholder="Select doctor">
                  <Option value="Dr. Sarah Wilson">Dr. Sarah Wilson</Option>
                  <Option value="Dr. Michael Chen">Dr. Michael Chen</Option>
                  <Option value="Dr. Jennifer Lee">Dr. Jennifer Lee</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="noteType"
                label="Note Type"
                rules={[{ required: true, message: 'Please select note type' }]}
              >
                <Select placeholder="Select type">
                  <Option value="Consultation">Consultation</Option>
                  <Option value="Treatment">Treatment</Option>
                  <Option value="Diagnosis">Diagnosis</Option>
                  <Option value="Lab Results">Lab Results</Option>
                  <Option value="Follow-up">Follow-up</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <Select placeholder="Select priority">
                  <Option value="High">High</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Low">Low</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="Active">Active</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="title"
            label="Note Title"
            rules={[{ required: true, message: 'Please enter note title' }]}
          >
            <Input placeholder="Enter descriptive title for the note" />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="Note Content"
            rules={[{ required: true, message: 'Please enter note content' }]}
          >
            <TextArea rows={6} placeholder="Enter detailed note content..." />
          </Form.Item>
          
          <Form.Item
            name="tags"
            label="Tags"
          >
            <Select mode="tags" placeholder="Add tags for better organization">
              <Option value="Surgery">Surgery</Option>
              <Option value="Medication">Medication</Option>
              <Option value="Diet">Diet</Option>
              <Option value="Follow-up">Follow-up</Option>
              <Option value="Lab Results">Lab Results</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Note Detail Drawer */}
      <Drawer
        title="Note Details"
        placement="right"
        size="large"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedNote && (
          <div className="space-y-4">
            <div>
              <Text strong>Patient:</Text>
              <div className="mt-1">{selectedNote.patient} ({selectedNote.patientId})</div>
            </div>
            <div>
              <Text strong>Doctor:</Text>
              <div className="mt-1">{selectedNote.doctor}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>Note Type:</Text>
                <div className="mt-1">
                  <Tag color="blue">{selectedNote.noteType}</Tag>
                </div>
              </div>
              <div>
                <Text strong>Priority:</Text>
                <div className="mt-1">
                  <Tag color={selectedNote.priority === 'High' ? 'red' : 'orange'}>
                    {selectedNote.priority}
                  </Tag>
                </div>
              </div>
            </div>
            <div>
              <Text strong>Title:</Text>
              <div className="mt-1 text-lg font-medium">{selectedNote.title}</div>
            </div>
            <div>
              <Text strong>Content:</Text>
              <div className="mt-1 p-3 bg-gray-50 rounded">{selectedNote.content}</div>
            </div>
            <div>
              <Text strong>Tags:</Text>
              <div className="mt-1">
                {selectedNote.tags.map(tag => (
                  <Tag key={tag} color="purple">{tag}</Tag>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>Created:</Text>
                <div className="mt-1">{new Date(selectedNote.createdDate).toLocaleDateString()}</div>
              </div>
              <div>
                <Text strong>Last Modified:</Text>
                <div className="mt-1">{new Date(selectedNote.lastModified).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default StaffNotesPage;
