import { useState } from 'react';
import { Container, Form, Button, Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default user
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        fullName,
        email,
        password,
        role, // role backend'e gönderiliyor
      });

      alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Kayıt sırasında hata oluştu.');
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

      <Container style={{ maxWidth: '500px' }}>
        <h2 className="mb-4 text-center">Kayıt Ol</h2>
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>İsim Soyisim</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Şifre</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Kullanıcı</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">Kayıt Ol</Button>
        </Form>
      </Container>
    </>
  );
}
