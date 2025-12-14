import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import axios from 'axios' 
// โหลด token จากที่เก็บไว้ (ถ้ามี) แล้วตั้งค่าให้ axios ใช้
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
if (token) {
  axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)