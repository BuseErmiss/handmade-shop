import { useState } from 'react';
import { Container, Form, Button, Navbar, Nav, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/auth/register`, {
        fullName,
        email,
        password,
        role,
      });

      navigate('/login', { state: { message: 'Kayıt başarılı! Lütfen giriş yapın.' } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            Handmade Shop
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" size="sm" onClick={() => navigate('/login')}>Giriş Yap</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container style={{ maxWidth: '450px' }} className="py-5">
        <div className="shadow p-4 rounded bg-white border-0">
          <h2 className="mb-4 text-center fw-bold text-primary">Kayıt Ol</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>İsim Soyisim</Form.Label>
              <Form.Control
                type="text"
                placeholder="Adınız ve Soyadınız"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>E-posta Adresi</Form.Label>
              <Form.Control
                type="email"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Kullanıcı Tipi</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">Müşteri (User)</option>
                <option value="admin">Satıcı/Admin</option>
              </Form.Select>
            </Form.Group>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-100 py-2 fw-bold" 
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Kayıt İşlemini Tamamla'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <small className="text-muted">
              Zaten hesabınız var mı? <span 
                className="text-primary fw-bold" 
                style={{ cursor: 'pointer' }} 
                onClick={() => navigate('/login')}
              >Giriş Yap</span>
            </small>
          </div>
        </div>
      </Container>
    </>
  );
}
