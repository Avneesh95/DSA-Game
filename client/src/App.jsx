import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import GameMap from './pages/GameMap';
import DoorPage from './pages/DoorPage';
import Profile from './pages/Profile';
import NeetCode150 from './pages/NeetCode150';
import Amazon150 from './pages/Amazon150';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <GameMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/neetcode-150"
        element={
          <ProtectedRoute>
            <NeetCode150 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/amazon-150"
        element={
          <ProtectedRoute>
            <Amazon150 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/door/:doorNumber"
        element={
          <ProtectedRoute>
            <DoorPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
