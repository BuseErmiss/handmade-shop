// src/pages/AppProduct.jsx
import { useState } from 'react';
import { Container, Form, Button, Navbar, Nav, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/products', {
        name,
        price: Number(price),
        categoryId: Number(categoryId),
        description,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Ürün başarıyla eklendi!');
      setName('');
      setPrice('');
      setCategoryId('');
      setDescription('');
    } catch (err) {
      console.error(err);
      alert('Ürün eklenirken hata oluştu.');
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="/home">Handmade Shop</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" onClick={() => navigate('/home')}>Ana Sayfa</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="d-flex justify-content-center">
        <Card className="p-4 shadow" style={{ width: '500px' }}>
          <h3 className="mb-4 text-center">Yeni Ürün Ekle</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Ürün Adı</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fiyat (TL)</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kategori ID</Form.Label>
              <Form.Control
                type="number"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="w-100">Ürünü Ekle</Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}
