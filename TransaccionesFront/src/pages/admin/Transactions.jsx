import { useEffect, useState } from 'react';
import api from '../../api/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      const dataParaSetear = res.data.transactions || res.data.transacciones || res.data.data;
      setTransactions(Array.isArray(dataParaSetear) ? dataParaSetear : []);
    } catch (err) {
      console.error("Error al obtener transacciones", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderAccount = (account) => {
    if (!account) return <span className="text-muted small">N/A</span>;
    const num = typeof account === 'object' ? account.numero_cuenta : account;
    return <code className="fw-bold text-dark">{num}</code>;
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold mb-0">
          <i className="bi bi-clock-history me-2"></i>Historial Global
        </h2>
        <span className="badge bg-primary px-3 py-2">{transactions.length} Operaciones</span>
      </div>
      
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Monto</th>
                <th className="py-3">Origen / Destino</th>
                <th className="py-3 text-center">Estado</th>
                <th className="py-3 text-end px-4">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
              ) : transactions.length > 0 ? (
                transactions.map(t => (
                  <tr key={t._id}>
                    <td className="px-4">
                      <div className={`fw-bold fs-5 ${t.monto < 0 ? 'text-danger' : 'text-success'}`}>
                        {t.monto > 0 ? '+' : ''}{t.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })} 
                        <small className="ms-1 fs-6">{t.moneda || 'USD'}</small>
                      </div>
                      <small className="text-muted text-uppercase">{t.concepto || 'Transferencia'}</small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {renderAccount(t.cuenta_origen)}
                        <i className="bi bi-arrow-right text-muted"></i>
                        {renderAccount(t.cuenta_destino)}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill border border-success">
                        <i className="bi bi-check-circle-fill me-1"></i> completado
                      </span>
                    </td>
                    <td className="text-end px-4">
                      <div className="fw-bold">{new Date(t.fecha_creacion).toLocaleDateString()}</div>
                      <small className="text-muted">{new Date(t.fecha_creacion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-5 text-muted">No hay transacciones registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;