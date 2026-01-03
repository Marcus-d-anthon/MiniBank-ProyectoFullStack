import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { name: 'Mi Perfil', path: '/user/profile', icon: 'bi-wallet2', role: 'user' },
    { name: 'Mis Cuentas', path: '/user/my-accounts', icon: 'bi-wallet2', role: 'user' },
    { name: 'Vista de Transferencias', path: '/admin/transactions', icon: 'bi-arrow-left-right', role: 'admin' },
    { name: 'Historial de Transacciones', path: '/user/my-transactions', icon: 'bi-clock-history', role: 'user' },
    { name: 'Gestión Cuentas', path: '/admin/accounts', icon: 'bi-bank', role: 'admin' },
    { name: 'Usuarios', path: '/admin/users', icon: 'bi-people', role: 'admin' },
  ];

  return (
    <div className="bg-white border-end vh-100 d-none d-md-block" style={{ width: '280px' }}>
      <div className="p-4">
        <div className="list-group list-group-flush">
          {menuItems.map((item) => {
            if (item.role !== 'all' && item.role !== user?.rol) return null;
            
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`list-group-item list-group-item-action border-0 py-3 mb-2 rounded-3 transition-all ${
                  isActive ? 'bg-primary text-white shadow' : 'text-muted'
                }`}
              >
                <i className={`bi ${item.icon} me-3 ${isActive ? 'text-white' : 'text-primary'}`}></i>
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;