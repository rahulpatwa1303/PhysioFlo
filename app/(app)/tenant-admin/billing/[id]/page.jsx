"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Descriptions, 
  Table,
  Timeline,
  Modal,
  message,
  Space,
  Divider,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Avatar
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  DollarOutlined,
  FileTextOutlined,
  PrinterOutlined,
  SendOutlined,
  DownloadOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

// Mock invoice data
const mockInvoiceData = {
  '1': {
    id: 'INV-001',
    patientName: 'John Smith',
    patientId: 'PT001',
    patientEmail: 'john.smith@email.com',
    patientPhone: '+1 234-567-8901',
    patientAddress: '123 Main St, New York, NY 10001',
    doctorName: 'Dr. Sarah Wilson',
    doctorId: 'DR001',
    doctorSpecialty: 'Cardiology',
    appointmentId: 'APT001',
    appointmentDate: '2024-01-15',
    appointmentTime: '09:00 AM',
    serviceType: 'Consultation',
    serviceDescription: 'Cardiac consultation and examination',
    amount: 150.00,
    discount: 0,
    discountReason: '',
    tax: 15.00,
    taxRate: 10,
    totalAmount: 165.00,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    paymentDate: '2024-01-15',
    paymentReference: 'PAY-001-2024',
    dueDate: '2024-01-30',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    notes: 'Regular consultation fee',
    clinicName: 'PhysioFlo Clinic',
    clinicAddress: '456 Medical Center Blvd, New York, NY 10002',
    clinicPhone: '+1 555-PHYSIO',
    clinicEmail: 'billing@physioflo.com',
    paymentHistory: [
      {
        id: 'PAY-001',
        date: '2024-01-15',
        amount: 165.00,
        method: 'Credit Card',
        reference: 'PAY-001-2024',
        status: 'Completed'
      }
    ],
    activityLog: [
      {
        action: 'Payment Received',
        amount: 165.00,
        date: '2024-01-15 10:30 AM',
        user: 'System',
        details: 'Full payment received via Credit Card'
      },
      {
        action: 'Invoice Sent',
        date: '2024-01-15 09:00 AM',
        user: 'Dr. Sarah Wilson',
        details: 'Invoice sent to patient via email'
      },
      {
        action: 'Invoice Created',
        date: '2024-01-15 08:45 AM',
        user: 'Dr. Sarah Wilson',
        details: 'Invoice generated for consultation service'
      }
    ]
  }
};

const InvoiceDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [paymentForm] = Form.useForm();

  useEffect(() => {
    // Simulate API call
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockInvoice = mockInvoiceData[params.id] || mockInvoiceData['1'];
        setInvoice(mockInvoice);
      } catch (error) {
        message.error('Failed to load invoice details');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    form.setFieldsValue({
      ...invoice,
      appointmentDate: dayjs(invoice.appointmentDate),
      dueDate: dayjs(invoice.dueDate),
      paymentDate: invoice.paymentDate ? dayjs(invoice.paymentDate) : null,
    });
    setEditModalVisible(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    message.success('Invoice downloaded successfully');
  };

  const handleSendInvoice = () => {
    message.success('Invoice sent to patient successfully');
  };

  const handleRecordPayment = () => {
    paymentForm.resetFields();
    setPaymentModalVisible(true);
  };

  const handlePaymentSubmit = async (values) => {
    try {
      const paymentData = {
        ...values,
        paymentDate: values.paymentDate.format('YYYY-MM-DD'),
        reference: `PAY-${String(Date.now()).slice(-6)}`,
        status: 'Completed'
      };

      // Update invoice status based on payment amount
      const newStatus = values.amount >= invoice.totalAmount ? 'Paid' : 'Partially Paid';
      
      setInvoice(prev => ({
        ...prev,
        status: newStatus,
        paymentMethod: values.method,
        paymentDate: paymentData.paymentDate,
        paymentReference: paymentData.reference,
        paymentHistory: [...prev.paymentHistory, {
          id: paymentData.reference,
          date: paymentData.paymentDate,
          amount: values.amount,
          method: values.method,
          reference: paymentData.reference,
          status: 'Completed'
        }]
      }));

      message.success('Payment recorded successfully');
      setPaymentModalVisible(false);
    } catch (error) {
      message.error('Failed to record payment');
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      const formData = {
        ...values,
        appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        paymentDate: values.paymentDate ? values.paymentDate.format('YYYY-MM-DD') : null,
        tax: values.amount * 0.1,
        totalAmount: values.amount + (values.amount * 0.1) - (values.discount || 0),
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };

      setInvoice(prev => ({ ...prev, ...formData }));
      message.success('Invoice updated successfully');
      setEditModalVisible(false);
    } catch (error) {
      message.error('Failed to update invoice');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Paid': 'green',
      'Pending': 'orange',
      'Overdue': 'red',
      'Partially Paid': 'blue',
      'Cancelled': 'gray'
    };
    return colors[status] || 'default';
  };

  const paymentColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
  ];

  if (loading || !invoice) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Invoice Details</h1>
            <p className="text-gray-500">#{invoice.id}</p>
          </div>
        </div>
        
        <Space wrap>
          <Button
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            Download
          </Button>
          <Button
            icon={<SendOutlined />}
            onClick={handleSendInvoice}
          >
            Send
          </Button>
          {invoice.status !== 'Paid' && (
            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              onClick={handleRecordPayment}
            >
              Record Payment
            </Button>
          )}
          <Button
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </Space>
      </div>

      <Row gutter={24}>
        {/* Main Content */}
        <Col xs={24} lg={16} className="space-y-6">
          {/* Invoice Header */}
          <Card className="shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-blue-600">{invoice.clinicName}</h2>
                <p className="text-gray-600">{invoice.clinicAddress}</p>
                <p className="text-gray-600">{invoice.clinicPhone} | {invoice.clinicEmail}</p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold">INVOICE</h3>
                <p className="text-gray-600">#{invoice.id}</p>
                <Tag color={getStatusColor(invoice.status)} className="mt-2">
                  {invoice.status}
                </Tag>
              </div>
            </div>

            <Divider />

            {/* Bill To & Invoice Details */}
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <h4 className="font-semibold mb-3">Bill To:</h4>
                <div className="space-y-1">
                  <p className="font-medium">{invoice.patientName}</p>
                  <p className="text-gray-600">ID: {invoice.patientId}</p>
                  <p className="text-gray-600">{invoice.patientAddress}</p>
                  <p className="text-gray-600">{invoice.patientPhone}</p>
                  <p className="text-gray-600">{invoice.patientEmail}</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Invoice Date:</span>
                    <span>{dayjs(invoice.createdAt).format('MMM DD, YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span>{dayjs(invoice.dueDate).format('MMM DD, YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Appointment:</span>
                    <span>{invoice.appointmentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Date:</span>
                    <span>{dayjs(invoice.appointmentDate).format('MMM DD, YYYY')}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Service Details */}
          <Card title="Service Details" className="shadow-sm">
            <Table
              dataSource={[{
                key: '1',
                service: invoice.serviceType,
                description: invoice.serviceDescription,
                doctor: invoice.doctorName,
                amount: invoice.amount
              }]}
              columns={[
                {
                  title: 'Service',
                  dataIndex: 'service',
                  key: 'service',
                },
                {
                  title: 'Description',
                  dataIndex: 'description',
                  key: 'description',
                },
                {
                  title: 'Doctor',
                  dataIndex: 'doctor',
                  key: 'doctor',
                },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (amount) => `$${amount.toFixed(2)}`,
                  align: 'right',
                },
              ]}
              pagination={false}
              className="mb-4"
            />

            {/* Invoice Totals */}
            <div className="border-t pt-4">
              <Row gutter={16}>
                <Col xs={24} md={12} offset={12}>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${invoice.amount.toFixed(2)}</span>
                    </div>
                    {invoice.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-${invoice.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax ({invoice.taxRate}%):</span>
                      <span>${invoice.tax.toFixed(2)}</span>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${invoice.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>

          {/* Payment History */}
          {invoice.paymentHistory && invoice.paymentHistory.length > 0 && (
            <Card title="Payment History" className="shadow-sm">
              <Table
                dataSource={invoice.paymentHistory}
                columns={paymentColumns}
                rowKey="id"
                pagination={false}
              />
            </Card>
          )}

          {/* Notes */}
          {invoice.notes && (
            <Card title="Notes" className="shadow-sm">
              <p className="text-gray-700">{invoice.notes}</p>
            </Card>
          )}
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8} className="space-y-6">
          {/* Invoice Summary */}
          <Card title="Invoice Summary" className="shadow-sm">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${invoice.totalAmount.toFixed(2)}
                </div>
                <div className="text-gray-500">Total Amount</div>
              </div>
              
              <Divider />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Tag color={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Tag>
                </div>
                {invoice.paymentMethod && (
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{invoice.paymentMethod}</span>
                  </div>
                )}
                {invoice.paymentDate && (
                  <div className="flex justify-between">
                    <span>Payment Date:</span>
                    <span>{dayjs(invoice.paymentDate).format('MMM DD, YYYY')}</span>
                  </div>
                )}
                {invoice.paymentReference && (
                  <div className="flex justify-between">
                    <span>Reference:</span>
                    <span className="text-xs">{invoice.paymentReference}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Patient Information */}
          <Card title="Patient Information" className="shadow-sm">
            <div className="flex items-start space-x-3">
              <Avatar size={48} icon={<UserOutlined />} />
              <div className="flex-1">
                <h4 className="font-semibold">{invoice.patientName}</h4>
                <p className="text-sm text-gray-600">ID: {invoice.patientId}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneOutlined className="mr-2" />
                    {invoice.patientPhone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MailOutlined className="mr-2" />
                    {invoice.patientEmail}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Doctor Information */}
          <Card title="Doctor Information" className="shadow-sm">
            <div className="space-y-2">
              <div className="font-semibold">{invoice.doctorName}</div>
              <div className="text-sm text-gray-600">ID: {invoice.doctorId}</div>
              <div className="text-sm text-gray-600">{invoice.doctorSpecialty}</div>
            </div>
          </Card>

          {/* Activity Log */}
          <Card title="Activity Log" className="shadow-sm">
            <Timeline
              items={invoice.activityLog.map((activity, index) => ({
                color: index === 0 ? 'green' : 'blue',
                children: (
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    {activity.amount && (
                      <div className="text-sm text-green-600">
                        Amount: ${activity.amount.toFixed(2)}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {activity.date} - {activity.user}
                    </div>
                    {activity.details && (
                      <div className="text-xs text-gray-400 mt-1">
                        {activity.details}
                      </div>
                    )}
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Payment Modal */}
      <Modal
        title="Record Payment"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={paymentForm}
          layout="vertical"
          onFinish={handlePaymentSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Payment Amount"
            name="amount"
            rules={[
              { required: true, message: 'Please enter payment amount' },
              { type: 'number', min: 0.01, message: 'Amount must be greater than 0' }
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="0.00"
              prefix="$"
              min={0}
              max={invoice.totalAmount}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            label="Payment Method"
            name="method"
            rules={[{ required: true, message: 'Please select payment method' }]}
          >
            <Select placeholder="Select payment method">
              <Option value="Cash">Cash</Option>
              <Option value="Credit Card">Credit Card</Option>
              <Option value="Debit Card">Debit Card</Option>
              <Option value="Bank Transfer">Bank Transfer</Option>
              <Option value="Insurance">Insurance</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Payment Date"
            name="paymentDate"
            rules={[{ required: true, message: 'Please select payment date' }]}
            initialValue={dayjs()}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <TextArea rows={3} placeholder="Enter any notes about this payment..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              onClick={() => setPaymentModalVisible(false)}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Record Payment
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal
        title="Edit Invoice"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
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

          <Form.Item
            label="Notes"
            name="notes"
          >
            <TextArea rows={3} placeholder="Enter any additional notes..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              onClick={() => setEditModalVisible(false)}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Update Invoice
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default InvoiceDetailsPage;
