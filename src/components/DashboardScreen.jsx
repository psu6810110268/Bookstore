import { Card, Statistic, Row, Col, Spin } from 'antd';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

// ลงทะเบียน Component ของ ChartJS ให้พร้อมใช้งาน
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [summary, setSummary] = useState({ totalBooks: 0, totalValue: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ดึงข้อมูลหนังสือ และ หมวดหมู่
        const [booksRes, catsRes] = await Promise.all([
            axios.get("/api/book"),
            axios.get("/api/book-category")
        ]);

        const books = booksRes.data;
        const categories = catsRes.data;

        // 1. คำนวณสรุปยอดรวม (Bonus: โชว์ตัวเลขสวยๆ)
        const totalStock = books.reduce((sum, book) => sum + book.stock, 0);
        const totalValue = books.reduce((sum, book) => sum + (book.price * book.stock), 0);
        setSummary({ totalBooks: totalStock, totalValue });

        // 2. เตรียมข้อมูลกราฟ: นับจำนวนหนังสือตามหมวดหมู่
        // สร้าง Map เพื่อนับ: { 'Fiction': 5, 'Cartoon': 3 }
        const countMap = {};
        
        // เริ่มต้นให้ทุกหมวดเป็น 0
        categories.forEach(cat => countMap[cat.name] = 0);

        // วนลูปหนังสือเพื่อนับ
        books.forEach(book => {
            const catName = book.category?.name || 'Uncategorized';
            if (countMap[catName] !== undefined) {
                countMap[catName]++;
            } else {
                countMap[catName] = 1; // เผื่อเคสหมวดหมู่หลุด
            }
        });

        // 3. จัด Format ให้ ChartJS
        setChartData({
            labels: Object.keys(countMap), // ชื่อแกน X (ชื่อหมวด)
            datasets: [
              {
                label: 'Number of Titles',
                data: Object.values(countMap), // ค่าแกน Y (จำนวนเล่ม)
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderColor: 'rgb(53, 162, 235)',
                borderWidth: 1,
              },
            ],
          });

      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Books per Category' },
    },
  };

  return (
    <div style={{ padding: 20 }}>
        <h2>Dashboard</h2>
        
        {/* ส่วนแสดงตัวเลขสรุป (Card) */}
        <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={12}>
                <Card>
                    <Statistic title="Total Stock (Books)" value={summary.totalBooks} prefix="📚" />
                </Card>
            </Col>
            <Col span={12}>
                <Card>
                    <Statistic title="Total Inventory Value" value={summary.totalValue} prefix="฿" precision={2} />
                </Card>
            </Col>
        </Row>

        {/* ส่วนแสดงกราฟ */}
        <Card title="Statistics">
            <Spin spinning={loading}>
                {/* วาดกราฟตรงนี้ */}
                <Bar options={options} data={chartData} />
            </Spin>
        </Card>
    </div>
  );
}