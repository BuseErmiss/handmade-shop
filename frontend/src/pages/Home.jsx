import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
      return;
    }
    fetchProducts();
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin';

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      console.log("Gelen Veri:", response.data);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Beklenen format dizi değil!", response.data);
        setProducts([]); 
      }
    } catch (error) {
      console.error("Ürünler çekilemedi:", error);
      setError("Ürünler yüklenirken bir hata oluştu.");
    }
  };

  // Ürün Silme Fonksiyonu
  const handleDelete = async (id) => {
    if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Silinen ürünü ekrandan da kaldır (Sayfayı yenilemeden)
        setProducts(products.filter(product => product.id !== id));
        alert("Ürün silindi!");
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Ürün silinemedi!");
      }
    }
  };

  // Sipariş Verme Fonksiyonu (Hemen Al)
  const handleBuy = async (product) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const orderData = {
        userId: user.id,
        items: [
          {
            productId: product.id,
            quantity: 1, // Şimdilik 1 adet alıyoruz
            price: product.price
          }
        ]
      };

      await axios.post('http://localhost:3000/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`"${product.name}" siparişi oluşturuldu!`);
    } catch (error) {
      console.error("Sipariş hatası:", error);
      alert("Sipariş oluşturulamadı!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Handmade Shop</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-info" className="me-2" onClick={() => navigate('/my-orders')}>
              Siparişlerim
            </Button>
            
            <Button variant="outline-light" onClick={handleLogout}>Çıkış Yap</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        {/* DEĞİŞİKLİK BURADA: Başlık ve Butonu yan yana koyduk */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Ürünler</h2>
          {/* Eğer kullanıcı Admin ise butonu göster */}
          {isAdmin && (
            <Button variant="success" onClick={() => navigate('/add-product')}>
              + Yeni Ürün Ekle
            </Button>
          )}
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        
        <Row>
          {products && products.length > 0 ? (
            products.map((product) => (
              <Col key={product.id} md={4} className="mb-4">
                <Card>
                  <Card.Img 
                    variant="top" 
                    src={product.imageUrl || "https://via.placeholder.com/200"} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>
                      Fiyat: {product.price} TL <br />
                      Stok: {product.stock}
                    </Card.Text>
                    
                    <div className="d-flex justify-content-between">
                      <Button variant="primary" onClick={() => handleBuy(product)}>
                        Hemen Al
                      </Button>
                      
                      {/* Sadece Admin ise Sil Butonu Görünsün */}
                      {isAdmin && (
                        <Button 
                          variant="danger" 
                          size="sm" 
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
            <Alert variant="info">Henüz hiç ürün eklenmemiş veya yükleniyor...</Alert>
          )}
        </Row>
      </Container>
    </>
  );
}