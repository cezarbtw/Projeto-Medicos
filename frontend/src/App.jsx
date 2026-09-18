import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Toast } from './components/Toast';
import { DashboardPage } from './pages/DashboardPage';
import { MedicosPage } from './pages/MedicosPage';
import { PacientesPage } from './pages/PacientesPage';
import { ConsultasPage } from './pages/ConsultasPage';

export function App() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const titles = {
    dashboard: 'Painel Geral e Indicadores',
    medicos: 'Gerenciamento de Médicos',
    pacientes: 'Gerenciamento de Pacientes',
    consultas: 'Agendamento e Cancelamento de Consultas',
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="main" style={{ flex: 1 }}>
        <Topbar title={titles[currentPage] || 'MediClin'} />

        <main className="content">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'medicos' && <MedicosPage showToast={showToast} />}
          {currentPage === 'pacientes' && <PacientesPage showToast={showToast} />}
          {currentPage === 'consultas' && <ConsultasPage showToast={showToast} />}
        </main>
      </div>

      <Toast msg={toast} />
    </div>
  );
}

export default App;

