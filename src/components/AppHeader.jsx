import { Menu, Layout, Button } from 'antd';
import { HomeOutlined, BookOutlined, LogoutOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppstoreOutlined, PieChartOutlined } from '@ant-design/icons';

const { Header } = Layout;

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation(); // เอาไว้เช็คว่าตอนนี้อยู่หน้าไหน เมนูจะได้ไฮไลท์ถูก

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    // 1. ลบ Token ทิ้งทั้ง 2 ที่
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    // 2. ดีดกลับไปหน้า Login
    navigate('/login');
  };

  // รายการเมนู
const items = [
    {
      label: 'Book Store',
      key: '/',
      icon: <HomeOutlined />,
    },

    {
      label: 'Dashboard',
      key: '/dashboard',
      icon: <PieChartOutlined />,
    },

    {
      label: 'Add Book',
      key: '/add',
      icon: <PlusCircleOutlined />,
    },

    {
      label: 'Categories',
      key: '/category',
      icon: <AppstoreOutlined />,
    },
  ];

  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '0 20px', marginBottom: 20, boxShadow: '0 2px 8px #f0f1f2' }}>
      <div className="demo-logo" style={{marginRight: 20, fontWeight: 'bold', fontSize: 18}}>
        📚 MyShop
      </div>
      
      {/* ส่วนเมนูทางซ้าย */}
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[location.pathname]} // ไฮไลท์เมนูตาม URL ปัจจุบัน
        items={items}
        onClick={(e) => navigate(e.key)} // กดแล้วเปลี่ยนหน้า
        style={{ flex: 1, borderBottom: 'none' }}
      />

      {/* ปุ่ม Logout ทางขวา */}
      <Button 
        type="text" 
        danger 
        icon={<LogoutOutlined />} 
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Header>
  );
}