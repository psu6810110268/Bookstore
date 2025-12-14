import { Modal, Button, Spin, Typography } from 'antd';
import { RobotOutlined, StarOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const { Paragraph, Title } = Typography;

const API_KEY = "AIzaSyC-XcQjp6mcJhX9NG8CV7i5txM6B5quSKg"; 

export default function GeminiModal({ book }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const handleAskGemini = async () => {
    setIsModalOpen(true);
    setAiResponse(""); // ล้างคำตอบเก่า
    setLoading(true);

    try {
      // 1. เตรียมคำสั่ง (Prompt)
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `ฉันมีหนังสือชื่อ "${book.title}" เขียนโดย "${book.author}" 
      ช่วยเขียนสรุปเรื่องย่อสั้นๆ และบอกจุดเด่นของหนังสือเล่มนี้ให้หน่อย 
      (ตอบเป็นภาษาไทย ความยาวไม่เกิน 5 บรรทัด)`;

      // 2. ยิงไปถาม Gemini
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setAiResponse(text);
    } catch (error) {
      console.error("Gemini Error:", error);
      setAiResponse("ขออภัย เกิดข้อผิดพลาดในการติดต่อกับ AI หรือคุณอาจลืมใส่ API Key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
      type="primary"
      shape="round"
      icon={<StarOutlined style={{ fontSize: '1.2em' }} />} 
      size="middle"
      style={{
          background: 'linear-gradient(135deg, #4285F4 0%, #9B72CB 50%, #D96570 100%)',
          border: 'none', // เอาขอบออก
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(155, 114, 203, 0.4)', 
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
      }}
      onClick={handleAskGemini}
      >
      Ask Gemini
      </Button>

      <Modal 
        title={<span><RobotOutlined /> Gemini AI Analysis</span>} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={[
            <Button key="close" onClick={() => setIsModalOpen(false)}>Close</Button>
        ]}
      >
        <Title level={4}>{book.title}</Title>
        <Spin spinning={loading} tip="Gemini is thinking...">
            {aiResponse ? (
                <Paragraph style={{ marginTop: 20, fontSize: 16 }}>
                    {aiResponse}
                </Paragraph>
            ) : (
                <p>กำลังเชื่อมต่อข้อมูล...</p>
            )}
        </Spin>
      </Modal>
    </>
  );
}