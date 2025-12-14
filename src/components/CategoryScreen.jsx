import { Table, Button, Modal, Form, Input, Space, Popconfirm, Card } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const URL_CATEGORY = "/api/book-category";

// จุดสำคัญ: ต้องมีคำว่า export default ข้างหน้า function ครับ
export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL_CATEGORY);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (values) => {
    try {
      await axios.post(URL_CATEGORY, values);
      setIsModalOpen(false);
      form.resetFields();
      fetchCategories(); 
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL_CATEGORY}/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
           <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(record.id)}>
              <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
           </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card title="Manage Categories" style={{ width: 800 }}>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Add Category
          </Button>
        </div>

        <Table 
          rowKey="id" 
          dataSource={categories} 
          columns={columns} 
          loading={loading}
          pagination={{ pageSize: 5 }}
        />

        <Modal
          title="Add New Category"
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form form={form} layout="vertical" onFinish={handleAddCategory}>
            <Form.Item 
              name="name" 
              label="Category Name" 
              rules={[{ required: true, message: 'Please input category name!' }]}
            >
              <Input placeholder="e.g. Cartoon, History" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}