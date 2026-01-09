import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AppProduct from './pages/AppProduct';
import MyOrders from './pages/MyOrders'; // Bunu da listeye ekledik

// --- Korumalı Rota Bileşeni ---
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    // Giriş yapılmamışsa login sayfasına at
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    // Admin gerekiyorsa ama kullanıcı admin değilse ana sayfaya at
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Herkese Açık Rotalar */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Sadece Giriş Yapanlara Açık Rotalar */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/my-orders" 
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        } 
      />

      {/* Sadece Adminlere Açık Rotalar */}
      <Route 
        path="/add-product" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AppProduct />
          </ProtectedRoute>
        } 
      />

      {/* Hata Sayfası */}
      <Route path="*" element={
        <div className="text-center mt-5">
          <h2>404 - Sayfa Bulunamadı</h2>
          <Navigate to="/home" />
        </div>
      } />
    </Routes>
  );
}

export default App;