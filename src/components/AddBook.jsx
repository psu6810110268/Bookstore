import { Button, Form, Select, Input, InputNumber, Card, Divider } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ใช้สำหรับย้ายกลับหน้าแรก

const URL_BOOK = "/api/book"
const URL_CATEGORY = "/api/book-category"

export default function AddBook() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ดึง Category มาใช้ในหน้านี้เอง
  useEffect(() => {
    const fetchCategories = async () => {
        try {
          const response = await axios.get(URL_CATEGORY);
          setCategories(response.data.map(cat => ({ label: cat.name, value: cat.id })));
        } catch (error) { console.error('Error fetching categories:', error); }
    }
    fetchCategories();
  }, [])

  const handleFinish = async (values) => {
    setLoading(true)
    try {
      await axios.post(URL_BOOK, values);
      navigate('/'); // บันทึกเสร็จ ดีดกลับหน้าแรก
    } catch (error) {
      console.error('Error adding book:', error);
    } finally {
      setLoading(false);
    }
  }

  return(
    <div style={{ display: 'flex', justifyContent: 'center'}}>
        <Card title="Add New Book" style={{ width: 600 }}>
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={handleFinish}>
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="author" label="Author" rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                    <InputNumber style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                    <InputNumber style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
                    <Select allowClear options={categories}/>
                </Form.Item>
                <Divider/>
                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>Save Book</Button>
                    <Button style={{marginLeft: 10}} onClick={() => navigate('/')}>Cancel</Button>
                </Form.Item>
            </Form>
        </Card>
    </div>
  )
}