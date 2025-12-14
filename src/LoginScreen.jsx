import { useState } from 'react';
import { Button, Form, Input, Alert, Checkbox } from 'antd'; // 1. เพิ่ม Checkbox
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const URL_AUTH = "/api/auth/login"

export default function LoginScreen(props) {
 const navigate = useNavigate();
 const [isLoading, setIsLoading] = useState(false)
 const [errMsg, setErrMsg] = useState(null)

 const handleLogin = async (formData) => {
  try{
   setIsLoading(true)
   setErrMsg(null)
   const response = await axios.post(URL_AUTH, formData)
   const token = response.data.access_token
   
   // เช็คว่าติ๊ก Remember me ไหม?
   if (formData.remember) {
     localStorage.setItem('token', token)    // ติ๊ก: จำตลอดไป (อยู่ใน LocalStorage)
   } else {
     sessionStorage.setItem('token', token)  // ไม่ติ๊ก: จำแค่ชั่วคราว (อยู่ใน SessionStorage)
   }
   
   axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
   navigate('/'); 

  } catch(err) {
    console.log(err)
    setErrMsg(err.message)
  } finally { setIsLoading(false) }
 }

 return(
   <Form
      onFinish={handleLogin}
      autoComplete="off">
      {errMsg &&
       <Form.Item>
         <Alert message={errMsg} type="error" />
       </Form.Item>
      }
      <Form.Item
         label="Username"
         name="username"
         rules={[{required: true,}]}>
         <Input />
      </Form.Item>

      <Form.Item
         label="Password"
         name="password"
         rules={[{required: true},]}>
         <Input.Password />
      </Form.Item>

      {/* 3. เพิ่มปุ่ม Checkbox ตรงนี้ */}
      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit" loading={isLoading}>
          Submit
        </Button>
      </Form.Item>
   </Form>
 )
}