import './App.css'
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import AppHeader from './components/AppHeader'; // 1. import Header มา

axios.defaults.baseURL = "http://localhost:3000"

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // 2. แก้ไขตรงนี้: ถ้ามี Token ให้แสดง Header ด้วย + เนื้อหาหน้าเว็บ
  return (
    <>
      <AppHeader /> 
      <div style={{ padding: '0 20px' }}>
        {children}
      </div>
    </>
  );
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

        <Route path="/add" element={
          <PrivateRoute>
             <AddBook/>
          </PrivateRoute>
        } />

        <Route path="/edit/:id" element={
          <PrivateRoute>
             <EditBook/>
          </PrivateRoute>
        } />
     </Routes>
  )
}
 
export default App