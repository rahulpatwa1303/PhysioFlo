"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Tag,
  Space,
  message,
  Popconfirm,
  Tooltip,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Card,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  FileTextOutlined,
  SendOutlined,
  DownloadOutlined,
  ExportOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import SearchableTable from '@/app/components/common/SearchableTable';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const BillingPage = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [form] = Form.useForm();

  // Mock billing data
  const [billsData, setBillsData] = useState([
    {
      key: '1',
      id: 'INV-001',
      patientName: 'John Smith',
      patientId: 'PT001',
      doctorName: 'Dr. Sarah Wilson',
      appointmentId: 'APT001',
      appointmentDate: '2024-01-15',
      serviceType: 'Consultation',
      amount: 150.00,
      discount: 0,
      tax: 15.00,
      totalAmount: 165.00,
      status: 'Paid',
      paymentMethod: 'Credit Card',
      paymentDate: '2024-01-15',
      dueDate: '2024-01-30',
      createdAt: '2024-01-15',
      notes: 'Regular consultation fee'
    },
    {
      key: '2',
      id: 'INV-002',
      patientName: 'Emily Johnson',
      patientId: 'PT002',
      doctorName: 'Dr. Michael Brown',
      appointmentId: 'APT002',
      appointmentDate: '2024-01-15',
      serviceType: 'Follow-up',
      amount: 100.00,
      discount: 10.00,
      tax: 9.00,
      totalAmount: 99.00,
      status: 'Pending',
      paymentMethod: null,
      paymentDate: null,
      dueDate: '2024-02-15',
      createdAt: '2024-01-15',
      notes: 'Follow-up visit with senior discount'
    },
    {
      key: '3',
      id: 'INV-003',
      patientName: 'Robert Davis',
      patientId: 'PT003',
      doctorName: 'Dr. Sarah Wilson',
      appointmentId: 'APT003',
      appointmentDate: '2024-01-16',
      serviceType: 'Treatment',
      amount: 300.00,
      discount: 0,
      tax: 30.00,
      totalAmount: 330.00,
      status: 'Overdue',
      paymentMethod: null,
      paymentDate: null,
      dueDate: '2024-01-31',
      createdAt: '2024-01-16',
      notes: 'Physical therapy session'
    },
    {
      key: '4',
      id: 'INV-004',
      patientName: 'Lisa Garcia',
      patientId: 'PT004',
      doctorName: 'Dr. Jessica Lee',
      appointmentId: 'APT004',
      appointmentDate: '2024-01-16',
      serviceType: 'Check-up',
      amount: 120.00,
      discount: 0,
      tax: 12.00,
      totalAmount: 132.00,
      status: 'Partially Paid',
      paymentMethod: 'Cash',
      paymentDate: '2024-01-16',
      dueDate: '2024-02-16',
      createdAt: '2024-01-16',
      notes: 'Annual health screening - partial payment received'
    },
    {
      key: '5',
      id: 'INV-005',
      patientName: 'Michael Chen',
      patientId: 'PT005',
      doctorName: 'Dr. David Chen',
      appointmentId: 'APT005',
      appointmentDate: '2024-01-17',
      serviceType: 'Emergency',
      amount: 500.00,
      discount: 0,
      tax: 50.00,
      totalAmount: 550.00,
      status: 'Cancelled',
      paymentMethod: null,
      paymentDate: null,
      dueDate: '2024-02-17',
      createdAt: '2024-01-17',
      notes: 'Emergency consultation - cancelled due to patient no-show'
    }
  ]);

  // Calculate statistics
  const totalRevenue = billsData.reduce((sum, bill) => 
    bill.status === 'Paid' ? sum + bill.totalAmount : sum, 0
  );
  const pendingAmount = billsData.reduce((sum, bill) => 
    ['Pending', 'Overdue', 'Partially Paid'].includes(bill.status) ? sum + bill.totalAmount : sum, 0
  );
  const overdueAmount = billsData.reduce((sum, bill) => 
    bill.status === 'Overdue' ? sum + bill.totalAmount : sum, 0
  );
  const totalBills = billsData.length;

  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Patient',
      key: 'patient',
      width: 200,
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">{record.patientName}</div>
          <div className="text-sm text-gray-500">{record.patientId}</div>
        </div>
      ),
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
      width: 160,
      sorter: (a, b) => a.doctorName.localeCompare(b.doctorName),
    },
    {
      title: 'Service',
      dataIndex: 'serviceType',
      key: 'serviceType',
      width: 120,
      render: (type) => {
        const colors = {
          'Consultation': 'blue',
          'Follow-up': 'green',
          'Check-up': 'orange',
          'Treatment': 'purple',
          'Emergency': 'red'
        };
        return (
          <Tag color={colors[type] || 'default'}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: 'Amount',
      key: 'amount',
      width: 120,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (_, record) => (
        <div>
          <div className="font-medium">${record.totalAmount.toFixed(2)}</div>
          {record.discount > 0 && (
            <div className="text-sm text-green-600">-${record.discount.toFixed(2)} discount</div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const colors = {
          'Paid': 'green',
          'Pending': 'orange',
          'Overdue': 'red',
          'Partially Paid': 'blue',
          'Cancelled': 'gray'
        };
        return (
          <Tag color={colors[status] || 'default'}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      render: (date, record) => {
        const isOverdue = record.status !== 'Paid' && dayjs(date).isBefore(dayjs());
        return (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {dayjs(date).format('MMM DD, YYYY')}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Invoice">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewBill(record.key)}
            />
          </Tooltip>
          <Tooltip title="Edit Invoice">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditBill(record)}
            />
          </Tooltip>
          <Tooltip title="Send Invoice">
            <Button
              type="text"
              icon={<SendOutlined />}
              size="small"
              onClick={() => handleSendInvoice(record.key)}
              disabled={record.status === 'Cancelled'}
            />
          </Tooltip>
          <Tooltip title="Delete Invoice">
            <Popconfirm
              title="Delete Invoice"
              description="Are you sure you want to delete this invoice?"
              onConfirm={() => handleDeleteBill(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Popconfirm>
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
        { label: 'Paid', value: 'Paid' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Overdue', value: 'Overdue' },
        { label: 'Partially Paid', value: 'Partially Paid' },
        { label: 'Cancelled', value: 'Cancelled' }
      ]
    },
    {
      key: 'serviceType',
      label: 'Service Type',
      options: [
        { label: 'Consultation', value: 'Consultation' },
        { label: 'Follow-up', value: 'Follow-up' },
        { label: 'Check-up', value: 'Check-up' },
        { label: 'Treatment', value: 'Treatment' },
        { label: 'Emergency', value: 'Emergency' }
      ]
    },
    {
      key: 'doctorName',
      label: 'Doctor',
      options: [
        { label: 'Dr. Sarah Wilson', value: 'Dr. Sarah Wilson' },
        { label: 'Dr. Michael Brown', value: 'Dr. Michael Brown' },
        { label: 'Dr. Jessica Lee', value: 'Dr. Jessica Lee' },
        { label: 'Dr. David Chen', value: 'Dr. David Chen' }
      ]
    }
  ];

  const searchFields = ['patientName', 'doctorName', 'id', 'patientId', 'serviceType'];

  // Handlers
  const handleCreateBill = () => {
    setEditingBill(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    form.setFieldsValue({
      ...bill,
      appointmentDate: dayjs(bill.appointmentDate),
      dueDate: dayjs(bill.dueDate),
      paymentDate: bill.paymentDate ? dayjs(bill.paymentDate) : null,
    });
    setModalVisible(true);
  };

  const handleViewBill = (billId) => {
    router.push(`/tenant-admin/billing/${billId}`);
  };

  const handleDeleteBill = (billId) => {
    setBillsData(prev => prev.filter(bill => bill.key !== billId));
    message.success('Invoice deleted successfully');
  };

  const handleSendInvoice = (billId) => {
    message.success('Invoice sent to patient successfully');
  };

  const handleExport = () => {
    message.info('Export functionality would be implemented here');
  };

  const handleModalSubmit = async (values) => {
    try {
      const formData = {
        ...values,
        appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        paymentDate: values.paymentDate ? values.paymentDate.format('YYYY-MM-DD') : null,
        tax: values.amount * 0.1, // 10% tax
        totalAmount: values.amount + (values.amount * 0.1) - (values.discount || 0),
        createdAt: editingBill ? editingBill.createdAt : dayjs().format('YYYY-MM-DD'),
        id: editingBill ? editingBill.id : `INV-${String(billsData.length + 1).padStart(3, '0')}`
      };

      if (editingBill) {
        setBillsData(prev => prev.map(bill => 
          bill.key === editingBill.key ? { ...formData, key: editingBill.key } : bill
        ));
        message.success('Invoice updated successfully');
      } else {
        setBillsData(prev => [...prev, { ...formData, key: String(Date.now()) }]);
        message.success('Invoice created successfully');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save invoice');
    }
  };

  const headerActions = (
    <Space>
      <Button
        icon={<ExportOutlined />}
        onClick={handleExport}
      >
        Export
      </Button>
      <Button
        icon={<BarChartOutlined />}
        onClick={() => router.push('/tenant-admin/billing/reports')}
      >
        View Reports
      </Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateBill}
      >
        Create Invoice
      </Button>
    </Space>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Billing Management</h1>
          <p className="text-gray-500">Manage invoices, payments, and billing records</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {headerActions}
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Pending Amount"
              value={pendingAmount}
              precision={2}
              valueStyle={{ color: '#faad14' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Overdue Amount"
              value={overdueAmount}
              precision={2}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Invoices"
              value={totalBills}
              valueStyle={{ color: '#1677ff' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Billing Table */}
      <SearchableTable
        data={billsData}
        columns={columns}
        filters={filters}
        searchFields={searchFields}
        searchPlaceholder="Search by patient name, doctor, invoice ID, or service..."
        rowKey="key"
        scroll={{ x: 1400 }}
      />

      {/* Create/Edit Invoice Modal */}
      <Modal
        title={editingBill ? 'Edit Invoice' : 'Create Invoice'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Patient Name"
                name="patientName"
                rules={[{ required: true, message: 'Please enter patient name' }]}
              >
                <Input placeholder="Enter patient name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Patient ID"
                name="patientId"
                rules={[{ required: true, message: 'Please enter patient ID' }]}
              >
                <Input placeholder="Enter patient ID" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Doctor"
                name="doctorName"
                rules={[{ required: true, message: 'Please select doctor' }]}
              >
                <Select placeholder="Select doctor">
                  <Option value="Dr. Sarah Wilson">Dr. Sarah Wilson</Option>
                  <Option value="Dr. Michael Brown">Dr. Michael Brown</Option>
                  <Option value="Dr. Jessica Lee">Dr. Jessica Lee</Option>
                  <Option value="Dr. David Chen">Dr. David Chen</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Appointment ID"
                name="appointmentId"
                rules={[{ required: true, message: 'Please enter appointment ID' }]}
              >
                <Input placeholder="Enter appointment ID" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Service Type"
                name="serviceType"
                rules={[{ required: true, message: 'Please select service type' }]}
              >
                <Select placeholder="Select service type">
                  <Option value="Consultation">Consultation</Option>
                  <Option value="Follow-up">Follow-up</Option>
                  <Option value="Check-up">Check-up</Option>
                  <Option value="Treatment">Treatment</Option>
                  <Option value="Emergency">Emergency</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Appointment Date"
                name="appointmentDate"
                rules={[{ required: true, message: 'Please select appointment date' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Please enter amount' }]}
              >
                <InputNumber
                  className="w-full"
                  placeholder="0.00"
                  prefix="$"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Discount"
                name="discount"
              >
                <InputNumber
                  className="w-full"
                  placeholder="0.00"
                  prefix="$"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Due Date"
                name="dueDate"
                rules={[{ required: true, message: 'Please select due date' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="Pending">Pending</Option>
                  <Option value="Paid">Paid</Option>
                  <Option value="Partially Paid">Partially Paid</Option>
                  <Option value="Overdue">Overdue</Option>
                  <Option value="Cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Payment Method"
                name="paymentMethod"
              >
                <Select placeholder="Select payment method" allowClear>
                  <Option value="Cash">Cash</Option>
                  <Option value="Credit Card">Credit Card</Option>
                  <Option value="Debit Card">Debit Card</Option>
                  <Option value="Bank Transfer">Bank Transfer</Option>
                  <Option value="Insurance">Insurance</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Payment Date"
            name="paymentDate"
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <TextArea rows={3} placeholder="Enter any additional notes..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingBill ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BillingPage;
