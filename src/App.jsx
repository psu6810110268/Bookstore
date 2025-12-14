import './App.css'
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import AddBook from './components/AddBook'; 
import EditBook from './components/EditBook';

axios.defaults.baseURL = "http://localhost:3000"

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return(
    <Routes>
        <Route path="/login" element={<LoginScreen />} />
        
        <Route path="/" element={
          <PrivateRoute>
             <BookScreen/>
          </PrivateRoute>
        } />

        {/* 2. เพิ่ม Route สำหรับหน้า Add */}
        <Route path="/add" element={
          <PrivateRoute>
             <AddBook/>
          </PrivateRoute>
        } />

        {/* 3. เพิ่ม Route สำหรับหน้า Edit (รับ id ของหนังสือมาด้วย) */}
        <Route path="/edit/:id" element={
          <PrivateRoute>
             <EditBook/>
          </PrivateRoute>
        } />

     </Routes>
  )
}
 
export default App