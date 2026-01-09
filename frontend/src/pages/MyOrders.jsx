import { useEffect, useState, useCallback, useMemo } from 'react';
import { Container, Table, Button, Navbar, Nav, Card, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api'; // API_URL buradan geliyor

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  const user = useMemo(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!token || !user?.id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const myOrders = response.data
        .filter(order => order.userId === user.id && order.items && order.items.length > 0)
        .reverse();
      
      setOrders(myOrders);
    } catch (error) {
      console.error("Siparişler çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  const isUserLoggedIn = !!user;
  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [fetchOrders, navigate, isUserLoggedIn, user]);

  // Yeni: Siparişi Tamamlama (Checkout) Fonksiyonu
  const handleCheckout = async (orderId) => {
    if (!window.confirm("Siparişi onaylıyor musunuz?")) return;
    try {
      await axios.patch(`${API_URL}/orders/${orderId}/checkout`, 
        { userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Siparişiniz başarıyla tamamlandı!");
      fetchOrders(); // Listeyi yenile
    } catch (error) {
      console.error(error);
      alert("Sipariş tamamlanırken bir hata oluştu.");
    }
  };

  const handleDeleteItem = async (orderId, productId, itemId) => {
    if (!window.confirm("Bu ürünü siparişten çıkarmak istediğinize emin misiniz?")) return;
    
    try {
      await axios.delete(
        `${API_URL}/orders/item/${productId}?userId=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          const newItems = o.items.filter(i => i.id !== itemId);
          const newTotal = newItems.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0);
          return { ...o, items: newItems, totalPrice: newTotal };
        }
        return o;
      }).filter(o => o.items.length > 0));
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Ürün silinirken bir hata oluştu.");
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Draft': { bg: 'secondary', text: 'Taslak' },
      'Hazırlanıyor': { bg: 'warning', text: 'Hazırlanıyor' },
      'Tamamlandı': { bg: 'success', text: 'Tamamlandı' },
      'İptal Edildi': { bg: 'danger', text: 'İptal Edildi' }
    };
    const current = statusMap[status] || { bg: 'info', text: status };
    return <Badge bg={current.bg}>{current.text}</Badge>;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4 sticky-top shadow-sm">
        <Container>
          <Navbar.Brand onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            Handmade Shop
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" size="sm" onClick={() => navigate('/home')}>
              Alışverişe Devam Et
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="pb-5">
        <h2 className="mb-4 fw-bold">Sipariş Geçmişim</h2>

        {orders.length === 0 ? (
          <Card className="text-center p-5 border-0 shadow-sm rounded-4">
            <Card.Body>
              <h4>Henüz bir siparişiniz bulunmuyor.</h4>
              <Button variant="primary" className="mt-3" onClick={() => navigate('/home')}>
                Hemen Ürünleri İncele
              </Button>
            </Card.Body>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="mb-4 shadow-sm border-0 rounded-3">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                <div>
                  <span className="text-muted me-2">Sipariş No:</span>
                  <span className="fw-bold text-primary">#{order.id}</span>
                </div>
                <div>
                  <span className="text-muted me-3 small">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4" style={{ width: '100px' }}>Görsel</th>
                      <th>Ürün Adı</th>
                      <th className="text-center">Fiyat</th>
                      <th className="text-center">Adet</th>
                      <th className="text-end pe-4">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="align-middle">
                        <td className="ps-4">
                          <img
                            src={item.product?.imageUrl ? `${API_URL}${item.product.imageUrl}` : 'https://via.placeholder.com/60?text=Yok'}
                            alt={item.product?.name}
                            className="rounded shadow-sm"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=Hata'; }}
                          />
                        </td>
                        <td className="fw-medium">{item.product?.name || 'Ürün Bilgisi Yok'}</td>
                        <td className="text-center">{item.priceAtPurchase?.toLocaleString()} TL</td>
                        <td className="text-center">x{item.quantity}</td>
                        <td className="text-end pe-4">
                          {order.status === 'Draft' && (
                            <Button variant="link" className="text-danger p-0 text-decoration-none" onClick={() => handleDeleteItem(order.id, item.productId, item.id)}>
                              Kaldır
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                
                {/* Alt Kısım: Toplam Fiyat ve Siparişi Onayla Butonu */}
                <div className="bg-light p-3 d-flex justify-content-between align-items-center border-top">
                  <div>
                    {order.status === 'Draft' && (
                      <Button variant="success" size="sm" onClick={() => handleCheckout(order.id)}>
                        Siparişi Onayla
                      </Button>
                    )}
                  </div>
                  <div className="text-end">
                    <span className="text-muted small d-block mb-1">Toplam Tutar</span>
                    <h5 className="fw-bold text-primary mb-0">{order.totalPrice?.toLocaleString()} TL</h5>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </>
  );
}