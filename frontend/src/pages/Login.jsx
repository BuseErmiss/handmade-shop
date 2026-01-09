import { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../api'; // Sabit URL yerine bunu ekledik

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // DÜZELTME: API_URL değişkenini kullanarak /auth/login'e istek atıyoruz
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Giriş başarısız! Email veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: '#f8f9fa' }}
    >
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 fw-bold text-primary">Handmade Shop</h2>
          <p className="text-center text-muted mb-4">Hesabınıza giriş yapın</p>

          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Adresi</Form.Label>
              <Form.Control
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              className="w-100 mb-3 py-2" 
              type="submit" 
              disabled={loading}
              variant="primary"
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Giriş Yap'}
            </Button>

            <div className="text-center mt-3">
              <span className="text-muted">Hesabın yok mu?</span>{' '}
              <Button 
                variant="link" 
                className="p-0 text-decoration-none fw-bold"
                onClick={() => navigate('/register')}
              >
                Hemen Kayıt Ol
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}