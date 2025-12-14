import { Form, Select, Input, InputNumber, Image, Card, Divider, Button, Spin } from "antd"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"; // useParams เอาไว้ดึง id จาก url
import axios from "axios";

const URL_BOOK = "/api/book"
const URL_CATEGORY = "/api/book-category"

export default function EditBook() {
  const { id } = useParams(); // ดึง id จาก URL (เช่น /edit/15 -> id = 15)
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);

  // โหลดข้อมูล Category และ ข้อมูลหนังสือที่จะแก้ไข
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. ดึง Category
            const catRes = await axios.get(URL_CATEGORY);
            setCategories(catRes.data.map(cat => ({ label: cat.name, value: cat.id })));

            // 2. ดึงข้อมูลหนังสือตาม ID
            const bookRes = await axios.get(`${URL_BOOK}/${id}`);
            setBook(bookRes.data);
            form.setFieldsValue(bookRes.data); // เอาข้อมูลยัดใส่ฟอร์ม
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [id, form]);
  
  const handleSave = async (values) => {
    setLoading(true)
    try {
      const editedData = {...book, ...values, 'price': Number(values.price), 'stock': Number(values.stock)}
      // ตัด field ที่ไม่จำเป็นออกก่อนส่ง update
      const {id: _id, category, createdAt, updatedAt, ...data} = editedData
      
      await axios.patch(`${URL_BOOK}/${id}`, data);
      navigate('/'); // บันทึกเสร็จ กลับหน้าแรก
    } catch (error) {
      console.error('Error editing book:', error);
    } finally {
      setLoading(false);
    }
  }

  return(
    <div style={{ display: 'flex', justifyContent: 'center'}}>
        <Card title="Edit Book" style={{ width: 600 }}>
            <Spin spinning={loading}>
                <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onFinish={handleSave}>
                    <div style={{textAlign: 'center', marginBottom: 20}}>
                        {book?.coverUrl && <Image src={`http://localhost:3080/${book.coverUrl}`} height={150} />}
                    </div>
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
                        <Button type="primary" htmlType="submit">Update</Button>
                        <Button style={{marginLeft: 10}} onClick={() => navigate('/')}>Cancel</Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Card>
    </div>
  )
}