import './App.css'
import { useState, useEffect } from 'react';
import { Divider, Spin, Button } from 'antd'; // เพิ่ม Button
import { useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate
import axios from 'axios'
import BookList from './components/BookList'

const URL_BOOK = "/api/book"

function BookScreen() {
  const navigate = useNavigate(); // สร้างตัวสั่งย้ายหน้า
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Note: ลบ fetchCategories, AddBook, EditBook ออกไป เพราะย้ายไปทำที่หน้าของมันเองแล้ว

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL_BOOK);
      setBookData(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLikeBook = async (book) => {
    setLoading(true)
    try {
      const response = await axios.patch(URL_BOOK + `/${book.id}`, { likeCount: book.likeCount + 1 });
      fetchBooks();
    } catch (error) {
      console.error('Error liking book:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteBook = async (bookId) => {
    setLoading(true)
    try {
      const response = await axios.delete(URL_BOOK + `/${bookId}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2em" }}>
        {/* เปลี่ยนจาก component AddBook เป็นปุ่มธรรมดาที่กดแล้วย้ายหน้า */}
        <Button type="primary" onClick={() => navigate('/add')}>
            + Add New Book
        </Button>
      </div>
      <Divider>My Books List</Divider>
      <Spin spinning={loading}>
        <BookList 
          data={bookData} 
          onLiked={handleLikeBook}
          onDeleted={handleDeleteBook}
          // เมื่อกด Edit ให้ย้ายไปหน้า /edit/ตามด้วยไอดีหนังสือ
          onEdit={book => navigate(`/edit/${book.id}`)}
        />
      </Spin>
    </>
  )
}

export default BookScreen
