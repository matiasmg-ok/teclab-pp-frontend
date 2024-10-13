import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './utils/ProtectedRoute'
import Dashboard from './pages/dashboard/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedAdminRoute from './utils/ProtectedAdminRoute'
import AdminProducts from './pages/admin/AdminProducts'
import NewProduct from './components/admin/NewProduct'
import EditProduct from './components/admin/EditProduct'
import Products from './pages/Products'
import AdminBanners from './pages/admin/AdminBanners'
import NewBanner from './components/admin/NewBanner'
import ProductPage from './pages/ProductPage'
import Checkout from './pages/checkout/Checkout'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/products" element={<Products />}></Route>
      <Route path="/product" element={<ProductPage />}></Route>
      <Route path="/checkout" element={<Checkout />}></Route>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>
      
      <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>}></Route>
      
      <Route path="/admin/products" element={<ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>}></Route>
      <Route path="/admin/new-product" element={<ProtectedAdminRoute><NewProduct /></ProtectedAdminRoute>}></Route>
      <Route path="/admin/edit-product" element={<ProtectedAdminRoute><EditProduct /></ProtectedAdminRoute>}></Route>
      
      <Route path="/admin/advertisements" element={<ProtectedAdminRoute><AdminBanners /></ProtectedAdminRoute>}></Route>
      <Route path="/admin/new-advertisement" element={<ProtectedAdminRoute><NewBanner /></ProtectedAdminRoute>}></Route>
    </Routes>
  </BrowserRouter>
)
