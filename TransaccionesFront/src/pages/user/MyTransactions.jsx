import { useEffect, useState, useContext } from 'react';
import api from '../../api/api';
import { AuthContext } from '../../auth/AuthContext';

const MyTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');
  const { user } = useContext(AuthContext); 

  // Estado para el formulario
  const [transferData, setTransferData] = useState({
    cuenta_destino: '',
    monto: '',
    concepto: ''
  });

  // Función para obtener el historial
  const fetchMyTrans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions/my-transactions');
      const data = res.data.transactions || res.data.data || [];
      setTransactions(data);
    } catch (err) {
      console.error("Error al cargar transacciones:", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchMyTrans();
  }, []);

  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    if (value.startsWith(' ')) return; // Bloquea espacios iniciales
    setTransferData({ ...transferData, [name]: value });
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica en el cliente
    if (parseFloat(transferData.monto) <= 0) {
      return alert("Por favor, ingresa un monto válido mayor a 0.");
    }

    setLoading(true);
    try {
      // LLAMADA AL BACKEND
      const res = await api.post('/accounts/transfer', {
        numero_cuenta_destino: transferData.cuenta_destino.trim(),
        monto: parseFloat(transferData.monto),
        concepto: transferData.concepto.trim()
      });

      if (res.data.status === 'success') {
        alert("✅ Transferencia realizada con éxito.");
        
        // SOLUCIÓN FINAL: Recarga la página para actualizar el 'saldo_actual' 
        // en toda la interfaz (Navbar, etc.) y limpiar el formulario.
        window.location.reload(); 
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al procesar la transferencia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <i className="bi bi-wallet2 me-2 text-primary"></i>Movimientos
        </h2>
        {/* Selector de Pestañas */}
        <div className="btn-group" role="group shadow-sm">
          <button 
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('history')}
          >
            Historial
          </button>
          <button 
            className={`btn ${activeTab === 'transfer' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('transfer')}
          >
            Nueva Transferencia
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        /* --- VISTA DE HISTORIAL --- */
        <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
          <div className="list-group list-group-flush">
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Buscando movimientos...</p>
              </div>
            ) : transactions.length > 0 ? (
              transactions.map((t) => {
                const userIdActual = user?._id || user?.id;
                const emisorId = t.cuenta_origen?.user_id?._id || t.cuenta_origen?.user_id || t.user_id;
                const soyEmisor = userIdActual && emisorId && String(emisorId) === String(userIdActual);

                return (
                  <div key={t._id} className="list-group-item p-3 animate__animated animate__fadeIn">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{soyEmisor ? '📤 Transferencia Enviada' : '📥 Transferencia Recibida'}</div>
                        <small className="text-muted">
                          {soyEmisor ? `A cuenta: ${t.cuenta_destino?.numero_cuenta}` : `De cuenta: ${t.cuenta_origen?.numero_cuenta}`}
                        </small>
                        <div className="small text-secondary italic">"{t.concepto || 'Sin concepto'}"</div>
                      </div>
                      <div className="text-end">
                        <div className={`fw-bold fs-5 ${soyEmisor ? 'text-danger' : 'text-success'}`}>
                          {soyEmisor ? `-$${t.monto}` : `+$${t.monto}`}
                        </div>
                        <small className="text-muted">{new Date(t.fecha_creacion).toLocaleDateString()}</small>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-5 text-center text-muted">Aún no tienes transacciones registradas.</div>
            )}
          </div>
        </div>
      ) : (
        /* --- FORMULARIO DE TRANSFERENCIA --- */
        <div className="row justify-content-center animate__animated animate__fadeIn">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '20px' }}>
              <h4 className="text-center fw-bold mb-4">Enviar Dinero</h4>
              <form onSubmit={handleTransferSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Cuenta del Beneficiario</label>
                  <input 
                    type="text" name="cuenta_destino" className="form-control form-control-lg" 
                    placeholder="Número de cuenta" value={transferData.cuenta_destino}
                    onChange={handleTransferChange} required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Monto a Enviar (USD)</label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text">$</span>
                    <input 
                      type="number" name="monto" className="form-control" 
                      placeholder="0.00" step="0.01" value={transferData.monto}
                      onChange={handleTransferChange} required 
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Concepto</label>
                  <input 
                    type="text" name="concepto" className="form-control" 
                    placeholder="Ej. Pago de cena" value={transferData.concepto}
                    onChange={handleTransferChange} 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow" disabled={loading}>
                  {loading ? 'Procesando envío...' : 'Confirmar Transferencia'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTransactions;