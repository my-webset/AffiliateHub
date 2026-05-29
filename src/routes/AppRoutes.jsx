import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/HomePage'
import ShopPage from '../pages/ShopPage'
import ProductDetailsPage from '../pages/ProductDetailsPage'
import AdminLogin from '../dashboard/AdminLogin'
import AdminDashboard from '../dashboard/AdminDashboard'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop/:shopId" element={<ShopPage />} />
      <Route path="/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}