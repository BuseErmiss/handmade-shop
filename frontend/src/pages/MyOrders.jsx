import { useEffect, useState } from 'react';
import { Container, Table, Button, Navbar, Nav, Card, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const myOrders = response.data.filter(order => order.userId === user.id);
      setOrders(myOrders.reverse());
    } catch (error) {
      console.error("Siparişler çekilemedi:", error);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="/home">Handmade Shop</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" onClick={() => navigate('/home')}>Ürünlere Dön</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <h2 className="mb-4">Sipariş Geçmişim</h2>

        {orders.length === 0 || orders.every(o => o.items.length === 0) ? (
          <div className="text-center mt-5">
            <h4>Henüz hiç sipariş vermediniz.</h4>
            <Button variant="primary" className="mt-3" onClick={() => navigate('/home')}>Alışverişe Başla</Button>
          </div>
        ) : (
          orders
            .filter(order => order.items.length > 0) // Boş siparişleri gizle
            .map((order) => (
              <Card key={order.id} className="mb-4 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span><strong>Sipariş No:</strong> #{order.id}</span>
                  <span><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
                  <Badge bg={order.status === 'Hazırlanıyor' ? 'warning' : 'success'}>{order.status}</Badge>
                </Card.Header>
                <Card.Body>
                  <Table hover size="sm">
                    <thead>
                      <tr>
                        <th>Ürün</th>
                        <th>Fiyat</th>
                        <th>Adet</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product ? item.product.name : 'Silinmiş Ürün'}</td>
                          <td>{item.priceAtPurchase} TL</td>
                          <td>{item.quantity}</td>
                          <td>
                            {order.status === 'Draft' && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    const token = localStorage.getItem('token');
                                    await axios.delete(
                                      `http://localhost:3000/orders/item/${item.productId}?userId=${user.id}`,
                                      { headers: { Authorization: `Bearer ${token}` } }
                                    );

                                    // State güncelle
                                    const updatedOrders = orders.map(o => {
                                      if (o.id === order.id) {
                                        const newItems = o.items.filter(i => i.id !== item.id);
                                        return {
                                          ...o,
                                          items: newItems,
                                          totalPrice: newItems.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0)
                                        };
                                      }
                                      return o;
                                    }).filter(o => o.items.length > 0); // Boş siparişleri kaldır
                                    
                                    setOrders(updatedOrders);

                                  } catch (err) {
                                    console.error("Ürün silinirken hata oluştu", err);
                                  }
                                }}
                              >
                                Sil
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="text-end">
                    <h5>Toplam: {order.totalPrice} TL</h5>
                  </div>
                </Card.Body>
              </Card>
            ))
        )}
      </Container>
    </>
  );
}
