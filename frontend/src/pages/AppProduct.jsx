import { useState } from 'react';
import { Container, Form, Button, Card, Navbar, Nav, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api'; // API_URL eklendi

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Kullanıcı bilgisini güvenli bir şekilde alalım
  const user = (() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  })();

  // Admin kontrolü
  if (user?.role !== 'admin') {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger">Bu sayfaya erişim yetkiniz yok!</Alert>
        <Button onClick={() => navigate('/home')}>Ana Sayfaya Dön</Button>
      </Container>
    );
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Lütfen ürün için bir resim seçin!');

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('categoryId', categoryId);
    formData.append('image', selectedFile); 

    try {
      const token = localStorage.getItem('token');
      // DÜZELTME: Sabit localhost URL'i yerine ${API_URL} kullanıldı
      await axios.post(`${API_URL}/products`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      
      alert('Ürün başarıyla eklendi!');
      navigate('/home');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Ürün eklenirken bir hata oluştu. Lütfen bilgileri kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            Handmade Shop - Admin Paneli
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" size="sm" onClick={() => navigate('/home')}>İptal Et</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="pb-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Body className="p-4">
                <h3 className="mb-4 text-center fw-bold">Yeni Ürün Ekle</h3>
                
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ürün Adı</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Örn: El Örmesi Atkı"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Fiyat (TL)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="0.00"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Stok Adedi</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="10"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Kategori ID</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Kategori numarası"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Ürün Görseli</Form.Label>
                    <Form.Control 
                      type="file" 
                      onChange={handleFileChange} 
                      accept="image/*"
                      required
                    />
                    <Form.Text className="text-muted">
                      JPG, PNG veya WEBP formatında bir resim seçin.
                    </Form.Text>
                  </Form.Group>

                  <Button 
                    variant="success" 
                    type="submit" 
                    className="w-100 py-2 fw-bold"
                    disabled={loading}
                  >
                    {loading ? 'Yükleniyor...' : 'Ürünü Kaydet'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}