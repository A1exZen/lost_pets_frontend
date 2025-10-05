import React from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { AdminPage } from './components/Admin';
import { Login, Register } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Home } from './components/Home';
import {
  CreateListingForm,
  ListingDetail,
  ListingList,
} from './components/Listings';
import { Navbar } from './components/Navbar';
import { useAuthStore } from './store/authStore';
import './styles/globals.scss';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/listings" element={<ListingList />} />
        <Route path="/listing/:id" element={<ListingDetail />} />

        <Route
          path="/create-listing"
          element={
            <ProtectedRoute>
              <CreateListingForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
