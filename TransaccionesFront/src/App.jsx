import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MainLayout from './pages/public/MainLayout';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import LandingPage from './pages/public/LandingPage';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import Users from './pages/admin/Users';
import Accounts from './pages/admin/Accounts';
import Transactions from './pages/admin/Transactions';
import DashboardUser from './pages/user/DashboardUser';
import Profile from './pages/user/Profile';
import MyAccounts from './pages/user/MyAccounts';
import MyTransactions from './pages/user/MyTransactions';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<MainLayout />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/accounts" element={<Accounts />} />
            <Route path="/admin/transactions" element={<Transactions />} />
            <Route path="/user" element={<DashboardUser />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/my-accounts" element={<MyAccounts />} />
            <Route path="/user/my-transactions" element={<MyTransactions />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;