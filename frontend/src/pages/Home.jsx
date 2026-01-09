import { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api'; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [user] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = user?.role === 'admin';

  const loadProducts = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products`); 
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError('Ürünler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [navigate, user]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleBuy = async (product) => {
    if (product.stock <= 0) {
      alert('Bu ürünün stoğu tükenmiş!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      // DÜZELTME: Sabit URL yerine ${API_URL} kullanıldı
      await axios.post(
        `${API_URL}/orders`,
        {
          userId: user.id,
          items: [{ productId: product.id, quantity: 1, price: product.price }]
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`"${product.name}" sipariş listenize eklendi!`);
    } catch {
      alert('Sipariş oluşturulamadı');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      const token = localStorage.getItem('token');
      // DÜZELTME: Sabit URL yerine ${API_URL} kullanıldı
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Ürün silinemedi!');
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 sticky-top shadow">
        <Container>
          <Navbar.Brand onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            Handmade Shop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate('/home')}>Ana Sayfa</Nav.Link>
              <Nav.Link onClick={() => navigate('/my-orders')}>Siparişlerim</Nav.Link>
            </Nav>
            <Nav className="align-items-center">
              <span className="text-light me-3">Hoş geldin, <strong>{user?.fullName || 'Misafir'}</strong></span>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>Çıkış Yap</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">El Emeği Ürünler</h2>
          {isAdmin && (
            <Button variant="success" onClick={() => navigate('/add-product')}>
              + Yeni Ürün Ekle
            </Button>
          )}
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          {loading ? (
            <div className="text-center w-100 mt-5">Yükleniyor...</div>
          ) : products.length > 0 ? (
            products.map(product => (
              <Col md={6} lg={4} key={product.id} className="mb-4">
                <Card className="h-100 shadow-sm border-0">
                  <Card.Img
                    variant="top"
                    // DÜZELTME: Sabit URL yerine ${API_URL} kullanıldı
                    src={product.imageUrl
                      ? `${API_URL}${product.imageUrl}`
                      : 'https://via.placeholder.com/300x200?text=Resim+Yok'}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Hata:+Resim+Bulunamadi';
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0">{product.name}</Card.Title>
                      <Badge bg="primary">{product.price} TL</Badge>
                    </div>
                    <Card.Text className="text-muted small">
                      Stok Durumu: {product.stock > 0 ? product.stock : <span className="text-danger">Tükendi</span>}
                    </Card.Text>

                    <div className="mt-auto d-flex gap-2">
                      <Button
                        variant={product.stock > 0 ? "outline-primary" : "secondary"}
                        className="flex-grow-1"
                        onClick={() => handleBuy(product)}
                        disabled={product.stock <= 0}
                      >
                        {product.stock > 0 ? 'Hemen Al' : 'Stokta Yok'}
                      </Button>

                      {isAdmin && (
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDelete(product.id)}
                        >
                          Sil
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Alert variant="info" className="text-center">Henüz ürün eklenmemiş.</Alert>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}