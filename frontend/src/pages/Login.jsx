import { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend'e istek atıyoruz
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      });

      // Gelen Token'ı tarayıcıya kaydediyoruz
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert("Giriş Başarılı!");
      // Şimdilik ana sayfaya yönlendirelim (henüz yapmadık ama olsun)
      navigate('/home');
      
    } catch (err) {
      setError('Giriş başarısız! Email veya şifre hatalı.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Giriş Yap</h2>
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
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </Form.Group>

            <Button className="w-100" type="submit">
              Giriş Yap
            </Button>

            <div className="text-center">
              Hesabın yok mu? <a href="/register" style={{textDecoration: 'none'}}>Kayıt Ol</a>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}