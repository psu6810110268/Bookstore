import './App.css'
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';

axios.defaults.baseURL = "http://localhost:3000"

// เช็คว่ามี token ไหม
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />; // ไม่มี? เด้งไปหน้า Login เลย
  }
  return children; // มี? เชิญเข้าข้างใน
}

function App() {
  return(
    <Routes>
        <Route path="/login" element={<LoginScreen />} />
        
        {/* 3. เอา PrivateRoute มาครอบ BookScreen ไว้ */}
        <Route path="/" element={
          <PrivateRoute>
            <BookScreen />
          </PrivateRoute>
        } />
        
     </Routes>
  )
}
 
export default App